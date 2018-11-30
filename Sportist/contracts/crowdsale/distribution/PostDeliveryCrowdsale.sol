pragma solidity ^0.4.24;

import "../validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract PostDeliveryCrowdsale is TimedCrowdsale {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;

    function withdrawTokens(address beneficiary) public {
        require(hasClosed(), "Crowdsale is not yet closed.");
        uint256 amount = _balances[beneficiary];
        require(amount > 0, "Invalid token amount.");
        _balances[beneficiary] = 0;
        _deliverTokens(beneficiary, amount);
    }

    function balanceOf(address account) public view returns(uint256) {
        return _balances[account];
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        _balances[beneficiary] = _balances[beneficiary].add(tokenAmount);
    }
}
