import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PaperList from './paperList';

class DetailedPaperList extends React.Component {
    render() {
        return this.props.list.length === 0 ? null : (
            <Grid item xs={12} sm={6}>
                <Paper>
                    <Grid container justify="center" style={{paddingTop: 20}}>
                        <Typography variant="headline">
                            {this.props.title + " (" + this.props.list.length + ")"}
                        </Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.onlyInfluential}
                                    onChange={this.props.updateOnlyInfluential}
                                    color="primary"
                                />
                            }
                            label="Only influential"
                        />
                    </Grid>
                    <PaperList
                        list={this.props.list.slice(0, this.props.maxShown)}
                        handleChooseTitle={this.props.handleChooseTitle}
                        onlyInfluential={this.props.onlyInfluential}
                        handleToggleChecked={this.props.handleToggleChecked}
                        favoritePapers={this.props.favoritePapers}
                        openURL={this.props.openURL}
                    />
                </Paper>
            </Grid>
        );
    }
}

export default DetailedPaperList;
