pragma solidity ^0.4.24;

import "../Crowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract CappedCrowdsale is Crowdsale {
    using SafeMath for uint256;

    uint256 private _cap;

    constructor(uint256 cap) public {
        require(cap > 0, "Invalid cap.");
        _cap = cap;
    }

    function cap() public view returns(uint256) {
        return _cap;
    }

    function changeCap(uint256 newCap) internal {
        require(newCap > 0, "New Cap cannot be zero.");
        _cap = newCap;
    }

    function capReached() public view returns (bool) {
        return weiRaised() >= _cap;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(weiRaised().add(weiAmount) <= _cap, "Token requested exceeds cap.");
    }
}
