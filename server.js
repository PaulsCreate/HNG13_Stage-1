const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./conf.env" });
const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Running Environment:", NODE_ENV);
});
