pragma solidity ^0.4.24;

import "../Crowdsale.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract AllowanceCrowdsale is Crowdsale {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address private _tokenWallet;

    constructor(address tokenWallet) internal {
        require(tokenWallet != address(0), "Invalid token address.");
        _tokenWallet = tokenWallet;
    }

    function tokenWallet() public view returns(address) {
        return _tokenWallet;
    }
    
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        token().safeTransferFrom(_tokenWallet, beneficiary, tokenAmount);
    }
}
