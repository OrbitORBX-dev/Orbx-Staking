require("dotenv").config();
const express = require("express");
const cors = require("cors");
const startWatcher = require("./watcher");  // listens for new stakes
const processClaims = require("./claims");  // processes matured stakes
const db = require("./db");                 // simple database

const app = express();
app.use(cors());
app.use(express.json());

// ROUTE: Get all stakes for a wallet
app.get("/stakes/:wallet", (req, res) => {
  const stakes = db.data.stakes.filter(
    s => s.wallet === req.params.wallet
  );
  res.json(stakes);
});

// ROUTE: Get all stakes (optional, for dashboard)
app.get("/stakes", (req, res) => {
  res.json(db.data.stakes);
});

// Start the staking vault watcher
startWatcher();

// Periodically process matured stakes (every 60 seconds)
setInterval(() => {
  processClaims().catch(err => console.error("Claim error:", err));
}, 60 * 1000);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`ORBX staking backend running on port ${PORT}`)
);
