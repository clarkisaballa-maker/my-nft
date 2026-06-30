const express = require("express");
const router = express.Router();
const User = require("../models/Users"); // Import the User model
const Product = require("../models/Product");
const Task = require("../models/Task");
const Combo = require("../models/Combo");
const WalletAddress = require("../models/WalletAddress");
const TransactionHistory = require("../models/TransactionHistory");
const DepositWallet = require("../models/DepositWallet");
const Referral = require("../models/Referral");
const VipLevel = require("../models/VipLevel");
const VersionModel = require("../models/Version");
const crypto = require("crypto");

const META_PIXEL_ID = "2214789792589157";
const META_CAPI_TOKEN = "EAAckOu37tZAwBRyEJaZBZBRVQfDZC8kP8TIy571hNZAZBkgrjc21VHYYRULwJEAUURWXnRIbmXrdZAm4eiEyptZAwuLzTsVztGsZAHP2qEFYcNdaHXhZBJiSunfOlnqctc9jtdZCEfuUWh9LjGwMLwpQQe7W3dJhz3n0a3lstiDMXa6pGetSjLQfsNIEyyOb0jCIQZDZD";

async function sendMetaConversion({
  event_id,
  event_name,
  event_time,
  user_data,
  custom_data,
  test_event_code,
  event_source_url = "https://www.moveetech.online",
}) {
  try {
    let hashedEmail;
    if (user_data?.em) {
      hashedEmail = crypto
        .createHash("sha256")
        .update(user_data.em.trim().toLowerCase())
        .digest("hex");
    }

    let hashedPhone;
    if (user_data?.ph) {
      hashedPhone = crypto
        .createHash("sha256")
        .update(user_data.ph.replace(/\D/g, ""))
        .digest("hex");
    }

    const payload = {
      data: [
        {
          event_name: event_name || "Lead",
          event_time: event_time || Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url,
          event_id,

          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            ph: hashedPhone ? [hashedPhone] : undefined,
            client_ip_address: user_data?.client_ip_address,
            client_user_agent: user_data?.client_user_agent,
          },

          custom_data: {
            value: custom_data?.value || 0,
            currency: custom_data?.currency || "USD",
            content_name: custom_data?.content_name,
            content_category: custom_data?.content_category,
          },
        },
      ],

      test_event_code,
    };

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("Meta Conversion Response:", data);

    return data;
  } catch (err) {
    console.error("Meta Conversion Error:", err);
  }
}

const getVipLevelByNumber = async (level) => {
  try {
    if (isNaN(level)) {
      throw new Error("Valid VIP level number is required");
    }

    const vipLevel = await VipLevel.findOne({
      level: Number(level)
    });

    return vipLevel;
  } catch (error) {
    console.error("getVipLevelByNumber Error:", error);
    throw error; // Let the calling function handle the error
  }
};

