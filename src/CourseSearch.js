import React , {Component} from 'react';
import CourseGrid from  "./CourseGrid";
import SearchBar from './SearchBar';

export default class CourseSearch extends Component{

constructor(props){
    super(props);
    this.state={
        "cartItems":[],
        "selectedCourse" : {   
            className: "Search For Classes", 
            professorName: "", 
            sections: []
        }
    }
    this.initialState = this.state;
}

/**
 *           {
                    "className": "CMPE 172",
                    "professorName": "Babu Thomas",
                    "classTime": "6:00PM-8:45PM",
                    "classDay": "Mon-Wed"
                },
 */
addToCart=(section)=>{
    //console.log("class to add", this.state.selectedCourse.className);
    //console.log("section to add", section);
    let cartItems = this.state.cartItems ;
    let isSameClassAddedAlready = false;
    cartItems.map(value=>{
        if(value.className === this.state.selectedCourse.className){
            isSameClassAddedAlready = true;
            console.log(" Can Not Add More than 1 section of Same Class");
            return;
        }
    });
    if(isSameClassAddedAlready) return ; //exit here
    cartItems.push(
        {
            "className":this.state.selectedCourse.className,
            "professName" : section.professorName,
            "classTime": section.classTime,
            "classDay": section.classDay
        }
    );
    this.setState({cartItems},()=>{console.log("Cart Updated ", this.state.cartItems)});
};

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
        return(
            <>
                <SearchBar handleUserSearchSelection= {this.handleUserSearchSelection}></SearchBar>
                <br></br><br></br>
                <CourseGrid selectedCourse={this.state.selectedCourse} addToCart={this.addToCart}></CourseGrid>
            </>
        );
    }

}