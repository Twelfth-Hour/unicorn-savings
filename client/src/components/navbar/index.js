import React, { Component } from "react";
import { Button } from "reactstrap";

class NavBar extends Component {
  render() {
    return (
      <div className="Navbar">
        <nav className="nav">
          <Button className="btn-simple" color="primary" onClick={this.handleAuth}>
            Log In
          </Button>
          <Button color="primary" onClick={this.handleAuth}>
            Sign Up
          </Button>
        </nav>
      </div>
    );
  }
}

export default NavBar;
