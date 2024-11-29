const express = require("express");
const axios = require("axios");
const checklistRules = require("./rules/checklist");

const app = express();
const PORT = 3000;

// Middleware for serving static files and parsing requests
app.use(express.static("public"));
app.set("view engine", "ejs");

// API Endpoint and checklist evaluation
const API_URL = "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";

app.get("/", async (req, res) => {
  try {
    // Fetch input data
    const { data } = await axios.get(API_URL);

    // Evaluate checklist rules
    const results = checklistRules.map((rule) => ({
      name: rule.name,
      status: rule.check(data) ? "Passed" : "Failed",
    }));

    // Render dashboard
    res.render("dashboard", { results });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
