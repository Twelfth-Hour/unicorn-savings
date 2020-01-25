import React, { Component } from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Input, Button, Card, CardBody } from "reactstrap";
import { authenticateUser, setPet } from "../../actions";

import "./NewPage.scss";

class NewPage extends Component {
  state = {
    name: "",
    daily: "",
    target: ""
  };
  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };
  handleDailyChange = e => {
    this.setState({ daily: Number(e.target.value) });
  };
  handleTargetChange = e => {
    this.setState({ target: Number(e.target.value) });
  };
  submit = async () => {
    let pet = {
      owner: this.props.user.email,
      name: this.state.name
    };
    let user = {
      id: this.props.user.id,
      daily: this.state.daily,
      target: this.state.target,
      isNew: false
    };
    let resUser = await fetch(`/user/set`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(user)
    });
    const responseUser = await resUser.text();
    const dataUser = JSON.parse(responseUser);
    this.props.authenticateUser(dataUser);

    let resPet = await fetch(`/pet/set`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(user)
    });
    const responsePet = await resPet.text();
    const dataPet = JSON.parse(responsePet);
    this.props.setPet(dataPet);
    console.log(dataPet);
    console.log(dataUser);
  };
  render() {
    return (
      <div className="NewPage">
        <Card>
          <CardBody>
            <h1>Let's make a new pet</h1>
            <img
              className="pet"
              src={`https://arkvatar.com/arkvatar/jrathod9@gmail.com`}
              alt="pet"
            />
            <form>
              <FormGroup>
                <Label>Name of Your Pet</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Bonky"
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Daily Savings Amount</Label>
                <br />
                <Input
                  type="number"
                  className="short"
                  onChange={this.handleDailyChange}
                  value={this.state.daily}
                  min="10"
                  name="name"
                  placeholder="40"
                />{" "}
                ₹
              </FormGroup>
              <FormGroup>
                <Label>Target Savings</Label>
                <br />
                <Input
                  type="number"
                  min="1000"
                  className="short"
                  name="name"
                  value={this.state.target}
                  onChange={this.handleTargetChange}
                  placeholder="40000"
                />{" "}
                ₹
              </FormGroup>
              <Button color="primary" type="submit" onClick={this.submit}>
                Submit
              </Button>
            </form>
          </CardBody>
        </Card>
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

export default connect(mapStateToProps, { authenticateUser, setPet })(NewPage);
