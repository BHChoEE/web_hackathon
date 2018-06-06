import React from 'react';
import axios from 'axios';
import {List, ListItem, ListItemText} from '@material-ui/core';

class ReferenceList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleQuery = (e) => {
      var children = e.target.parentElement.children;
      this.props.handleChooseTitle(children[0].innerHTML, children[1].innerHTML);
    };

    render() {
                //print(print_format.format(ref['title'], ref['paperId']))
        console.log(this.props.referenceList);
        var objectList = this.props.referenceList.map((item) => {
            return (
                <ListItem button onClick={this.handleQuery}>
                    <ListItemText inset primary={item.title} secondary={item.id}/>
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