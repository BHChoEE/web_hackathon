import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Grid, Icon, withStyles } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInput(e) {
        this.props.updateQuery(e.target.value);
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.props.sendQuery();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Input
                    id="#userInput"
                    placeholder="Search for some papers ..."
                    className={classes.input}
                    value={this.props.query}
                    onChange={this.handleInput}
                    onKeyPress={this.handleKeyPress}
                    inputProps={{ "aria-label": "Description" }}
                    autoFocus
                    style={{ flex: 1 }}
                />
                <Button className={classes.button} variant="outlined" onClick={this.props.sendQuery} color="primary" disabled={this.props.query.length === 0}>
                    Search
                    <Icon className={classes.rightIcon}>send</Icon>
                </Button>
                <RadioGroup
                    row
                    value={this.props.displayMode}
                    onChange={this.props.handleModeChange}
                >
                    <FormControlLabel
                        value="List"
                        control={<Radio />}
                        label="List mode"
                    />
                    <FormControlLabel
                        value="Graph"
                        control={<Radio />}
                        label="Graph mode"
                    />
                </RadioGroup>
            </Grid>
        );
    }
}

UserInput.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserInput);
