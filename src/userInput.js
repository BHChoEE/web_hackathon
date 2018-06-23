import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Grid, Icon, withStyles } from '@material-ui/core';

const styles = theme => ({
    input: {
        width: "100%",
        margin: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class UserInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

    }

    handleInput(e) {
        this.props.updateQuery(e.target.value);
    }

    sendMessage(e) {
        e.preventDefault();
        var qry = this.props.query;
        if (qry.length == 0){
            return;
        }
        this.props.sendQuery();
    }

    handleKeyPress(e) {
        if(e.key == "Enter") {
            this.sendMessage(e);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item sm={10}>
                    <Input placeholder="Search for some papers ..." className={classes.input} value={this.props.query}
                    onChange={this.handleInput} onKeyPress={this.handleKeyPress} inputProps={{"aria-label": "Description"}} autoFocus />
                </Grid>
                <Grid item sm={2}>
                    <Button className={classes.button} variant="outlined" onClick={this.sendMessage} color="primary"> Send
                        <Icon className={classes.rightIcon}>send</Icon>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

UserInput.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(UserInput);
