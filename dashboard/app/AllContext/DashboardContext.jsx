"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [vipLevels, setVipLevels] = useState([]);
  const [isLoadingVipLevels, setIsLoadingVipLevels] = useState(false);

  const [referralSettings, setReferralSettings] = useState(null);
  const [isLoadingReferral, setIsLoadingReferral] = useState(false);

  const host1offline = "http://localhost:3001/"
  const host2offline = "http://localhost:8000/"
  const host1online = "https://sergio-amir-backend.vercel.app/"
  const host2online = "https://sergio-amir-live.onrender.com/"

  useEffect(() => {
    const eventSource = new EventSource(`${host2offline}api/realtime-events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event !== "users_updated") return;

      const change = data.payload;
      const updatedUser = change.fullDocument;
      const userId = change.documentKey?._id;

      if (!userId) return;

      setUsers((prevUsers) => {
        const index = prevUsers.findIndex((u) => u._id === userId);

        // =========================
        // ➕ INSERT (NEW USER)
        // =========================
        if (change.operationType === "insert") {
          if (index === -1) {
            return [updatedUser, ...prevUsers];
          }
          return prevUsers;
        }

        // =========================
        // 🔁 UPDATE / REPLACE
        // =========================
        if (
          change.operationType === "update" ||
          change.operationType === "replace"
        ) {
          if (index !== -1) {
            const updatedUsers = [...prevUsers];
            updatedUsers[index] = {
              ...prevUsers[index],
              ...updatedUser,
            };
            return updatedUsers;
          } else {
            // agar user list me nahi tha → push kar do
            return [updatedUser, ...prevUsers];
          }
        }

        // =========================
        // ❌ DELETE
        // =========================
        if (change.operationType === "delete") {
          return prevUsers.filter((u) => u._id !== userId);
        }

        return prevUsers;
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // Users Management Functions
  const addUser = (userData) => {
    const newUser = {
      _id: String(users.length + 1),
      ...userData,
      currentVIPLevel: {
        number: 1,
        name: "Bronze Tier",
        withdraw_limit: 1300,
        commission: 0.4
      },
      walletBalance: 0,
      commissionTotal: 0,
      profileimage: "/diverse-user-avatars.png"
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (userId, updatedData) => {
    setUsers(users.map(user =>
      user._id === userId ? { ...user, ...updatedData } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
  };

  // Products Management
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${host1offline}api/products/addProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Add product failed");

      setProducts((prev) => [...prev, result.product]);
      return result.product;
    } catch (error) {
      console.error("Add Product Error:", error);
    }
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(products.map(product =>
      product._id === productId ? { ...product, ...updatedData } : product
    ));
  };

  // Products Management Functions
  const deleteProduct = async (productId) => {
    try {
      // Call your backend API to delete the product
      const response = await fetch(`${host1offline}api/products/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to delete product");
        return false;
      }

      const result = await response.json();
      console.log("Product deleted:", result);

      // Update local state after successful deletion
      setProducts(products.filter(product => product._id !== productId));

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };


  const fetchProducts = async (page = 1) => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(`${host1offline}api/products/products?page=${page}`);

      if (!response.ok) {
        console.error("Failed to fetch products");
        setIsLoadingProducts(false);
        return;
      }

      const result = await response.json();
      console.log("[v0] Fetched products:", result);

      // Set products array and total pages from API response
      setProducts(result.products || []);
      setTotalPages(result.totalPages || 1);

      setIsLoadingProducts(false);

    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoadingProducts(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoadingUsers(true);

      const response = await fetch(
        `${host1offline}api/users/users?page=${page}`
      );

      if (!response.ok) {
        console.error("Failed to fetch users");
        setIsLoadingUsers(false);
        return;
      }

      const result = await response.json();

      // Update state
      setUsers(result.users || []);
      setTotalUserPages(result.totalPages || 1);

      setIsLoadingUsers(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoadingUsers(false);
    }
  };

  const searchUsers = async (query, page = 1) => {
    try {
      setIsLoadingUsers(true);

      const response = await fetch(
        `${host1offline}api/users/search?query=${query}&page=${page}`
      );

      const data = await response.json();

      setUsers(data.users);
      setTotalUserPages(data.totalPages);
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Update User via API
  const updateUserAPI = async (userId, updatedData) => {
    try {
      const response = await fetch(
        `${host1offline}api/users/updateUser/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Update user failed:", result.error);
        return null;
      }

      // Update state locally
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...result.user } : user
        )
      );

      return result.user;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  const rechargeTrainingAccountAPI = async (userId, updatedData) => {
    try {
      // Send a PUT request to the backend to update the user account
      const response = await fetch(
        `${host1offline}api/users/rechargeTrainingAccount/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      // Parse the JSON response
      const result = await response.json();

      // If the response is not OK, log the error and return null
      if (!response.ok) {
        console.error("Recharge training account failed:", result.error);
        return null;
      }

      // Update the state locally to reflect the changes
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...result.user } : user
        )
      );

      // Return the updated user
      return result.user;
    } catch (error) {
      console.error("Error recharging training account:", error);
      return null;
    }
  };

  // =========================
  // FETCH ALL VIP LEVELS
  // =========================
  const fetchVipLevels = async () => {
    try {
      setIsLoadingVipLevels(true);

      const response = await fetch(`${host1offline}api/viplevel/`);

      if (!response.ok) {
        console.error("Failed to fetch VIP levels");
        setIsLoadingVipLevels(false);
        return;
      }

      const result = await response.json();
      setVipLevels(result.data || []);
      setIsLoadingVipLevels(false);

    } catch (error) {
      console.error("Error fetching VIP levels:", error);
      setIsLoadingVipLevels(false);
    }
  };

  // =========================
  // CREATE VIP LEVEL
  // =========================
  const createVipLevel = async (vipData) => {
    try {
      const response = await fetch(`${host1offline}api/viplevel/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vipData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Create VIP level failed:", result.error);
        return null;
      }

      setVipLevels((prev) => [...prev, result.data]);
      return result.data;

    } catch (error) {
      console.error("Error creating VIP level:", error);
      return null;
    }
  };

  // =========================
  // UPDATE VIP LEVEL
  // =========================
  const updateVipLevel = async (vipId, updatedData) => {
    try {
      const response = await fetch(`${host1offline}api/viplevel/update/${vipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Update VIP level failed:", result.error);
        return null;
      }

      setVipLevels((prev) =>
        prev.map((vip) =>
          vip._id === vipId ? { ...vip, ...result.data } : vip
        )
      );

      return result.data;

    } catch (error) {
      console.error("Error updating VIP level:", error);
      return null;
    }
  };

  // =========================
  // DELETE VIP LEVEL
  // =========================
  const deleteVipLevel = async (vipId) => {
    try {
      const response = await fetch(`${host1offline}api/viplevel/delete/${vipId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Failed to delete VIP level");
        return false;
      }

      setVipLevels((prev) => prev.filter((vip) => vip._id !== vipId));
      return true;

    } catch (error) {
      console.error("Error deleting VIP level:", error);
      return false;
    }
  };

  // =========================
  // FETCH REFERRAL SETTINGS
  // =========================
  const fetchReferralSettings = async () => {
    try {
      setIsLoadingReferral(true);

      const response = await fetch(`${host1offline}api/referral/`);
      const result = await response.json();

      if (!response.ok) {
        setReferralSettings(null);
        setIsLoadingReferral(false);
        return null;
      }

      setReferralSettings(result.data || null);
      setIsLoadingReferral(false);
      return result.data;

    } catch (error) {
      console.error("Error fetching referral settings:", error);
      setIsLoadingReferral(false);
      return null;
    }
  };

  // =========================
  // CREATE REFERRAL SETTINGS
  // =========================
  const createReferralSettings = async (data) => {
    try {
      const response = await fetch(`${host1offline}api/referral/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Create referral failed:", result.error);
        return null;
      }

      setReferralSettings(result.data);
      return result.data;

    } catch (error) {
      console.error("Error creating referral settings:", error);
      return null;
    }
  };

  // =========================
  // UPDATE REFERRAL SETTINGS
  // =========================
  const updateReferralSettings = async (id, updatedData) => {
    try {
      const response = await fetch(`${host1offline}api/referral/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Update referral failed:", result.error);
        return null;
      }

      setReferralSettings(result.data);
      return result.data;

    } catch (error) {
      console.error("Error updating referral settings:", error);
      return null;
    }
  };

  // =========================
  // DELETE REFERRAL SETTINGS
  // =========================
  const deleteReferralSettings = async (id) => {
    try {
      const response = await fetch(`${host1offline}api/referral/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Delete referral failed");
        return false;
      }

      setReferralSettings(null);
      return true;

    } catch (error) {
      console.error("Error deleting referral settings:", error);
      return false;
    }
  };

  const value = {
    // Users
    users,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
    totalUserPages,
    isLoadingUsers,
    searchUsers,
    updateUserAPI,
    rechargeTrainingAccountAPI,

    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    totalPages,
    isLoadingProducts,

    // Tab management
    activeTab,
    setActiveTab,

    // VIP Levels
    vipLevels,
    isLoadingVipLevels,
    fetchVipLevels,
    createVipLevel,
    updateVipLevel,
    deleteVipLevel,

    // Referral
    referralSettings,
    isLoadingReferral,
    fetchReferralSettings,
    createReferralSettings,
    updateReferralSettings,
    deleteReferralSettings,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
