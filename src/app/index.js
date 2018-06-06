import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './paperList';
import ReferenceList from './refList';
// import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
const JSSoup = require('jssoup').default;

class App extends React.Component{
    constructor(){
        super();
        this.state = {
            query: "",
            paperList: [],
            referenceList: [],
        }
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQryCb = this.sendQryCb.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
    }
    sendQryCb = () => {
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
                    var id = entry.find('id').contents[0]._text.split("/abs/")[1].split("v")[0];
                    tmpList.push({
                        title: title,
                        id: "arXiv:" + id,
                    });
                }
            });
            this.setState({paperList: tmpList});
        })
        .catch(error => {
            console.log(error);
        });
    }
    updateQuery = (query) => {
        this.setState({query: query});
    }

    handleChooseTitle = (title, id) => {
        
        axios.get('http://api.semanticscholar.org/v1/paper/' + id + '?include_unknown_references=false')
        .then(response => {
            var tmpList = [];
            response.data.references.forEach((ref) => {
                if (ref.isInfluential) {
                    // console.log(ref);
                    tmpList.push({title: ref.title, id: ref.paperId})
                }
            });
            var paperList = this.state.paperList;
            if (id.includes("arXiv:")) {
              paperList = [{title: title, id: id}];
            }
            else {
              var i = 0;
              for (; i < paperList.length; i++) {
                if (paperList[i].id == id) {
                  break;
                }
              }
              paperList = paperList.slice(0, i);
              paperList.push({title: title, id: id});
            }
            this.setState({
                referenceList: tmpList,
                paperList: paperList,
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
                <PaperList paperList = {this.state.paperList} handleChooseTitle = {this.handleChooseTitle}></PaperList>
                <ReferenceList referenceList = {this.state.referenceList} handleChooseTitle = {this.handleChooseTitle}></ReferenceList>
            </div>
                
        );
    }
}
ReactDOM.render(<App />, document.getElementById('app'));