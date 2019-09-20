import React from "../node_modules/react";
import "./App.css";
import "./index.css";
import { BrowserRouter as Router } from "../node_modules/react-router-dom";
import Routes from "./Routes";
/**
 * @App Build Decentralized Art Market using ERC-721
 * @Util initail App build main class
 * @Book Learn Ethereum
 * @author brian wu
 */
class App extends React.Component {

  render() {
    return (
      <Router>
      <div>
        <main>
          <Routes />
        </main>
      </div>
      </Router>
    );
  }
}
export default App;