import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import { TextField } from '@material-ui/core';
import {environement_write_values as env_write} from "./environment";

export default function Cart(props){

    // saves the cart items in state
    // this state will not hold when this component unmounts
    // we send the cart items state to HomeScreenNavigation via props.updateCart() method to save cart items globally
    const [cartItems, setCartItems] = useState(props.cartData);
    const [userMessage, setUserMessage] = useState({status:"",message:""});
    const baseUserMessage = userMessage ; // save the initial state

    // if user add more classes to cart, then update the cart items...
    useEffect(()=>{
        setCartItems(props.cartData);
    },[props.cartData]);

    // remove items from cart...
    const removeItemFromCart=(classToRemove)=>{
        console.log("item remove",classToRemove);
        let updateCartItems = cartItems;
        let indexToRemove = 0;
        updateCartItems.map((item,index)=>{
            if(item.className === classToRemove.className){
                indexToRemove = index ;
                return;
            }
        });
        updateCartItems.splice(indexToRemove,1);
        setCartItems(updateCartItems);
        // update the cart state in the HomeNavigation Component which will hold the Cart State Globally
        props.updateGlobalCartState(updateCartItems);
    };

    const saveToDb=async ()=>{
        setUserMessage({status:"Message",message:"Checking Out Items..."});
        try {
            const payload = props.userDBInfo;
            cartItems.map((row)=>{payload.userAttributes.classes.push(row)});
            let xhr = new XMLHttpRequest();
            await xhr.open("POST", env_write.API_QUERY_WITH_USERNAME_URL, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("X-API-Key", env_write.API_GATEWAY_KEY);
            xhr.send(JSON.stringify(payload));
            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    console.log(JSON.parse(xhr.responseText));
                    setUserMessage({status:"Message",message:"Check Out Successful. Your Schedule is Updated!"});
                        props.updateGlobalCartState([]);
                        setTimeout(()=>{
                            setUserMessage(baseUserMessage);
                        },2000);

                }
            });
        } catch (error) {
            console.log('error getting data', error);
            setUserMessage({status:"Error",message:"Error Checking Out Your Items.Please Try after some time!"});
        }
    };

    return(
        <>
            <br/><br/>
            <h1 style={{alignSelf: "center"}}>Your Cart</h1>
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
                        {cartItems.map((row) => (
                            <TableRow>
                                <TableCell component="th" scope="row">{row.className}</TableCell>
                                <TableCell align="right">{row.professorName}</TableCell>
                                <TableCell align="right">{row.classTime}</TableCell>
                                <TableCell align="right">{row.classDay}</TableCell>
                                <TableCell align="right">
                                    <Button 
                                        color="secondary" 
                                        variant="contained" 
                                        onClick={()=>removeItemFromCart(row)}
                                        >Remove </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            <Button disabled = {cartItems.length === 0} color="primary" variant="contained" onClick={saveToDb}>Check Out</Button>
            <br></br>
            {userMessage.status &&
                <TextField 
                    error = {userMessage.status === "Error"}
                    rowsMax={4}
                    multiline
                    label={userMessage.status}
                    id="outlined-margin-normal"
                    disabled 
                    variant="outlined"
                    value={userMessage.message}
                />
            }
        </>
    );
}