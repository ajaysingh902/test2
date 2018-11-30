pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../validation/TimedCrowdsale.sol";

/**
 * @title FinalizableCrowdsale
 * @dev Extension of Crowdsale with a one-off finalization action, where one
 * can do extra work after finishing.
 */
contract FinalizableCrowdsale is TimedCrowdsale {
    using SafeMath for uint256;

    bool private _finalized;

    event CrowdsaleFinalized();

    constructor() internal {
        _finalized = false;
    }

    function finalized() public view returns (bool) {
        return _finalized;
    }

    function finalize() public {
        require(!_finalized, "Crowdsale already finalized.");
        require(hasClosed(), "Crowdsale canot be finalized.");

        _finalized = true;

        _finalization();
        emit CrowdsaleFinalized();
    }

    function _finalization() internal {}
}
