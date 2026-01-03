const { server, asset } = require("./stellar");
const { getReward, getUnlockTime } = require("./rewards");
const db = require("./db");

function startWatcher() {
  server
    .payments()
    .forAccount(process.env.STAKING_VAULT_PUBLIC)
    .cursor("now")
    .stream({
      onmessage: async payment => {
        if (payment.asset_type !== "credit_alphanum4") return;
        if (payment.asset_code !== process.env.ASSET_CODE) return;
        if (!payment.memo) return;

        const memo = payment.memo.toUpperCase();
        if (!memo.startsWith("ORBX_STAKE:")) return;

        const days = parseInt(memo.split(":")[1]);
        if (![30, 60, 120].includes(days)) return;

        const amount = parseFloat(payment.amount);
        const reward = getReward(amount, days);
        const unlock = getUnlockTime(days);

        db.data.stakes.push({
          wallet: payment.from,
          amount,
          reward,
          days,
          unlock,
          claimed: false
        });

        await db.write();
        console.log("New stake recorded:", payment.from, amount, days);
      },
      onerror: err => console.error("Watcher error:", err)
    });
}

module.exports = startWatcher;
