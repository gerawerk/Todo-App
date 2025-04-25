const app = require("./app");
const connectDB = require('./config/db'); // make sure this is your async function
const port = 3000;
require('dotenv').config();

const startServer = async () => {
  try {
    await connectDB(); // ✅ Wait for DB connection
    app.listen(port, () => {
      console.log(`✅ Server Listening on Port`);
      console.log(`http://localhost:${port}`);
      console.log("MONGO_URI:", process.env.MONGODB_URI);
console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);

    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
