const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ============================
   CORS CONFIG (IMPORTANT)
============================ */
const allowedOrigins = [
  "https://event-frontend-roan.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle preflight requests
app.options("*", cors());

/* ============================
   MIDDLEWARE
============================ */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ============================
   DATABASE
============================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    require("./seed")(); // seed admin
  })
  .catch((err) => console.log("MongoDB Error:", err));

/* ============================
   ROUTES
============================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));

app.get("/", (req, res) => {
  res.send("Event Management API is running");
});

/* ============================
   START SERVER
============================ */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
