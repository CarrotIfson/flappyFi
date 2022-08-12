//SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.10;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/access/AccessControlEnumerable.sol";

contract Vault is Ownable, AccessControlEnumerable {
    IERC20 private token;
    
    uint256 public maxWithdrawalAmount;
    bool public withdrawEnabled;

    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setMaxWithdrawalAmount(uint256 _maxAmount) public onlyOwner {
        maxWithdrawalAmount = _maxAmount;
    }
    function setWithdrawEnabled(bool _enabled) public onlyOwner {
        withdrawEnabled = _enabled;
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

    function deposit(uint256 _amount) external {
        require(
            token.balanceOf(msg.sender) >= _amount,
            "Insufficient account balance"
        );
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount, address _to)  external onlyWithdrawer {
        require(withdrawEnabled, "Withdraw is not enabled");
        require(_amount <= maxWithdrawalAmount, "Amount should be lower than maxWithdrawalAmount");
        token.transfer(_to, _amount);

    }
 

    modifier onlyWithdrawer() {
        require(owner() == _msgSender()||hasRole(WITHDRAWER_ROLE,_msgSender()), "Caller is not a withdrawer"); 
        _;
    }


}