pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract Token is ERC20Detailed, ERC20Capped, ERC20Pausable, ERC20Burnable {
    constructor (string name, string symbol, uint8 decimals, uint256 cap)
        ERC20Detailed(name, symbol, decimals)
        ERC20Capped(cap)
    public {}
}