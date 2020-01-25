import React, { Component } from "react";
import { connect } from "react-redux";

class UserPage extends Component {
  constructor(props) {
    super(props);
    console.log(props.user);
  }
  render() {
    return <div>UserPage</div>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(UserPage);
