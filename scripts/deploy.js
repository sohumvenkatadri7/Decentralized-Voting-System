const hre = require("hardhat");

async function main() {
  console.log("Deploying VotingSystem contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.waitForDeployment();

  const address = await votingSystem.getAddress();
  console.log("VotingSystem deployed to:", address);
  
  // Save the contract address and ABI to a file for the frontend
  const fs = require("fs");
  const contractsDir = "./src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ VotingSystem: address }, undefined, 2)
  );

  const VotingSystemArtifact = await hre.artifacts.readArtifact("VotingSystem");

  fs.writeFileSync(
    contractsDir + "/VotingSystem.json",
    JSON.stringify(VotingSystemArtifact, null, 2)
  );
  
  console.log("Contract address and ABI saved to src/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
