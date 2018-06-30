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
            snackOpen: false,
            snackMessage: ""
        };

        this.handleLogInOut = this.handleLogInOut.bind(this);
        this.handleToggleChecked = this.handleToggleChecked.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.resetToBePushed = this.resetToBePushed.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.refresh = this.refresh.bind(this);
        this.handleSnackClose = this.handleSnackClose.bind(this)
        this.snackbarCb = this.snackbarCb.bind(this);
    }

    componentDidMount() {
        var username;
        var retrievedObject = sessionStorage.getItem('userInfo');
        if (retrievedObject == null) {
            username = "GUEST";
        }
        else {
            retrievedObject = JSON.parse(retrievedObject);
            username = retrievedObject.username;
        }
        this.updateUsername(username);
    }

    handleLogInOut() {
        if (this.state.username !== "GUEST") {
            // logout
            sessionStorage.clear();
            this.setState({
                username: "GUEST",
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
            // if username not GUEST, load back all favorite paper to favoritePapers
            if (this.state.username != "GUEST") {
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

    snackbarCb(msg){
        this.setState({snackOpen: true, snackMessage: msg})
    }
    handleSnackClose(){
        this.setState({snackOpen: false});
    }
    render() {
        var appBar = (
            <AppBar style={{position: "fixed"}}>
                <Toolbar>
                    {/* <IconButton className={classes.menuButton} onClick={this.toggleDrawer(true)} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        <ButtonBase onClick={this.refresh} style={{fontSize: 20}} color="inherit">
                            Paper Query
                        </ButtonBase>
                    </Typography>
                    {this.state.progress && <CircularProgress color="inherit" size={30}/>}
                    {/* <Button color="inherit" onClick={this.toggleDrawer(true)}>
                        Favorites
                    </Button>
                    <Button color="inherit" onClick={this.handleLogInOut}>
                        {this.state.username === "GUEST" ? "Login" : "Logout"}
                    </Button> */}
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
                snackbarCb={this.snackbarCb}
            />
        );

        var login = (props) => <Login {...props} updateUsername={this.updateUsername} toBePushed={this.state.toBePushed} resetToBePushed={this.resetToBePushed} snackbarCb={this.snackbarCb}/>;

        var signup = (props) => <SignUp {...props} toBePushed={this.state.toBePushed} resetToBePushed={this.resetToBePushed} snackbarCb={this.snackbarCb}/>

        return (
            <div>
                <SimpleSnackbar open={this.state.snackOpen} handleClose={this.handleSnackClose} msg={this.state.snackMessage}/>
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
