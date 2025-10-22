const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./conf.env" });
const app = require("./src/app");

const PORTS = process.env.PORTS || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const server = app.listen(PORTS, () => {
  console.log(`Server is running on port ${PORTS}`);
  console.log("Running Environment:", NODE_ENV);
});

process.on("uncaughtException", (err) =>
  console.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (err) =>
  console.error("Unhandled Rejection:", err)
);