// Route to create a new user
router.post("/createUser", async (req, res) => {
  try {
    const { username, phone, loginPassword, transactionPassword, gender, inviteCode } = req.body;

    // 0️⃣ Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(201).json({ error: "Another user with this username already exists." });
    }

    // 1️⃣ Check if referral code exists
    const existingUser = await User.findOne({ myinviteCode: inviteCode });
    if (!existingUser) {
      return res.status(201).json({ error: "Invitation code not found." });
    }

    // 2️⃣ Generate a unique 6-character invite code
    let myinviteCode;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
      myinviteCode = Array.from({ length: 6 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join("");
      const codeExists = await User.findOne({ myinviteCode });
      if (!codeExists) break;
    }

    // 5️⃣ Create new user
    const newUser = new User({
      username,
      phone,
      loginPassword,
      transactionPassword,
      gender,
      myinviteCode,
      refinviteCode: inviteCode,
      profileimage: "none",
      allowWithdrawal: false,
    });

    await newUser.save();

    // 6️⃣ CREATE DEFAULT NOTIFICATION
    newUser.notifications.push({
      message: "Congratulations on creating new account!!!",
      type: "success",
      read: false,
    });

    await newUser.save(); // Save again after adding notification

    const eventId = crypto.randomUUID();

    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";

    const userAgent =
      req.headers["user-agent"] || "";

    // Send Meta Events
    await sendMetaConversion({
      event_id: eventId,   // ✅ ADDED
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        em: "helloworld@gmail.com",
        ph: phone,
        client_ip_address: rawIp,
        client_user_agent: userAgent,
      },
      custom_data: {
        value: 50,
        currency: "USD",
        content_name: "Job Application",
        content_category: "Career",
      },
      test_event_code: "TEST72798",
    });

    res.status(201).json({ message: "User created successfully", user: newUser, eventId });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Route to log in an existing user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Check if username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // 2️⃣ Compare the password
    if (user.loginPassword !== password) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    // 3️⃣ If credentials are valid, return user data
    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ✅ Fetch users with pagination and task count
router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    const usersWithExtras = await Promise.all(
      users.map(async (user) => {

        // ✅ Count tasks
        const numOfTasks = await Task.countDocuments({
          userId: user._id
        });

        // ✅ Find referral user
        let referralUser = null;

        if (user.refinviteCode) {
          referralUser = await User.findOne({
            myinviteCode: user.refinviteCode
          }).select("username");
        }

        return {
          ...user.toObject(),
          NumOfTasks: numOfTasks,
          ReferralName: referralUser ? referralUser.username : null
        };
      })
    );

    res.json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      users: usersWithExtras
    });

  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({
      error: "Failed to fetch users"
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const pageSize = 10;

    const mongoQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { phone: { $regex: query } }
      ]
    };

    // Count total matching users
    const total = await User.countDocuments(mongoQuery);

    // Fetch users with pagination
    const users = await User.find(mongoQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const usersWithExtras = await Promise.all(
      users.map(async (user) => {

        // ✅ Count tasks
        const numOfTasks = await Task.countDocuments({
          userId: user._id
        });

        // ✅ Find referral name
        let referralUser = null;

        if (user.refinviteCode) {
          referralUser = await User.findOne({
            myinviteCode: user.refinviteCode
          }).select("username");
        }

        return {
          ...user.toObject(),
          NumOfTasks: numOfTasks,
          ReferralName: referralUser ? referralUser.username : null
        };
      })
    );

    res.json({
      users: usersWithExtras,
      totalPages: Math.ceil(total / pageSize),
      currentPage: Number(page)
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Search failed"
    });
  }
});

