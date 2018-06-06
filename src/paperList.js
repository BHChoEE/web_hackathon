import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';

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

    handleQuery(e) {
        var children = e.target.parentElement.children;
        this.props.handleChooseTitle(children[0].innerHTML, children[1].innerHTML);
    }

    render() {
        var objectList = this.props.paperList.map(item => (
            <ListItem button onClick={this.handleQuery}>
                <ListItemText inset primary={item.title} secondary={item.id} />
            </ListItem>
        ));
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav">
                    {objectList}
                </List>
            </div>
        );
    }
}

PaperList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperList);
