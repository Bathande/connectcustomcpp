import React, { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
// require('dotenv').config(); 
import awsmobile from '../aws-exports';

Amplify.configure(awsmobile);
const config = {
  identityPool: process.env.REACT_APP_COGNITO_IDENTITY_POOL,
  userPool: {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID
  }
}

function Validate(){
  // var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  // var params = {
  //   UserAttributes: [ /* required */
  //     {
  //       Name: 'STRING_VALUE', /* required */
  //       Value: 'STRING_VALUE'
  //     },
  //     /* more items */
  //   ],
  //   UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, /* required */
  //   Username: 'STRING_VALUE', /* required */
  //   ClientMetadata: {
  //     '<StringType>': 'STRING_VALUE',
  //     /* '<StringType>': ... */
  //   }
  // };

  // cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(data);           // successful response
  // });
  console.log("inside the function :",this.user)
}

const Signup = () => {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);
    useEffect(() => {
        const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
          switch (event) {
            
            case "signIn":
              setUser(data);
              break;
            case "signOut":
              setUser(null);
              break;
            case "customOAuthState":
              console.log("We are in here")
              setCustomState(data);
            case "signUp":
              console.log("Tuman")
              Auth.currentAuthenticatedUser()
              .then(currentUser => setUser(currentUser))
              .catch(() => console.log("Not signed in"));
              Validate()
            console.log("looking for event",event)
          }
        });
        
        Auth.currentAuthenticatedUser()
          .then(currentUser => setUser(currentUser))
          .catch(() => console.log("Not signed in"))
    
        return unsubscribe;
      }, []);

    return (
      <div>
      <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
      <button onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Facebook })}>Open Facebook</button>
      <button onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google })}>Open Google</button>
      <button onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Amazon })}>Open Amazon</button>
      <button onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Apple })}>Open Apple</button>
      <button onClick={() => Auth.signOut()}>Sign Out</button>
      <div>{user && user.getUsername()}</div>
        </div>
    );
}

export default Signup;
