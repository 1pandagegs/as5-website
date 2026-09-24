require("dotenv").config();

const express = require("express");
const path = require("node:path");
// Resolves resend/zod from the repo root: run `npm install` there too.
const inquire = require("../api/inquire");

const app = express();
const PORT = process.env.PORT || 4000;
const staticRoot = path.join(__dirname, "..");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticRoot, { extensions: ["html"] }));

// Same handler Vercel deploys from api/, so the two can't drift apart.
app.post("/api/inquire", inquire);

app.use((req, res) => {
  res.status(404).sendFile(path.join(staticRoot, "404.html"));
});

app.listen(PORT, () => {
  console.log(`AS5 static site running at http://localhost:${PORT}`);
});
