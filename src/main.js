import React from 'react';
import axios from 'axios';
import UserInput from './userInput';
import PaperList from './paperList';
import ReferenceList from './refList';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
const JSSoup = require('jssoup').default;

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            paperList: [],
            referenceList: [],
            onlyInfluential: false,
        }
        this.updateQuery = this.updateQuery.bind(this);
        this.sendQuery = this.sendQuery.bind(this);
        this.handleChooseTitle = this.handleChooseTitle.bind(this);
        this.updateOnlyInfluential = this.updateOnlyInfluential.bind(this);
    }

    sendQuery() {
        var query = this.state.query;
        axios.get("https://export.arxiv.org/api/query?search_query=" + query)
        .then(response => {
            var soup = new JSSoup(response.data);
            var entries = soup.findAll("entry");
            var paperList = [];
            entries.forEach(entry => {
                var find = (str, tag) => tag.find(str).contents[0]._text;
                // var authorList = entry.findAll("author").map(tag => find("name", tag));
                var year = find("published", entry).substring(0, 4);
                if (parseInt(year) >= 2008) {
                    var title = find("title", entry);
                    var id = find("id", entry).split("/abs/")[1].split("v")[0];
                    paperList.push({
                        title: title.replace("\n", " "),
                        id: "arXiv:" + id,
                        info: "ArXiv, " + year,
                    });
                }
            });
            this.setState({
                paperList: paperList,
                referenceList: [],
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    updateQuery(query) {
        this.setState({query: query});
    }

    updateOnlyInfluential(e) {
        this.setState({onlyInfluential: e.target.checked});
    }

    handleChooseTitle(title, id, info) {
        axios.get("https://api.semanticscholar.org/v1/paper/" + id + "?include_unknown_references=false")
        .then(response => {
            var referenceList = [];
            response.data.references.forEach(ref => {
                var reference = {
                    title: ref.title,
                    id: ref.paperId,
                    isInfluential: ref.isInfluential,
                    info: ref.venue + ", " + ref.year,
                };
                if (ref.isInfluential) {
                    referenceList.unshift(reference);
                }
                else {
                    referenceList.push(reference);
                }
            });
            var paperList = this.state.paperList;
            var paper = {
                title: title.replace("\n", " "),
                id: id,
                info: info,
            };
            if (id.includes("arXiv:")) {
                paperList = [paper];
            }
            else {
                var i = 0;
                for (; i < paperList.length; i++) {
                    if (paperList[i].id == id) {
                        break;
                    }
                }
                paperList = paperList.slice(0, i);
                paperList.push(paper);
            }
            this.setState({
                referenceList: referenceList,
                paperList: paperList,
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <UserInput
                    sendQuery={this.sendQuery}
                    query={this.state.query}
                    updateQuery={this.updateQuery}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.onlyInfluential}
                            onChange={this.updateOnlyInfluential}
                            color="primary"
                        />
                    }
                    label="Only influential"
                />
                <PaperList
                    paperList={this.state.paperList}
                    handleChooseTitle={this.handleChooseTitle}
                />
                <ReferenceList
                    referenceList={this.state.referenceList}
                    handleChooseTitle={this.handleChooseTitle}
                    onlyInfluential={this.state.onlyInfluential}
                />
            </div>
        );
    }
}
export default Main;