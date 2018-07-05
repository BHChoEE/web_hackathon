import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PaperItem from './paperItem';

const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
});

function PaperListWithoutStyles(props) {
    const { list, onlyInfluential, favoritePapers, handleChooseTitle, handleToggleChecked, openURL, username, classes } = props;
    let papers = [...list];
    if (papers.length === 0) {
        return null;
    }
    if (onlyInfluential) {
        papers = papers.filter(paper => paper.isInfluential);
    }
    papers = papers.map(paper => (
        <PaperItem
            title={paper.title}
            paperId={paper.paperId}
            url={paper.url}
            key={paper.paperId}
            info={paper.info}
            checked={favoritePapers[paper.title] !== undefined}
            isInfluential={paper.isInfluential}
            handleChooseTitle={handleChooseTitle}
            handleToggleChecked={handleToggleChecked}
            openURL={openURL}
            username={username}
        />
    ));
    return (
        <div className={classes.root}>
            {papers}
        </div>
    );
}

PaperListWithoutStyles.propTypes = {
    classes: PropTypes.object.isRequired,
};

const PaperList = withStyles(styles)(PaperListWithoutStyles);

function DetailedPaperList(props) {
    const { list, title, onlyInfluential, updateOnlyInfluential, maxShown, handleChooseTitle, handleToggleChecked, favoritePapers, openURL, username } = props;
    return list.length === 0 ? null : (
        <Grid item xs={12} sm={6}>
            <Paper>
                <Grid container justify="center" style={{ paddingTop: 20 }}>
                    <Typography variant="headline">
                        {`${title} (${list.length})`}
                    </Typography>
                </Grid>
                <Grid container justify="flex-end">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyInfluential}
                                onChange={updateOnlyInfluential}
                                color="primary"
                            />
                        }
                        label="Only influential"
                    />
                </Grid>
                <PaperList
                    list={list.slice(0, maxShown)}
                    handleChooseTitle={handleChooseTitle}
                    onlyInfluential={onlyInfluential}
                    handleToggleChecked={handleToggleChecked}
                    favoritePapers={favoritePapers}
                    openURL={openURL}
                    username={username}
                />
            </Paper>
        </Grid>
    );
}

export { PaperList, DetailedPaperList };
