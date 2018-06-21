import React from 'react';
import axios from 'axios';
import { List } from '@material-ui/core';
import PaperItem from './paperItem';

class ReferenceList extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuery = this.handleQuery.bind(this);
    }

    handleQuery(title, id, info) {
        this.props.handleChooseTitle(title, id, info);
    }

    render() {
        var references = this.props.referenceList;
        if (this.props.onlyInfluential) {
            references = references.filter(ref => ref.isInfluential);
        }
        references = references.map(ref => (
            <PaperItem
                title={ref.title}
                id={ref.id}
                key={ref.id}
                isInfluential={ref.isInfluential}
                info={ref.info}
                checked={this.props.checkedList.indexOf(ref.title) !== -1}
                handleQuery={this.handleQuery}
                handleToggleChecked={this.props.handleToggleChecked}
            />
        ));
        return (
            <div>
                <List component="nav">
                    {references}
                </List>
            </div>
        );
    }
}

export default ReferenceList;
