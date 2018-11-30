// const { assertRevert } = require('./helpers/assertRevert');
// const { ether } = require('./helpers/ether');
// const {EVMRevert}= require('./helpers/EVMRevert');

// const Token=artifacts.require("Token");

// const BigNumber=web3.BigNumber;
// require('chai')
// .use(require("chai-bignumber")(BigNumber))
// .should();

// contract("Sportlist",function(accounts)
// {
//     const _name="Sportlist";
//     const _symbol="Sporty";
//     const _decimals=18;
//     const _cap=5009000
//     beforeEach(async function(){

//         this.token=await Token.new(_name,_symbol,_decimals,_cap);

// });
// describe("checking the token name ", function(){
//     it('checking if the cap is valid ',async function(){

//         //assert.isFalse(await this.token.mintingFinished());
//         //assert.isTrue(await this.token.mint(accounts[0],10));
//         console.log(await this.token.cap()); //console.log(await this.token.totalSupply());

//        })
//        it('checking if the minting finished is valid ',async function(){

//         //assert.isFalse(await this.token.mintingFinished());
//         //assert.isTrue(await this.token.mint(accounts[0],10));
//         assert.isFalse(await this.token.mintingFinished()); //console.log(await this.token.totalSupply());

//        })
//        it('checking if minting is out of the cap  ',async function(){

//         //assert.isFalse(await this.token.mintingFinished());
//         //assert.isTrue(await this.token.mint(accounts[0],10));
//         await assertRevert(this.token.mint(accounts[1],10000000000000000000000));

//        })

// })

// });
