import React from 'react';
import { IconButton, Icon } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';

class ActionButtons extends React.Component {
    render() {
        var { title, paperId, url, checked, openURL, handleChoose, handleToggleChecked } = this.props;
        var iconSrc = "./assets/" + (url.includes("arxiv") ? "arxiv.ico" : "ss.png");
        return (
            <div>
                <Tooltip title="Visit" placement="top">
                    <IconButton onClick={openURL(url)} color="primary">
                        <img src={iconSrc} width="24" height="24" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Send" placement="top">
                    <IconButton onClick={handleChoose(paperId)} color="primary">
                        <Icon>send</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add to favorite" placement="top">
                    <Checkbox
                        onChange={handleToggleChecked(title, paperId, url)}
                        checked={checked}
                        icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                    />
                </Tooltip>
            </div>
        );
    }
}

export default ActionButtons;
