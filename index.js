require("dotenv").config();
const express = require("express");
const cors = require("cors");
const startWatcher = require("./watcher");
const processClaims = require("./claims");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// API: Get all stakes for a wallet
app.get("/stakes/:wallet", (req, res) => {
  const stakes = db.data.stakes.filter(
    s => s.wallet === req.params.wallet
  );
  res.json(stakes);
});

// Optional: Get all stakes
app.get("/stakes", (req, res) => {
  res.json(db.data.stakes);
});

// Start watcher for new stakes
startWatcher();

// Process matured stakes every minute
setInterval(() => {
  processClaims().catch(err => console.error("Claim error:", err));
}, 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`ORBX staking backend running on port ${PORT}`)
);
