        console.log('init MSAL - begin');

        // configuration to initialize msal
        const msalConfig = {
            auth: {
                clientId: b2cAppConfig.appId, //This is your client ID
                authority: `https://${b2cAppConfig.tenantName}.b2clogin.com/${b2cAppConfig.tenantName}.onmicrosoft.com/${b2cAppConfig.policyName}`, //This is your tenant info
                //redirectUri: "index.html",
                validateAuthority: false
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            }
        };

        console.log(msalConfig);
        // instantiate MSAL
        const myMSALObj = new Msal.UserAgentApplication(msalConfig);
      
        // request to signin - returns an idToken
        const loginRequest= {
            scopes: b2cAppConfig.b2cScopes
        };

        // request to acquire a token for resource access
        const tokenRequestApi = {
            scopes: b2cAppConfig.b2cScopesApi
        };
        const tokenRequestGraph= {
            scopes: b2cAppConfig.b2cScopesGraph
        };

        let accessToken;
        
        myMSALObj.handleRedirectCallback(authRedirectCallBack);

        function authRedirectCallBack(error, response) {
            msalLogMessage("authRedirectCallBack()")
            if (error) {
                msalLogMessage(error);
            } else {
                if (response.tokenType === "id_token") {
                    msalLogMessage("id_token acquired at: " + new Date().toString());                 
                    if (myMSALObj.getAccount()) {
                        var username = myMSALObj.getAccount().name;
                        msalLogMessage("username: " + username);
                    } else {
                        msalLogMessage("myMSALObj.getAccount() == null")
                    }
                } else if (response.tokenType === "access_token") {
                    msalLogMessage("access_token acquired at: " + new Date().toString());
                    accessToken = response.accessToken;
                } else {
                    msalLogMessage("token type is:" + response.tokenType);
                }
            }
        }

        // signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
        function msalSignInRedirect(callback) {
            msalLogMessage("msalSignInRedirect()");
            myMSALObj.loginRedirect(loginRequest);
        }

        function msalSignInPopup() {
            msalLogMessage("msalSignInPopup()");
            myMSALObj.loginPopup(loginRequest)
              .then(loginResponse => {
                console.log("id_token acquired at: " + new Date().toString());
                console.log(loginResponse);                
                if (myMSALObj.getAccount()) {
                  showWelcomeMessage(myMSALObj.getAccount());
                }
              }).catch(error => {
                console.log(error);
              });
          }
          
        //acquire a token silently
        function getToken(tokenRequest) {
            return myMSALObj.acquireTokenSilent(tokenRequest).catch(function(error) {
            console.log("aquire token popup");
            // fallback to interaction when silent call fails
            return myMSALObj.acquireTokenPopup(tokenrequest).then(function (tokenResponse) {
            }).catch(function(error){
                msalLogMessage("Failed token acquisition", error);
            });
        });
        }

        function getTokenPopup(request) {
            console.log(request)
            return myMSALObj.acquireTokenSilent(request)
              .then(response => {
                console.log(response);
                return response;
              })
              .catch(error => {
                console.log(error);
                console.log("silent token acquisition fails. acquiring token using popup");
                    
                // fallback to interaction when silent call fails
                  return myMSALObj.acquireTokenPopup(request)
                    .then(tokenResponse => {
                        console.log(response);
                        return tokenResponse;
                    }).catch(error => {
                      console.log(error);
                    });
              });
          }
          
        // signout the user
        function msalSignOut() {
            // Removes all sessions, need to call AAD endpoint to do full logout
            msalLogMessage("msalSignOut()")
            myMSALObj.logout();
        }

        // debug helper
        function msalLogMessage(s) {
            console.log(s);
            //document.body.querySelector('.response').appendChild(document.createTextNode('\n' + s));
        }
        function msalGetUserName() {
            if (myMSALObj.getAccount()) {
                var username = myMSALObj.getAccount().name;
                //msalLogMessage("username: " + username);
                return username;
            } else {
                msalLogMessage("no username");
                return null;
            }
        }

        function seeProfile() {
            if (myMSALObj.getAccount()) {
              getTokenPopup(tokenRequestGraph)
                .then(response => {
                  callRestEndpoint(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
                }).catch(error => {
                  console.log(error);
                });
            }
          }

          function callApi() {
            if (myMSALObj.getAccount()) {
              getTokenPopup(tokenRequestApi)
                .then(response => {
                  callRestEndpoint(b2cAppConfig.webApi, response.accessToken, updateUI);
                }).catch(error => {
                  console.log(error);
                });
            }
          }

        function callRestEndpoint(endpoint, token, callback) {
            const headers = new Headers();
            const bearer = `Bearer ${token}`;          
            headers.append("Authorization", bearer);          
            const options = {
                method: "GET",
                headers: headers
            };
          
            console.log(`request made to ${endpoint} API at: ` + new Date().toString());
            
            fetch(endpoint, options)
              .then(response => response.json())
              .then(response => callback(response, endpoint))
              .catch(error => callback(error, endpoint))
          }
                    
        console.log('init MSAL - end');
