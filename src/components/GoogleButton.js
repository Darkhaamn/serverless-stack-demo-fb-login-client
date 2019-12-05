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

    const ga = window.gapi && window.gapi.auth2 ? 
      window.gapi.auth2.getAuthInstance() : 
      null;
    if (!ga) this.createScript();
  }

  createScript() {
    // load the Google SDK
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.onload = this.initGapi;
    document.body.appendChild(script);
  }

  signIn = () => {
    console.log(window.gapi)
    const ga = window.gapi.auth2.getAuthInstance();
    ga.signIn().then(
        googleUser => 
            this.getAWSCredentials(googleUser)
        ,
        error => {
            console.log(error);
        }
    );
  }

  
  handleError(error) {
    alert(error);
  }

  getAWSCredentials = (googleUser) => {
    console.log(googleUser)
    this.setState({ isLoading: true });
    const { id_token, expires_at } = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    let user = {
        email: profile.getEmail(),
        name: profile.getName()
    };
    
    
      const response = Auth.federatedSignIn(
        'google',
        { token: id_token, expires_at },
        user
    );

      response.then(res => {
        
        this.setState({ isLoading: false });
        this.props.onLogin(res)})
        .catch(err => {
          console.log(err)
          this.setState({ isLoading: false });
          this.handleError(err);
        })
      
  }

  initGapi() {
    // init the Google SDK client
    const g = window.gapi;
    g.load('auth2', function() {
        g.auth2.init({
            client_id: '829367953271-cib00mpuva1tjh2jfqcdfhcah7es9h74.apps.googleusercontent.com',
            // authorized scopes
            scope: 'profile email openid'
        });
    });
  }

  render() {
    return (
      <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        className="FacebookButton"
        text="Login with Google"
        onClick={this.signIn}
        disabled={this.state.isLoading}
      />
    );
  }
}


