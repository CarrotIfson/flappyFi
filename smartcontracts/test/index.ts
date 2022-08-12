import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";
import { keccak256 } from "ethers/lib/utils";
import { Vault__factory } from "../typechain";

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function parseEther(amount: Number) {
    return ethers.utils.parseUnits(amount.toString(), 18);
}


describe("Vault", function () {
    let owner:SignerWithAddress,
          alice:SignerWithAddress,
          bob:SignerWithAddress,
          carl:SignerWithAddress;
        
    let vault:Contract;
    let token:Contract;

    this.beforeEach(async() => {
        await ethers.provider.send("hardhat_reset", []);
        [owner, alice, bob, carl] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("Vault", owner);
        vault = await Vault.deploy();
        const Token = await ethers.getContractFactory("Floppy", owner);
        token = await Token.deploy();
        await vault.setToken(token.address);
    })
    
    it("Should deposit into the vault", async() => { 
        await token.transfer(alice.address, parseEther(1 * 10**6)); 
        await token.connect(alice).approve(vault.address, token.balanceOf(alice.address)); 
        await vault.connect(alice).deposit(parseEther(500*10**3));
        expect(await token.balanceOf(vault.address)).equal(parseEther(500*10**3));
    });

    it("Should withdraw", async() => {
        //grant withdrawer role to Bob
        let WITHDRAWER_ROLE = keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        await vault.grantRole(WITHDRAWER_ROLE, bob.address);

        //Set vault state
        await vault.setWithdrawEnabled(true);
        await vault.setMaxWithdrawalAmount(parseEther(1*10**6)); 
        //do some deposit
        await token.transfer(alice.address, parseEther(1 * 10**6)); 
        await token.connect(alice).approve(vault.address, token.balanceOf(alice.address)); 
        await vault.connect(alice).deposit(parseEther(500*10**3)); 

        //withdraw
        await vault.connect(bob).withdraw(parseEther(300*10**3), bob.address); 
        expect(await token.balanceOf(vault.address)).equal(parseEther(200*10**3)); 
        expect(await token.balanceOf(bob.address)).equal(parseEther(300*10**3));
    });
    
});