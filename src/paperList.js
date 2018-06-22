import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import PaperItem from './paperItem';

const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
});
  
class PaperList extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuery = this.handleQuery.bind(this);
    }

    handleQuery(title, id, info) {
        this.props.handleChooseTitle(title, id, info);
    }

    render() {
        var papers = [...this.props.list];
        if (this.props.onlyInfluential) {
            papers = papers.filter(paper => paper.isInfluential);
        }
        papers = papers.map(paper => (
            <PaperItem
                title={paper.title}
                id={paper.id}
                key={paper.id}
                info={paper.info}
                checked={this.props.checkedList.indexOf(paper.title) !== -1}
                isInfluential={paper.isInfluential}
                handleQuery={this.handleQuery}
                handleToggleChecked={this.props.handleToggleChecked}
            />
        ));
        return (
            <div className={this.props.classes.root}>
                <List component="nav">
                    {papers}
                </List>
            </div>
        );
    }
}

PaperList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperList);
