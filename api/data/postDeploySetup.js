require('dotenv').config();
const Web3 = require('web3');
const flopabi = require('../contracts/floppy.json');
const vaultabi = require('../contracts/vault.json');


web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
token_address = process.env.TOKEN_ADDRESS;
vault_address = process.env.VAULT_ADDRESS;
withdrawer_private_key = process.env.WITHDRAWER_PRIVATE_KEY;
withdrawer_address = process.env.WITHDRAWER_ADDRESS; 
  

    // Withdraw from vault
async function enableWithdraw(amount=1000) {
    try {
        web3.eth.accounts.wallet.add(withdrawer_private_key); 
        const vault_contract = await new web3.eth.Contract(vaultabi, vault_address); 
        var rs = await vault_contract.methods
            .setToken(token_address)
            .send({
                from: withdrawer_address,
                gas: 3000000,
            });
        var rs = await vault_contract.methods
            .setWithdrawEnabled(true)
            .send({
                from: withdrawer_address,
                gas: 3000000,
            });
        
        var value = Web3.utils.toWei(amount.toString());
        var rs = await vault_contract.methods
            .setMaxWithdrawalAmount(value)
            .send({
                from: withdrawer_address,
                gas: 3000000,
            });
        console.log(2);
    } catch (error) {
        console.log(error);
    }
}


enableWithdraw();