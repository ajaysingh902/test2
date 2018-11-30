pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract Crowdsale {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _token;
    address private _wallet;
    uint256 internal _rate;
    uint256 private _weiRaised;
    
    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor(uint256 rate, address wallet, IERC20 token) internal {
        require(rate > 0, "Rate can't be zero.");
        require(wallet != address(0), "Invalid wallet address.");
        require(token != address(0), "Invalid token address.");

        _rate = rate;
        _wallet = wallet;
        _token = token;
    }

    function () external payable {
        buyTokens(msg.sender);
    }

    function token() public view returns(IERC20) {
        return _token;
    }

    function wallet() public view returns(address) {
        return _wallet;
    }

    function rate() public view returns(uint256) {
        return _rate;
    }

    function changeRate(uint256 newRate) internal {
        require(newRate > 0, "New rate should be greater than zero.");
        _rate = newRate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function buyTokens(address beneficiary) public payable {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);

        uint256 tokens = _getTokenAmount(weiAmount);

        _weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(msg.sender, beneficiary, weiAmount, tokens);

        _forwardFunds();
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        require(beneficiary != address(0), "Invalid beneficiary address.");
        require(weiAmount != 0, "Invalid wei send.");
    }

    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {}

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.mul(_rate);
    }

    function _forwardFunds() internal {}
}