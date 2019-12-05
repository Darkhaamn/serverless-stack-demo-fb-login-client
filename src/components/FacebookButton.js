import React, { Component } from "react";
import { Auth, Cache } from "aws-amplify";
import LoaderButton from "./LoaderButton";

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = response => {
    console.log(response);
    if (response.status === "connected") {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.FB.login(this.checkLoginState, {scope: "public_profile,email"});
  };

  handleError(error) {
    alert(error);
  }

  async handleResponse(data) {
    console.log(data)
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    const fb = window.FB;
    fb.api('/me', { fields: 'name, email' }, response => {
      console.log(response)
    });

    this.setState({ isLoading: true });
    console.log(user, token)
    try {
      const response = await Auth.federatedSignIn(
        "facebook",
        { token, expires_at },
        user
      );
      console.log(response);
      this.setState({ isLoading: false });
      this.props.onLogin(response);
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    return (
      <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        className="FacebookButton"
        text="Login with Facebook"
        onClick={this.handleClick}
        disabled={this.state.isLoading}
      />
    );
  }
}
