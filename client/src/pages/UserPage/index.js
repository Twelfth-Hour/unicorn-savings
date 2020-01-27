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
  Button,
  Row,
  Col,
  Table
} from "reactstrap";
import { Line } from "react-chartjs-2";

import { post } from "../../api/fetch-backend";
import { authenticateUser, setPet } from "../../actions";
import "./UserPage.scss";

import badge1 from "../../assets/svg/first.svg";
import badge2 from "../../assets/svg/seven.svg";
import badge3 from "../../assets/svg/hero.svg";
import badge4 from "../../assets/svg/paw.svg";
const chartColor = "#FFFFFF";

class UserPage extends Component {
  _isMounted = false;

  state = {
    modal: false,
    nextLevel: 1000,
    leaderboard: [],
    rank: 1,
    history: [0, 0, 0, 0, 0, 0, this.props.pet.todaySaved],
    amountToSave: 0,
    badges: [],
    withdraw: false
  };
  componentDidMount = async () => {
    if (this.props.user.auth === false) {
      this.props.history.push("/");
    }
    this._isMounted = true;
    let res = await post(`/pet/get/${this.props.user.email}`);
    const response = await res.text();
    const data = JSON.parse(response);
    this.props.setPet(data);
    if (this._isMounted) {
      let a = [...this.props.pet.history];
      a.push(this.props.pet.todaySaved);
      a.shift();
      this.setState({
        nextLevel: (5 * (this.props.pet.level + 1) * (this.props.pet.level + 2)) / 2,
        history: a
      });
    }
    let a = await post(`/leaderboard/${this.props.user.email}`);
    const b = await a.json();
    if (this._isMounted) {
      this.setState({ leaderboard: b.array, rank: b.ownerRank });
    }
    let c = await post("/badges", {
      user: this.props.user,
      pet: this.props.pet
    });
    const d = await c.json();
    if (this._isMounted) {
      this.setState({
        badges: d
      });
      console.log(d);
    }
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  toggleWithdraw = () => {
    this.setState({ withdraw: !this.state.withdraw });
  };
  renderTable = () => {
    return this.state.leaderboard.map((user, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{user.name}</td>
          <td>{user.xp}</td>
        </tr>
      );
    });
  };
  handlePayField = e => {
    this.setState({ amountToSave: e.target.value });
  };
  handlePay = async () => {
    const amount = Number(this.state.amountToSave);
    let a = await post("/user/set", {
      id: this.props.user.id,
      savings: amount + this.props.user.savings
    });
    let b = await a.json();
    this.props.authenticateUser(b);
    let c = await post("/pet/set", {
      owner: this.props.user.email,
      xp: this.props.pet.xp + 5,
      hasPaid: true,
      todaySaved: this.props.pet.todaySaved + amount
    });
    let d = await c.json();
    this.props.setPet(d);
    window.location.reload();
  };
  handleWitdraw = async () => {
    if (this.props.user.savings >= this.props.user.target) {
      await post("/user/set", {
        id: this.props.user.id,
        isNew: true,
        savings: 0
      });
    } else {
      await post("/pet/set", {
        owner: this.props.user.email,
        xp: 0,
        history: [0, 0, 0, 0, 0, 0, 0]
      });
      await post("/user/set", {
        id: this.props.user.id,
        isNew: true,
        savings: 0
      });
    }
    this.props.history.push("/");
  };
  render() {
    const data = canvas => {
      var ctx = canvas.getContext("2d");

      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#80b6f4");
      gradientStroke.addColorStop(1, chartColor);

      var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
      gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
      return {
        labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Money Saved",
            borderColor: "#f96332",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#f96332",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: this.state.history
          }
        ]
      };
    };
    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [
          {
            display: 0,
            ticks: {
              display: false
            },
            gridLines: {
              zeroLineColor: "transparent",
              drawTicks: false,
              display: false,
              drawBorder: false
            }
          }
        ],
        xAxes: [
          {
            display: 0,
            ticks: {
              display: false
            },
            gridLines: {
              zeroLineColor: "transparent",
              drawTicks: false,
              display: false,
              drawBorder: false
            }
          }
        ]
      },
      layout: {
        padding: { left: 0, right: 0, top: 15, bottom: 15 }
      }
    };
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
            <h1 id="money-left">{this.props.user.daily - this.props.pet.todaySaved}₹</h1>
            <Modal isOpen={this.state.modal} toggle={this.toggleModalDemo}>
              <div className="modal-header">
                <h1 className="modal-title">Select Amount</h1>
              </div>
              <ModalBody>
                <p>Amount to Save</p>
                <input
                  type="number"
                  value={this.state.amountToSave}
                  onChange={this.handlePayField}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className="btn-simple" onClick={this.toggleModal}>
                  Close
                </Button>
                <Button color="primary" onClick={this.handlePay}>
                  Pay
                </Button>
              </ModalFooter>
            </Modal>
            <Button
              id="pay-button"
              color="success"
              className="animation-on-hover"
              onClick={this.toggleModal}
            >
              Invest Now
            </Button>
          </div>
          <Card id="points">
            <h1>Health</h1>
            <Progress color="danger" value={this.props.pet.hp} />
            <h1>XP</h1>
            <Progress color="success" value={(this.props.pet.xp * 100) / this.state.nextLevel} />
            <h1>Level: {this.props.pet.level}</h1>
          </Card>
        </div>
        <div id="stats">
          <Row>
            <Col>
              <h2>Badges</h2>
              <img className="badge-icon" src={badge4} alt="badge" />
              {this.props.pet.level >= 1 && <img className="badge-icon" src={badge1} alt="badge" />}
              {!this.props.pet.history.includes(0) && (
                <img className="badge-icon" src={badge2} alt="badge" />
              )}
              {this.props.pet.todaySaved > this.props.user.daily && (
                <img className="badge-icon" src={badge3} alt="badge" />
              )}
            </Col>
            <Col>
              <h2>Stats</h2>
              <div>
                <Line data={data} options={options} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Leaderboard</h2>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>XP</th>
                  </tr>
                </thead>
                <tbody>{this.renderTable()}</tbody>
              </Table>
            </Col>
            <Col>
              <h2>Vitals</h2>
              <h4>Savings Today: {this.props.pet.todaySaved}₹</h4>
              <h4>XP for next level: {this.state.nextLevel - this.props.pet.xp}</h4>
              <h4>
                Average Saving for Last Week:{" "}
                {Math.round(
                  this.state.history.reduce((a, b) => a + b, 0) / this.state.history.length
                )}
                ₹
              </h4>
              <h4>Your Rank: {this.state.rank}</h4>
              <h4>Total Savings: {this.props.user.savings}₹</h4>
              <Button onClick={this.toggleWithdraw}>Withdraw</Button>
              <Modal isOpen={this.state.withdraw} toggle={this.toggleModalDemo}>
                <div className="modal-header">
                  <h1 className="modal-title">Confirmation</h1>
                </div>
                <ModalBody>
                  <p>Are you Sure?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" className="btn-simple" onClick={this.toggleWithdraw}>
                    Close
                  </Button>
                  <Button color="primary" onClick={this.handleWitdraw}>
                    Withdraw
                  </Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
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

export default connect(mapStateToProps, { authenticateUser, setPet })(UserPage);
