import React from 'react';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './paperList';
import DetailedPaperList from './detailedPaperList';
import ActionButtons from './actionButtons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
const JSSoup = require('jssoup').default;
import PaperGraph from './paperGraph';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

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
            historyList: [],
            referenceList: [],
            citationList: [],
            onlyInfluentialRefs: false,
            onlyInfluentialCits: false,
            displayMode: "List",
            hasChosenTitle: false,
            maxCitRefShown: 10,
            anchorEl: null,
            selectedIndex: -1,
            memesDialogOpen: false,
        };
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQuery = this.sendQuery.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
        this.updateOnlyInfluential = this.updateOnlyInfluential.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleChooseFavorite = this.handleChooseFavorite.bind(this);
        this.handleMaxShownChange = this.handleMaxShownChange.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.openURL = this.openURL.bind(this);

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
                    historyList: [],
                    referenceList: [],
                    citationList: [],
                    hasChosenTitle: false,
                    anchorEl: null,
                    selectedIndex: -1,
                });
            }
        }
    }

    sendQuery() {
        var query = this.state.query;
        if (query === "memes") {
            this.setState({memesDialogOpen: true});
        }
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
                    var url = entry.find("link").attrs.href;
                    searchResultList.push({
                        title: title.replace(/\s\s+/g, " "),
                        paperId: "arXiv:" + paperId,
                        url: url,
                        info: year + " ArXiv",
                    });
                }
            });
            this.setState({
                searchResultList: searchResultList,
                referenceList: [],
                citationList: [],
                hasChosenTitle: false,
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
        var { historyList, selectedIndex } = this.state;
        if (selectedIndex >= 0 && paperId === historyList[selectedIndex].paperId) {
            return;
        }
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
                        url: paper.url,
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
            var newHistoryList = [...historyList];
            var info = [response.data.year || "", response.data.venue || ""].join(" ")
            var paper = {
                title: response.data.title.replace(/\s\s+/g, " "),
                paperId: paperId,
                url: response.data.url,
                info: info,
            };
            var newSelectedIndex = -1;
            for (let i = 0; i < newHistoryList.length; i++) {
                if (newHistoryList[i].paperId === paperId) {
                    newSelectedIndex = i;
                    break;
                }
            }
            if (newSelectedIndex === -1) {
                newHistoryList.push(paper);
                newSelectedIndex = newHistoryList.length - 1;
            }
            this.setState({
                referenceList: referenceList,
                citationList: citationList,
                historyList: newHistoryList,
                hasChosenTitle: true,
                selectedIndex: newSelectedIndex,
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
        this.setState(
            {searchResultList: []},
            this.handleChooseTitle(paperId)
        );
    }

    handleMaxShownChange(event) {
        var maxCitRefShown = Math.max(event.target.value, 1);
        this.setState({maxCitRefShown: maxCitRefShown});
    }

    handleListItemClick(event) {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuItemClick = index => () => {
        this.setState(
            {anchorEl: null},
            this.handleChooseTitle(this.state.historyList[index].paperId)
        );
    };

    handleMenuClose() {
        this.setState({anchorEl: null});
    };

    closeMemesDialog = () => {
        this.setState({memesDialogOpen: false});
    };

    openURL = url => () => {
        window.open(url, "_blank");
    }

    render() {
        const { classes, favoritePapers, handleToggleChecked } = this.props;
        var { displayMode, historyList, selectedIndex, anchorEl, hasChosenTitle, maxCitRefShown } = this.state;
        var currentPaper = historyList[selectedIndex];

        var favoritePaperListItems = Object.keys(favoritePapers).map(title => {
            var { paperId, url } = favoritePapers[title];
            return (
                <ListItem key={title}>
                    <ListItemText primary={title} style={{flex: 1}} />
                    <ActionButtons
                        title={title}
                        paperId={paperId}
                        url={url}
                        checked={true}
                        username={this.props.username}
                        openURL={this.openURL}
                        handleChoose={this.handleChooseFavorite}
                        handleToggleChecked={handleToggleChecked}
                    />
                </ListItem>
            );
        });

        var drawer = (
            <Drawer open={this.props.drawerOpen} onClose={this.props.toggleDrawer(false)}>
                <Typography
                    variant="display1"
                    color="inherit"
                    style={{textAlign: "center", marginTop: 20}}
                >
                    Favorite Papers
                </Typography>
                <List>
                    {favoritePaperListItems}
                </List>
            </Drawer>
        );

        var memesDialog = (
            <Dialog
                open={this.state.memesDialogOpen}
                onClose={this.closeMemesDialog}
                maxWidth="md"
            >
                <DialogContent>
                    <img src="./assets/memes.jpg" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeMemesDialog} color="primary" style={{textTransform: "none"}}>
                        "原來是memes的部分啊... OK OK"
                    </Button>
                </DialogActions>
            </Dialog>
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

        var historyListMenuItems = historyList.map((paper, index) => (
            <MenuItem key={paper.paperId} selected={index === selectedIndex} onClick={this.handleMenuItemClick(index)}>
                {paper.title}
            </MenuItem>
        ));

        var history = historyList.length === 0 ? null : (
            <Grid container alignItems="center" justify="center">
                <Typography variant="display1">
                    View history
                </Typography>
                <List component="nav">
                    <ListItem button aria-haspopup="true" onClick={this.handleListItemClick}>
                        <ListItemText primary={currentPaper.title} secondary={currentPaper.info} />
                    </ListItem>
                </List>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleMenuClose}>
                    {historyListMenuItems}
                </Menu>
                {
                    this.props.username !== "Guest" &&
                    <Checkbox
                        onChange={this.props.handleToggleChecked(currentPaper.title, currentPaper.paperId, currentPaper.url)}
                        checked={Object.keys(favoritePapers).includes(currentPaper.title)}
                        icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                    />
                }
            </Grid>
        );

        var searchResultList = hasChosenTitle ? null : (
            <PaperList
                list={this.state.searchResultList}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={handleToggleChecked}
                favoritePapers={favoritePapers}
                openURL={this.openURL}
                username={this.props.username}
            />
        );

        var graph = hasChosenTitle && displayMode === "Graph" ? (
            <PaperGraph
                currentPaper={currentPaper}
                referenceList={this.state.referenceList}
                citationList={this.state.citationList}
                handleChooseTitle={this.handleChooseTitle}
            />
        ) : null;

        var referenceList = displayMode === "List" ? (
            <DetailedPaperList
                title="References"
                onlyInfluential={this.state.onlyInfluentialRefs}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialRefs")}
                list={this.state.referenceList}
                maxShown={maxCitRefShown}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={handleToggleChecked}
                favoritePapers={favoritePapers}
                openURL={this.openURL}
                username={this.props.username}
            />
        ) : null;

        var citationList = displayMode === "List" ? (
            <DetailedPaperList
                title="Citations"
                onlyInfluential={this.state.onlyInfluentialCits}
                updateOnlyInfluential={this.updateOnlyInfluential("onlyInfluentialCits")}
                list={this.state.citationList}
                maxShown={maxCitRefShown}
                handleChooseTitle={this.handleChooseTitle}
                handleToggleChecked={handleToggleChecked}
                favoritePapers={favoritePapers}
                openURL={this.openURL}
                username={this.props.username}
            />
        ) : null;

        return (
            <div className={classes.root}>
                {drawer}
                {memesDialog}
                <Grid container style={{marginTop: 80}}>
                    {userInput}
                    {history}
                    {searchResultList}
                    {
                        hasChosenTitle && displayMode === "List" &&
                        <TextField fullWidth
                            label="Maximum number shown"
                            value={maxCitRefShown}
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
