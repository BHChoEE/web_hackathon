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
    }

    render() {
        var papers = [...this.props.list];
        if (papers.length === 0) {
            return null;
        }
        if (this.props.onlyInfluential) {
            papers = papers.filter(paper => paper.isInfluential);
        }
        papers = papers.map(paper => (
            <PaperItem
                title={paper.title}
                paperId={paper.paperId}
                url={paper.url}
                key={paper.paperId}
                info={paper.info}
                checked={this.props.favoritePapers[paper.title] !== undefined}
                isInfluential={paper.isInfluential}
                handleChooseTitle={this.props.handleChooseTitle}
                handleToggleChecked={this.props.handleToggleChecked}
            />
        ));
        return (
            <div className={this.props.classes.root}>
                {papers}
            </div>
        );
    }
}

PaperList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperList);
