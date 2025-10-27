const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let votingSystem;
  let admin;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    [admin, voter1, voter2, voter3] = await ethers.getSigners();

    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
    await votingSystem.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await votingSystem.admin()).to.equal(admin.address);
    });

    it("Should start with voting closed", async function () {
      expect(await votingSystem.votingOpen()).to.equal(false);
    });

    it("Should start with zero nominees", async function () {
      expect(await votingSystem.nomineeCount()).to.equal(0);
    });

    it("Should start with zero votes", async function () {
      expect(await votingSystem.totalVotes()).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to add nominee", async function () {
      await votingSystem.addNominee("Alice", "Candidate A");
      expect(await votingSystem.nomineeCount()).to.equal(1);

      const nominee = await votingSystem.getNominee(1);
      expect(nominee.name).to.equal("Alice");
      expect(nominee.description).to.equal("Candidate A");
    });

    it("Should not allow non-admin to add nominee", async function () {
      await expect(
        votingSystem.connect(voter1).addNominee("Bob", "Candidate B")
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should allow admin to toggle voting", async function () {
      await votingSystem.toggleVoting();
      expect(await votingSystem.votingOpen()).to.equal(true);

      await votingSystem.toggleVoting();
      expect(await votingSystem.votingOpen()).to.equal(false);
    });

    it("Should allow admin to register voter", async function () {
      await votingSystem.registerVoter(voter1.address, "aadhar_hash_123");
      
      const voterInfo = await votingSystem.getVoterInfo(voter1.address);
      expect(voterInfo.isRegistered).to.equal(true);
      expect(voterInfo.hasVoted).to.equal(false);
    });

    it("Should not allow registering same voter twice", async function () {
      await votingSystem.registerVoter(voter1.address, "aadhar_hash_123");
      
      await expect(
        votingSystem.registerVoter(voter1.address, "aadhar_hash_123")
      ).to.be.revertedWith("Voter already registered");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Setup: Add nominees and register voters
      await votingSystem.addNominee("Alice", "Candidate A");
      await votingSystem.addNominee("Bob", "Candidate B");
      await votingSystem.registerVoter(voter1.address, "aadhar_hash_1");
      await votingSystem.registerVoter(voter2.address, "aadhar_hash_2");
      await votingSystem.toggleVoting(); // Open voting
    });

    it("Should allow registered voter to vote", async function () {
      await votingSystem.connect(voter1).vote(1);
      
      const voterInfo = await votingSystem.getVoterInfo(voter1.address);
      expect(voterInfo.hasVoted).to.equal(true);
      expect(voterInfo.votedNomineeId).to.equal(1);

      const nominee = await votingSystem.getNominee(1);
      expect(nominee.voteCount).to.equal(1);
    });

    it("Should not allow voting when voting is closed", async function () {
      await votingSystem.toggleVoting(); // Close voting

      await expect(
        votingSystem.connect(voter1).vote(1)
      ).to.be.revertedWith("Voting is not open");
    });

    it("Should not allow unregistered voter to vote", async function () {
      await expect(
        votingSystem.connect(voter3).vote(1)
      ).to.be.revertedWith("You are not registered to vote");
    });

    it("Should not allow double voting", async function () {
      await votingSystem.connect(voter1).vote(1);
      
      await expect(
        votingSystem.connect(voter1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting for non-existent nominee", async function () {
      await expect(
        votingSystem.connect(voter1).vote(999)
      ).to.be.revertedWith("Nominee does not exist");
    });

    it("Should correctly count multiple votes", async function () {
      await votingSystem.connect(voter1).vote(1);
      await votingSystem.connect(voter2).vote(1);

      const nominee = await votingSystem.getNominee(1);
      expect(nominee.voteCount).to.equal(2);
      expect(await votingSystem.totalVotes()).to.equal(2);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await votingSystem.addNominee("Alice", "Candidate A");
      await votingSystem.addNominee("Bob", "Candidate B");
      await votingSystem.addNominee("Carol", "Candidate C");
    });

    it("Should return all nominees", async function () {
      const nominees = await votingSystem.getAllNominees();
      expect(nominees.length).to.equal(3);
      expect(nominees[0].name).to.equal("Alice");
      expect(nominees[1].name).to.equal("Bob");
      expect(nominees[2].name).to.equal("Carol");
    });

    it("Should check if address is admin", async function () {
      expect(await votingSystem.isAdmin(admin.address)).to.equal(true);
      expect(await votingSystem.isAdmin(voter1.address)).to.equal(false);
    });

    it("Should get voting status", async function () {
      expect(await votingSystem.getVotingStatus()).to.equal(false);
      
      await votingSystem.toggleVoting();
      expect(await votingSystem.getVotingStatus()).to.equal(true);
    });
  });

  describe("Events", function () {
    it("Should emit NomineeAdded event", async function () {
      await expect(votingSystem.addNominee("Alice", "Candidate A"))
        .to.emit(votingSystem, "NomineeAdded")
        .withArgs(1, "Alice");
    });

    it("Should emit VoteCast event", async function () {
      await votingSystem.addNominee("Alice", "Candidate A");
      await votingSystem.registerVoter(voter1.address, "aadhar_hash");
      await votingSystem.toggleVoting();

      await expect(votingSystem.connect(voter1).vote(1))
        .to.emit(votingSystem, "VoteCast")
        .withArgs(voter1.address, 1);
    });

    it("Should emit VoterRegistered event", async function () {
      await expect(votingSystem.registerVoter(voter1.address, "aadhar_hash"))
        .to.emit(votingSystem, "VoterRegistered")
        .withArgs(voter1.address, "aadhar_hash");
    });

    it("Should emit VotingStatusChanged event", async function () {
      await expect(votingSystem.toggleVoting())
        .to.emit(votingSystem, "VotingStatusChanged")
        .withArgs(true);
    });
  });
});
