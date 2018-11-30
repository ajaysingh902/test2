let Token = artifacts.require("./Token.sol");

module.exports = async function (deployer) {
    return await deployToken(deployer);
};


async function deployToken(deployer) {
    let name = "Sportist";
    let symbol = "S";
    let decimals = 6;
    let cap = 10000000000 * 10 ** 6;

    console.log("Deploying Token:");
    console.log("\tName    \t: %s", name);
    console.log("\tSymbol  \t: %s", symbol);
    console.log("\tDecimals\t: %s", decimals);
    console.log("\tCap     \t: %s", cap);

    await deployer.deploy(Token, name, symbol, decimals, cap);

    if (await Token.deployed())
        return true;
    return false;
}