// ✅ Updated updateUser Route
router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allowedFields = [
      "username", "phone", "gender", "loginPassword", "transactionPassword",
      "profileimage", "currentVIPLevel", "walletBalance", "totalBalance",
      "commissionTotal", "salary", "activeSetTasks", "allowWithdrawal",
      "notifications", "todayProfit", "creditScore",
    ];

    let isVipLevelChanging = false;
    let newVipLevelNumber = null;

    // ==================== VIP LEVEL VALIDATION ====================
    if (updatedData.currentVIPLevel !== undefined) {
      let incomingVipNumber;

      if (typeof updatedData.currentVIPLevel === "object") {
        console.log("There is number")
        incomingVipNumber = updatedData.currentVIPLevel.number;
      } else {
        incomingVipNumber = updatedData.currentVIPLevel;
      }

      const newVipNumber = Number(incomingVipNumber);
      if (isNaN(newVipNumber) || newVipNumber < 0) {
        return res.status(400).json({ error: "Invalid VIP Level number" });
      }

      // 🔥 NEW: If VIP is 0, skip all VIP logic
      if (newVipNumber === 0) {
        isVipLevelChanging = user.currentVIPLevel.number !== 0;

        if (isVipLevelChanging) {
          user.currentVIPLevel.number = 0;
          await user.save();

          return res.json({
            message: "User updated successfully (VIP reset to 0)",
            user,
          });
        }

        // 👇 if not changing VIP, just skip this block
      }

      // Get current VIP number
      const currentVipNumber = Number(
        user.currentVIPLevel?.number || user.currentVIPLevel || 0
      );

      // 🔥 Validation 1: VIP Level must exist in database
      if (newVipNumber !== 0) {
        const vipLevelExists = await getVipLevelByNumber(newVipNumber);

        if (!vipLevelExists) {
          return res.status(400).json({
            error: `This VIP Level (${newVipNumber}) is not available in the system.`
          });
        }
      }

      // 🔥 Validation 2: VIP Level can only increase (not decrease)
      // if (newVipNumber < currentVipNumber) {
      //   return res.status(400).json({
      //     error: `VIP Level cannot be decreased. Current level is ${currentVipNumber}, you cannot downgrade to ${newVipNumber}.`
      //   });
      // }

      // Check if it's actually changing
      if (newVipNumber !== currentVipNumber) {
        isVipLevelChanging = true;
        newVipLevelNumber = newVipNumber;

        user.currentVIPLevel.number = newVipNumber;
        user.currentVIPLevel.upgradedAt = new Date();

        console.log(
          `🔄 VIP Level upgrading from ${currentVipNumber} → ${newVipNumber}`
        );
      }
    }

    // ==================== Update User Fields ====================
    allowedFields.forEach((field) => {
      if (updatedData[field] === undefined) return;

      if (field === "currentVIPLevel") {
        // Sirf number update karo
        if (updatedData.currentVIPLevel?.number !== undefined) {
          user.currentVIPLevel.number =
            updatedData.currentVIPLevel.number;
        }
      } else {
        user[field] = updatedData[field];
      }
    });

    const updatedUser = await user.save();

    // ✅ Transaction logic
    if (updatedData.transaction !== undefined) {
      await TransactionHistory.create({
        userId: userId,
        walletId: null,
        transactionAmount: updatedData.transaction,
        status: "Successful",
        type: "Credit",
      });
    }

    // 🔥 Referrer Commission (Sirf tab jab VIP actually upgrade hua ho)
    if (isVipLevelChanging && newVipLevelNumber) {
      console.log("🚀 Processing Referrer Commission for VIP Upgrade...");

      const vipLevel = await getVipLevelByNumber(newVipLevelNumber);

      if (vipLevel && user.refinviteCode) {
        const referrer = await User.findOne({ myinviteCode: user.refinviteCode });

        if (referrer) {
          const referralSettings = await Referral.findOne({});
          const depositRewardPercent = referralSettings?.depositRewardPercent || 0;

          const commissionAmount = (vipLevel.packagePrice * depositRewardPercent) / 100;

          referrer.totalBalance = (referrer.totalBalance || 0) + commissionAmount;
          await referrer.save();

          console.log(`✅ Commission Added: ${commissionAmount} to referrer ${referrer.username}`);
        }
      }
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ Fetch single user by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Route to submit task and update referrer with 15% commission
router.put("/submitTask/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body; // should contain walletBalance, commission, task updates, etc.

    // 1️⃣ Update user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const allowedFields = [
      "activeSetTasks",
      "walletBalance",
      "commissionTotal",
      "todayProfit",
      "taskCommission",
    ];
    allowedFields.forEach((field) => {
      if (updatedData[field] !== undefined) {
        user[field] = updatedData[field];
      }
    });

    await user.save();

    // 2️⃣ Find the referrer
    if (user.refinviteCode) {
      const referrer = await User.findOne({ myinviteCode: user.refinviteCode });
      if (referrer) {
        const commissionToAdd = Number(updatedData.taskCommission ?? 0) * 0.15; // 15%
        referrer.walletBalance = Number(referrer.walletBalance ?? 0) + commissionToAdd;
        await referrer.save();
      }
    }

    res.json({
      message: "Task submitted successfully and referrer updated with 15% commission",
      user,
    });

  } catch (error) {
    console.error("SubmitTask error:", error);
    res.status(500).json({ error: "Failed to submit task" });
  }
});

