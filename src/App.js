import React,{Component} from "react";
import Amplify,{ Auth, Hub } from 'aws-amplify';
import Button from '@material-ui/core/Button';
import logo from "./logo.svg";
import awsmobile from "./aws-exports";
import { Input,TextField } from '@material-ui/core';

// import api urls and api gateway protected key
import {environement_values as env} from "./environment";

// your Cognito Hosted UI configuration
const oauth = {
"domain": "cmpe172506f9cfb-506f9cfb-newdevenv.auth.us-east-1.amazoncognito.com",
"scope": [
    "phone",
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
],
"redirectSignIn": "http://localhost:3000/",
"redirectSignOut": "http://localhost:3000/",
"responseType": "code"
};

Amplify.configure(awsmobile);
Auth.configure({ oauth });
// Code Reference:-  https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend
class App extends Component {

  constructor(props){
    super(props);

    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data,error:null });
          break;
        case "signOut":
          this.setState({ user: null,error:null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });
    this.state = { user: null, customState: null, email:null, password:null, confirmationCode: null, userConfirmed:false,error:null };

  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        if (user.attributes){
          if(user.attributes.email_verified){
            this.setState({user:user,userConfirmed:true});
          }
        }
        else this.setState({ user });
        this.readUserData();
      })
      .catch(() => console.log("Not signed in"));

  }

  signInUser=async()=>{
      const username = this.state.email;
      const password = this.state.password;
      if(!this.validateUserInput()) return;
      try {
          const user = await Auth.signIn(username, password);
          console.log(user);
          this.setState({user:user,userConfirmed:true,error:null});
          this.readUserData();
      } catch (error) {
          console.log('error signing in', error);
          this.setState({error:error});
          if(error.code === "UserNotConfirmedException"){
            this.setState({userConfirmed:false});
          }
      }
  }

    //This function reads data from the dynamodb
    //output we be used to display on frontend
    //url taken out because of security reasons
    readUserData = async()=>{
        const username = this.state.user.username;
        const data = { "username": username };
        try{
            let xhr = new XMLHttpRequest();
            await xhr.open("POST",env.API_QUERY_WITH_USERNAME_URL, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("X-API-Key", env.API_GATEWAY_KEY);
            xhr.send(JSON.stringify({ "username": username}));
            xhr.addEventListener("readystatechange", ()=> {
                if(xhr.readyState == 4){
                    console.log(JSON.parse(xhr.responseText));
                }
            });
        } catch (error) {
            console.log('error getting data', error);
        }
    }

  signOut= async()=>{
    try {
        await Auth.signOut({ global: true });
        this.setState({user:null,error:null,email:null,password:null,userConfirmed:false,confirmationCode:null});
    } catch (error) {
        console.log('error signing out: ', error);
        this.setState({error:error});
    }
}

signUp=async()=>{
  // user name and email needs to be same
  //cognito pool use email as username in the backend config
    const username = this.state.email;
    const password = this.state.password;
    if(!this.validateUserInput()) return;
    try {
        const user = await Auth.signUp({
            username,
            password,
            attributes: {
                // optional
                // other custom attributes 
            }
        });
        console.log({ user });
        this.setState({user,error:null});
    } catch (error) {
        console.log('error signing up:', error);
        this.setState({error:error});
        //UsernameExistsException
    }
}
  
confirmSignUp = async()=>{
  try {
    const user = await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
    console.log("confirmation result", user);

    // clear everything, as we want user to sign in with credentials
    this.setState({user:null,error:null,email:null,password:null,userConfirmed:false,confirmationCode:null});
  } catch (error) {
      console.log('error confirming sign up', error);
      this.setState({error:error});
  }
}

handleEmailInput=(event)=>{
  this.setState({email:event.target.value});
}

handlePasswordInput=(event)=>{
  this.setState({password:event.target.value});
}

handleConfirmationCode=(event)=>{
  this.setState({confirmationCode: event.target.value});
}

validateUserInput = ()=>{
  if(!this.state.email || !this.state.password){
    this.setState({error:{message:"Email/Password can not be empty"}});
    return false;
  }
  return true;
}

resendConfirmationCode=async()=>{
  try {
      await Auth.resendSignUp(this.state.email);
      console.log('code resent succesfully');
  } catch (error) {
      console.log('error resending code: ', error);
      this.setState({error:error});
  }
}

  render() {
    const { user } = this.state;

    return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}>
        <img src={logo} height="100"></img>
        {/* // if user is not logged in */}
          {!this.state.user && 
            <>
              <Input onChange={this.handleEmailInput} placeholder="email"></Input>
              <br></br>
              <Input onChange={this.handlePasswordInput} type="password" placeholder="password"></Input>
              <br></br>
              <div>
                <Button color="primary" style={{margin: 20}} variant="contained" onClick={() => this.signInUser()}>Sign In </Button>
                <Button color="primary" variant="contained" onClick={() => this.signUp()}>Sign Up </Button>
              </div>
            </>
          }
          {/* if user is logged in  and confirmed*/}
          {
            this.state.user && this.state.userConfirmed &&
              <>
                <div>Welcome to CMPE 172 Project!</div>
                <Button color="primary" variant="contained" onClick={() => this.signOut()}>Sign Out</Button>
              </>
          }
          {/* user has signed up but did not confirmed yet */}
          {
            this.state.user && !this.state.userConfirmed &&
              <>
                <Input onChange={this.handleConfirmationCode} placeholder="Confirmation Code"></Input>
                <br></br>
                <Button color="primary" variant="contained" onClick={() => this.confirmSignUp()}>Confirm Code</Button>
                <br></br>
                <Button color="primary" variant="contained" onClick={() => this.resendConfirmationCode()}>Resend Confirmation Code Code</Button>
              </>
          }
          {/* if there is any error */}
          {  
            this.state.error &&
              <>
                <br></br>
                <TextField disabled color="secondary" value={this.state.error.message}></TextField>
              </>
          }
      </div>
    );
  }
}

export default App;