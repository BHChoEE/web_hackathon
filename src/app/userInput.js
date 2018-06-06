import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Input, Button, Grid, Icon, withStyles} from '@material-ui/core';
const styles = theme => ({
    input: {
        width: '100%',
        margin: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
  });
class UserInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //query: ""
        };
    }
    handleInput = e => {this.props.updateQuery(e.target.value);};
    sendMessage = e => {
        e.preventDefault();
        var qry = this.props.query;
        if (qry.length == 0){
            return;
        }
        this.props.sendQryCb();
        /*
        axios.get('/redirect?page=main&query='+this.state.query)
        .then(function (res){
            console.log(res);
            window.location = '/main'
        })
        .catch(function (err){
            console.log(err);
        });*/

    };
    handleKeyPress(e){
        if(e.key == 'Enter'){
            this.sendMessage(e);
        }
    };
    render(){
        const {classes} = this.props;
        return(
            
            <Grid container className={classes.root} spacing={24}>
                <Grid item sm={10}>
                    <Input placeholder="Enter Your Message..." className={classes.input} value={this.props.query}
                    onChange={e => this.handleInput(e)} onKeyPress={e => this.handleKeyPress(e)} inputProps={{'aria-label': 'Description',}}/>
                </Grid>
                <Grid item sm={2}>
                    <Button className={classes.button} variant="outlined" onClick={e => this.sendMessage(e)} color="primary"> Send
                        <Icon className={classes.rightIcon}>send</Icon>
                    </Button>
                </Grid>
            </Grid>
        );
    };
}

UserInput.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(UserInput);