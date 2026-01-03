// stellar.js
const { Server, Networks, Asset } = require("stellar-sdk");

const server = new Server(process.env.HORIZON);

const network =
  process.env.NETWORK === "PUBLIC" ? Networks.PUBLIC : Networks.TESTNET;

const asset = new Asset(process.env.ASSET_CODE, process.env.ISSUER_PUBLIC);

module.exports = { server, network, asset };
