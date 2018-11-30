// // const { assertRevert } = require('./helpers/assertRevert');
// // const { ether } = require('./helpers/ether');
// // const {EVMRevert}= require('./helpers/EVMRevert');

// // const ERC20Capped = artifacts.require('ERC20Capped');

// // contract('ERC20Capped', function ([_, minter, ...otherAccounts]) {
// //     const cap = ether(1000);

// //     it('requires a non-zero cap', async function () {
// //       await assertRevert(
// //         ERC20Capped.new(0, { from: minter })

// //       );
// //     });

// // })
const { ether } = require('./helpers/ether');
const shouldFail = require('./helpers/shouldFail');
const { advanceBlock } = require('./helpers/advanceToBlock');
const time = require('./helpers/time');
const { ethGetBalance } = require('./helpers/web3');

const BigNumber = web3.BigNumber;
const SportlistToken = artifacts.require("Token");
const SportlistCrowdsale = artifacts.require("TokenCrowdsale");

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

  contract('CappedCrowdsale', function ([_, wallet]) {
    // const rate = new BigNumber(1);
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
      describe('accepting payments', function () {
        it('should accept payments within cap', async function () {
          //await this.crowdsale.send(1000000);
        await this.crowdsale.send(100000);
        });
        it('should reject payments outside cap', async function () {
          // await this.crowdsale.send(cap);
          await shouldFail.reverting(this.crowdsale.send(1));
        });
      });
        describe('ending', function () {
          it('should not reach cap if sent under cap', async function () {
            await this.crowdsale.send(100000);
            (await this.crowdsale.capReached()).should.equal(false);
          });
          it('to check the opening time ',async function () {
            console.log(await this.crowdsale.closingTime());
          });
    
         
        });
      
    });