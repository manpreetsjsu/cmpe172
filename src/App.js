import React,{Component} from "react";
import Amplify,{ Auth, Hub } from 'aws-amplify';
import Button from '@material-ui/core/Button';
import logo from "./logo.svg";
import awsmobile from "./aws-exports";
import { Input,TextField } from '@material-ui/core';
import QRCode from 'qrcode.react';
// import api urls and api gateway protected key
import {environement_read_values as env} from "./environment";
import HomeScreenNavigator from  "./HomeScreenNavigator";

const VALIDATE_TOTP_INSTRUCTIONS = "Please Input Temporary One Time Password [TOTP] from your Google Authenticator App in your device "
                                    + " with which you have registered TOTP Account when you signed In first time."
const REGISTER_TOTP_ACCOUNT_INSTRUCTION  = "Please Set Up Multi-factor Authentication to Secure your account. "
                                + " Install Google Authenticator App on your device"
                                + " Scan the QR Code or enter code manually to register for new TOTP Account" 
                                + " Input the generated 6- Digit Code to verfiy and set up TOTP Account"

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
          break;
        default:
          break;
      }
    });
    this.state = { 
      user: null, 
      email:null, 
      password:null, 
      confirmationCode: null, 
      error:null,
      totp: null,
      messageToUser:null
     };

     // save the initial base state
     this.initialState = this.state;

  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({bypassCache:true})
      .then((user) => {
        console.log(user);
        this.setState({user:user});
      })
      .catch(() => console.log("Not signed in"));

  }

  // only used first time setting up MFA for user - when user sign IN first time into app
  // With your TOTP account in your TOTP-generating app (like Google Authenticator)
  // Use the generated one-time password to verify the setup
  confirmTotp=async(code)=>{
    this.setState({error:null,messageToUser: "Confirming Code..."});
    try{
      const result = await Auth.verifyTotpToken(this.state.user,this.state.totp);
      console.log("mFA set up result",result);
      await this.setPreferredMFA();
      // update the user as we updated preferred MFA to totp
      const updatedUser = await Auth.currentAuthenticatedUser({bypassCache:true});
      console.log("updated user",updatedUser);
      this.setState({user:updatedUser,error:null,messageToUser:null});
    }
    catch(e){
      console.log("Unable to verify totp ",e);
      this.setState({error:e,messageToUser:null});
    }

  };

  // after MFA is setup for user, user will always be required to enter totp from the app when signing in
  // after signing in user , this validate the user's totp with aws server 
  // Note - this is used after the user's tofp MFA has been set up 
  confirmSignInWithTotp=async()=>{
    this.setState({error:null,messageToUser: "Confirming Code..."});
    try {
      const user = await Auth.confirmSignIn(this.state.user, this.state.totp,this.state.user.challengeName);
      console.log("MFA validation result", user);
      // the above result does not contain preferredMFA attribute in the result, hence updating with below call
      // this is just kinda slow - temp fix
      let updatedUser = await Auth.currentAuthenticatedUser({bypassCache:true});
      console.log("update user with currentAuthenthenticated Call", updatedUser);
      this.setState({user:updatedUser,error:null,messageToUser:null});
     
  } catch (error) {
      console.log('error signing in', error);
      this.setState({error:error,messageToUser:null});
  }
  };

  // handler for recording totp input 
  handleTotp=(event)=>{
    this.setState({totp:event.target.value});
  };

  // sets up MFA for the user after the user signed in first time into the app
  setMultifactorauth=async()=>{
    try{
       const code = await Auth.setupTOTP(this.state.user);
       console.log(code);
       this.setState({code:code,error:null}); 
    }
    catch(e){
      console.log("unable to generate QR code for setting up MFA ",e);
      this.setState({error:e,messageToUser:null});
    }
  }

  // update the user object in the cognito telling that user has set up totp as MFA
  // next time user sign in, user will be asked for totp code 
  setPreferredMFA=async()=>{
    // don't forget to set TOTP as the preferred MFA method
    try{
      const data = await Auth.setPreferredMFA(this.state.user, 'TOTP');
      console.log(data);
      return data
    }
    catch(e){
      console.log(e);
      this.setState({error:e});
      return e;
    }
  }

  // validate user credentials with cognito
  signInUser=async()=>{
      this.setState({error:null,messageToUser: "Validating Credentials..."});
      const username = this.state.email;
      const password = this.state.password;
      if(!this.validateUserInput()) return;
      try {
          const user = await Auth.signIn(username, password);

          // user has not set up MFA, this means user is signing in first time after sign up
          if(user.preferredMFA === "NOMFA"){
            // generate QR code for the user to set up totp account in user's device's app such as google authenticator
            await this.setMultifactorauth();
          }
          console.log(user);
          this.setState({user:user,error:null,messageToUser:"Your Credentials Are Valid."});
         
      } catch (error) {
          console.log('error signing in', error);
          this.setState({error:error,messageToUser:null});
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
            xhr.send(JSON.stringify(data));
            xhr.addEventListener("readystatechange", ()=> {
                if(xhr.readyState === 4){
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
        this.setState(this.initialState);
    } catch (error) {
        console.log('error signing out: ', error);
        this.setState({error:error,messageToUser:null});
    }
}

signUp=async()=>{
  // user name and email needs to be same
  //cognito pool use email as username in the backend config
    this.setState({error:null,messageToUser:"Signing Up..."});
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
        this.setState({user,error:null,messageToUser:"Sign Up Successful. Please Check your email for confirmation code."});
    } catch (error) {
        console.log('error signing up:', error);
        this.setState({error:error,messageToUser:null});
        //UsernameExistsException can happen - not catching it
    }
}
  
confirmSignUp = async()=>{
  this.setState({error:null,messageToUser:"Confirming Code..."})
  try {
    const user = await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
    console.log("confirmation result", user);
    // clear everything, as we want user to sign in with credentials
    this.setState(this.initialState,()=>{
      this.setState({messageToUser:"Your Email is Confirmed. Please Log In!"});
    });
  } catch (error) {
      console.log('error confirming sign up', error);
      this.setState({error:error,messageToUser:null});
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
    this.setState({error:{message:"Email/Password can not be empty"},messageToUser:null});
    return false;
  }
  return true;
}

resendConfirmationCode=async()=>{
  this.setState({error:null,messageToUser:"Resending Code..."})
  try {
      await Auth.resendSignUp(this.state.email);
      this.setState({error:null,messageToUser:"Code Resent.Please Check Email"});
      console.log('code resent succesfully');
  } catch (error) {
      console.log('error resending code: ', error);
      this.setState({error:error,messageToUser:null});
  }
}

  render() {
    let renderOutput = null ;
    // user object exists
    if(this.state.user){
      // user is challenged to pass MFA
      if(this.state.user.challengeName === "SOFTWARE_TOKEN_MFA"){
          renderOutput = (
            <>
                <img src={logo} alt="" height="100"></img>
              <TextField
                id="standard-full-width"
                fullWidth
                variant="outlined"
                label="Instructions For TOTP"
                multiline
                variant="outlined"
                rowsMax={8}
                disabled
                value={VALIDATE_TOTP_INSTRUCTIONS}
              />
              <br></br><br></br>
              <Input variant="outlined" onChange={this.handleTotp} placeholder="Code From Your Device"></Input>
              <br></br><br></br>
              <Button color="primary" variant="contained" onClick={() => this.confirmSignInWithTotp()}>Confirm Code</Button>
            </>
          );
      }
      // user has not has not set up MFA... lets set it up ,, this will show QR code to user
      else if (this.state.user.preferredMFA === "NOMFA" ){

        renderOutput = (
          <>
              <img src={logo} alt="" height="100"></img>
            <TextField
              id="standard-full-width"
              label="Register TOTP Account in Device"
              multiline
              fullWidth
              variant="outlined"
              rowsMax={8}
              disabled
              value={REGISTER_TOTP_ACCOUNT_INSTRUCTION}
            />
            <Input onChange={this.handleTotp} placeholder="Code From Your Device"></Input>
            <br></br><br></br>
            <QRCode value={"otpauth://totp/AWSCognito:" + this.state.user.username + "?secret=" + this.state.code +"&issuer=aws"} />
              <br></br><br></br>
            <Button color="primary" variant="contained" onClick={() => this.confirmTotp()}>Confirm code</Button>
          </>
        );
      }

      // user email is not confirmed ,, lets confirm it 
      else if (this.state.user.userConfirmed === false ){
        renderOutput = (
          <>
              <img src={logo} alt="" height="100"></img>
            <br></br><br></br>
            <Input onChange={this.handleConfirmationCode} type="password" placeholder="Confirmation Code"></Input>
            <br></br>
            <Button color="primary" variant="contained" onClick={() => this.confirmSignUp()}>Confirm Code</Button>
            <br></br>
            <Button color="primary" variant="contained" onClick={() => this.resendConfirmationCode()}>Resend Confirmation Code</Button>
          </>
        );
      }

      // finaly if user has set MFA, we can allow him to access our app
      else if (this.state.user.preferredMFA === "SOFTWARE_TOKEN_MFA" && this.state.user.username ){
        renderOutput = (
          <>
            {/*  HomeScreen code goes Here... */}
            {/* <CourseSearch></CourseSearch>
            <Button color="primary" variant="contained" onClick={() => this.signOut()}>Sign Out</Button> */}
            <HomeScreenNavigator signOut={this.signOut} username={this.state.user.username}/>
          </>
        );
      }
    }

    // user is not signed in , no user object in state exists 
    else{
      renderOutput = (
        <>
            <img src={logo} alt="" height="100"></img>
        <Input onChange={this.handleEmailInput} placeholder="email"></Input>
        <br></br>
        <Input onChange={this.handlePasswordInput} type="password" placeholder="password"></Input>
        <br></br>
        <div>
          <Button color="primary" style={{margin: 20}} variant="contained" onClick={() => this.signInUser()}>Sign In </Button>
          <Button color="primary" variant="contained" onClick={() => this.signUp()}>Sign Up </Button>
        </div>
      </>
      );
    }

    return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
      }}>
        {renderOutput}          
          {/* if there is any error */}
          {  
            this.state.error &&
              <>
                <br></br>
                <TextField 
                error
                multiline
                rowsMax={3}
                label="Error"
                id="outlined-error-helper-text" 
                disabled 
                variant="outlined"
                value={this.state.error.message}
                />
              </>
          }
          {/* any message to user */}
          {  
            this.state.messageToUser &&
              <>
                <br></br>
                <TextField 
                rowsMax={4}
                multiline
                label="Message"
                id="outlined-margin-normal"
                disabled 
                variant="outlined"
                value={this.state.messageToUser}
                />
              </>
          }
      </div>
    );
  }
}

export default App;
