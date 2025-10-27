const { ethers } = require("hardhat");

async function checkGanache() {
  try {
    console.log("Checking Ganache connection...");
    console.log("RPC URL: http://127.0.0.1:7545");
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    
    // Try to get network info
    const network = await provider.getNetwork();
    console.log("✓ Connected to network:", network.name);
    console.log("✓ Chain ID:", network.chainId.toString());
    
    // Get accounts
    const accounts = await provider.listAccounts();
    console.log("✓ Available accounts:", accounts.length);
    
    if (accounts.length > 0) {
      console.log("\nFirst account:", accounts[0].address);
      const balance = await provider.getBalance(accounts[0].address);
      console.log("Balance:", ethers.formatEther(balance), "ETH");
    }
    
    console.log("\n✓ Ganache is running and ready!");
    return true;
  } catch (error) {
    console.error("\n✗ Cannot connect to Ganache!");
    console.error("Error:", error.message);
    console.log("\nPlease make sure:");
    console.log("1. Ganache is running");
    console.log("2. RPC Server is at http://127.0.0.1:7545");
    console.log("3. Port 7545 is not blocked");
    return false;
  }
}

checkGanache()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
