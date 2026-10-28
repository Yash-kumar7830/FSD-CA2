require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./Routes/bookRoutes");
const errorHandler = require("./Middleware/errorHandler");

const app = express();

app.use(express.json());
app.use("/api/books", bookRoutes);
app.use(errorHandler);

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file.");
  }

  await mongoose.connect(mongoUri);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Library API is running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Could not start the Library API:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
