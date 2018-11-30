const expectEvent = require('./helpers/expectEvent');
const { advanceBlock } = require('./helpers/advanceToBlock');
const time = require('./helpers/time');
const shouldFail = require('./helpers/shouldFail');
const { ether } = require('./helpers/ether');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

  const SportlistToken = artifacts.require("Token");
  const SportlistCrowdsale = artifacts.require("TokenCrowdsale");
  
  contract('AllowanceCrowdsale', function ([_, investor, wallet, purchaser, tokenWallet,anyone]) {
      // const rate = new BigNumber(1);
      const value =100000000
      const lessThanGoal=1000000
      const rate = 500;
      const cap = ether(100);
      const lessThanCap = ether(1);
      const tokenSupply = new BigNumber('1e22');
      // const cap = ether(100);
      const changedcap = ether(100);
      const goal = ether(50);
      const expectedTokenAmount = rate*(value);
      
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
          
  
          // this.rate = 500;
          this.wallet = wallet;
          this.cap = ether(100);
          this.openingTime = (await time.latest())+time.duration.minutes(1);
          this.closingTime = this.openingTime + time.duration.weeks(1);
          this.afterClosingTime = this.closingTime + time.duration.seconds(1);
        //   this.preWalletBalance = await ethGetBalance(wallet);
            
          // console.log(await time.latest()<=this.openingTime)
          //changed mincap and maxcap for testing for the goal 
          
          this.crowdsale = await SportlistCrowdsale.new(
            rate,
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
        it('cannot be finalized before ending', async function () {
            await shouldFail.reverting(this.crowdsale.finalize({ from: anyone }));
          });
        
          it('can be finalized by anyone after ending', async function () {
            await time.increaseTo(this.afterClosingTime);
            await this.crowdsale.finalize({ from: anyone });
          });
        
          it('cannot be finalized twice', async function () {
            await time.increaseTo(this.afterClosingTime);
            await this.crowdsale.finalize({ from: anyone });
            await shouldFail.reverting(this.crowdsale.finalize({ from: anyone }));
          });
        
          it('logs finalized', async function () {
            await time.increaseTo(this.afterClosingTime);
            const { logs } = await this.crowdsale.finalize({ from: anyone });
            expectEvent.inLogs(logs, 'CrowdsaleFinalized');
          });
       
    })