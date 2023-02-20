const hre = require("hardhat");

async function main() {

  const Upload = await hre.ethers.getContractFactory("Voting");
  const upload = await Upload.deploy();

  await upload.deployed();
  await upload.deployTransaction.wait()

  console.log(
    `Voting deployed to ${upload.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
