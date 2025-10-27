require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    development: {
      url: "http://127.0.0.1:7545", // Ganache default RPC server
      chainId: 1337,
      // No accounts needed - Hardhat will use Ganache accounts automatically
    },
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
