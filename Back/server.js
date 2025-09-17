require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const corsMiddleware = require("./middlewares/cors");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const connectToDatabase = require("./db/mongoose");
const limiter = require("./middlewares/rateLimiter");

// Controllers
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const doctorController = require("./controllers/doctorController");
const nurseController = require("./controllers/nurseController");
const appointmentController = require("./controllers/appointmentController");
const adminController = require("./controllers/adminController");

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);

app.use("/auth", limiter, authController);
app.use("/user", limiter, userController);
app.use("/doctor", limiter, doctorController);
app.use("/nurse", limiter, nurseController);
app.use("/appointment", limiter, appointmentController);
app.use("/admin", limiter, adminController);

app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
  }
})();
