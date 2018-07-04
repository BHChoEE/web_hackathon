import React from 'react';
import { ListItemText, ListItemIcon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import ActionButtons from './actionButtons';

class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authors: [],
        };
    }
    handleMore = e => {
        if(this.state.authors.length!=0){
            return;
        }
        axios.get("https://api.semanticscholar.org/v1/paper/" + this.props.paperId + "?include_unknown_references=false")
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
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
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
                    <p style={{flex: 1}}>{"Authors: " + this.state.authors.join(", ")}</p>
                    <ActionButtons
                        title={this.props.title}
                        paperId={this.props.paperId}
                        url={this.props.url}
                        checked={this.props.checked}
                        username={this.props.username}
                        openURL={this.props.openURL}
                        handleChoose={this.props.handleChooseTitle}
                        handleToggleChecked={this.props.handleToggleChecked}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default PaperItem;
