import React , {Component} from 'react';
import CourseGrid from  "./CourseGrid";
import SearchBar from './SearchBar';
import { Input,TextField } from '@material-ui/core';
export default class CourseSearch extends Component{

constructor(props){
    super(props);

    // saves the cart items in state
    // this state will not hold when this component unmounts
    // hence we send the cart items state to HomeScreenNavigation via props.saveCartItems() method to save cart items globally
    this.state={
        "cartItems":this.props.currentItemsInCart, // sync global Cart State from parent Comp
        // save state of course searched by user in SearchBar.js, pass down to CourseGrid to filter results
        "selectedCourse" : {className:"",sections:[]}, // initially no class is filtered , hence show all classes to user
        userMessage : {status:"",message:""}, // display friendly message or errors to user while adding classes to cart
        currentUserDBInfo: this.props.currentUserDBInfo, 
    }
    this.initialState = this.state;
}

 // gets section added to cart by user 
addToCart=(section,selectedCourseByUser)=>{
    //console.log("class to add", this.state.selectedCourse.className);
    //console.log("section to add", section);
    let cartItems = this.state.cartItems ;

    // check if class is already enrolled or in cart already
    if (!this.validate(selectedCourseByUser)) return;

    cartItems.push(
        {
            "className":selectedCourseByUser.className,
            "professorName" : section.professorName,
            "classTime": section.classTime,
            "classDay": section.classDay
        }
    );
    this.setState({cartItems},()=>{
        console.log("Cart Updated ", this.state.cartItems);
        // save cart state globally in HomeScreenNavigation.js
        this.props.updateGlobalCartState(this.state.cartItems);
        this.setState({userMessage:{status:"Message",message: "" + selectedCourseByUser.className + " is added to your cart." }});
        setTimeout(()=>{
            this.setState({userMessage:this.initialState.userMessage});
        },2000);
    });
};

    validate = (selectedCourseByUser)=>{
        let isClassAlreadyEnrolled = false;
        // check if class is already enrolled by user
        this.state.currentUserDBInfo.userAttributes.classes.map((row)=>{
            if(row.className === selectedCourseByUser.className){
                isClassAlreadyEnrolled = true;
                return;
            }
        });

        if(isClassAlreadyEnrolled){
            this.setState({userMessage:{status:"Error",message: "Class is already enrolled in your schedule. Please Drop it first to continue"}});
            setTimeout(()=>{
                this.setState({userMessage:this.initialState.userMessage});
            },2000);
            return false;
        }
        // check if class is already in cart
        let isSameClassAddedAlready = false;
        this.state.cartItems.map(value=>{
            if(value.className === selectedCourseByUser.className){
                isSameClassAddedAlready = true;
                return;
            }
        });
        
        if(isSameClassAddedAlready){
            this.setState({userMessage:{status:"Error",message: "You can Not add more than 1 section of Same Class in Cart"}});
            setTimeout(()=>{
                this.setState({userMessage:this.initialState.userMessage});
            },2000);
            return false;
        }
        return true;
    }

    // when user filter or search for particular class, get that selected class and send to <CourseGrid> for filtering
    handleUserSearchSelection =(selectedCourse)=>{
        console.log(selectedCourse);
        if(selectedCourse === null){
            this.setState({selectedCourse : this.initialState.selectedCourse});
        }
        else{
            this.setState({selectedCourse:selectedCourse});
        }
    };

    render(){
        const status = this.state.userMessage.status;
        return(
            <>  
                <br></br><br></br>
                <SearchBar handleUserSearchSelection= {this.handleUserSearchSelection} availableClasses={availableClasses}></SearchBar>
                {/* display messages or error to user */}
                <br></br>
                {this.state.userMessage.status &&
                    <TextField 
                        error = {status === "Error"}
                        rowsMax={6}
                        multiline
                        label={this.state.userMessage.status}
                        id="outlined-margin-normal"
                        disabled 
                        variant="outlined"
                        value={this.state.userMessage.message}
                    />
                }
                <br></br><br></br>
                <CourseGrid selectedCourse={this.state.selectedCourse} addToCart={this.addToCart}></CourseGrid>
            </>
        );
    }

}

const availableClasses= 
    [
        {   
            className: "CMPE 172", 
            sections: [
            {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Jake Taylor"},
            {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kane Lyke"},
            {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Kite Phan"} 
            ]
        },
        {   
            className: "CMPE 188", 
            sections: [
            {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Goal Bair"},
            {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Colman Lie"},
            {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Snow Lane"} 
            ]
        },
        {   
            className: "CMPE 102", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Kayle Bair" },
                {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kyla Nay"},
                {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Jon Snow"} 
            ]
        },

        {   
            className: "CS 49J", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Kayle Bair" },
                {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kyla Nay"},
                {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kyla Nay"},

            ]
        },
        {   
            className: "CS 149", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Benjamin Reed" },
                {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kong Li"},
                {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "William Andreapolous"},

            ]
        },
        {   
            className: "CS 159", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Robert Chun" },
            ]
        },
        {   
            className: "CMPE 187", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Badari Eswar" },
            ]
        },
        {   
            className: "CMPE 148", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Frank Lin" },
                {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Rod Fatoohi"},

            ]
        },

    ];