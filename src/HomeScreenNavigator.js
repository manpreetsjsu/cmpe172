import React,{Component} from 'react';
import ClassSchedule from './ClassSchedule';
import CourseSearch from './CourseSearch';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cart from './Cart';

// Navigaton for homescreen
// saves Cart Items in State...
export default class HomeScreenNavigator extends Component{

    constructor(props){
        super(props);

        // Global State keeping info about all components such as Cart items and userDBInfo
        this.state={
            displayUserSchedule: true,
            displaySearchClasses: false,
            displayCart : false,
            cartItems:[], // save cart items globally in this state as long as user is logged in
            userDBInfo: null, // reterive it from class schedule component as it renders first time and makes read call to db
        };

        this.initialState = this.state; // save the base state
    }

    saveCartItems=(items)=>{
        // may be also save these as potential_cart_items in DB 
        this.setState({cartItems:items},()=>console.log("Global Cart Updated",items));
    }

    displaySearchClasses=()=>{
        this.setState({displaySearchClasses:true,displayUserSchedule:false,displayCart:false});
    }
    displayUserSchedule=()=>{
        this.setState({displaySearchClasses:false,displayUserSchedule:true,displayCart:false});
    }

    displayCart=()=>{
        this.setState({displaySearchClasses:false,displayUserSchedule:false,displayCart:true});
    }


    // reterieves userDB info from class Schedule component since it makes a read call to db
    saveUserDBInfo=(userDBInfo)=>{
        this.setState({userDBInfo});
    };
    render(){
        let currentRenderScreen = null;
        // true by default
        if(this.state.displayUserSchedule){
            currentRenderScreen = <ClassSchedule {...this.props} saveUserDBInfo={this.saveUserDBInfo} ></ClassSchedule> ;
        }
        else if(this.state.displaySearchClasses){
            currentRenderScreen = <CourseSearch 
                                    currentItemsInCart={this.state.cartItems} 
                                    updateGlobalCartState={(items)=>this.saveCartItems(items)}
                                    currentUserDBInfo = {this.state.userDBInfo}
                                />
                                    
        }
        else {
            currentRenderScreen = (
            <Cart 
                cartData={this.state.cartItems} 
                updateGlobalCartState={(items)=>this.saveCartItems(items)}
                userDBInfo={this.state.userDBInfo} >
            </Cart>
            );
        }

        return(
            <>
            <div style={{alignSelf: "normal"}}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            <Button color="inherit" onClick={this.displayUserSchedule}>My Schedule</Button>
                        </Typography>
                        <br></br>   
                        <Typography variant="h6">
                            <Button color="inherit" onClick={this.displaySearchClasses}>Search/Add Classes</Button>
                        </Typography>
                        <Typography variant="h6">
                            <Button color="inherit" onClick={this.displayCart}>Your Cart</Button>
                        </Typography>
                        <Button color="inherit" style={{marginLeft: "80%"}}
                                onClick={() => this.props.signOut()}>SIGN OUT</Button>
                    </Toolbar>
                </AppBar>
            </div>

            {currentRenderScreen}
            </>
        );
    }
}