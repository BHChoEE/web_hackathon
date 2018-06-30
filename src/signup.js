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
            field_user: "",
            field_pwd: "",
            error: false
        };
        document.title = "Sign Up";
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

    SignUpPage = e => {
        var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
        if (this.state.field_user.match(re) === null){
            window.alert('Username must contain only english and number!');
            this.setState({
                error: true,
                field_user: ""
            });
            return;
        }
        axios.post('/user/signup', {
            username: this.state.field_user,
            password: this.state.field_pwd,
            updateTime: Date()
        })
        .then(res => {
            if (res.data._message == null) {
                var username = res.data.username;
                window.alert('Sign Up successfully!' + username);
                this.LogInPage();
            }
            else {
                window.alert(res.data._message + ': already used or invalid');
                this.setState({
                    error: true,
                    field_user: "",
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
            if (this.state.field_user == "") {
                window.alert("Username cannot be empty!")
            }
            else if (this.state.field_pwd == "") {
                window.alert("Password cannot be empty!")
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
                    <TextField error={this.state.error} margin="dense" id="username" label="Name" type="username" autoFocus
                    value={this.state.field_user} onChange={this.handleChange('field_user')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardContent>
                    <TextField error={this.state.error} margin="dense" id="password" label="Password" type="password"
                    value={this.state.field_pwd} onChange={this.handleChange('field_pwd')} onKeyPress={this.handleKeyPress} fullWidth />
                </CardContent>
                <CardActions>
                    <Button onClick={this.LogInPage} color="secondary">Return</Button>
                    <Button onClick={this.SignUpPage} color="primary">Confirm</Button>
                </CardActions>
            </Card>
        );
    }
}

export default SignUp;
