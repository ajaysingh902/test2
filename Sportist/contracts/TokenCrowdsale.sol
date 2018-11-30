pragma solidity ^0.4.24;

import "./crowdsale/emission/AllowanceCrowdsale.sol";
import "./crowdsale/distribution/RefundableCrowdsale.sol";
import "./crowdsale/validation/IndividualTokenCappedPostDeliveryCrowdsale.sol";
import "./crowdsale/emission/StagedCrowdsale.sol";

contract TokenCrowdsale is AllowanceCrowdsale, RefundableCrowdsale, IndividualTokenCappedPostDeliveryCrowdsale, StagedCrowdsale {
    constructor (uint256 rate, address wallet, IERC20 token, uint256[2] crowdsalePeriod, address tokenWallet, uint256 goal, uint256 cap, uint256[2] individualTokenCap)
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(crowdsalePeriod)
        AllowanceCrowdsale(tokenWallet)
        RefundableCrowdsale(goal)
        CappedCrowdsale(cap)
        IndividualTokenCappedPostDeliveryCrowdsale(individualTokenCap)
    public {}
}