import React from 'react';
import { ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

class PaperItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
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
                        onChange={this.props.handleToggleChecked(this.props.title, this.props.id)}
                        checked={this.props.checked}
                        icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                    />
                </ListItemSecondaryAction>
                <IconButton onClick={this.searchSS} color="secondary">S</IconButton>
            </ListItem>
        );
    }
}

export default PaperItem;
