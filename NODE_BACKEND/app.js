const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Important for Flutter/web access
const UserRoute = require("./routes/user.routes");
const ToDoRoute = require("./routes/todo.router");

const app = express();

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(bodyParser.json());

// Route Setup
app.use("/api", UserRoute);    // All user routes prefixed with /api
app.use("/api", ToDoRoute);    // All todo routes prefixed with /api

module.exports = app;
