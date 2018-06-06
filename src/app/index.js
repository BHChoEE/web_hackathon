import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './list';
import ReferenceList from './refList';
// import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
const JSSoup = require('jssoup').default;

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            query: "",
            objectList: [],
            referenceList: [],
        }
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQryCb = this.sendQryCb.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
    }
    sendQryCb = () => {
        console.log(this.state.query);
        var query = this.state.query;
        axios.get('http://export.arxiv.org/api/query?search_query=' + query)
        .then(response => {
            var soup = new JSSoup(response.data);
            var entries = soup.findAll('entry');
            var tmpList = [];
            entries.forEach((entry) => {
                var published = entry.find('published').contents[0]._text.substring(0, 4);
                if (parseInt(published) >= 2008) {
                    var title = entry.find('title').contents[0]._text
                    //console.log(title);
                    var id = entry.find('id').contents[0]._text.split("/abs/")[1].split("v")[0];
                    //console.log(id);
                    tmpList.push({
                        title: title,
                        id: id,
                    });
                }
            });
            this.setState({objectList: tmpList});
        })
        .catch(error => {
            console.log(error);
        });
    }
    updateQuery = (query) => {
        this.setState({query: query});
    }

    handleChooseTitle = (arxiv_id) => {
        
        axios.get('http://api.semanticscholar.org/v1/paper/arXiv:' + arxiv_id + '?include_unknown_references=false')
        .then(response => {
            var tmpList = [];
            response.data.references.forEach((ref) => {
                if (ref.isInfluential) {
                    tmpList.push({title:ref.title, url: ref.url});
                }
            });
            this.setState({
                referenceList: tmpList,
                objectList: []
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    render(){
        return(
            <div>
                <UserInput sendQryCb = {this.sendQryCb} query = {this.state.query} updateQuery = {this.updateQuery}/>
                <PaperList objectList = {this.state.objectList} handleChooseTitle = {this.handleChooseTitle}></PaperList>
                <ReferenceList referenceList = {this.state.referenceList}></ReferenceList>
            </div>
                
        );
    }
}
ReactDOM.render(<App />, document.getElementById('app'));