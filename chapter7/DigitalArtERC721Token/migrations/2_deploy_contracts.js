var DigitalArt = artifacts.require("./DigitalArt.sol");

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    try {
      await deployer.deploy(DigitalArt, "DigitalArtToken", "DT");
    } catch (err) {
      console.log(('Failed to Deploy Contracts', err))
    }
  })

}