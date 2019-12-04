export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://5by75p4gn3.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_VyBnkZ7AU",
    APP_CLIENT_ID: "1rlban4okk1b9so358ot9k93v8",
    IDENTITY_POOL_ID: "us-east-1:bcd9f266-2558-4d18-9c9b-2584e37152c5"
  },
  social: {
    FB: "804681716658868"
  },
};