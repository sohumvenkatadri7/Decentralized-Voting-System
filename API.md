# API Documentation

## Smart Contract API Reference

### Contract Address
After deployment, your contract will be available at the address shown in:
- `src/contracts/contract-address.json`

### Network Information
- **Development**: Ganache (localhost:7545)
- **Testnet**: Goerli/Sepolia
- **Mainnet**: Ethereum Mainnet

---

## Contract State Variables

### Public Variables

\`\`\`solidity
address public admin;              // Contract admin address
uint256 public nomineeCount;       // Total number of nominees
uint256 public totalVotes;         // Total votes cast
bool public votingOpen;            // Voting status (open/closed)
\`\`\`

---

## Admin Functions

### addNominee

Add a new nominee to the voting system.

**Signature:**
\`\`\`solidity
function addNominee(string memory _name, string memory _description) public onlyAdmin
\`\`\`

**Parameters:**
- `_name` (string): Name of the nominee
- `_description` (string): Description/bio of the nominee

**Access:** Admin only

**Emits:** `NomineeAdded(uint256 nomineeId, string name)`

**Example (JavaScript):**
\`\`\`javascript
await contract.addNominee("Alice Johnson", "Experienced leader with 10 years in public service");
\`\`\`

---

### toggleVoting

Open or close the voting period.

**Signature:**
\`\`\`solidity
function toggleVoting() public onlyAdmin
\`\`\`

**Access:** Admin only

**Emits:** `VotingStatusChanged(bool status)`

**Example:**
\`\`\`javascript
// Open voting
await contract.toggleVoting();

// Close voting
await contract.toggleVoting();
\`\`\`

---

### registerVoter

Register a voter with their Aadhar hash.

**Signature:**
\`\`\`solidity
function registerVoter(address _voter, string memory _aadharHash) public onlyAdmin
\`\`\`

**Parameters:**
- `_voter` (address): Ethereum address of the voter
- `_aadharHash` (string): Hashed Aadhar number for verification

**Access:** Admin only

**Emits:** `VoterRegistered(address voter, string aadharHash)`

**Example:**
\`\`\`javascript
const voterAddress = "0x1234...5678";
const aadharHash = ethers.keccak256(ethers.toUtf8Bytes("123456789012"));
await contract.registerVoter(voterAddress, aadharHash);
\`\`\`

---

## Voter Functions

### vote

Cast a vote for a nominee.

**Signature:**
\`\`\`solidity
function vote(uint256 _nomineeId) public votingIsOpen
\`\`\`

**Parameters:**
- `_nomineeId` (uint256): ID of the nominee to vote for

**Requirements:**
- Voting must be open
- Voter must be registered
- Voter must not have voted already
- Nominee must exist

**Emits:** `VoteCast(address voter, uint256 nomineeId)`

**Example:**
\`\`\`javascript
// Vote for nominee with ID 1
await contract.vote(1);
\`\`\`

---

## View Functions (Read-Only)

### getNominee

Get details of a specific nominee.

**Signature:**
\`\`\`solidity
function getNominee(uint256 _nomineeId) public view returns (
    uint256 id,
    string memory name,
    string memory description,
    uint256 voteCount
)
\`\`\`

**Parameters:**
- `_nomineeId` (uint256): ID of the nominee

**Returns:**
- `id` (uint256): Nominee ID
- `name` (string): Nominee name
- `description` (string): Nominee description
- `voteCount` (uint256): Number of votes received

**Example:**
\`\`\`javascript
const [id, name, description, voteCount] = await contract.getNominee(1);
console.log(\`\${name} has \${voteCount} votes\`);
\`\`\`

---

### getAllNominees

Get all nominees at once.

**Signature:**
\`\`\`solidity
function getAllNominees() public view returns (Nominee[] memory)
\`\`\`

**Returns:**
- Array of Nominee structs

**Example:**
\`\`\`javascript
const nominees = await contract.getAllNominees();
nominees.forEach(nominee => {
  console.log(\`\${nominee.name}: \${nominee.voteCount} votes\`);
});
\`\`\`

---

### getVoterInfo

Get information about a voter.

**Signature:**
\`\`\`solidity
function getVoterInfo(address _voter) public view returns (
    bool hasVoted,
    uint256 votedNomineeId,
    bool isRegistered
)
\`\`\`

**Parameters:**
- `_voter` (address): Ethereum address of the voter

**Returns:**
- `hasVoted` (bool): Whether the voter has cast their vote
- `votedNomineeId` (uint256): ID of nominee they voted for (0 if not voted)
- `isRegistered` (bool): Whether the voter is registered

**Example:**
\`\`\`javascript
const [hasVoted, votedFor, isRegistered] = await contract.getVoterInfo(voterAddress);
if (hasVoted) {
  console.log(\`Voter already voted for nominee \${votedFor}\`);
}
\`\`\`

---

### isAdmin

Check if an address is the admin.

**Signature:**
\`\`\`solidity
function isAdmin(address _address) public view returns (bool)
\`\`\`

**Parameters:**
- `_address` (address): Address to check

**Returns:**
- `bool`: True if address is admin

**Example:**
\`\`\`javascript
const adminStatus = await contract.isAdmin(currentAccount);
if (adminStatus) {
  console.log("User is admin");
}
\`\`\`

---

### getVotingStatus

Get current voting status.

**Signature:**
\`\`\`solidity
function getVotingStatus() public view returns (bool)
\`\`\`

**Returns:**
- `bool`: True if voting is open

**Example:**
\`\`\`javascript
const isOpen = await contract.getVotingStatus();
console.log(\`Voting is \${isOpen ? 'open' : 'closed'}\`);
\`\`\`

---

### getTotalVotes

Get total number of votes cast.

**Signature:**
\`\`\`solidity
function getTotalVotes() public view returns (uint256)
\`\`\`

**Returns:**
- `uint256`: Total votes

**Example:**
\`\`\`javascript
const total = await contract.getTotalVotes();
console.log(\`Total votes cast: \${total}\`);
\`\`\`

---

## Events

### NomineeAdded

Emitted when a new nominee is added.

\`\`\`solidity
event NomineeAdded(uint256 indexed nomineeId, string name);
\`\`\`

**Listening:**
\`\`\`javascript
contract.on("NomineeAdded", (nomineeId, name) => {
  console.log(\`Nominee #\${nomineeId} added: \${name}\`);
});
\`\`\`

---

### VoteCast

Emitted when a vote is cast.

\`\`\`solidity
event VoteCast(address indexed voter, uint256 indexed nomineeId);
\`\`\`

**Listening:**
\`\`\`javascript
contract.on("VoteCast", (voter, nomineeId) => {
  console.log(\`\${voter} voted for nominee \${nomineeId}\`);
});
\`\`\`

---

### VoterRegistered

Emitted when a voter is registered.

\`\`\`solidity
event VoterRegistered(address indexed voter, string aadharHash);
\`\`\`

**Listening:**
\`\`\`javascript
contract.on("VoterRegistered", (voter, aadharHash) => {
  console.log(\`Voter registered: \${voter}\`);
});
\`\`\`

---

### VotingStatusChanged

Emitted when voting is opened or closed.

\`\`\`solidity
event VotingStatusChanged(bool status);
\`\`\`

**Listening:**
\`\`\`javascript
contract.on("VotingStatusChanged", (status) => {
  console.log(\`Voting is now \${status ? 'open' : 'closed'}\`);
});
\`\`\`

---

## Error Messages

Common error messages and their meanings:

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Only admin can perform this action" | Non-admin trying to call admin function | Use admin account |
| "Voting is not open" | Trying to vote when voting is closed | Wait for admin to open voting |
| "You are not registered to vote" | Unregistered address trying to vote | Contact admin for registration |
| "You have already voted" | Trying to vote twice | Each address can only vote once |
| "Nominee does not exist" | Invalid nominee ID | Use valid nominee ID (1 to nomineeCount) |
| "Voter already registered" | Trying to register same address twice | Voter is already registered |

---

## Gas Estimates

Approximate gas costs for each function (on testnet):

| Function | Estimated Gas | Cost (at 50 gwei) |
|----------|--------------|------------------|
| addNominee | ~100,000 | ~$2-5 |
| toggleVoting | ~30,000 | ~$0.50-1 |
| registerVoter | ~80,000 | ~$1.50-3 |
| vote | ~70,000 | ~$1-2.50 |
| getAllNominees | Free (view) | $0 |
| getVoterInfo | Free (view) | $0 |

*Costs vary based on network congestion and gas prices*

---

## Code Examples

### Complete Voting Flow

\`\`\`javascript
// 1. Admin adds nominees
await contract.addNominee("Alice", "Candidate A");
await contract.addNominee("Bob", "Candidate B");

// 2. Admin registers voters
await contract.registerVoter(voter1Address, aadharHash1);
await contract.registerVoter(voter2Address, aadharHash2);

// 3. Admin opens voting
await contract.toggleVoting();

// 4. Voters cast votes
await contract.connect(voter1).vote(1); // Vote for Alice
await contract.connect(voter2).vote(2); // Vote for Bob

// 5. Get results
const nominees = await contract.getAllNominees();
nominees.forEach(n => {
  console.log(\`\${n.name}: \${n.voteCount} votes\`);
});

// 6. Admin closes voting
await contract.toggleVoting();
\`\`\`

---

## Rate Limits

To prevent spam and abuse:

- **Admin functions**: No built-in limits (controlled by gas)
- **Voter functions**: One vote per address (enforced by contract)
- **View functions**: No limits (free reads)

---

## Testing

### Running Tests

\`\`\`bash
npx hardhat test
\`\`\`

### Test Coverage

\`\`\`bash
npx hardhat coverage
\`\`\`

---

## Support

For API questions or issues:
- GitHub Issues: https://github.com/sohumvenkatadri7/Decentralized-Voting-System/issues
- Documentation: See README.md
- Contract Source: `contracts/VotingSystem.sol`