// ✅ Fetch all tasks for a user
router.get("/fetchTasks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({
      userId,
      status: "completed"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: `Tasks fetched successfully for user ${userId}`,
      tasks,
    });
  } catch (error) {
    console.error("FetchTasks Error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ Check for combo at a specific task number
router.get("/checkCombo/:userId/:taskNo", async (req, res) => {
  try {
    const { userId, taskNo } = req.params;

    // Fetch all combos for this user
    const combos = await Combo.find({ userId }).sort({ createdAt: -1 });

    // Check if any combo matches the taskNo
    const combo = combos.find(c => c.comboAt === Number(taskNo));

    if (combo) {
      return res.status(200).json({
        message: "Combo found for this task number",
        found: true,
        combo,
      });
    } else {
      return res.status(200).json({
        message: "No combo found for this task number",
        found: false,
      });
    }
  } catch (error) {
    console.error("CheckCombo Error:", error);
    res.status(500).json({ error: "Failed to check combo" });
  }
});

// Endpoint to get a task (Combo or Normal) for a user
router.post("/getTaskForUser/:userId/:taskNo/:version", async (req, res) => {
  try {
    const { userId, taskNo, version } = req.params;
    const { vipInfo } = req.body;

    // 🔥 Version check first
    const appVersionDoc = await VersionModel.findOne();

    if (!appVersionDoc) {
      return res.status(500).json({ error: "You're using an old version. Please upgrade to the latest version." });
    }

    const frontendVersion = String(version);
    const backendVersion = String(appVersionDoc.currentVersion);

    if (frontendVersion !== backendVersion) {
      return res.status(400).json({
        error: "Version mismatch. Please update your app.",
        backendVersion: appVersionDoc.version,
        yourVersion: version
      });
    }

    // Get user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ⭐ Extract VIP number (supports both formats)
    let vipNumber = 0;

    if (typeof user.currentVIPLevel === "number") {
      vipNumber = user.currentVIPLevel;
    } else if (user.currentVIPLevel && typeof user.currentVIPLevel === "object") {
      vipNumber = user.currentVIPLevel.number || 0;
    }

    // ❌ VIP = 0 block
    if (vipNumber === 0) {
      return res.status(403).json({
        error: "You are not allowed to perform this action. Please upgrade your VIP level."
      });
    }

    // 🎯 Get VIP config
    const vipLevelDoc = await VipLevel.findOne({ level: vipNumber });

    if (!vipLevelDoc) {
      return res.status(404).json({ error: "VIP configuration not found" });
    }

    const dailyProducts = vipLevelDoc.dailyProducts;

    // 📊 Count user's transactions
    const completedTasks = await Task.countDocuments({ userId });

    // ❌ Limit reached
    if (completedTasks >= dailyProducts) {
      return res.status(403).json({
        error: "You have completed your sets for today"
      });
    }

    // ================= EXISTING LOGIC =================

    // 2️⃣ If no combo, pick a random product
    const allProducts = await Product.find();

    // Get all products already used in tasks for this user
    const userTasks = await Task.find({ userId });
    const taskProducts = userTasks.map(t => t.product?.productName);

    // Filter out products already used
    const availableProducts = allProducts.filter(
      p => !taskProducts.includes(p._id)
    );

    if (availableProducts.length === 0) {
      return res.status(404).json({ error: "No available products for this user" });
    }

    // Pick a random product
    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    const selectedProduct = availableProducts[randomIndex].toObject();

    // Example:
    // packagePrice = 50
    // dailyProfitPercent = 4
    // dailyProducts = 10

    const totalDailyProfit =
      (vipInfo.packagePrice * vipInfo.dailyProfitPercent) / 100;

    const productValue =
      totalDailyProfit / vipInfo.dailyProducts;

    selectedProduct.productValue = Number(productValue.toFixed(3));

    return res.status(200).json({
      orderType: "Normal",
      product: selectedProduct,
      user // send user as well
    });

  } catch (error) {
    console.error("getTaskForUser Error:", error);
    res.status(500).json({ error: "Some error occured. Please check your VIP Level." });
  }
});

// Utility function to generate unique task code
const generateTaskCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

// ✅ Save Task endpoint 
router.post("/saveTask", async (req, res) => {
  try {
    const { userId, orderType, combo, product } = req.body;

    if (!userId || !orderType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Get user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const PACKAGE_DAYS = 75;

    // VIP expiry check
    if (user.currentVIPLevel?.upgradedAt) {
      const startDate = new Date(user.currentVIPLevel.upgradedAt);
      const today = new Date();

      const diffTime = today - startDate;
      const daysSpent = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (daysSpent >= PACKAGE_DAYS) {
        return res.status(403).json({
          error: "Your VIP package has expired. Please recharge your VIP level."
        });
      }
    }

    // ⭐ Extract VIP number (supports both formats)
    let vipNumber = 0;

    if (typeof user.currentVIPLevel === "number") {
      vipNumber = user.currentVIPLevel;
    } else if (user.currentVIPLevel && typeof user.currentVIPLevel === "object") {
      vipNumber = user.currentVIPLevel.number || 0;
    }

    // ❌ VIP = 0 block
    if (vipNumber === 0) {
      return res.status(403).json({
        error: "You are not allowed to perform this action. Please upgrade your VIP level."
      });
    }

    // 🎯 Get VIP config
    const vipLevelDoc = await VipLevel.findOne({ level: vipNumber });

    if (!vipLevelDoc) {
      return res.status(404).json({ error: "VIP configuration not found" });
    }

    const dailyProducts = vipLevelDoc.dailyProducts;

    // 📊 Count user's transactions
    const completedTasks = await Task.countDocuments({ userId });

    // ❌ Limit reached
    if (completedTasks >= dailyProducts) {
      return res.status(403).json({
        error: "You have completed your sets for today"
      });
    }

    // ================= EXISTING LOGIC =================

    // Prepare new task data
    const newTaskData = {
      userId,
      orderType
    };

    if (!product) return res.status(400).json({ error: "Product data missing" });

    if (!product.taskCode) product.taskCode = generateTaskCode();
    newTaskData.product = product;
    newTaskData.totalValue = product.productValue || 0;
    newTaskData.status = "completed"

    // Normal order balances
    user.totalBalance = (user.totalBalance) + (product.productValue)

    // 3️⃣ Save task
    const savedTask = await Task.create(newTaskData);

    // 5️⃣ Save user
    await user.save();

    // 6️⃣ Referrer commission
    if (user.refinviteCode) {
      const referrer = await User.findOne({ myinviteCode: user.refinviteCode });
      if (referrer) {
        // Fetch the referral settings (assuming only one document exists)
        const referralSettings = await Referral.findOne({});
        const depositRewardPercent = referralSettings?.depositRewardPercent || 0;

        // Calculate commission based on product.productValue
        const referrerCommission = (product.productValue * depositRewardPercent) / 100;

        // Add commission to referrer's balances
        referrer.totalBalance = (referrer.totalBalance || 0) + referrerCommission;

        await referrer.save();
      }
    }

    return res.status(201).json({
      message: "Task saved and commission applied successfully",
      task: savedTask,
      user,
    });

  } catch (error) {
    console.error("saveTask error:", error);
    return res.status(500).json({ error: "Failed to save task" });
  }
});

// Route to create a new transaction
router.post("/createTransaction", async (req, res) => {
  try {
    const { userId, walletId, transactionAmount, status, type } = req.body;

    // 0️⃣ Required fields check (walletId REMOVED from required)
    if (!userId || !transactionAmount || !type) {
      return res.status(400).json({
        error: "userId, transactionAmount and type are required."
      });
    }

    // 1️⃣ Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // 1.5️⃣ Check if user has any pending transaction
    const pendingTransaction = await TransactionHistory.findOne({
      userId,
      status: "Pending",
    });

    if (pendingTransaction) {
      return res.status(400).json({
        error: "You already have an unfinished transaction."
      });
    }

    // 2️⃣ Validate wallet ONLY if walletId is provided
    if (walletId) {
      const walletExists = await WalletAddress.findOne({
        _id: walletId,
        userId,
      });

      if (!walletExists) {
        return res.status(400).json({
          error: "Invalid walletId or this wallet does not belong to the user."
        });
      }
    }

    // 3️⃣ Validate status (optional)
    const allowedStatus = ["Pending", "Successful", "Failed"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    // 4️⃣ Validate type
    const allowedTypes = ["Debit", "Credit"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type." });
    }

    // 5️⃣ Create new transaction
    const newTransaction = new TransactionHistory({
      userId,
      walletId: walletId || null, // wallet optional
      transactionAmount,
      status: status || "Pending",
      type,
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });

  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Route to get all transactions for a user
router.get("/getTransactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 0️⃣ Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    // 1️⃣ Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2️⃣ Fetch all transactions for the user
    //    - populate walletId ONLY if it exists
    const transactions = await TransactionHistory.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "walletId",
        model: "WalletAddress",
        match: { _id: { $ne: null } }, // populate only if walletId exists
      });

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Route to update the status of a transaction
router.put("/updateTransaction/:transactionId/:userId", async (req, res) => {
  try {
    const { transactionId, userId } = req.params;
    const { status, amount } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    // Validate allowed status
    const allowedStatus = ["Pending", "Successful", "Failed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    // Find transaction
    const transaction = await TransactionHistory.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    // Update status
    transaction.status = status;
    await transaction.save();

    // ✅ Update totalBalance if status is Successful
    if (status === "Successful") {
      const user = await User.findById(transaction.userId);

      if (user) {
        const deductAmount = Number(amount || transaction.transactionAmount || 0);

        user.totalBalance =
          (user.totalBalance || 0) - deductAmount;

        // ❌ prevent negative balance (optional but recommended)
        if (user.totalBalance < 0) {
          user.totalBalance = 0;
        }

        await user.save();
      }
    }

    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction
    });

  } catch (error) {
    console.error("Update transaction status error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.post("/createAddress", async (req, res) => {
  try {
    const { userId, walletLabel, walletAddress } = req.body;

    // Check required fields
    if (!userId || !walletLabel || !walletAddress) {
      return res.status(201).json({ error: "All fields are required." });
    }

    // Check duplicate address
    const existing = await WalletAddress.findOne({ walletAddress });
    if (existing) {
      return res.status(201).json({ error: "This wallet address already exists." });
    }

    // Create new address
    const newAddress = new WalletAddress({
      userId,
      walletLabel,
      walletAddress,
    });

    await newAddress.save();

    res.status(201).json({
      message: "Wallet address created successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.put("/updateAddress/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const { userId, walletLabel, walletAddress } = req.body;

    if (!userId) {
      return res.status(201).json({ error: "userId is required." });
    }

    // Find address
    const address = await WalletAddress.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(201).json({
        error: "Wallet address not found or does not belong to this user.",
      });
    }

    // Update fields
    if (walletLabel) address.walletLabel = walletLabel;
    if (walletAddress) address.walletAddress = walletAddress;

    await address.save();

    res.status(201).json({
      message: "Wallet address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.delete("/deleteAddress/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const { userId } = req.query; // use query param instead of req.body

    if (!userId) {
      return res.status(201).json({ error: "userId is required." });
    }

    const deleted = await WalletAddress.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deleted) {
      return res.status(201).json({
        error: "Wallet address not found or does not belong to this user.",
      });
    }

    res.status(201).json({ message: "Wallet address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.get("/getWalletAddresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await WalletAddress.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(201).json({
      message: "Wallet addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error("Get wallet addresses error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Deposit Wallet
router.post("/addWallet", async (req, res) => {
  try {
    const { walletName, walletAddress } = req.body;

    const newWallet = await DepositWallet.create({
      walletName,
      walletAddress,
    });

    res.status(201).json({
      message: "Wallet created successfully",
      wallet: newWallet,
    });
  } catch (error) {
    console.error("Add wallet error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Deposit Wallet
router.get("/getWallet", async (req, res) => {
  try {
    const wallets = await DepositWallet.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Wallets fetched successfully",
      wallets,
    });
  } catch (error) {
    console.error("Get wallets error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Route to fetch a single wallet address by its ID
router.get("/fetchWalletAddress/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({ error: "addressId is required." });
    }

    const walletAddress = await WalletAddress.findById(addressId);

    if (!walletAddress) {
      return res.status(404).json({ error: "Wallet address not found." });
    }

    res.status(200).json({
      message: "Wallet address fetched successfully",
      walletAddress,
    });
  } catch (error) {
    console.error("Fetch wallet address error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Deposit Wallet
router.put("/updateWallet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { walletName, walletAddress } = req.body;

    const updatedWallet = await DepositWallet.findByIdAndUpdate(
      id,
      {
        walletName,
        walletAddress,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Wallet updated successfully",
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error("Update wallet error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Deposit wallet
router.delete("/deleteWallet/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await DepositWallet.findByIdAndDelete(id);

    res.status(200).json({
      message: "Wallet deleted successfully",
    });
  } catch (error) {
    console.error("Delete wallet error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ✅ Fetch user by userId
router.get("/getUserByUserId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Get user by userId error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ✅ Fetch all referrals for a user
router.get("/getReferrals/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2️⃣ Find all users whose refinviteCode matches this user's myinviteCode
    const referrals = await User.find({ refinviteCode: user.myinviteCode })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Referrals fetched successfully",
      total: referrals.length,
      referrals,
    });

  } catch (error) {
    console.error("Get Referrals Error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.get("/transactionhistory", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const transactions = await TransactionHistory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        model: "Users",
        select: "username phone",
      })
      .populate({
        path: "walletId",
        model: "WalletAddress",
        match: { _id: { $ne: null } },
      });

    const total = await TransactionHistory.countDocuments();

    res.status(200).json({
      message: "Transaction history fetched successfully",
      page,
      totalPages: Math.ceil(total / limit),
      total,
      transactions,
    });

  } catch (error) {
    console.error("Transaction History Error:", error);
    res.status(500).json({ error: "Failed to fetch transaction history" });
  }
});

module.exports = router;
