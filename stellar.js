const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Server(process.env.HORIZON);
const network =
  process.env.NETWORK === "PUBLIC"
    ? StellarSdk.Networks.PUBLIC
    : StellarSdk.Networks.TESTNET;

const asset = new StellarSdk.Asset(
  process.env.ASSET_CODE,
  process.env.ISSUER_PUBLIC
);

module.exports = { server, network, asset };
