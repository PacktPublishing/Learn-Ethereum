/**
 * @notice Unit test for The MyERC20Token
 * @author brian wu
 */ 
var MyERC20Token = artifacts.require("./MyERC20Token.sol");
const BN = web3.utils.BN;

contract('MyERC20Token', ([owner, operator, other, ...accounts]) => {
  const initialAccount = owner
  const transferValue = '100000000000000000'
  const initialBalance = '100000000000000000000'
  const name ='MyERC20Token'
  const symbol='MTK'
  let token
  let tokenTotalSupply
  let SUCCESS_CODE
  let SUCCESS_MESSAGE
  let NON_WHITELIST_CODE
  let NON_WHITELIST_ERROR
  let sender = owner
  let recipient = operator
  let thirdAcct = other

  before(async () => {
    token = await MyERC20Token.new(name, symbol, initialAccount, initialBalance)
    tokenTotalSupply = await token.totalSupply()
    SUCCESS_CODE = await token.SUCCESS_CODE()
    SUCCESS_MESSAGE = await token.SUCCESS_MESSAGE()
    NON_WHITELIST_CODE = await token.NON_WHITELIST_CODE()
    NON_WHITELIST_ERROR = await token.NON_WHITELIST_ERROR()
  })

  let senderBalanceBefore;
  let recipientBalanceBefore
  beforeEach(async () => {
    senderBalanceBefore = await token.balanceOf(sender)
    recipientBalanceBefore = await token.balanceOf(recipient)
  })

  it('should has token name and symbol', async () => {
    const tokenSummary = await token.tokenSummary();
    assert(tokenSummary[1]===name)
    assert(tokenSummary[2]===symbol)
  })

  it('should mint total supply of tokens to initial account', async () => {
    const initialAccountBalance = await token.balanceOf(initialAccount)
    assert(initialAccountBalance.eq(tokenTotalSupply))
  })


  it('should revert transfers between non-whitelisted accounts', async () => {
    let revertedTransfer = false
    try {
      await token.transfer(recipient, transferValue, { from: sender })
    } catch (err) {
      revertedTransfer = true
    }

    assert(revertedTransfer)
  })

  it('should revert use of transferFrom between non-whitelisted accounts', async () => {
    let revertedTransfer = false
    try {
      await token.approve(owner, transferValue, { from: sender })
      await token.transferFrom(sender, recipient, transferValue, { from: owner })
    } catch (err) {
      revertedTransfer = true
    }

    assert(revertedTransfer)
  })

  it('should detect restriction for transfer between non-whitelisted accounts', async () => {
    const code = await token.validateTransferRestricted(recipient)
    assert(code.eq(NON_WHITELIST_CODE))
  })
  
  it('should return non-whitelisted error message for whitelist error code', async () => {
    const message = await token.messageHandler(NON_WHITELIST_CODE)
    assert.equal(NON_WHITELIST_ERROR, message)
  })
  it('should allow only contract owner add account as admin', async () => {
    const isAdmin = await token.isAdmin(recipient, { from: owner })
    assert(!isAdmin)
    let revertedAddAdmin = false
    try {
      await token.addAdmin(operator, { from: thirdAcct })
    } catch (err) {
        revertedAddAdmin = true
    }
    assert(revertedAddAdmin)

    await token.addAdmin(operator, { from: owner })
    const operatorIsAdmin = await token.isAdmin(operator)
    assert(operatorIsAdmin)
  })

  it('should allow contract admin to whitelist an account', async () => {
    const operatorIsNotWhitelisted = await token.isWhitelist(operator)
    assert(!operatorIsNotWhitelisted)
    await token.addWhitelist(operator, { from: operator })
    const operatorIsWhitelisted = await token.isWhitelist(operator)
    assert(operatorIsWhitelisted)
  })
  it('should not allow transfer when contract is paused', async () => {
    await token.pause({ from: owner })
    let revertedTransfer = false
    try {
      await token.transfer(recipient, transferValue, { from: sender })
    } catch (err) {
      revertedTransfer = true
    }

    assert(revertedTransfer)
    await token.unpause({ from: owner })
  })

  it('should allow transfer between whitelisted accounts', async () => {
    await token.transfer(recipient, transferValue, { from: sender })
    
    const senderBalanceAfter = await token.balanceOf(sender)
    const recipientBalanceAfter = await token.balanceOf(recipient)
    assert.equal(
      senderBalanceAfter.valueOf(),
      new BN(senderBalanceBefore).sub(new BN(transferValue)).toString()
    )
    assert.equal(
      recipientBalanceAfter.valueOf(),
      new BN(recipientBalanceBefore).add(new BN(transferValue)).toString()
    )
  })

  it('should allow use of transferFrom betwen whitelisted accounts', async () => {
    await token.approve(owner, transferValue, { from: sender })
    await token.transferFrom(sender, recipient, transferValue, { from: owner })

    const senderBalanceAfter = await token.balanceOf(sender)
    const recipientBalanceAfter = await token.balanceOf(recipient)
    assert.equal(
      senderBalanceAfter.valueOf(),
      new BN(senderBalanceBefore).sub(new BN(transferValue)).toString()
    )
    assert.equal(
      recipientBalanceAfter.valueOf(),
      new BN(recipientBalanceBefore).add(new BN(transferValue)).toString()
    )
  })

  it('should detect success for valid transfer', async () => {
    const code = await token.validateTransferRestricted(recipient)
    console.log("code:" + code);
    assert(code.eq(SUCCESS_CODE))
  })

  it('should ensure success code is 0', async () => {
    assert.equal(SUCCESS_CODE, 0)
  })
  
  it('should return success message for success code', async () => {
    const message = await token.messageHandler(SUCCESS_CODE)
    assert.equal(SUCCESS_MESSAGE, message)
  })
  it('should admin burn certain amount tokens', async () => {
    const senderBalanceBefore = await token.balanceOf(sender)
    const tokenTotalSupplyBefore = await token.totalSupply()
    await token.burn(transferValue, { from: owner })
    const senderBalanceAfter = await token.balanceOf(sender)
    const tokenTotalSupplyAfter = await token.totalSupply()
    assert.equal(
      senderBalanceAfter.valueOf(),
      new BN(senderBalanceBefore).sub(new BN(transferValue)).toString()
    )
    assert.equal(
      tokenTotalSupplyAfter.valueOf(),
      new BN(tokenTotalSupplyBefore).sub(new BN(transferValue)).toString()
    )
  })
  it('should admin mint certain amount tokens', async () => {
    const senderBalanceBefore = await token.balanceOf(sender)
    const tokenTotalSupplyBefore = await token.totalSupply()
    await token.mint(sender, transferValue, { from: owner })
    const senderBalanceAfter = await token.balanceOf(sender)
    const tokenTotalSupplyAfter = await token.totalSupply()
    assert.equal(
      senderBalanceAfter.valueOf(),
      new BN(senderBalanceBefore).add(new BN(transferValue)).toString()
    )
    assert.equal(
      tokenTotalSupplyAfter.valueOf(),
      new BN(tokenTotalSupplyBefore).add(new BN(transferValue)).toString()
    )
  })
})
