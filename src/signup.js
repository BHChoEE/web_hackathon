import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            usernameError: false,
            passwordError: false,
        };
        document.title = "Sign Up";
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

    SignUpPage = e => {
        var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
        if (this.state.username.match(re) === null){
            this.props.setSnackbarMsg("Username must contain only english letters and numbers!");
            this.setState({
                usernameError: true,
                username: ""
            });
            return;
        }
        axios.post('/user/signup', {
            username: this.state.username,
            password: this.state.password,
            updateTime: Date()
        })
        .then(res => {
            console.log(res.data);
            if (res.data._message == null) {
                var username = res.data.username;
                this.props.setSnackbarMsg('Sign Up successfully!' + username);
                this.LogInPage();
            }
            else {
                this.props.setSnackbarMsg(res.data._message + ': Already used or invalid.');
                this.setState({
                    usernameError: true,
                    username: "",
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    LogInPage = e => {
        this.props.history.push('/login');
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
                this.SignUpPage(e);
            }
        }
    };

    render() {
        return (
            <Card open style={{marginTop: 80}}>
                <CardHeader title="Sign up" />
                <CardContent>
                    <TextField error={this.state.usernameError} margin="dense" id="username" label="Username" type="username" autoFocus
                    value={this.state.username} onChange={this.handleChange('username')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardContent>
                    <TextField error={this.state.passwordError} margin="dense" id="password" label="Password" type="password"
                    value={this.state.password} onChange={this.handleChange('password')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardActions>
                    <Button onClick={this.LogInPage} color="secondary" style={{textTransform: "none"}}>
                        Log in
                    </Button>
                    <Button variant="raised" onClick={this.SignUpPage} color="primary" style={{textTransform: "none"}}>
                        Sign up
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default SignUp;
