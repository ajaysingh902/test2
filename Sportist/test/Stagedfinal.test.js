const { ether } = require("./helpers/ether");
const { advanceBlock } = require("./helpers/advanceToBlock");
//const { increaseTimeTo, duration } = require("./helpers/increaseTime");
// const { latestTime } = require("./helpers/latestTime");
// const { expectThrow } = require("./helpers/expectThrow");
// const { EVMRevert } = require("./helpers/EVMRevert");
// const { ethGetBalance } = require("./helpers/web3");
const { assertRevert } = require("./helpers/assertRevert");
const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

// const RefundableCrowdsale = artifacts.require('RefundableCrowdsaleImpl');
// const SimpleToken = artifacts.require('SimpleToken');
const SportlistToken = artifacts.require("Token");
const SportlistCrowdsale = artifacts.require("TokenCrowdsale");

contract("StagedCrowdsale", function([
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

  describe("checking the rate and cap after different stages", function() {
    it("checking the for the stage", async function() {
      console.log(await this.crowdsale.getStage());
      let phase1 = await this.crowdsale.changeStage(50, cap);
      console.log(await this.crowdsale.getStage());
    });
    it("checking the change of stages ", async function() {
      const initial = await this.crowdsale.getStage();
      let phase1 = await this.crowdsale.changeStage(50, cap);
      const final = await this.crowdsale.getStage();

      assert.isTrue(initial < final);
    });
    it("checking the change of rates", async function() {
      const initialRate = await this.crowdsale.rate();
      let phase1 = await this.crowdsale.changeStage(1000, cap);
      const finalRate = await this.crowdsale.rate();
      // assert.isTrue(finalRate<intitalRate);
      initialRate.should.be.bignumber.lessThan(finalRate);
    });
    //  it("checking weather we can make rate to be negative",async function(){
    //     // await this.crowdsale.nextPhase(-1));
    //     let initial=await this.crowdsale.rate()
    //     console.log(initial.toNumber());
    //     await this.crowdsale.nextPhase(-50);
    //     let final =await this.crowdsale.rate();
    //     console.log(final.toFixed());

    it("checking the rate to be 0", async function() {
      await assertRevert(this.crowdsale.changeStage(0, cap));
    });
    it("checking if the rate can be changed by anyone other than the owner", async function() {
      await assertRevert(
        this.crowdsale.changeStage(50, cap, { from: investor1 })
      );
    });
    it("checking if the cap can be changed by anyone other than the owner", async function() {
      await assertRevert(
        this.crowdsale.changeStage(50, changedcap, { from: investor1 })
      );
    });
    it("checking the change of cap", async function() {
      const initialcap = await this.crowdsale.cap();
      await this.crowdsale.changeStage(rate, ether(50));
      const finalcap = await this.crowdsale.cap();
      assert.isTrue(initialcap != finalcap);
    });

    it("checking fo zero cap ", async function() {
      await assertRevert(this.crowdsale.changeStage(50, 0));
    });
  });
});
