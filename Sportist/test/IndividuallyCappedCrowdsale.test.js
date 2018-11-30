const { ether } = require("./helpers/ether");
const { advanceBlock } = require("./helpers/advanceToBlock");
const { increaseTimeTo, duration } = require("./helpers/increaseTime");
const { latestTime } = require("./helpers/latestTime");
const { expectThrow } = require("./helpers/expectThrow");
const { EVMRevert } = require("./helpers/EVMRevert");
const { ethGetBalance } = require("./helpers/web3");
const { assertRevert } = require("./helpers/assertRevert");

const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

// const RefundableCrowdsale = artifacts.require("RefundableCrowdsaleImpl");
// const SimpleToken = artifacts.require("SimpleToken");
const SportlistToken = artifacts.require("Token");
const SportlistCrowdsale = artifacts.require("TokenCrowdsale");

contract("IndividuallyCappedCrowdsale", function([
  _,
  wallet,
  investor1,
  investor2,
  foundersFund,
  foundationFund,
  partnersFund
]) {
  // beforeEach(async function()){

  // }
  const cap = ether(100);
  const changedcap = ether(100);
  const rate = 500;
  let minCap = 1000;
  let maxCap = 4000000000 * 10 * 9;

  beforeEach(async function() {
    // Token config
    this.name = "DappToken";
    this.symbol = "DAPP";
    this.decimals = 18;

    // Deploy Token
    this.token = await SportlistToken.new(
      this.name,
      this.symbol,
      this.decimals,
      2000000000
    );
    this.rate = 500;
    this.wallet = wallet;
    this.cap = ether(100);
    this.openingTime = Math.floor(new Date().getTime() / 1000); //latestTime() + duration.weeks(1);
    this.closingTime = this.openingTime + 1 * 60 * 60 * 24; //this.openingTime + duration.weeks(1);
    this.goal = ether(50);
    this.crowdsale = await SportlistCrowdsale.new(
      this.rate,
      this.wallet,
      this.token.address,
      [this.openingTime, this.closingTime],
      this.wallet,
      this.goal,
      this.cap,
      [minCap, maxCap]
    );
  });
  describe("cheking individual cap ", function() {
    it("should reject payments outside cap", async function() {
      await this.crowdsale.buyTokens(investor1, { value: 1000000 });

      await expectThrow(
        this.crowdsale.buyTokens(investor1, { value: 1 }, EVMRevert)
      );
      // await this.crowdsale.balanceOf(_);
    });
    it("should reject payments exceed cap", async function() {
      await expectThrow(
        this.crowdsale.buyTokens(investor1, { value: maxCap + 1 }, EVMRevert)
      );
    });
    it("should reject payments by account[0]", async function() {
      await expectThrow(
        this.crowdsale.buyTokens(_, { value: 4000000 }, EVMRevert)
      );
    });
    it("should reject payments having value 0", async function() {
      await expectThrow(
        this.crowdsale.buyTokens(investor2, { value: 0 }, EVMRevert)
      );
    });
    it("checking the individual cap", async function() {
      console.log(await this.crowdsale.getIndividualCap());
    });
  });
});
