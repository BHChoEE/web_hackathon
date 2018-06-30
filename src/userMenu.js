import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class UserMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="inherit"
        >
          {this.props.username}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {/* <MenuItem color="secondary" >{this.props.username}</MenuItem> */}
          <MenuItem color="inherit" onClick={this.props.toggleDrawer}>Favorites</MenuItem>
          <MenuItem color="inherit" onClick={this.props.handleLogInOut}>{this.props.username === "GUEST" ? "Login" : "Logout"}</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default UserMenu;