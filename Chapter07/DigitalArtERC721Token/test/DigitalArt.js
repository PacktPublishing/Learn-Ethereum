/**
 * @notice Unit test for The DigitalArt ERC721 Token
 * @Book Learn Ethereum
 * @author brian wu
 */ 
var DigitalArt = artifacts.require("./DigitalArt.sol");


contract('DigitalArt', ([owner, operator, ...accounts]) => {

  const name ='DigitalArtToken'
  const symbol='DT'
  let token
  let sender = owner
  let recipient = operator

  let tokenId = 0;
  let title ="Blue village";
  let date ="2019-02-01";
  let description ="a somber sort of mixed color scheme and emotion in blue mountain background";
  let authorName ="MagicMix";
  const price = '100000000000000000' // 0.1 ether
  const payment = 100000000000000000 // 0.1 ether
  let image ="https://imagenet/Blue-village.png"
  

  before(async () => {
    token = await DigitalArt.new(name, symbol)
  })

  it('should has token name and symbol', async () => {
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    assert(tokenName===name)
    assert(tokenSymbol===symbol)
  })

  it('should create an art token and selling art', async () => {
      assert( token.arts.length ===0, "Arts should be empty");
      await token.createTokenAndSellArt(title, description, date, authorName,  price, image);
      const res = await token.findAllArt();
      var ids = res[0]; 
      var authors = res[1];
      var owners = res[2];
      var status = res[3];
      assert(ids.length===1)
      assert(authors.length===1)
      assert(owners.length===1)
      assert(status.length===1)
      assert.equal(ids[0],tokenId, "Token Id should be 0");
      assert.equal(authors[0],sender, "Author Address should match");
      assert.equal(owners[0],sender, "Owner Address should match");
      assert.equal(status[0],1, "Status should be pending");
  })

  it('should find art with matched information', async () => {
      const res = await token.findArt(tokenId);
      assert.equal(res[0],tokenId, "Token Id should be 0");
      assert.equal(res[1],title, "Title should match");
      assert.equal(res[2],description, "Description should match");
      assert.equal(res[3],price, "Price should match");
      assert.equal(res[4],1, "Status should match");
      assert.equal(res[5],date, "Date should match");
      assert.equal(res[6],authorName, "AuthorName should match");
      assert.equal(res[7],sender, "Author Address should match");
      assert.equal(res[8],sender, "Owner Address should match");
      assert.equal(res[9],image, "Image should match");
  })
  it('should buyer purchase art', async () => {
      const resBefore = await token.findArt(tokenId);
      assert.equal(resBefore[8],sender, "Owner Address should match");
      await token.buyArt(tokenId, { from: recipient, gas: 6000000, value: payment  });
      const resAfter = await token.findArt(tokenId);
      assert.equal(resAfter[8],recipient, "Owner Address should match");
  })
  it('should get ArtTxn for trading', async () => {
      const res = await token.getArtAllTxn(tokenId);
      var ids = res[0]; 
      var prices = res[1];
      var sellers = res[2];
      var buyers = res[3];
      assert.equal(ids[0],tokenId, "Token Id should be 0");
      assert.equal(prices[0],price, "Price Id should match");
      assert.equal(sellers[0],sender, "Seller should match");
      assert.equal(buyers[0],recipient, "Buyer hould match");
  })
})
