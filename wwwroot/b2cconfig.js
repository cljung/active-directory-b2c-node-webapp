console.log('b2cconfig.js - begin');
// The current application coordinates were pre-registered in a B2C tenant.
var b2cAppConfig = {
    b2cScopes: ["profile"],
    b2cScopesApi: ["https://yourtenant.onmicrosoft.com/cljung-jwtms-demo-api/demo.read"],
    b2cScopesGraph: ["https://graph.microsoft.com/User.Read"],
    webApi0: "https://your-api.azurewebsites.net/hello",
    webApi: "http://localhost:5000/hello",
    appId: "...giud",
    tenantName: "yourtenant", // excl .onmicrosoft.com
    policyName: "b2c_1a_signup_signin"
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
  };