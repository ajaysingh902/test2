pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../Crowdsale.sol";

contract TimedCrowdsale is Crowdsale {
    using SafeMath for uint256;

    uint256 private _openingTime;
    uint256 private _closingTime;

    modifier onlyWhileOpen {
        require(isOpen(), "Crowdsale has ended.");
        _;
    }

    constructor(uint256[2] crowdsalePeriod) internal {
        // solium-disable-next-line security/no-block-members
        require(crowdsalePeriod[0] >= block.timestamp, "Invalid opening time.");
        require(crowdsalePeriod[1] > crowdsalePeriod[0], "Invalid closing time.");

        _openingTime = crowdsalePeriod[0];
        _closingTime = crowdsalePeriod[1];
    }

    
    function openingTime() public view returns(uint256) {
        return _openingTime;
    }

    function closingTime() public view returns(uint256) {
        return _closingTime;
    }

    function isOpen() public view returns (bool) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp >= _openingTime && block.timestamp <= _closingTime;
    }

    function hasClosed() public view returns (bool) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp > _closingTime;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal onlyWhileOpen view {
        super._preValidatePurchase(beneficiary, weiAmount);
    }

}
