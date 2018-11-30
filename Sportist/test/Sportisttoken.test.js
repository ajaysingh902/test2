// const Token = artifacts.require("Token");
// const BigNumber = web3.BigNumber;
// require("chai")
//   .use(require("chai-bignumber")(BigNumber))
//   .should();

// contract("Sportist", function(accounts) {
//   const _name = "Sportist";
//   const _symbol = "Sporty";
//   const _decimals = 18;
//   const _cap = 7000000;
//   beforeEach(async function() {
//     this.token = await Token.new(_name, _symbol, _decimals, _cap);
//   });
//   describe("checking token attributes", function() {
//     it("has the correct name ", async function() {
//       const name = await this.token.name();
//       name.should.equal(_name);
//     });
//     it("has the correct symbol", async function() {
//       const symbol = await this.token.symbol();
//       symbol.should.equal(_symbol);
//     });
//     // it("has the correct address",async function(){
//     //     const address=await this.token.address;
//     //     console.log(address);
//     // });
//     it("has the correct decimals", async function() {
//       const decimals = await this.token.decimals();
//       decimals.should.be.bignumber.equal(_decimals);
//     });

//     it("to check the cap ", async function() {
//       const cap = await this.token.cap();
//       cap.should.be.bignumber.equal(_cap);
//     });
//   });
//   describe("testing token features", function() {
//     it("to check the minting process", async function() {
//       assert.isFalse(await this.token.mintingFinished());
//       //assert.isTrue(await this.token.mint(accounts[1],10))
//     });
//     it("to check the total supply", async function() {
//       let totalSupply = await this.token.totalSupply();
//       // totalSupply.should.equal(totalSupply);

//       //to check it how the tokens are being deployed
//       totalSupply.should.be.bignumber.equal(_cap);
//     });

//     // it("to check the total supply",async function(){
//     //     console.log(await this.token.balanceOf(accounts[0]));
//     // } );

//     // it("to check the transfer ",async function(){
//     //     console.log(await this.token.balanceOf(accounts[0]));
//     // } );

//     it("to check the transfer of tokens", async function() {
//       const balance = await this.token.balanceOf(accounts[1]);

//       balance.should.be.bignumber.equal(0);
//       const balance2 = await this.token.balanceOf(accounts[0]);

//       await this.token.transfer(accounts[3], 100000);

//       let balance3 = await this.token.balanceOf(accounts[3]);
//       balance3.should.be.bignumber.equal(100000);
//     });
//     it("to check the approve is working for the token", async function() {
//       let amount = 5000;
//       await this.token.approve(accounts[3], 10000);

//       await this.token.allowance(accounts[0], accounts[3]);
//       await this.token.transferFrom(accounts[0], accounts[4], amount, {
//         from: accounts[3]
//       });
//       let balanceof4 = await this.token.balanceOf(accounts[4]);

//       balanceof4.should.bignumber.equal(5000);

//       // console.log(await this.token.balanceOf(accounts[1]));
//     });
//   });
// });
