const { ether } = require('./helpers/ether');
const { advanceBlock } = require('./helpers/advanceToBlock');
const shouldFail = require('./helpers/shouldFail');
const time = require('./helpers/time');

const BigNumber = web3.BigNumber;
const SportlistToken = artifacts.require("Token");
const SportlistCrowdsale = artifacts.require("TokenCrowdsale");

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();
  contract('CappedCrowdsale', function ([_, investor, wallet, purchaser]) {
    // const rate = new BigNumber(1);
    const value =100000000
    const rate = 500;
    const cap = ether(100);
    const lessThanCap = ether(1);
    const tokenSupply = new BigNumber('1e22');
    // const cap = ether(100);
    const changedcap = ether(100);
    
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
        this.beforeopeningTime=this.openingTime -20000;
          
        // console.log(await time.latest()<=this.openingTime)
        
        const goal = ether(50);
        this.crowdsale = await SportlistCrowdsale.new(
          this.rate,
          this.wallet,
          this.token.address,
          [this.openingTime, this.closingTime],
          this.wallet,
          goal,
          this.cap,
          [minCap, maxCap]
        );
        await this.token.approve(this.crowdsale.address, tokensMinting);
        await time.increaseTo(this.openingTime);
      });
      describe('with crowdsale',function (){
          it('should be ended only after end',async function (){
            (await this.crowdsale.hasClosed()).should.equal(false);
            
            
                  
          });
          it('after ending',async function() {
            await time.increaseTo(this.afterClosingTime);
            (await this.crowdsale.isOpen()).should.equal(false);
            (await this.crowdsale.hasClosed()).should.equal(true);
          });
        
          
      });
      //need to change 2 extra statements 
      describe('accepting payments', function () {
        it('should reject payments before start', async function () {
            await time.increaseTo(this.afterClosingTime);
          (await this.crowdsale.isOpen()).should.equal(false);
          await shouldFail.reverting(this.crowdsale.send(value));
          await shouldFail.reverting(this.crowdsale.buyTokens(investor, { from: purchaser, value: value }));
        });
        it('should accept payments after start', async function () {
            await time.increaseTo(this.openingTime);
            (await this.crowdsale.isOpen()).should.equal(true);
            await this.crowdsale.send(value);
            await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
          });

    })


    })