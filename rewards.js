function getReward(amount, days) {
  const rates = {
    30: 0.08,
    60: 0.20,
    120: 0.50
  };
  return amount * rates[days];
}

function getUnlockTime(days) {
  return Math.floor(Date.now() / 1000) + days * 86400;
}

module.exports = { getReward, getUnlockTime };
