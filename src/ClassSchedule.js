import React, { Component } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import {environement_read_values as env_read} from "./environment";
import {environement_write_values as env_write} from "./environment";
import { TextField } from '@material-ui/core';

class ClassSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null, 
            display: false,
            userMessage : {status:"Message",message:"Fetching Schedule..."}, // display friendly message or errors to user while adding classes to cart
            classes: [], // user schedule classes
        }; 
    }

    //This function reads data from the dynamodb
    //output we be used to display on frontend
    //url taken out because of security reasons
    readUserData = async () => {
        const data = {"username": this.props.username};
        try {
            let xhr = new XMLHttpRequest();
            await xhr.open("POST", env_read.API_QUERY_WITH_USERNAME_URL, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("X-API-Key", env_read.API_GATEWAY_KEY);
            xhr.send(JSON.stringify(data));
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    this.setState({user: data,display:true, classes: data.userAttributes.classes}, ()=>{
                        this.clearMessage(0);
                        this.props.saveUserDBInfo(data);
                    });
                }
            });
        } catch (error) {
            console.log('error getting data', error);
        }
    }

    async componentDidMount() {
        await this.readUserData();
    }

    clearMessage=(timeout)=>{
           setTimeout(()=>{
            this.setState({userMessage:{status:"",message:""}});
        },timeout);
    }

    dropClassHandler=(dropItem)=>{
        this.setState({userMessage:{status:"Message",message:"Dropping Class..."}})
        let existingUserClasses = this.state.user.userAttributes.classes;
        let remove_index = 0;
        existingUserClasses.map((value,index)=>{
            if(value.className === dropItem.className){
                remove_index = index;
                return;
            }
        });
        // remove class
        existingUserClasses.splice(remove_index,1);
        // send the updated classes to db to save
        this.saveToDb(existingUserClasses);
    }

    saveToDb=async (newSchedule)=>{
        try {
            let payload = this.state.user;
            // replace the current schedule in db object of classes with newSchedule
            payload.userAttributes.classes = newSchedule;
            let xhr = new XMLHttpRequest();
            await xhr.open("POST", env_write.API_QUERY_WITH_USERNAME_URL, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("X-API-Key", env_write.API_GATEWAY_KEY);
            xhr.send(JSON.stringify(payload));
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    console.log(JSON.parse(xhr.responseText));
                    this.setState({
                        classes:payload.userAttributes.classes, // write was success, hence we can update the comp. state to reflect new changes in schedule, saves extra read call
                        userMessage:{status:"Message",message:"Drop Successful."}
                    },()=>{
                        //callback
                        this.clearMessage(2000);
                    });
                }
            });
        } catch (error) {
            console.log('error getting data', error);
            this.setState({userMessage:{status:"Error",message:"Error Checking Out Your Items.Please Try after some time!"}
            },()=>{
                this.clearMessage(2000);
            });
        }
    };

    render() {

        let renderOutput = null;
        if (this.state.display) {
            const rows = this.state.classes || [] ;
            const name = this.state.user.userAttributes.request.userAttributes.email + "\'s" || "";
            renderOutput = (<>                      
                    <br/><br/>
                    <h1 style={{alignSelf: "center"}}>{name} Schedule</h1>
                    <TableContainer component={Card} style={{width: "500px", alignSelf: "center"}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Class Name</TableCell>
                                    <TableCell align="right">Professor Name</TableCell>
                                    <TableCell align="right">Class Time</TableCell>
                                    <TableCell align="right">Class Day</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">{row.className}</TableCell>
                                        <TableCell align="right">{row.professorName}</TableCell>
                                        <TableCell align="right">{row.classTime}</TableCell>
                                        <TableCell align="right">{row.classDay}</TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                color="secondary" 
                                                variant="contained" 
                                                onClick={()=>this.dropClassHandler(row)}
                                                >Drop</Button>
                                        </TableCell>                                   
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            );

        }
        return (
            <>
                <br></br>
                {  
                    this.state.userMessage.status &&
                        <TextField 
                        error = {this.state.userMessage.status === "Error"}
                        rowsMax={4}
                        multiline
                        label= {this.state.userMessage.status}
                        id="outlined-margin-normal"
                        disabled 
                        variant="outlined"
                        value={this.state.userMessage.message}
                        />
                }
                {renderOutput}
            </>
            );
    }
}
export default ClassSchedule;