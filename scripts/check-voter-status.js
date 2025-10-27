const hre = require("hardhat");

async function checkVoterStatus() {
  console.log("Checking voter registration status...\n");

  // Get contract
  const contractAddress = require("../src/contracts/contract-address.json").VotingSystem;
  const contractABI = require("../src/contracts/VotingSystem.json").abi;
  
  const [signer] = await hre.ethers.getSigners();
  const contract = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Get all accounts from provider
  const provider = hre.ethers.provider;
  const signers = await hre.ethers.getSigners();
  
  console.log("Contract Address:", contractAddress);
  console.log("Checking accounts...\n");

  for (let i = 0; i < Math.min(5, signers.length); i++) {
    const address = await signers[i].getAddress();
    try {
      const voterInfo = await contract.getVoterInfo(address);
      const isAdmin = await contract.isAdmin(address);
      
      console.log(`Account ${i + 1}: ${address}`);
      console.log(`  Role: ${isAdmin ? 'ADMIN' : 'Voter'}`);
      console.log(`  Registered: ${voterInfo[2] ? 'YES ✓' : 'NO ✗'}`);
      console.log(`  Has Voted: ${voterInfo[0] ? 'YES' : 'NO'}`);
      if (voterInfo[0]) {
        console.log(`  Voted For: Nominee #${voterInfo[1]}`);
      }
      console.log('');
    } catch (error) {
      console.log(`Account ${i + 1}: ${address} - Error checking status`);
      console.log('');
    }
  }

  // Check voting status
  const votingOpen = await contract.getVotingStatus();
  const totalVotes = await contract.getTotalVotes();
  
  console.log("Voting Status:", votingOpen ? "OPEN ✓" : "CLOSED ✗");
  console.log("Total Votes Cast:", totalVotes.toString());
}

checkVoterStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
