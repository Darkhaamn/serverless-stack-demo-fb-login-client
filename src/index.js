import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import config from "./config";
import "./index.css";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: 'authdemodarkhaa.auth.us-east-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://localhost:3000/login ',
      redirectSignOut: 'https://localhost:3000',
      responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
