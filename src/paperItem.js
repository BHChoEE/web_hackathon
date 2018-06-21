import React from 'react';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.handleQuery(this.props.title, this.props.id, this.props.info);
    }
    
    render() {
        return (
            <ListItem button onClick={this.handleClick}>
                {
                    this.props.isInfluential &&
                    <ListItemIcon>
                        <StarIcon />
                    </ListItemIcon>
                }
                {/* props.info may vary */}
                <ListItemText inset primary={this.props.title} secondary={this.props.info} />
                <ListItemSecondaryAction>
                    <Checkbox
                        onChange={this.props.handleToggleChecked(this.props.title)}
                        checked={this.props.checked}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default PaperItem;
