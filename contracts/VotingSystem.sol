// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingSystem {
    address public admin;
    
    struct Nominee {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
        bool exists;
    }
    
    struct Voter {
        bool hasVoted;
        uint256 votedNomineeId;
        bool isRegistered;
        string aadharHash; // Hash of Aadhar for privacy
    }
    
    mapping(uint256 => Nominee) public nominees;
    mapping(address => Voter) public voters;
    
    uint256 public nomineeCount;
    uint256 public totalVotes;
    bool public votingOpen;
    
    event NomineeAdded(uint256 indexed nomineeId, string name);
    event VoteCast(address indexed voter, uint256 indexed nomineeId);
    event VoterRegistered(address indexed voter, string aadharHash);
    event VotingStatusChanged(bool status);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier votingIsOpen() {
        require(votingOpen, "Voting is not open");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        votingOpen = false;
        nomineeCount = 0;
        totalVotes = 0;
    }
    
    // Admin functions
    function addNominee(string memory _name, string memory _description) public onlyAdmin {
        nomineeCount++;
        nominees[nomineeCount] = Nominee({
            id: nomineeCount,
            name: _name,
            description: _description,
            voteCount: 0,
            exists: true
        });
        
        emit NomineeAdded(nomineeCount, _name);
    }
    
    function toggleVoting() public onlyAdmin {
        votingOpen = !votingOpen;
        emit VotingStatusChanged(votingOpen);
    }
    
    function registerVoter(address _voter, string memory _aadharHash) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter already registered");
        
        voters[_voter] = Voter({
            hasVoted: false,
            votedNomineeId: 0,
            isRegistered: true,
            aadharHash: _aadharHash
        });
        
        emit VoterRegistered(_voter, _aadharHash);
    }
    
    // Voter functions
    function vote(uint256 _nomineeId) public votingIsOpen {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(nominees[_nomineeId].exists, "Nominee does not exist");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedNomineeId = _nomineeId;
        
        nominees[_nomineeId].voteCount++;
        totalVotes++;
        
        emit VoteCast(msg.sender, _nomineeId);
    }
    
    // View functions
    function getNominee(uint256 _nomineeId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 voteCount
    ) {
        require(nominees[_nomineeId].exists, "Nominee does not exist");
        Nominee memory nominee = nominees[_nomineeId];
        return (nominee.id, nominee.name, nominee.description, nominee.voteCount);
    }
    
    function getAllNominees() public view returns (Nominee[] memory) {
        Nominee[] memory allNominees = new Nominee[](nomineeCount);
        
        for (uint256 i = 1; i <= nomineeCount; i++) {
            allNominees[i - 1] = nominees[i];
        }
        
        return allNominees;
    }
    
    function getVoterInfo(address _voter) public view returns (
        bool hasVoted,
        uint256 votedNomineeId,
        bool isRegistered
    ) {
        Voter memory voter = voters[_voter];
        return (voter.hasVoted, voter.votedNomineeId, voter.isRegistered);
    }
    
    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }
    
    function getVotingStatus() public view returns (bool) {
        return votingOpen;
    }
    
    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }
}
