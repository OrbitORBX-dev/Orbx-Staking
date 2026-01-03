const StellarSdk = require("stellar-sdk");
const { server, asset, network } = require("./stellar");
const db = require("./db");

async function processClaims() {
  const now = Math.floor(Date.now() / 1000);

  for (const stake of db.data.stakes) {
    if (stake.claimed) continue;
    if (stake.unlock > now) continue;

    const source = await server.loadAccount(
      process.env.REWARD_VAULT_PUBLIC
    );

    const tx = new StellarSdk.TransactionBuilder(source, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: network
    })
      .addOperation(
        StellarSdk.Operation.createClaimableBalance({
          asset,
          amount: (stake.amount + stake.reward).toFixed(7),
          claimants: [
            new StellarSdk.Claimant(
              stake.wallet,
              StellarSdk.Claimant.predicateUnconditional()
            )
          ]
        })
      )
      .setTimeout(0)
      .build();

    tx.sign(
      StellarSdk.Keypair.fromSecret(process.env.REWARD_VAULT_SECRET)
    );

    await server.submitTransaction(tx);
    stake.claimed = true;
    await db.write();
    console.log("Claimable balance created for:", stake.wallet);
  }
}

module.exports = processClaims;
