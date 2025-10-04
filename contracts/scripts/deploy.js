const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`\n🚀 Deploying MfaAudit to Polygon Amoy...`);
  console.log(`📍 Deployer: ${deployer.address}\n`);

  const MfaAudit = await ethers.getContractFactory("MfaAudit");
  const contract = await MfaAudit.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ MfaAudit deployed to: ${address}`);
  console.log(`🔍 View: https://amoy.polygonscan.com/address/${address}\n`);

  // Update .env
  const envPath = path.resolve(__dirname, "../../.env");
  let envContent = fs.readFileSync(envPath, "utf8");
  envContent = envContent.replace(/^CONTRACT_ADDRESS=.*$/m, `CONTRACT_ADDRESS=${address}`);
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Updated .env with contract address\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

