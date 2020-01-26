import React, { Component } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { Button } from "reactstrap";
import { connect } from "react-redux";

import { authenticateUser, setPet } from "../../actions";
import { post } from "../../api/fetch-backend";

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
          email: result.user.email
        };
        let res = await post("/user/set", user);
        const response = await res.text();
        const data = JSON.parse(response);
        this.props.authenticateUser(data);
        if (data.isNew) {
          this.props.history.push("/new");
        } else {
          let res = await post(`/pet/get/${user.email}`, { owner: user.email });
          const data = await res.json();
          let res2 = await post("/pet/set", { owner: user.email, xp: data.xp });
          const data2 = await res2.json();
          this.props.setPet(data2);
          this.props.history.push("/user");
        }
      });
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

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, { authenticateUser, setPet })(LandingPage);
