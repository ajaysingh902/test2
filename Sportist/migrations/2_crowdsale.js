let Token = artifacts.require("./Token.sol");
let Crowdsale = artifacts.require("./TokenCrowdsale.sol")
// const abiEncoder = require('ethereumjs-abi');
// const assert = require('chai').assert;


let owner = "0xDc6234d567eBA03B465f519596E679A8d3959935";
  const BigNumber = web3.BigNumber;

module.exports = async function (deployer) {
    let token = await Token.deployed();
    let tokens = 2000000000
    if (token) {
        let crowdsale = await deployTokenCrowdsale(deployer, token);
        if (crowdsale)
            return await init(token, crowdsale, tokens);
    }
    return false;
};

async function deployTokenCrowdsale(deployer, token) {
    const dayInSecs = 86400
    const openingTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 80;
    const closingTime = openingTime + (dayInSecs * 60) // 60 days;

    let rate = 1;
    let wallet = owner;
    // let openingTime = (new Date("2018-10-25T20:10:00")).getTime() / 1000;
    // let closingTime = (new Date("2018-10-25T20:25:00")).getTime() / 1000;
    // console.log(web3.eth.getBlock('latest').timestamp);
    // let openingTime = latestTime() + duration.minutes(5);
    // let closingTime =latestTime() + duration.weeks(1);
    let cap = 4000000000 * 10 ** 9;
    let minCap = 1000;
    let maxCap = 4000000000 * 10 ** 9;
    let goal = 800000000 * 10 ** 9;
    let tokenWallet = owner;
    console.log("Deploying Token Crowdsale:");
    console.log("\tRate                 \t: %s", rate);
    console.log("\tWallet               \t: %s", wallet);
    console.log("\tOpening Time         \t: %s", openingTime);
    console.log("\tClosing Time         \t: %s", closingTime);
    console.log("\tCap                  \t: %s", cap);
    console.log("\tIndividual Min Cap   \t: %s", minCap);
    console.log("\tIndividual Max Cap   \t: %s", maxCap);
    console.log("\tGoal                 \t: %s", goal);
    console.log("\tToken Address        \t: %s", token ? token.address : "");
    console.log("\tToken Wallet         \t: %s", tokenWallet);

    await deployer.deploy(Crowdsale, rate, wallet, token ? token.address : "", [openingTime, closingTime], tokenWallet, goal, cap, [minCap, maxCap]);

    if (Crowdsale.deployed())
        return Crowdsale.deployed();
        
}
console.log("crowdsale is deployed");

async function init(token, crowdsale, tokens) {
    let tokensMinting = tokens * 10 ** await token.decimals()

    console.log("Minting and creating allowance for crowdsale contract.");
    console.log("Token address          \t: %s", token.address);
    console.log("Token Crowdsale address\t: %s", crowdsale.address);
    console.log("Tokens to mint         \t: %s", tokens);
    console.log("Allowance              \t: %s", tokens);

    if (await token.mint(owner, tokensMinting) && await token.approve(crowdsale.address, tokensMinting))
        return true;
    return false;
}