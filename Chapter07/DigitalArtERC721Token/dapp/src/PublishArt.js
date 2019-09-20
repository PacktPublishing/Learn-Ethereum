import React from 'react';
import './App.css';
import AppNav from "./AppNav";
import { getWeb3, getInstance}  from "./Web3Util";
/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util Publish artwork
 * @Book Learn Ethereum 
 * @author brian wu
 */
class PublishArt extends React.Component {
    constructor(props) {
      super(props);
      this.imageChange = this.imageChange.bind(this);
      this.submitHandler = this.submitHandler.bind(this);
      this.changeHandler = this.changeHandler.bind(this);
      this.state = { 
            imageValue: 'images/a-moment-of-silence.png',
            description: '',
            title: '', 
            authorName: '',
            price: 0,
            date:'',
            user: '',
            balance: 0,
            contractInstance: '',
            networkId:'',
            networkType:'',
        };
    }
    componentDidMount = async () => {
        const web3 = await getWeb3();
        window.web3 = web3;
        const contractInstance = await getInstance(web3);
        window.user = (await web3.eth.getAccounts())[0];
        const balanceInWei = await web3.eth.getBalance(window.user);
        var balance = web3.utils.fromWei(balanceInWei, 'ether');
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        this.setState({ user: window.user });
        this.setState({ balance: balance});
        this.setState({ contractInstance: contractInstance });
        this.setState({ networkId: networkId});
        this.setState({ networkType: networkType});
      }
    imageChange = (event) => {
        this.setState({ imageValue: event.target.value });
    };
    categoryChange = (event) => {
        this.setState({ categoryValue: event.target.value });
    };
    submitHandler = (event) => {
        event.preventDefault();
        const {  imageValue, description, title, authorName, price, date} = this.state;
        if(this.isNotEmpty(title) &&this.isNotEmpty(description) &&this.isNotEmpty(authorName) 
            &&this.isNotEmpty(date)&&this.isNotEmpty(imageValue) && this.isNotEmpty(price)) {
            const priceInWei =  window.web3.utils.toWei(price, 'ether');
            this.publishArt(title, description, date, authorName, priceInWei, imageValue);  
        }
    };
    isNotEmpty(val) {
        return val&& val.length>0;
    }
    changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
            }, function(){ })
    };
    async publishArt(title, description, date, authorName, price, imageValue) {
        try {
            await this.state.contractInstance.methods.createTokenAndSellArt(title,description, date, authorName, price, imageValue).send({
                from: this.state.user
            })
            this.props.history.push(`/home`)
            window.location.reload(); 
        } catch (e) {console.log('Error', e)}

    }
    render() {
      return (
        <div>
            <AppNav></AppNav>
            <section className="mx-auto" style={{ marginTop: '20px'}}>
                <div className="row">
                    <div className="col-md-2 mb-md-0 mb-5"></div>
                    <div className="col-md-8 mb-md-0 mb-5">
                        <div className="card">
                            <div className="card-body">
                                <form className="text-center border border-light p-5" onSubmit={this.submitHandler}>
                                    <p className="h4 mb-4">Submit your digital art today.</p>
                                    <div className="row">
                                        <div className="col-md-6 mb-md-0 mb-5">
                                            <input className="form-control mb-4" id="title" name="title" type="text" placeholder="Title" onChange={this.changeHandler}  value={this.state.title}/>
                                            <input className="form-control mb-4" id="description" name="description"  type="text" placeholder="Description" onChange={this.changeHandler}  value={this.state.description}/>
                                           <input className="form-control mb-4" id="authorName" name="authorName" type="text" placeholder="Author Name" onChange={this.changeHandler}  value={this.state.authorName}/>

                                        </div>
                                        <div className="col-md-6 mb-md-0 mb-5">
                                           <input className="form-control mb-4" id="price" name="price"  type="text" placeholder="Price (ether)"  onChange={this.changeHandler}  value={this.state.price}/>
                                           <input className="form-control mb-4" id="date" name="date"  type="text" placeholder="Date" onChange={this.changeHandler}   value={this.state.date}/>
                                            <select className="browser-default custom-select" onChange={this.imageChange} value={this.state.imageValue}>
                                                    <option value="images/a-moment-of-silence.png">images/a-moment-of-silence.png</option>
                                                    <option value="images/Finchwing.png">images/Finchwing.png</option>
                                                    <option value="images/girl-and-bird.png">images/girl-and-bird.png</option>
                                                    <option value="images/kitty.png">images/kitty.png</option>
                                                    <option value="images/margay-cat.png">images/margay-cat.png</option>
                                                    <option value="images/Nighthill.png">images/Nighthill.png</option>
                                                    <option value="images/storm.png">images/storm.png</option>
                                            </select>
                                            <img className="imgBox z-depth-4 rounded" alt="art" src={this.state.imageValue} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-5 mb-md-0 mb-5"></div>
                                        <div className="col-md-2 mb-md-0 mb-5"><button className="btn btn-info btn-block" type="submit">Publish</button></div>
                                        <div className="col-md-5 mb-md-0 mb-5"></div>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-md-0 mb-5"></div>
                </div>

            </section>
        </div>

      );
    }
  }
  export default PublishArt;