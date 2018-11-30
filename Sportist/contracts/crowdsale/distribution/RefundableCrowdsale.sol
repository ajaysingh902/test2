pragma solidity ^0.4.24;


import "./FinalizableCrowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/payment/escrow/RefundEscrow.sol";

contract RefundableCrowdsale is FinalizableCrowdsale {
    using SafeMath for uint256;

    uint256 private _goal;

    RefundEscrow private _escrow;

    constructor(uint256 goal) internal {
        require(goal > 0, "Goal cannot be zero.");
        _escrow = new RefundEscrow(wallet());
        _goal = goal;
    }

    function goal() public view returns(uint256) {
        return _goal;
    }

    function claimRefund(address beneficiary) public {
        require(finalized(), "Crowdsale is not yet finalized.");
        require(!goalReached(), "Crowdsale is sussessful, refund denied!");

        _escrow.withdraw(beneficiary);
    }

    function goalReached() public view returns (bool) {
        return weiRaised() >= _goal;
    }

    function _finalization() internal {
        if (goalReached()) {
            _escrow.close();
            _escrow.beneficiaryWithdraw();
        } else {
            _escrow.enableRefunds();
        }
    }

    function _forwardFunds() internal {
        _escrow.deposit.value(msg.value)(msg.sender);
    }
}
