import React from 'react';
import axios from 'axios';
import {List, ListItem, ListItemText} from '@material-ui/core';

class ReferenceList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
                //print(print_format.format(ref['title'], ref['paperId']))
        
        var objectList = this.props.referenceList.map((item) => {
            return (
                <ListItem button >
                    <ListItemText inset primary={item.title}/>
                </ListItem>
            )
        });
        return(
            <div>
                <List component="nav">
                    {objectList}
                </List>
            </div>
        );
    }
}
export default ReferenceList;