import axios from 'axios';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

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
        const retrievedObject = sessionStorage.getItem('userInfo');
        if (retrievedObject != null) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate() {
        const { toBePushed } = this.props;
        if (toBePushed !== "") {
            this.props.resetToBePushed();
            this.props.history.push(toBePushed);
        }
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
            [`${name}Error`]: false,
        });
    };

    LogInPage = () => {
        const re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
        if (this.state.username.match(re) === null) {
            this.props.setSnackbarMsg("Username must contain only english letters and numbers!", "error");
            this.setState({
                usernameError: true,
                username: "",
            });
            return;
        }
        axios.post("/user/login", {
            username: this.state.username,
            password: this.state.password,
            updateTime: Date.now(),
        }).then((res) => {
            if (res.data === 'User not found!') {
                this.props.setSnackbarMsg(res.data, "error");
                this.setState({
                    usernameError: true,
                    password: "",
                    username: "",
                });
            } else if (res.data === 'Password is wrong!') {
                this.props.setSnackbarMsg(res.data, "error");
                this.setState({
                    passwordError: true,
                    password: "",
                });
            } else if (res.data === 'Log in successfully!') {
                sessionStorage.clear();
                const userInfo = {
                    username: this.state.username,
                };
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                this.props.setSnackbarMsg(res.data, "success");
                this.props.updateUsername(this.state.username);
                this.props.history.push('/');
            } else {
                this.props.setSnackbarMsg(res.data, "error");
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    SignUpPage = () => {
        this.props.history.push('/signup');
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (this.state.username === "") {
                this.props.setSnackbarMsg("Username cannot be empty!", "error");
                this.setState({ usernameError: true });
            } else if (this.state.password === "") {
                this.props.setSnackbarMsg("Password cannot be empty!", "error");
                this.setState({ passwordError: true });
            } else {
                this.LogInPage(e);
            }
        }
    };

    render() {
        return (
            <Card open style={{ marginTop: 80 }}>
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
                    <Button onClick={this.SignUpPage} color="secondary" style={{ textTransform: "none" }}>
                        Sign up
                    </Button>
                    <Button variant="raised" onClick={this.LogInPage} color="primary" style={{ textTransform: "none" }}>
                        Log in
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default Login;
