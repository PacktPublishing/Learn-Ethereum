var MyERC20Token = artifacts.require("./MyERC20Token.sol");

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    try {
      const ownerAddress = accounts[0];
      await deployer.deploy(MyERC20Token, "MyERC20Token", "MTK", ownerAddress, '100000000000000000000');
    } catch (err) {
      console.log(('Failed to Deploy Contracts', err))
    }
  })

}