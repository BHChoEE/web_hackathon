import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import StarIcon from '@material-ui/icons/Star';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Login from './login.js';
import SignUp from './signup.js';
import Main from './main.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            progress: false,
            drawerOpen: false,
            favoritePapers: {},
            toBePushed: "",
        };

        this.handleLogInOut = this.handleLogInOut.bind(this);
        this.handleToggleChecked = this.handleToggleChecked.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.resetToBePushed = this.resetToBePushed.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.setProgress = this.setProgress.bind(this);
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

    handleLogInOut() {
        if (this.state.username !== "GUEST") {
            // logout
            sessionStorage.clear();
            this.setState({
                username: "GUEST",
                favoritePapers: [],
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
            // save favorite to db
            action = 'add';
        }
        else {
            delete newFavoritePapers[title];
            // delete favorite from db
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
        .catch(err => {
            console.log(err);
        });
    }

    resetToBePushed() {
        this.setState({toBePushed: ""});
    }

    updateUsername(username) {
        this.setState({username: username});
    }

    setProgress(status) {
        this.setState({progress: status});
    }

    render() {
        var favoritePapers = Object.keys(this.state.favoritePapers).map(title => (
            <ListItem key={title}>
              <ListItemText primary={title} />
            </ListItem>
        ));

        var drawer = (
            <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                >
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        <StarIcon />   Favorite Papers
                    </Typography>
                    <div style={{width: 500}}>
                        <List>
                            {favoritePapers}
                        </List>
                    </div>
                </div>
            </Drawer>
        );

        var appBar = (
            <AppBar style={{position: "fixed"}}>
                <Toolbar>
                    {/* <IconButton className={classes.menuButton} onClick={this.toggleDrawer(true)} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        Paper Query
                    </Typography>
                    {this.state.progress && <CircularProgress color="inherit" size={30}/>}
                    <Button color="inherit" onClick={this.toggleDrawer(true)}>
                        Favorites
                    </Button>
                    <Button color="inherit" onClick={this.handleLogInOut}>
                        {this.state.username === "GUEST" ? "Login" : "Logout"}
                    </Button>
                </Toolbar>
            </AppBar>
        );

        var main = (props) => (
            <Main
                {...props}
                username={this.state.username}
                favoritePapers={this.state.favoritePapers}
                toBePushed={this.state.toBePushed}
                resetToBePushed={this.resetToBePushed}
                toggleDrawer={this.toggleDrawer}
                handleToggleChecked={this.handleToggleChecked}
                setProgress={this.setProgress}
            />
        );

        var login = (props) => <Login {...props} updateUsername={this.updateUsername} />;

        var signup = (props) => <SignUp {...props} toBePushed={this.state.toBePushed} resetToBePushed={this.resetToBePushed} />

        return (
            <div>
                {drawer}
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
