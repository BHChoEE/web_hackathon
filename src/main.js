import React from 'react';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './paperList';
import DetailedPaperList from './detailedPaperList';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import StarIcon from '@material-ui/icons/Star';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import {Button, Icon} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ListItem, ListItemText } from '@material-ui/core';
const JSSoup = require('jssoup').default;
import PaperGraph from './paperGraph';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    drawer: {
        width: 500,
    },
    main: {
        marginLeft: 20,
        marginRight: 20,
    },
};

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            query: "",
            searchResultList: [],
            referenceList: [],
            citationList: [],
            onlyInfluentialRefs: false,
            onlyInfluentialCits: false,
            favoritePapers: {},
            drawerOpen: false,
            displayMode: "List",
            hasChosenTitle: false,
        }
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQuery = this.sendQuery.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
        this.updateOnlyInfluential = this.updateOnlyInfluential.bind(this);
        this.handleToggleChecked = this.handleToggleChecked.bind(this);
        this.handleLogInOut = this.handleLogInOut.bind(this);
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
            if(this.state.username != "GUEST"){
                axios.post('/favorite/all', {
                    username: this.state.username
                })
                .then(res => {
                    var newFavoritePapers = {};
                    for (let i = 0; i < res['data'].length; i++) {
                        newFavoritePapers[res['data'][i].title] = res['data'][i].id;
                    }
                    this.setState({favoritePapers: newFavoritePapers});
                })
                .catch(error => {
                    console.log(error);
                });
            }
        });
        
    }
    
    sendQuery() {
        var query = this.state.query;
        axios.get("https://export.arxiv.org/api/query?search_query=" + query)
        .then(response => {
            var soup = new JSSoup(response.data);
            var entries = soup.findAll("entry");
            var searchResultList = [];
            entries.forEach(entry => {
                var find = (str, tag) => tag.find(str).contents[0]._text;
                // var authorList = entry.findAll("author").map(tag => find("name", tag));
                var year = find("published", entry).substring(0, 4);
                if (parseInt(year) >= 2008) {
                    var title = find("title", entry);
                    var id = find("id", entry).split("/abs/")[1].split("v")[0];
                    searchResultList.push({
                        title: title.replace("\n", " "),
                        id: "arXiv:" + id,
                        info: year + ", " + "ArXiv",
                    });
                }
            });
            this.setState({
                searchResultList: searchResultList,
                referenceList: [],
                citationList: [],
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    updateQuery(query) {
        this.setState({query: query});
    }

    updateOnlyInfluential = onlyInfluential => e => {
        this.setState({[onlyInfluential]: e.target.checked});
    }

    handleChooseTitle(title, id, info) {
        axios.get("https://api.semanticscholar.org/v1/paper/" + id + "?include_unknown_references=false")
        .then(response => {
            var referenceList = [];
            var citationList = [];
            var makeList = (src, dst) => {
                src.forEach(paper => {
                    var info = paper.year;
                    if (paper.venue) {
                        info += ", " + paper.venue;
                    }
                    var paperObj = {
                        title: paper.title,
                        id: paper.paperId,
                        isInfluential: paper.isInfluential,
                        info: info,
                    };
                    if (paper.isInfluential) {
                        dst.unshift(paperObj);
                    }
                    else {
                        dst.push(paperObj);
                    }
                });
            }
            makeList(response.data.references, referenceList);
            makeList(response.data.citations, citationList);
            var searchResultList = [...this.state.searchResultList];
            var paper = {
                title: title.replace("\n", " "),
                id: id,
                info: info,
            };
            if (id.includes("arXiv:")) {
                searchResultList = [paper];
            }
            else {
                var i = 0;
                for (; i < searchResultList.length; i++) {
                    if (searchResultList[i].id == id) {
                        break;
                    }
                }
                searchResultList = searchResultList.slice(0, i);
                searchResultList.push(paper);
            }
            this.setState({
                referenceList: referenceList,
                citationList: citationList,
                searchResultList: searchResultList,
                hasChosenTitle: true,
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleToggleChecked = (title, id) => () => {
        var newFavoritePapers = {...this.state.favoritePapers};
        var action = '';
        if (newFavoritePapers[title] === undefined) {
            newFavoritePapers[title] = id;
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
            id: id,
            username: this.state.username
        })
        .then(res => {
            this.setState({favoritePapers: newFavoritePapers});
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    toggleDrawer = state => () => {
        this.setState({
            drawerOpen: state,
        });
    }

    // searchSS = e => {
    //     var url = "https://www.semanticscholar.org/search?q=" + this.state.query + "&sort=relevance";
    //     window.open(url, "_blank");
    // }
    
    handleModeChange = event => {
        this.setState({displayMode: event.target.value});
    }

    handleLogInOut() {
        if (this.state.username === "GUEST") {
            // login
            this.props.history.push('/login');
        }
        else {
            // logout
            sessionStorage.clear();
            this.setState({
                username: "GUEST",
                favoritePapers: [],
            });
            this.props.history.push('/login');
        }
    }

    render() {
        const { classes } = this.props;
        var favoritePapers = Object.keys(this.state.favoritePapers).map(title => (
            <ListItem key={title}>
              <ListItemText primary={title} />
            </ListItem>
        ));
        var displayMode = this.state.displayMode;
        var currentPaper = this.state.searchResultList[this.state.searchResultList.length - 1];
        var appBar = (
            <AppBar style={{position: "fixed"}}>
                <Toolbar>
                    <IconButton className={classes.menuButton} onClick={this.toggleDrawer(true)} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Paper Query
                    </Typography>
                    <Button color="inherit" onClick={this.handleLogInOut}>
                        {this.state.username === "GUEST" ? "Login" : "Logout"}
                    </Button>
                    {/* <Grid>
                        <Button  className={classes.button} variant="outlined" onClick={this.searchSS} color="secondary"> 
                            SS<Icon className={classes.rightIcon}>send</Icon>
                        </Button>
                    </Grid> */}
                </Toolbar>
            </AppBar>
        );
        var drawer = (
            <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                >
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        <StarIcon />   Favorite Papers
                    </Typography>
                    <div className={classes.drawer}>
                        <List>
                            {favoritePapers}
                        </List>
                    </div>
                </div>
            </Drawer>
        );
        var userInput = (
            <UserInput
                sendQuery={this.sendQuery}
                query={this.state.query}
                updateQuery={this.updateQuery}
            />
        );
        var displayModeControl = (
            <FormControl component="fieldset">
                <FormLabel component="legend">Display mode</FormLabel>
                <RadioGroup row aria-label="Display Mode" className={classes.group} value={displayMode} onChange={this.handleModeChange}>
                    <FormControlLabel
                        value="List"
                        control={<Radio />}
                        label="List"
                    />
                    <FormControlLabel
                        value="Graph"
                        control={<Radio />}
                        label="Graph"
                    />
                </RadioGroup>
            </FormControl>
        );
        var searchResultList = (
            <PaperList
                list={this.state.searchResultList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                favoritePapers={this.state.favoritePapers}
            />
        );
        var graph = this.state.hasChosenTitle && displayMode === "Graph" ? (
            <PaperGraph
                currentPaper={currentPaper}
                referenceList={this.state.referenceList}
                citationList={this.state.citationList}
            />
        ) : null;
        var referenceList = displayMode === "List" ? (
            <DetailedPaperList
                title="References"
                onlyInfluential={this.state.onlyInfluentialRefs}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialRefs")}
                list={this.state.referenceList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                favoritePapers={this.state.favoritePapers}
            />
        ) : null;
        var citationList = displayMode === "List" ? (
            <DetailedPaperList
                title="Citations"
                onlyInfluential={this.state.onlyInfluentialCits}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialCits")}
                list={this.state.citationList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                favoritePapers={this.state.favoritePapers}
            />
        ) : null;
        return (
            <div className={classes.root}>
                {appBar}
                <div className={classes.main}>
                <Grid container spacing={24} style={{marginTop: 80}}>
                    {drawer}
                    <Grid container spacing={24}>
                        <Grid item sm={10}>{userInput}</Grid>
                        <Grid item sm={2}>{displayModeControl}</Grid>
                    </Grid>
                    {searchResultList}
                    {citationList}
                    {referenceList}
                    {graph}
                </Grid>
            </div>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
