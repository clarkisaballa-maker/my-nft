const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { broadcast } = require("../sse/sseStore")

// =======================
// 🔥 In-memory data
// =======================
let messages = [] // chat messages (temporary)
const typingUsers = {} // { userId: { username, sender, timestamp } }

let broadcasts = []

// =======================
// 🔥 SSE STREAM (connect user/admin)
// =======================
router.get("/stream", (req, res) => {
  const { userId } = req.query

  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.flushHeaders()

  const clientId = uuidv4()

  // 🔥 Register client in GLOBAL SSE store
  const { addClient, removeClient } = require("../sse/sseStore")
  addClient({ id: clientId, res, userId: userId || null })

  console.log(`🟢 LiveSupport SSE connected: ${clientId}`)

  // Send initial messages
  const initialMessages = userId
    ? messages.filter(m => m.userId === userId)
    : messages

  res.write(`data: ${JSON.stringify({
    event: "initial_messages",
    payload: initialMessages
  })}\n\n`)

  req.on("close", () => {
    removeClient(clientId)
    console.log(`🔴 LiveSupport SSE disconnected: ${clientId}`)
  })
})

// =======================
// 🔥 SEND MESSAGE
// =======================
router.post("/send", (req, res) => {
  const {
    userId,
    username,
    text,
    fileType,
    fileUrl,
    fileName,
    replyTo,
    sender
  } = req.body

  if (!userId || (!text && !fileUrl)) {
    return res.status(400).json({ error: "Invalid message data" })
  }

  const newMessage = {
    id: Date.now(),
    userId,
    username: username || (sender === "support" ? "Support" : "Anonymous"),
    sender: sender || "user",
    text: text || "",
    fileType: fileType || null,
    fileUrl: fileUrl || null,
    fileName: fileName || null,
    replyTo: replyTo || null,
    read: false,
    timestamp: Date.now(),
  }

  messages.push(newMessage)

  // 🔥 Broadcast to SSE clients
  broadcast({
    event: "new_message",
    payload: newMessage,
  })

  res.json({ success: true, message: newMessage })
})

// =======================
// 🔥 MARK READ
// =======================
router.post("/mark-read", (req, res) => {
  const { userId, messageIds } = req.body

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" })
  }

  messages = messages.map(msg => {
    if (
      msg.userId === userId &&
      (!messageIds || messageIds.includes(msg.id))
    ) {
      return { ...msg, read: true }
    }
    return msg
  })

  broadcast({
    event: "messages_read",
    payload: { userId, messageIds },
  })

  res.json({ success: true })
})

// =======================
// 🔥 TYPING STATUS
// =======================
router.post("/typing", (req, res) => {
  const { userId, username, sender, isTyping } = req.body

  if (!userId) {
    return res.status(400).json({ error: "Invalid typing data" })
  }

  if (isTyping) {
    typingUsers[userId] = { username, sender, timestamp: Date.now() }
  } else {
    delete typingUsers[userId]
  }

  broadcast({
    event: "typing_status",
    payload: { userId, username, sender, isTyping },
  })

  res.json({ success: true })
})

// =======================
// 🔥 ALL USERS (ADMIN)
// =======================
router.get("/allUsers", (req, res) => {
  const userMap = {}

  messages.forEach(msg => {
    if (msg.sender === "user") {
      if (!userMap[msg.userId]) {
        userMap[msg.userId] = {
          id: msg.userId,
          username: msg.username,
          lastMessage: msg.text || msg.fileName || "File sent",
          timestamp: msg.timestamp,
          pendingMessages: 0,
        }
      } else {
        userMap[msg.userId].lastMessage = msg.text || msg.fileName || "File sent"
        userMap[msg.userId].timestamp = msg.timestamp
      }
    }
  })

  messages.forEach(msg => {
    if (msg.sender === "user" && !msg.read && userMap[msg.userId]) {
      userMap[msg.userId].pendingMessages++
    }
  })

  res.json({
    success: true,
    users: Object.values(userMap).sort((a, b) => b.timestamp - a.timestamp)
  })
})

// =======================
// 🔥 USER CHAT HISTORY
// =======================
router.get("/history/:userId", (req, res) => {
  const { userId } = req.params
  res.json({
    success: true,
    messages: messages.filter(m => m.userId === userId),
  })
})

// =======================
// 🔥 DELETE CHAT
// =======================
router.delete("/killChat/:userId", (req, res) => {
  const { userId } = req.params

  messages = messages.filter(m => m.userId !== userId)

  broadcast({
    event: "chat_deleted",
    payload: { userId },
  })

  res.json({ success: true })
})

// =======================
// 🔥 BROADCAST TO ALL USERS (Totally Separate)
// =======================
router.post("/broadcast", (req, res) => {
  const { text, username = "Support", sender = "support" } = req.body

  if (!text?.trim()) {
    return res.status(400).json({ error: "Message text is required" })
  }

  const broadcastMsg = {
    id: "broadcast_" + Date.now(),
    username,
    sender,
    text: text,                    // Clean text (no prefix here)
    timestamp: Date.now(),
    isBroadcast: true,
    read: false
  }

  // 🔥 Sirf broadcasts array mein save ho raha hai
  broadcasts.unshift(broadcastMsg)   // Newest on top

  // Broadcast event bhej rahe hain (alag event)
  broadcast({
    event: "new_broadcast",        // Important: alag event
    payload: broadcastMsg
  })

  console.log(`📢 Broadcast sent successfully to all users`);

  res.json({
    success: true,
    message: "Broadcast sent to all users",
    broadcastId: broadcastMsg.id
  })
})

module.exports = router
