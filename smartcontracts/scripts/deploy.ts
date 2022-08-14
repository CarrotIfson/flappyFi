import { ethers, hardhatArguments } from "hardhat";
import  * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
  const [deployer] = await ethers.getSigners();
  console.log('deployer address: ', deployer.address);

  const Floppy = await ethers.getContractFactory("Floppy");
  const floppy = await Floppy.deploy();
  console.log('Deployed Floppy on: ', floppy.address);
  Config.setConfig(network + '.Floppy', floppy.address); 


  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy();
  console.log("Deployed Vault on: ", vault.address);
  Config.setConfig(network + '.Vault', vault.address);
  await Config.updateConfig();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
