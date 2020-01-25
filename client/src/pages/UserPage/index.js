import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardImg,
  CardBody,
  Progress,
  Modal,
  ModalFooter,
  ModalBody,
  Button
} from "reactstrap";

import { post } from "../../api/fetch-backend";
import { setPet } from "../../actions";
import "./UserPage.scss";

class UserPage extends Component {
  state = {
    modal: false
  };
  async componentDidMount() {
    if (!this.props.user.auth) {
      this.props.history.push("/");
    }
    let res = await post(`/pet/get/${this.props.user.email}`);
    const response = await res.text();
    const data = JSON.parse(response);
    this.props.setPet(data);
  }
  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  render() {
    return (
      <div className="UserPage">
        <div id="hero">
          <Card id="main" style={{ width: "20rem" }}>
            <CardImg top src={`https://arkvatar.com/arkvatar/${this.props.user.email}`} alt="..." />
            <CardBody>
              <h1>{this.props.pet.name}</h1>
              {this.props.user.name}
            </CardBody>
          </Card>
          <div id="target">
            <h1>Todays Target</h1>
            <h1 id="money-left">45₹</h1>
            <Modal isOpen={this.state.modal} toggle={this.toggleModalDemo}>
              <div className="modal-header">
                <h1 className="modal-title">Payment Successful</h1>
              </div>
              <ModalBody>
                <p>Woohoo, Another Saving!</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleModal}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
            <Button
              id="pay-button"
              color="success"
              className="animation-on-hover"
              onClick={this.toggleModal}
            >
              Pay Now
            </Button>
          </div>
          <Card id="points">
            <h1>Health</h1>
            <Progress color="danger" value="85" />
            <h1>XP</h1>
            <Progress color="success" value="25" />
            <h1>Level: 4</h1>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    pet: state.pet
  };
};

export default connect(mapStateToProps, { setPet })(UserPage);
