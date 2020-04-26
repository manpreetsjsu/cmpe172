import React,{Component} from "react";
import { Auth, Hub } from 'aws-amplify';
import Button from '@material-ui/core/Button';
import logo from "./logo.svg";

// Code Reference:-  https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend
class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        this.setState({ user });
      })
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;

    return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}>
        {/* // if user is not logged in */}
          {!this.state.user && 
          <>
          <img src={logo} height="100"></img>
          <Button color="primary" variant="contained" onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Sign In With Google</Button>
          </>
          }
          {/* if user is logged in */}
          {
            <div>Welcome to CMPE 172 Project!</div>
          }
      </div>
    );
  }
}

export default App;