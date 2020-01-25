import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { Button } from "reactstrap";

class LandingPage extends Component {
  state = {};
  handleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.addScope("profile");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async result => {
        let user = {
          id: result.user.uid,
          auth: true,
          name: result.user.displayName,
          email: result.user.email,
          is_new: false, // set new only to local
          target: 0,
          daily: 0,
          savings: 0
        };
        let res = await fetch(`/user/set`, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(user)
        });
        const body = await res.text();
        console.log(body);
      });
    console.log("Auth Done");
    // check is user exists in database
    // login/signup user
  };
  render() {
    return (
      <div>
        <Button color="primary" onClick={this.handleAuth}>
          Auth
        </Button>
      </div>
    );
  }
}

export default LandingPage;
