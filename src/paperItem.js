import axios from 'axios';
import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ActionButtons } from './actionButtons';

class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authors: [],
        };

        this.handleMore = this.handleMore.bind(this);
    }

    handleMore() {
        if (this.state.authors.length !== 0) {
            return;
        }
        axios.get(`https://api.semanticscholar.org/v1/paper/${this.props.paperId}?include_unknown_references=false`).then((res) => {
            const authors = res.data.authors.map(author => author.name);
            this.setState({ authors });
        }).catch((error) => {
            console.log(error);
        });
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
                    <ListItemText inset primary={this.props.title} secondary={this.props.info} />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <p style={{ flex: 1 }}>{`Authors: ${this.state.authors.join(", ")}`}</p>
                    <ActionButtons
                        title={this.props.title}
                        paperId={this.props.paperId}
                        url={this.props.url}
                        checked={this.props.checked}
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
