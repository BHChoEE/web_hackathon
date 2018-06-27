import React from 'react';
import Grid from '@material-ui/core/Grid';
import Graph from 'react-graph-vis';

class PaperGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var max = 3;
        var nodes = [{id: 0, label: this.props.currentPaper.title, level: 1}];
        var edges = [];
        var citationList = this.props.citationList;
        var referenceList = this.props.referenceList;
        for (let i = 0; i < max; i++) {
            if (i < citationList.length) {
                nodes.push({id: 2*i + 1, label: citationList[i].title, level: 0});
                edges.push({from: 2*i + 1, to: 0});
            }
            if (i < referenceList.length) {
                nodes.push({id: 2*i + 2, label: referenceList[i].title, level: 2});
                edges.push({from: 0, to: 2*i + 2});
            }
        }
        
        const graph = { nodes: nodes, edges: edges };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: "UD",
                    nodeSpacing: 500
                }
            },
            physics: {
                enabled: false
            },
            interaction: {
                zoomView: false
            }
        };

        const events = {
            select: event => {
                var { nodes, edges } = event;
            }
        }
        
        return (
            <Grid container>
                <Graph graph={graph} options={options} events={events} />
            </Grid>
        );
    }
}

export default PaperGraph;
