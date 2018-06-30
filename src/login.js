import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
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
        var retrievedObject = sessionStorage.getItem('userInfo');
        if (retrievedObject != null) {
            window.alert(retrievedObject + '\n Redirect to Main...');
            var username = JSON.parse(retrievedObject)['username'];
            this.props.history.push('/');
        }
    }

    componentDidUpdate() {
        var toBePushed = this.props.toBePushed;
        if (toBePushed !== "") {
            this.props.resetToBePushed();
            this.props.history.push(toBePushed);
        }
    }

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
                // window.alert(userInfo['username']+': Log In Successfully!');
                this.props.snackbarCb(userInfo['username']+': Log In Successfully!');
                this.props.updateUsername(this.state.field_user);
                this.props.history.push('/');
            }
            else {
                //window.alert(res.data);
                this.props.snackbarCb(res.data);
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
        //window.alert(userInfo['username']+': Log In Successfully!');
        this.props.snackbarCb(userInfo['username']+': Log In Successfully!');
        this.props.history.push('/');
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
            <Card open style={{marginTop: 80}}>
                <CardHeader title="Log in" />
                <CardContent>
                    <TextField error={this.state.error} margin="dense" id="username" label="name" type="username" autoFocus
                    value={this.state.field_user} onChange={this.handleChange('field_user')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardContent>
                    <TextField error={this.state.error} margin="dense" id="password" label="password" type="password"
                    value={this.state.field_pwd} onChange={this.handleChange('field_pwd')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardActions>
                    <Button onClick={this.GuestLogIn} color="secondary"> Guest </Button>
                    <Button onClick={this.SignUpPage} color="secondary"> Sign Up </Button>
                    <Button onClick={this.LogInPage} color="primary"> Log In </Button>
                </CardActions>
            </Card>
        );
    }
}

export default Login;
