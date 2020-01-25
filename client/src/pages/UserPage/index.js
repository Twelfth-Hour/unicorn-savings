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
import { setPet } from "../../actions";
import "./UserPage.scss";

import badge1 from "../../assets/svg/first.svg";
import badge2 from "../../assets/svg/seven.svg";
import badge3 from "../../assets/svg/hero.svg";
const chartColor = "#FFFFFF";

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
        data: [42, 48, 43, 55, 53, 4, 80]
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

class UserPage extends Component {
  state = {
    modal: false,
    nextLevel: 1000
  };
  async componentDidMount() {
    if (!this.props.user.auth) {
      this.props.history.push("/");
    }
    let res = await post(`/pet/get/${this.props.user.email}`);
    const response = await res.text();
    const data = JSON.parse(response);
    this.props.setPet(data);
    this.setState({ nextLevel: (5 * (this.props.pet.level + 1) * (this.props.pet.level + 2)) / 2 });
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
                <h1 className="modal-title">Select Amount</h1>
              </div>
              <ModalBody>
                <p>Amount to Save</p>
                <input type="number" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className="btn-simple" onClick={this.toggleModal}>
                  Close
                </Button>
                <Button color="primary" onClick={this.toggleModal}>
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
              Pay Now
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
              <img className="badge-icon" src={badge1} alt="badge" />
              <img className="badge-icon" src={badge2} alt="badge" />
              <img className="badge-icon" src={badge3} alt="badge" />
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
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Tanjiro</td>
                    <td>755</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>ButterCup</td>
                    <td>510</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Banme</td>
                    <td>400</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <h2>Vitals</h2>
              <h4>Savings Today: 30₹</h4>
              <h4>XP for next level: {this.state.nextLevel - this.props.pet.xp}</h4>
              <h4>Average Saving for Last Week: 45.8₹</h4>
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

export default connect(mapStateToProps, { setPet })(UserPage);
