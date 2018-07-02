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
            username: "",
            password: "",
            usernameError: false,
            passwordError: false,
        };
        document.title = "Log In";
        var retrievedObject = sessionStorage.getItem('userInfo');
        if (retrievedObject != null) {
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
            usernameError: false,
            passwordError: false,
        });
    };

    LogInPage = e => {
        var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
        if (this.state.username.match(re) === null) {
            this.props.setSnackbarMsg("Username must contain only english letters and numbers!");
            this.setState({
                usernameError: true,
                username: ""
            });
            return;
        }
        axios.post("/user/login", {
            username: this.state.username,
            password: this.state.password,
            updateTime: Date.now()
        })
        .then(res => {
            if (res.data === 'User not found!') {
                this.props.setSnackbarMsg(res.data);
                this.setState({
                    usernameError: true,
                    password: "",
                    username: ""
                });
            }
            else if (res.data === 'Password is wrong!') {
                this.props.setSnackbarMsg(res.data);
                this.setState({
                    passwordError: true,
                    password: "",
                });
            }
            else {
                sessionStorage.clear();
                var userInfo = {
                    username: this.state.username 
                };
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                this.props.setSnackbarMsg('Log in successfully!');
                this.props.updateUsername(this.state.username);
                this.props.history.push('/');
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
            username: "Guest"
        };
        sessionStorage.setItem('Guest', JSON.stringify(userInfo));
        this.props.history.push('/');
    }

    handleKeyPress = e => {
        if (e.key == "Enter") {
            if (this.state.username == "") {
                this.props.setSnackbarMsg("Username cannot be empty!")
                this.setState({usernameError: true});
            }
            else if (this.state.password == "") {
                this.props.setSnackbarMsg("Password cannot be empty!")
                this.setState({passwordError: true});
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
                    <TextField error={this.state.usernameError} margin="dense" id="username" label="Username" type="username" autoFocus
                    value={this.state.username} onChange={this.handleChange('username')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardContent>
                    <TextField error={this.state.passwordError} margin="dense" id="password" label="Password" type="password"
                    value={this.state.password} onChange={this.handleChange('password')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardActions>
                    <Button onClick={this.SignUpPage} color="secondary" style={{textTransform: "none"}}>
                        Sign up
                    </Button>
                    <Button variant="raised" onClick={this.LogInPage} color="primary" style={{textTransform: "none"}}>
                        Log in
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default Login;
