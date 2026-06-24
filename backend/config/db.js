const mongoose = require("mongoose")

const MONGO_URI = "mongodb://clarkisaballa_db_user:413spq5floRlH5YS@ac-bmrebmw-shard-00-00.jhzpugm.mongodb.net:27017,ac-bmrebmw-shard-00-01.jhzpugm.mongodb.net:27017,ac-bmrebmw-shard-00-02.jhzpugm.mongodb.net:27017/mynft?ssl=true&replicaSet=atlas-u8ceiy-shard-0&authSource=admin&appName=Cluster0" 
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.error("MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
