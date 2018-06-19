import React from 'react';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';

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
            </ListItem>
        );
    }
}

export default PaperItem;
