import React from 'react';
import Grid from '@material-ui/core/Grid';
import Graph from 'react-graph-vis';
import Slider from '@material-ui/lab/Slider';
import FormLabel from '@material-ui/core/FormLabel';

const getWindowSize = () => {
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    return {width: width, height: height};
}

class PaperGraph extends React.Component {
    constructor(props) {
        super(props);
        var size = getWindowSize();
        this.state = {
            maxCitRefShown: 3,
            width: size.width,
            height: size.height,
        };
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.updateWindowSize = this.updateWindowSize.bind(this);
    }

    componentDidMount() {
        this.updateWindowSize();
        window.addEventListener('resize', this.updateWindowSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowSize);
    }

    handleSliderChange(e, value) {
        this.setState({maxCitRefShown: value});
    }

    updateWindowSize() {
        this.setState(getWindowSize());
    }

    render() {
        var { maxCitRefShown, width, height } = this.state;
        height -= 260;
        width -= 30;
        var nodeSeparation = 50;
        var nodeWidth = (width - nodeSeparation*(maxCitRefShown - 1)) / maxCitRefShown;
        var currentPaper = this.props.currentPaper;
        var nodes = [{
            id: 0,
            label: currentPaper.title,
            level: 1,
            paperID: currentPaper.paperId,
        }];
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
                    paperID: citationList[i].paperId, // for event usage
                });
                edges.push({from: 2*i + 1, to: 0});
            }
            if (i < referenceList.length) {
                nodes.push({
                    id: 2*i + 2,
                    label: referenceList[i].title,
                    level: 2,
                    widthConstraint: {maximum: nodeWidth},
                    paperID: referenceList[i].paperId, // for event usage
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
                enabled: false,
            },
            interaction: {
                zoomView: false,
                dragView: false,
                dragNodes: false,
            },
            width: width + "px",
            height: height + "px",
            nodes: {
                shape: "box",
            },
        };

        const events = {
            select: event => {
                var nodeIDs = event.nodes;
                if (nodeIDs) {
                    nodeIDs.forEach(nodeID => {
                        var paperID = nodes.filter(node => node.id === nodeID)[0].paperID;
                        this.props.handleChooseTitle(paperID)();
                    });
                }
            },
        };
        
        return (
            <Grid container>
                <Grid item sm={2} style={{marginTop: 20}} >
                    <FormLabel component="legend">
                        Maximum number shown
                    </FormLabel>
                    <Slider value={maxCitRefShown} min={1} max={6} step={1} onChange={this.handleSliderChange} />
                </Grid>
                <Grid item sm={12}>
                    <Graph graph={graph} options={options} events={events} />
                </Grid>
            </Grid>
        );
    }
}

export default PaperGraph;
