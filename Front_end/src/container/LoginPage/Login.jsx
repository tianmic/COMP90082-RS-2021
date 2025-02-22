import { Form, Button } from "react-bootstrap"
import React, { Component } from "react"
import AuthService from "../../utils/AuthService"
import "./Login.css"
import UnimelbLogo from "./images/RS-UnimelbLogo.svg"
import "bootstrap/dist/css/bootstrap.min.css"

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: null,
      password: null,
      showWarning: false
    }
  }

  verify = (username, password) => {

    AuthService.login(username, password).then((response) => {
      if(response){
        this.routeChange('home')
      } else{
        this.setState({showWarning: true})
      }
    }).catch((err) => {
      this.setState({showWarning: true})
    })
  }

  routeChange(code) {
    this.props.history.push(`/${code}`)
  }

  getPassword = (e) => {
    this.setState({
      password: e.target.value,
    })
  }

  getUsername = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <div className="nav">
          <img src={UnimelbLogo} />
          <div>
            <a className="root">
              <span className="glyphicon glyphicon-home" />
              The University of Melbourne
            </a>
            <span> / </span>
            <a className="root" title="Login">
              Login
            </a>
          </div>
        </div>
        <div id="title">
          <div>Login</div>
        </div>
        <div className="contentTitle">
          Login with your University of Melbourne username and password.
        </div>
        <div className="content">
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                placeholder="Enter Username"
                onChange={(e) => this.getUsername(e)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => this.getPassword(e)}
              />
            </Form.Group>
            { this.state.showWarning
              ? <Form.Text className="text-danger">
                  The username and password you entered is incorrect.
                </Form.Text>
              : <div></div>
            }
            
            <Button
              variant="success"
              // id="btn"
              onClick={() =>
                // eslint-disable-next-line react/destructuring-assignment
                this.verify(this.state.username, this.state.password)
              }
            >
              LOGIN
            </Button>{" "}
            <Button
                // id="btn"
                variant="info"
                onClick={() => this.routeChange("register")}>
              Register
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}
