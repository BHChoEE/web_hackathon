import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import Login from './login.js';
import SignUp from './signup.js';
import Main from './main.js'
import UserMenu from './userMenu.js';
import SimpleSnackbar from './snackbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            progress: false,
            drawerOpen: false,
            favoritePapers: {},
            toBePushed: "",
            snackbarOpen: false,
            snackbarMessage: "",
        };

        this.handleLogInOut = this.handleLogInOut.bind(this);
        this.handleToggleChecked = this.handleToggleChecked.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.resetToBePushed = this.resetToBePushed.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setSnackbarMsg = this.setSnackbarMsg.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    componentDidMount() {
        var username;
        var retrievedObject = sessionStorage.getItem('userInfo');
        if (retrievedObject == null) {
            username = "Guest";
        }
        else {
            retrievedObject = JSON.parse(retrievedObject);
            username = retrievedObject.username;
        }
        this.updateUsername(username);
    }

    handleLogInOut() {
        if (this.state.username !== "Guest") {
            // logout
            sessionStorage.clear();
            this.setState({
                username: "Guest",
                favoritePapers: {},
            });
        }
        this.setState({toBePushed: "/login"});
    }

    toggleDrawer = state => () => {
        this.setState({
            drawerOpen: state,
        });
    }

    handleToggleChecked = (title, paperId) => () => {
        var newFavoritePapers = {...this.state.favoritePapers};
        var action = '';
        if (newFavoritePapers[title] === undefined) {
            newFavoritePapers[title] = paperId;
            action = 'add';
        }
        else {
            delete newFavoritePapers[title];
            action = 'remove';
        }

        axios.post('/favorite/' + action, {
            title: title,
            paperId: paperId,
            username: this.state.username
        })
        .then(res => {
            this.setState({favoritePapers: newFavoritePapers});
        })
        .catch(error => {
            console.log(error);
        });
    }

    resetToBePushed() {
        this.setState({toBePushed: ""});
    }

    updateUsername(username) {
        this.setState({username: username}, () => {
            // if username not Guest, load back all favorite paper to favoritePapers
            if (this.state.username != "Guest") {
                axios.post('/favorite/all', {
                    username: this.state.username
                })
                .then(res => {
                    var newFavoritePapers = {};
                    res['data'].forEach(paper => {
                        newFavoritePapers[paper.title] = paper.paperId;
                    });
                    this.setState({favoritePapers: newFavoritePapers});
                })
                .catch(error => {
                    console.log(error);
                });
            }
        });
    }

    setProgress(status) {
        this.setState({progress: status});
    }

    refresh() {
        this.setState({toBePushed: "/"});
    }

    setSnackbarMsg(msg) {
        this.setState({snackbarOpen: true, snackbarMessage: msg});
    }

    closeSnackbar() {
        this.setState({snackbarOpen: false});
    }

    render() {
        var appBar = (
            <AppBar style={{position: "fixed"}}>
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        <ButtonBase onClick={this.refresh} style={{fontSize: 20, textTransform: "none"}} color="inherit">
                            Paper Query
                        </ButtonBase>
                    </Typography>
                    {this.state.progress && <CircularProgress color="inherit" size={30}/>}
                    <UserMenu username={this.state.username} toggleDrawer={this.toggleDrawer(true)} 
                    handleLogInOut={this.handleLogInOut}/>
                </Toolbar>
            </AppBar>
        );

        var main = (props) => (
            <Main
                {...props}
                username={this.state.username}
                favoritePapers={this.state.favoritePapers}
                toBePushed={this.state.toBePushed}
                drawerOpen={this.state.drawerOpen}
                resetToBePushed={this.resetToBePushed}
                toggleDrawer={this.toggleDrawer}
                handleToggleChecked={this.handleToggleChecked}
                setProgress={this.setProgress}
                setSnackbarMsg={this.setSnackbarMsg}
            />
        );

        var login = (props) => <Login {...props} updateUsername={this.updateUsername} toBePushed={this.state.toBePushed} resetToBePushed={this.resetToBePushed} setSnackbarMsg={this.setSnackbarMsg} />;

        var signup = (props) => <SignUp {...props} toBePushed={this.state.toBePushed} resetToBePushed={this.resetToBePushed} setSnackbarMsg={this.setSnackbarMsg} />

        return (
            <div>
                <SimpleSnackbar open={this.state.snackbarOpen} msg={this.state.snackbarMessage} onClose={this.closeSnackbar} />
                {appBar}
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" render={login} />
                        <Route path="/signup" render={signup} />
                        <Route path="/" render={main} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
