// const { ether } = require('./helpers/ether');
// const { advanceBlock } = require('./helpers/advanceToBlock');
// const { increaseTimeTo, duration } = require('./helpers/increaseTime');
// const { latestTime } = require('./helpers/latestTime');
// const { expectThrow } = require('./helpers/expectThrow');
// const { EVMRevert } = require('./helpers/EVMRevert');
// const { ethGetBalance } = require('./helpers/web3');
// const { assertRevert } = require('./helpers/assertRevert');
// const BigNumber = web3.BigNumber;

// require('chai')
//   .use(require('chai-bignumber')(BigNumber))
//   .should();

// const RefundableCrowdsale = artifacts.require('RefundableCrowdsaleImpl');
// const SimpleToken = artifacts.require('SimpleToken');
// const SportlistToken = artifacts.require('Token');
// const SportlistCrowdsale = artifacts.require('TokenCrowdsale');


// contract('StagedCrowdsale', function([_, wallet, investor1, investor2, foundersFund, foundationFund, partnersFund]) {

//     // beforeEach(async function()){



//     // }

//     beforeEach(async function () {
//         // Token config
//         this.name = "DappToken";
//         this.symbol = "DAPP";
//         this.decimals = 18;
    
//         // Deploy Token
//         this.token = await SportlistToken.new(
//           this.name,
//           this.symbol,
//           this.decimals,
//           2000000000
//         );
//         this.rate = 500;
//         this.wallet = wallet;
//         this.cap = ether(100);
//         this.openingTime =  Math.floor((new Date()).getTime()/1000);//latestTime() + duration.weeks(1);
//         this.closingTime = this.openingTime + 1 * 60 * 60 * 24;//this.openingTime + duration.weeks(1);
//         this.goal = ether(50);
//         this.crowdsale=await SportlistCrowdsale.new(this.rate,this.wallet,this.token.address,
//             this.openingTime,this.closingTime,
//             this.cap,
//             this.goal,
//             this.wallet);
//     })

// describe('checking the rate after different stages',function () {
//       it('checking the for the phase', async function() {
//         console.log(await this.crowdsale.getPhase());
//         let phase1=await this.crowdsale.nextPhase(1);
//         console.log(await this.crowdsale.getPhase());
//       });
//       it('checking final pahase should be greater than the initial phase ', async function() {
//         const initial =await this.crowdsale.getPhase();
//         let phase1=await this.crowdsale.nextPhase(1);
//         const final =await this.crowdsale.getPhase();

//         assert.isTrue(initial<final); 
//       });
//       it('checking the final rate is more than the initial rate  ',async function(){
//         const initialRate=await this.crowdsale.rate(); 
//         let phase1=await this.crowdsale.nextPhase(1000);
//         const  finalRate=await this.crowdsale.rate();
//         // assert.isTrue(finalRate<intitalRate);
//         initialRate.should.be.bignumber.lessThan(finalRate);
//        });
//       //  it("checking weather we can make rate to be negative",async function(){
//       //     // await this.crowdsale.nextPhase(-1));
//       //     let initial=await this.crowdsale.rate()
//       //     console.log(initial.toNumber()); 
//       //     await this.crowdsale.nextPhase(-50);
//       //     let final =await this.crowdsale.rate();
//       //     console.log(final.toFixed());
//       //  })
//        it('checking the rate to be 0', async function() {
//           await assertRevert(this.crowdsale.nextPhase(0)); 

//        });
//        it('checking if the rate can be changed by anyone other than the owner',async function() {
//         await assertRevert(this.crowdsale.nextPhase(0,{from:investor1}));
//        });
       

//     });    
// })