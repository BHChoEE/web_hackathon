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
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
const JSSoup = require('jssoup').default;

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
            checkedList: {},
            drawerOpen: false,
        }
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQuery = this.sendQuery.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
        this.updateOnlyInfluential = this.updateOnlyInfluential.bind(this);
        this.handleToggleChecked = this.handleToggleChecked.bind(this);
    }
    componentDidMount(){
        var retrievedObject = sessionStorage.getItem('userInfo');
        if(retrievedObject == null){
            var username = "GUEST"
        } else {
            retrievedObject = JSON.parse(retrievedObject);
            var username = retrievedObject.username;
        }
        this.setState({username: username});
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
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleToggleChecked = (title, id) => () => {
        var newCheckedList = {...this.state.checkedList};
        if (newCheckedList[title] === undefined) {
            newCheckedList[title] = id;
            // save favorite to db
            axios.post('/favorite/add', {
                title: title,
                id: id,
                user: this.state.username
            })
            .then(res => {
                this.setState({checkedList: newCheckedList});
            })
            .catch(err => {
                console.log(err);
            })
        }
        else {
            delete newCheckedList[title];
            // delete favorite from db
            axios.post('/favorite/remove', {
                title: title,
                id: id,
                user: this.state.username
            })
            .then(res => {
                this.setState({checkedList: newCheckedList});
            })
            .catch(err => {
                console.log(err);
            })
        }
        
        
    }
    
    toggleDrawer = (state) => () => {
        this.setState({
            drawerOpen: state,
        });
    }
    
    render() {
        const { classes } = this.props;
        var checkedList = Object.keys(this.state.checkedList).map(title => (
            <ListItem>
              <ListItemText primary={title} key={title} />
            </ListItem>
        ));
        var appBar = (
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} onClick={this.toggleDrawer(true)} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Paper Query
                    </Typography>
                </Toolbar>
            </AppBar>
        );
        var drawer = (
            <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer(false)}
                    onKeyDown={this.toggleDrawer(false)}
                >
                    <div className={classes.drawer}>
                        <List>
                            {checkedList}
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
        var searchResultList = this.state.searchResultList.length == 0 ? null : (
            <PaperList
                list={this.state.searchResultList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                checkedList={this.state.checkedList}
            />
        );
        var referenceList = this.state.referenceList.length == 0 ? null : (
            <DetailedPaperList
                title="References"
                onlyInfluential={this.state.onlyInfluentialRefs}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialRefs")}
                list={this.state.referenceList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                checkedList={this.state.checkedList}
            />
        );
        var citationList = this.state.citationList.length == 0 ? null : (
            <DetailedPaperList
                title="Citations"
                onlyInfluential={this.state.onlyInfluentialCits}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialCits")}
                list={this.state.citationList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.handleToggleChecked}
                checkedList={this.state.checkedList}
            />
        );
        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    {appBar}
                    {drawer}
                    {userInput}
                    {searchResultList}
                    {referenceList}
                    {citationList}
                </Grid>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
