import React from 'react';
import { IconButton, Icon } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';

function FavoriteCheckbox(props) {
    const { title, paperId, url, checked, handleToggleChecked, username } = props;
    if (username === "Guest") {
        return null;
    }
    const tooltipTitle = `${checked ? "Remove from" : "Add to"} favorite`;
    return (
        <Tooltip title={tooltipTitle} placement="top">
            <Checkbox
                onChange={handleToggleChecked(title, paperId, url)}
                checked={checked}
                icon={<FavoriteBorder />} checkedIcon={<Favorite />}
            />
        </Tooltip>
    );
}

function ActionButtons(props) {
    const { title, paperId, url, checked, openURL, handleChoose, handleToggleChecked, username } = props;
    const iconSrc = `./assets/${url.includes("arxiv") ? "arxiv.ico" : "ss.png"}`;
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
            <FavoriteCheckbox
                title={title}
                paperId={paperId}
                url={url}
                checked={checked}
                username={username}
                handleToggleChecked={handleToggleChecked}
            />
        </div>
    );
}

export { FavoriteCheckbox, ActionButtons };
