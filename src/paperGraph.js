import React from 'react';
import Grid from '@material-ui/core/Grid';
import Graph from 'react-graph-vis';
import Slider from '@material-ui/lab/Slider';

class PaperGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxCitRefShown: 3,
        };
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    handleSliderChange(e, value) {
        this.setState({maxCitRefShown: value});
    }

    render() {
        var maxCitRefShown = this.state.maxCitRefShown;
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        height -= 260;
        width -= 30;
        var nodeSeparation = 50;
        var nodeWidth = (width - nodeSeparation*(maxCitRefShown - 1)) / maxCitRefShown;
        var nodes = [{id: 0, label: this.props.currentPaper.title, level: 1}];
        var edges = [];
        var citationList = this.props.citationList;
        var referenceList = this.props.referenceList;
        for (let i = 0; i < maxCitRefShown; i++) {
            if (i < citationList.length) {
                nodes.push({
                    id: 2*i + 1,
                    label: citationList[i].title,
                    level: 0,
                    widthConstraint: {maximum: nodeWidth},
                });
                edges.push({from: 2*i + 1, to: 0});
            }
            if (i < referenceList.length) {
                nodes.push({
                    id: 2*i + 2,
                    label: referenceList[i].title,
                    level: 2,
                    widthConstraint: {maximum: nodeWidth},
                });
                edges.push({from: 0, to: 2*i + 2});
            }
        }
        
        const graph = { nodes: nodes, edges: edges };

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: "UD",
                    nodeSpacing: nodeSeparation + nodeWidth,
                    levelSeparation: 80,
                }
            },
            physics: {
                enabled: false
            },
            interaction: {
                zoomView: false
            },
            width: width + "px",
            height: height + "px",
            nodes: {
                shape: "box",
            },
        };

        const events = {
            select: event => {
                var { nodes, edges } = event;
            }
        }
        
        return (
            <Grid container>
                <Grid item sm={2}>
                    <Slider value={this.state.maxCitRefShown} min={0} max={6} step={1} onChange={this.handleSliderChange} />
                </Grid>
                <Grid item sm={10}>
                </Grid>
                <Grid item sm={12}>
                    <Graph graph={graph} options={options} events={events} />
                </Grid>
            </Grid>
        );
    }
}

export default PaperGraph;
