import React from 'react';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './paperList';
import DetailedPaperList from './detailedPaperList';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Switch from '@material-ui/core/Switch';
const JSSoup = require('jssoup').default;
import PaperGraph from './paperGraph';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Drawer from '@material-ui/core/Drawer';
import StarIcon from '@material-ui/icons/Star';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import TextField from '@material-ui/core/TextField';

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    main: {
        marginLeft: 20,
        marginRight: 20,
    },
};

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            searchResultList: [],
            referenceList: [],
            citationList: [],
            onlyInfluentialRefs: false,
            onlyInfluentialCits: false,
            displayMode: "List",
            hasChosenTitle: false,
            maxCitRefShown: 10,
        };
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQuery = this.sendQuery.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
        this.updateOnlyInfluential = this.updateOnlyInfluential.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleChooseFavorite = this.handleChooseFavorite.bind(this);
        this.handleMaxShownChange = this.handleMaxShownChange.bind(this);

        document.title = "Paper Query";
    }

    componentDidUpdate() {
        var toBePushed = this.props.toBePushed;
        if (toBePushed !== "") {
            this.props.resetToBePushed();
            if (toBePushed !== "/") {
                this.props.history.push(toBePushed);
            }
            else {
                this.setState({
                    query: "",
                    searchResultList: [],
                    referenceList: [],
                    citationList: [],
                    hasChosenTitle: false,
                });
            }
        }
    }

    sendQuery() {
        var query = this.state.query;
        this.props.setProgress(true);
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
                    var paperId = find("id", entry).split("/abs/")[1].split("v")[0];
                    searchResultList.push({
                        title: title.replace(/\s\s+/g, " "),
                        paperId: "arXiv:" + paperId,
                        info: year + " ArXiv",
                    });
                }
            });
            this.setState({
                searchResultList: searchResultList,
                referenceList: [],
                citationList: [],
            });
            this.props.setProgress(false);
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

    handleChooseTitle = paperId => () => {
        this.props.setProgress(true);
        axios.get("https://api.semanticscholar.org/v1/paper/" + paperId + "?include_unknown_references=false")
        .then(response => {
            var referenceList = [];
            var citationList = [];
            var makeList = (src, dst) => {
                src.forEach(paper => {
                    var info = [paper.year || "", paper.venue || ""].join(" ");
                    var paperObj = {
                        title: paper.title,
                        paperId: paper.paperId,
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
            var info = [response.data.year || "", response.data.venue || ""].join(" ")
            var paper = {
                title: response.data.title.replace(/\s\s+/g, " "),
                paperId: paperId,
                info: info,
            };
            if (paperId.includes("arXiv:")) {
                searchResultList = [paper];
            }
            else {
                var i = 0;
                for (; i < searchResultList.length; i++) {
                    if (searchResultList[i].paperId == paperId) {
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
            this.props.setProgress(false);
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleModeChange = event => {
        this.setState({displayMode: event.target.value});
    }

    handleChooseFavorite = paperId => () => {
        this.props.toggleDrawer(false)();
        this.setState({searchResultList: []}, this.handleChooseTitle(paperId));
    }

    handleMaxShownChange(event) {
        var maxCitRefShown = Math.max(event.target.value, 1);
        this.setState({maxCitRefShown: maxCitRefShown});
    }

    render() {
        const { classes } = this.props;
        var displayMode = this.state.displayMode;
        var currentPaper = this.state.searchResultList[this.state.searchResultList.length - 1];
        var favoritePapers = this.props.favoritePapers;

        var favoritePaperListItems = Object.keys(favoritePapers).map(title => {
            var paperId = favoritePapers[title];
            return (
                <ListItem key={title}>
                    <ListItemText primary={title} style={{flex: 1}} />
                    <IconButton onClick={this.handleChooseFavorite(paperId)}>
                        <Icon>more_horiz</Icon>
                    </IconButton>
                    <Checkbox
                        onChange={this.props.handleToggleChecked(title, paperId)}
                        checked={true}
                        icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                    />
                </ListItem>
            );
        });

        var drawer = (
            <Drawer open={this.props.drawerOpen} onClose={this.props.toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                >
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        <StarIcon /> Favorite Papers
                    </Typography>
                    <div style={{width: 500}}>
                        <List>
                            {favoritePaperListItems}
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
                displayMode={displayMode}
                handleModeChange={this.handleModeChange}
            />
        );

        var searchResultList = (
            <PaperList
                list={this.state.searchResultList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.props.handleToggleChecked}
                favoritePapers={favoritePapers}
            />
        );

        var graph = this.state.hasChosenTitle && displayMode === "Graph" ? (
            <PaperGraph
                currentPaper={currentPaper}
                referenceList={this.state.referenceList}
                citationList={this.state.citationList}
                handleChooseTitle={this.handleChooseTitle}
            />
        ) : null;

        var maxCitRefShown = this.state.maxCitRefShown;

        var referenceList = displayMode === "List" ? (
            <DetailedPaperList
                title="References"
                onlyInfluential={this.state.onlyInfluentialRefs}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialRefs")}
                list={this.state.referenceList.slice(0, maxCitRefShown)}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.props.handleToggleChecked}
                favoritePapers={favoritePapers}
            />
        ) : null;

        var citationList = displayMode === "List" ? (
            <DetailedPaperList
                title="Citations"
                onlyInfluential={this.state.onlyInfluentialCits}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialCits")}
                list={this.state.citationList.slice(0, maxCitRefShown)}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={this.props.handleToggleChecked}
                favoritePapers={favoritePapers}
            />
        ) : null;

        return (
            <div className={classes.root}>
                {drawer}
                <Grid container style={{marginTop: 80}}>
                    {userInput}
                    {searchResultList}
                    {
                        this.state.displayMode === "List" &&
                        <TextField
                            label="Maximum number shown"
                            value={this.state.maxCitRefShown}
                            onChange={this.handleMaxShownChange}
                            type="number"
                            InputLabelProps={{shrink: true}}
                            margin="normal"
                        />
                    }
                    <Grid container spacing={16} style={{marginTop: 12}}>
                        {citationList}
                        {referenceList}
                    </Grid>
                    {graph}
                </Grid>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
