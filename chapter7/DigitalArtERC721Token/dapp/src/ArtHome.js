import React from 'react';
import './App.css';
import AppNav from "./AppNav";
import { getWeb3, getInstance}  from "./Web3Util";
/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util aution house for digial art
 * @Book Learn Ethereum 
 * @author brian wu
 */
class ArtHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      message: "",
      rows:[],
      columns: [],
      user: '',
      tokenIds: [],
      title: [],
      desc: [],
      price: [],
      publishDate: [],
      author: [],
      image: [],
      total: 0,
      contractInstance: '',
      user:''
    };
    this.buyArt = this.buyArt.bind(this);
  }
  resetPendingArts() {
    this.setState({ 
      tokenIds: [],
      title: [],
      desc: [],
      price: [],
      publishDate: [],
      author: [],
      image: [],
      total: 0
    });
  }
  componentDidMount = async () => {
    const web3 = await getWeb3();
    window.web3 = web3;
    const contractInstance = await getInstance(web3);
    window.user = (await web3.eth.getAccounts())[0];
    this.setState({ user: window.user });
    this.setState({ contractInstance: contractInstance });
    await this.loadDigitalArts(web3);

  }
  async loadDigitalArts(web3) {
      try {
        let ids;
        const result = await this.state.contractInstance.methods.findAllPendingArt().call();
        ids = result[0];
        let _total = ids.length;
        if(ids && _total>0) {
          let row;
          if(_total<=3) {
            row = 1;
          } else {
            row = Math.ceil(_total/3);
          }
          let columns = 3;
          this.setState({ rows: [], columns: [] });
          let rowArr = Array.apply(null, {length: row}).map(Number.call, Number);
          let colArr = Array.apply(null, {length: columns}).map(Number.call, Number);
          this.setState({ rows: rowArr, columns: colArr });
          let _tokenIds= [], _title =[],  _desc= [], _price= [], _publishDate= [],  _image =[], _author=[];
          let idx =0;
          this.resetPendingArts();
          for(let i = 0; i<row; i++) {
            for(let j = 0; j < columns; j++) {
               if(idx<_total) {
                 let tokenId= ids[idx];
                 const art = await this.state.contractInstance.methods.findArt(tokenId).call();
                 const priceInEther = web3.utils.fromWei(art[3], 'ether');
                 _tokenIds.push(art[0]);
                 _title.push(art[1]);
                 _desc.push(art[2]);
                 _price.push(priceInEther);
                 _publishDate.push(art[5]);
                 _image.push(art[9]);
                 _author.push(art[6]);
               }
              idx++;
            }
        }
         
          this.setState({ 
            tokenIds: _tokenIds,
            title: _title,
            desc: _desc,
            price: _price,
            publishDate: _publishDate,
            author: _author,
            image: _image,
            total: _total
          });
          this.setState({ hasData: true });
        } else {
          this.setState({ hasData: false });
        }
 
    } catch (e) {console.log('Error', e)}
  
  }
  async buyArt(tokenId, priceInEther) {
    try {
      const priceInWei =  window.web3.utils.toWei(priceInEther, 'ether');
      await this.state.contractInstance.methods.buyArt(tokenId).send({
          from: this.state.user, gas: 6000000, value: priceInWei
      })
      window.location.reload(); 
    } catch (e) {console.log('Error', e)}
  };

  render() {
    if (this.state.hasData) {
      return (
        <div className="App">
          <AppNav></AppNav>
          <section className="text-center">
            <h5 className="h1-responsive font-weight-bold text-center my-5">Buy/Sell Digital Art on our Art Gallery</h5>
            <div className="container">
               {this.state.rows.map((row, i) =>
                <div className="row" key={i}>
                  {this.state.columns.map((col, j) =>
                    <div className="col-lg-4 col-md-12 mb-lg-0 mb-0" key={j}>
                        { i*3+j < this.state.total &&
                            <div>
                            <div className="view overlay rounded z-depth-3 mb-2">
                              <img className="img-fluid" src={this.state.image[i*3+j]} alt="Sample"/>
                            </div>
                            <h6 className="pink-text font-weight-bold mb-1"><i className="fas fa-map pr-2"></i></h6>
                            <div className="font-weight-bold orange-text deep-orange-lighter-hover">TokenId: {this.state.tokenIds[i*3+j]}</div>
                            <h5 className="font-weight-bold mb-1">Title: {this.state.title[i*3+j]}</h5>
                            <div className="dark-grey-text">{this.state.price[i*3+j]} (ether)</div>
                            <p>by <span className="font-weight-bold">{this.state.author[i*3+j]}</span>, {this.state.publishDate[i*3+j]}</p>
                            
                            <p className="alert alert-primary dark-grey-text">{this.state.desc[i*3+j]}</p>
                            <button className="btn btn-pink btn-rounded btn-md" onClick={e => (e.preventDefault(),this.buyArt(this.state.tokenIds[i*3+j], this.state.price[i*3+j]))}>Buy</button>
                        </div>
                        }
                    </div>

                  )}
                </div>
              )}
              </div>
          </section>
        </div>
      );
    } else {
      return (
        <div className="App">
          <AppNav></AppNav>
          <section className="text-center">
            <h5 className="h1-responsive font-weight-bold text-center my-5">Buy Digital Art on our Art Gallery</h5>
            <div className="container">
              <div className="alert alert-primary" role="alert">
                Publish your digital arts in blockchain today!
              </div>
              </div>
          </section>
        </div>
      );
    }

  }
}

export default ArtHome;
