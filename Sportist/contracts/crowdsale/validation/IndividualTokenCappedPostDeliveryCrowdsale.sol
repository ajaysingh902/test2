pragma solidity ^0.4.24;

import "../distribution/PostDeliveryCrowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/roles/CapperRole.sol";


/**
 * @title IndividuallyCappedCrowdsale
 * @dev Crowdsale with per-beneficiary caps.
 */
contract IndividualTokenCappedPostDeliveryCrowdsale is PostDeliveryCrowdsale {
    using SafeMath for uint256;

    uint256 private _individualMinCap;
    uint256 private _individualMaxCap; 
    
    constructor (uint256[2] tokenCap) public {
        _setCap(tokenCap[0], tokenCap[1]);
    }
    
    /**
    * @dev Extend parent behavior requiring purchase to respect the beneficiary's funding cap.
    * @param beneficiary Token purchaser
    * @param weiAmount Amount of wei contributed
    */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        super._preValidatePurchase(beneficiary, weiAmount);

        require(_getTokenAmount(msg.value).add(balanceOf(msg.sender)) > _individualMinCap, "Individual minimum token cap not met.");
        require(_getTokenAmount(msg.value).add(balanceOf(msg.sender)) < _individualMaxCap, "Individual maximum token cap not met.");
    }

    function getIndividualCap() public view returns(uint256,uint256) {
        return(_individualMinCap, _individualMaxCap);
    }

    function _setCap(uint256 minCap, uint256 maxCap) private {
        _individualMinCap = minCap;
        _individualMaxCap = maxCap;
    }
}