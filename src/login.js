import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button} from '@material-ui/core';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field_user: "",
            field_pwd: "",
            error: false
        };
        document.title = "Log In";
    }
    componentWillMount = () => {
        var retrievedObject = sessionStorage.getItem('userInfo');
        if(retrievedObject != null) {
            window.alert(retrievedObject + '\n redirect to Main...');
            var username = JSON.parse(retrievedObject)['username'];
            this.props.history.push('/main');
        }
    };
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            error: false
        });
    };
    LogInPage = e => {
        var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
        if (this.state.field_user.match(re) === null) {
            window.alert('Username must contain only english and number!');
            this.setState({
                error:true,
                field_user: ""
            });
            return;
        }
        // send data by axios "/user/login"
        axios.post("/user/login", {
            username: this.state.field_user,
            password: this.state.field_pwd,
            updateTime: Date.now()
        })
        .then(res => {
            if (res.data != 'user not found') {
                sessionStorage.clear();
                var userInfo = {
                    "username": this.state.field_user 
                };
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                window.alert(userInfo['username']+': Log In Successfully!');
                this.props.history.push('/main');
            }
            else {
                window.alert(res.data);
                this.setState({
                    error: true,
                    field_pwd: "",
                    field_user: ""
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    SignUpPage = e => {
        this.props.history.push('/signup');
    }

    GuestLogIn = e => {
        var userInfo  = {
            "username": "GUEST"
        };
        sessionStorage.setItem('GUEST', JSON.stringify(userInfo));
        window.alert(userInfo['username']+': Log In Successfully!');
        this.props.history.push('/main');
    }

    handleKeyPress = e => {
        if (e.key == "Enter") {
            if (this.state.field_user == "") {
                window.alert("Username cannot be empty!")
            }
            else if (this.state.field_pwd == "") {
                window.alert("Password cannot be empty!")
            }
            else {
                this.LogInPage(e);
            }
        }
    };

    render() {
        return (
            <Dialog open style={{backgroundImage:'url("/assets/login.jpg")', backgroundSize:"cover"}} fullScreen={this.props.fullScreen}>
                <DialogTitle> Log In </DialogTitle>
                <DialogContent>
                    <DialogContentText> Please Enter Your Name </DialogContentText>
                    <TextField error={this.state.error} margin="dense" id="username" label="name" type="username" autoFocus
                    value={this.state.field_user} onChange={this.handleChange('field_user')} onKeyPress={this.handleKeyPress} fullWidth />
                </DialogContent>
                <DialogContent>
                    <DialogContentText> Please Enter Your Password </DialogContentText>
                    <TextField error={this.state.error} margin="dense" id="password" label="password" type="password"
                    value={this.state.field_pwd} onChange={this.handleChange('field_pwd')} onKeyPress={this.handleKeyPress} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.GuestLogIn} color="secondary"> Guest </Button>
                    <Button onClick={this.SignUpPage} color="secondary"> Sign Up </Button>
                    <Button onClick={this.LogInPage} color="primary"> Log In </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Login;
