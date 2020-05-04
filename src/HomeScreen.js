import react, { Component } from "react";
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import {environement_read_values as env_read} from "./environment";
import {environement_write_values as env_write} from "./environment";
import {Auth} from "aws-amplify";

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {user: null, display: false};
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
                    this.setState({user: data}, ()=>{
                         this.writeUserData();
                    });
                }
            });
        } catch (error) {
            console.log('error getting data', error);
        }
    }

    writeUserData = async () => {
        const data= this.state.user;
        data.userAttributes.classes = [
                {
                    "className": "CMPE 172",
                    "professorName": "Babu Thomas",
                    "classTime": "6:00PM-8:45PM",
                    "classDay": "Mon-Wed"
                },
                {
                    "className": "CMPE 195F",
                    "professorName": "Rod Fatoohi",
                    "classTime": "6:00PM-8:45PM",
                    "classDay": "Wed"
                },
                {
                    "className": "CS 174",
                    "professorName": "Fabio",
                    "classTime": "3:00PM-4:15PM",
                    "classDay": "Tues-Thurs"
                }
            ];
        try {
            let xhr = new XMLHttpRequest();
            await xhr.open("POST", env_write.API_QUERY_WITH_USERNAME_URL, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("X-API-Key", env_write.API_GATEWAY_KEY);
            xhr.send(JSON.stringify(data));
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    console.log(JSON.parse(xhr.responseText));
                    this.setState({display: true});
                }
            });
        } catch (error) {
            console.log('error getting data', error);
        }
    }

    async componentDidMount() {
        await this.readUserData();
    }

    render() {


        let renderOutput = null;
        if (this.state.display) {
            const rows = this.state.user.userAttributes.classes;
            renderOutput = (<>
                    <div style={{alignSelf: "normal"}}>
                        <AppBar position="static">
                            <Toolbar>

                                <Typography variant="h6">
                                    <Button color="inherit" onClick={() => this.props.signOut()}>My Schedule</Button>
                                </Typography>
                                <Button color="inherit" style={{marginLeft: "80%"}}
                                        onClick={() => this.props.signOut()}>SIGN OUT</Button>
                            </Toolbar>
                        </AppBar>
                    </div>
                    <br/><br/>
                    <h1 style={{alignSelf: "center"}}>Sar's Schedule</h1>
                    <TableContainer component={Card} style={{width: "500px", alignSelf: "center"}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Class Name</TableCell>
                                    <TableCell align="right">Professor Name</TableCell>
                                    <TableCell align="right">Class Time</TableCell>
                                    <TableCell align="right">Class Day</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow>
                                        <TableCell component="th" scope="row">{row.className}</TableCell>
                                        <TableCell align="right">{row.professorName}</TableCell>
                                        <TableCell align="right">{row.classTime}</TableCell>
                                        <TableCell align="right">{row.classDay}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            );

        }
        return (renderOutput);
    }
}
export default HomeScreen;