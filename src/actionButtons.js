import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Tooltip from '@material-ui/core/Tooltip';

function FavoriteCheckbox(props) {
    const { title, paperId, url, checked, handleToggleChecked } = props;
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
    const { title, paperId, url, checked, openURL, handleChoose, handleToggleChecked } = props;
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
                handleToggleChecked={handleToggleChecked}
            />
        </div>
    );
}

export { FavoriteCheckbox, ActionButtons };
