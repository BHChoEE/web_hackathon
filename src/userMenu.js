import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick(event) {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose() {
        this.setState({anchorEl: null});
    };

    render() {
        var anchorEl = this.state.anchorEl;
        var username = this.props.username;

        return (
            <div>
                <Button
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    color="inherit"
                    style={{textTransform: "none"}}
                >
                    {username}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {
                        username !== "Guest" &&
                        <MenuItem color="inherit" onClick={this.props.toggleDrawer}>
                            Favorites
                        </MenuItem>
                    }
                    <MenuItem color="inherit" onClick={this.props.handleLogInOut}>
                        {username === "Guest" ? "Login" : "Logout"}
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default UserMenu;