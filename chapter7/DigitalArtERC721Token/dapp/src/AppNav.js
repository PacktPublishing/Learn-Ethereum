import React from "react";
import { withRouter} from 'react-router-dom';
import "./App.css";
import { getWeb3, getInstance}  from "./Web3Util";
/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util header navigation
 * @Book Learn Ethereum 
 * @author brian wu
 */
class AppNav extends React.Component {
    constructor(props) {
      super(props);
      this.handleNavClick = this.handleNavClick.bind(this);
      this.state = { 
            name: '',
            symbol: ''
        };
    }
    handleNavClick = param => e => {
      e.preventDefault();
      this.props.history.push('/'+param)
    };
    componentDidMount = async () => {

      const web3 = await getWeb3();
      const contractInstance = await getInstance(web3);
      window.user = (await web3.eth.getAccounts())[0];
      const symbol = await contractInstance.methods.symbol().call()
      this.setState({ symbol: symbol });
            const name = await contractInstance.methods.name().call();
      this.setState({ name: name });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark stylish-color">
        <div className="navbar-brand">  
            <a className="navbar-item text-white" href="/">  
                <strong><i className="fa fa-coins"></i>Decentralized Art Market ( {this.state.name} | {this.state.symbol})</strong>  
            </a>  
        </div> 
      <form className="form-inline  my-2 my-lg-0 ml-auto">
        <a  className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/">Art Gallery</a>
        <a className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/publishArt">Publish Your Art</a>
        <a className="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" href="/myWallet">My Wallet Info</a>
        </form>
      </nav>
    );
  }
}
export default withRouter(AppNav);
