const { ether } = require('./helpers/ether');
const { advanceBlock } = require('./helpers/advanceToBlock');
const shouldFail = require('./helpers/shouldFail');
const time = require('./helpers/time');
const { ethGetBalance } = require('./helpers/web3');

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();
const SportlistToken = artifacts.require("Token");
const SportlistCrowdsale = artifacts.require("TokenCrowdsale");
contract('CappedCrowdsale', function ([_, wallet, investor, purchaser, anyone]) {
    // const rate = new BigNumber(1);
    const lessThanGoal=1000000
    const rate = 500;
    const cap = ether(100);
    const lessThanCap = ether(1);
    const tokenSupply = new BigNumber('1e22');
    // const cap = ether(100);
    const changedcap = ether(100);
    const goal = ether(50);
    
    let minCap = 1000;
    let maxCap = 4000000000 * 10 * 9;
    before(async function () {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
        await advanceBlock();
      });
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
          cap
        );
        let tokensMinting = cap;
        await this.token.mint(_, tokensMinting);
        

        this.rate = 500;
        this.wallet = wallet;
        this.cap = ether(100);
        this.openingTime = (await time.latest())+time.duration.minutes(1);
        this.closingTime = this.openingTime + time.duration.weeks(1);
        this.afterClosingTime = this.closingTime + time.duration.seconds(1);
        this.preWalletBalance = await ethGetBalance(wallet);
          
        // console.log(await time.latest()<=this.openingTime)
        //changed mincap and maxcap for testing for the goal 
        
        this.crowdsale = await SportlistCrowdsale.new(
          this.rate,
          this.wallet,
          this.token.address,
          [this.openingTime, this.closingTime],
          this.wallet,
          goal,
          this.cap,
          [1000, goal+1111]
        );
        await this.token.approve(this.crowdsale.address, tokensMinting);
        await time.increaseTo(this.openingTime);
      });
      context('after opening time', function () {
       
  
        it('denies refunds', async function () {
          await shouldFail.reverting(this.crowdsale.claimRefund(investor));
        });
  
        context('with unreached goal', function () {
          beforeEach(async function () {
            await this.crowdsale.sendTransaction({ value: lessThanGoal, from: investor });
          });
  
          context('after closing time and finalization', function () {
            beforeEach(async function () {
              await time.increaseTo(this.afterClosingTime);
              console.log( await this.crowdsale.isOpen());
            await this.crowdsale.finalize({ from: anyone});
            });
  
            it('refunds', async function () {
            
              const pre = await ethGetBalance(investor);
              await this.crowdsale.claimRefund(investor, { gasPrice: 0 });
              const post = await ethGetBalance(investor);
              post.minus(pre).should.be.bignumber.equal(lessThanGoal);
            });
          });
        });
        context('with reached goal', function () {
            beforeEach(async function () {
              await this.crowdsale.sendTransaction({ value: goal, from: investor });
            });
    
            context('after closing time and finalization', function () {
              beforeEach(async function () {
                await time.increaseTo(this.afterClosingTime);
                await this.crowdsale.finalize({ from: anyone });
              });
    
              it('denies refunds', async function () {
                  console.log("asdasd");
                await shouldFail.reverting(this.crowdsale.claimRefund(investor));
              });
    
              it('forwards funds to wallet', async function () {
                const postWalletBalance = await ethGetBalance(wallet);
                postWalletBalance.minus(this.preWalletBalance).should.be.bignumber.equal(goal);
              });
            });
          });
    })
    });