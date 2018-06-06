import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemText} from '@material-ui/core';

const styles = theme => ({
        root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        },
    });
  
class PaperList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
        
    }
    handleQuery = (e) => {
        //console.log(e.target.parentElement.children[1].innerHTML);
        this.props.handleChooseTitle(e.target.parentElement.children[1].innerHTML);
    };
    render(){
        const { classes } = this.props;
        var objectList = this.props.objectList.map((item) => {
            return (
                <ListItem button onClick= {this.handleQuery}>
                    <ListItemText inset primary={item.title} secondary = {item.id} />
                </ListItem>
            )
        });
        return(
            <div className={classes.root}>
                <List component="nav">
                    {objectList}
                </List>
            </div>
        );
    };
}
PaperList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperList);

  