import React from 'react';
import { ListItemText, ListItemIcon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Icon, FormLabel, Grid } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import axios from 'axios';
class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            authors: [],
        };
    }
    handleMore = e => {
        if(this.state.authors.length!=0){
            return;
        }
        axios.get("https://api.semanticscholar.org/v1/paper/" + this.props.id + "?include_unknown_references=false")
        .then(res => {
            var authors = []
            var searchHelper = (src, dst) => {
                src.forEach(author => {
                    var authorName = author.name;
                    dst.push(authorName);
                });
            };
            searchHelper(res.data.authors, authors);
            this.setState({authors: authors});
        })
        .catch(function(err){
            console.log(err);
        })
    }
    handleClick() {
        this.props.handleQuery(this.props.title, this.props.id, this.props.info);
    }
    searchSS = e => {
        var url = "https://www.semanticscholar.org/search?q=" + this.props.title + "&sort=relevance";
        window.open(url, "_blank");
    }
    render() {
        return (
            // <ListItem  >
                <ExpansionPanel onClick={this.handleMore}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        {
                            this.props.isInfluential &&
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                        }
                        {/* props.info may vary */}
                        <ListItemText inset primary={this.props.title} secondary={this.props.info} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container>
                            <Grid item sm={9}>
                                <p>{"Authors: " + this.state.authors.join(", ")}</p>
                            </Grid>
                            <Grid item sm={3}>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <IconButton onClick={this.searchSS} color="secondary">S</IconButton>
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={this.handleClick}><Icon>more_horiz</Icon></IconButton>
                                    </Grid>
                                    <Grid item>
                                        <Checkbox
                                            onChange={this.props.handleToggleChecked(this.props.title, this.props.id)}
                                            checked={this.props.checked}
                                            icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            // </ListItem>
        );
    }
}

export default PaperItem;
