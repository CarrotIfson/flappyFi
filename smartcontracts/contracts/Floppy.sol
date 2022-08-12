//SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.10;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Floppy is 
    ERC20("Floppy", "FLP"),
    ERC20Burnable,
    Ownable
{
    uint256 private max_supply = 50_000_000_000 * 10**uint256(18);
    constructor() {
        _mint(msg.sender, max_supply);
        transferOwnership(msg.sender);
    }

    //override mint function so we can't go over the total supply
    function mint(address to, uint256 amount) public onlyOwner {
        require(
            ERC20.totalSupply()+amount<max_supply,
            "Floppy: MAX SUPPLY CANT BE EXCEEDED"
        );
        _mint(to, amount);
    }  
}