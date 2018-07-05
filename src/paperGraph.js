import React from 'react';
import Grid from '@material-ui/core/Grid';
import Graph from 'react-graph-vis';
import Slider from '@material-ui/lab/Slider';
import FormLabel from '@material-ui/core/FormLabel';

function getWindowSize() {
    const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    const height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
    return { width, height };
}

class PaperGraph extends React.Component {
    constructor(props) {
        super(props);
        const size = getWindowSize();
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
        this.setState({ maxCitRefShown: value });
    }

    updateWindowSize() {
        this.setState(getWindowSize());
    }

    render() {
        let edges = [];
        const { citationList, referenceList, currentPaper } = this.props;
        let { maxCitRefShown, width, height } = this.state;
        height -= 260;
        width -= 30;
        const nodeSeparation = 40;
        const nodeWidth = (width - nodeSeparation * (maxCitRefShown - 1)) / maxCitRefShown;
        let nodes = [{
            id: 0,
            label: currentPaper.title,
            level: 1,
            paperID: currentPaper.paperId,
        }];
        for (let i = 0; i < maxCitRefShown; i++) {
            if (i < citationList.length) {
                nodes.push({
                    id: 2 * i + 1,
                    label: citationList[i].title,
                    level: 0,
                    widthConstraint: { maximum: nodeWidth },
                    paperID: citationList[i].paperId, // for event usage
                });
                edges.push({ from: 2 * i + 1, to: 0 });
            }
            if (i < referenceList.length) {
                nodes.push({
                    id: 2 * i + 2,
                    label: referenceList[i].title,
                    level: 2,
                    widthConstraint: { maximum: nodeWidth },
                    paperID: referenceList[i].paperId, // for event usage
                });
                edges.push({ from: 0, to: 2 * i + 2 });
            }
        }

        const graph = { nodes, edges };

        const nodeColor = "#92e9dc";

        const options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: "UD",
                    nodeSpacing: nodeSeparation + nodeWidth,
                    levelSeparation: 80,
                },
            },
            physics: {
                enabled: false,
            },
            interaction: {
                zoomView: false,
                dragView: false,
                dragNodes: false,
            },
            width: `${width}px`,
            height: `${height}px`,
            nodes: {
                shape: "box",
                borderWidth: 0,
                labelHighlightBold: false,
                color: nodeColor,
                font: {
                    size: 18,
                },
            },
            edges: {
                width: 5,
                labelHighlightBold: false,
                color: {
                    color: nodeColor,
                    highlight: nodeColor,
                    hover: nodeColor,
                },
            },
        };

        const events = {
            select: (event) => {
                const nodeIDs = event.nodes;
                if (nodeIDs) {
                    nodeIDs.forEach((nodeID) => {
                        const { paperID } = nodes.filter(node => node.id === nodeID)[0];
                        this.props.handleChooseTitle(paperID)();
                    });
                }
            },
        };

        return (
            <Grid container>
                <Grid item sm={2} style={{ marginTop: 20 }}>
                    <FormLabel component="legend">
                        Maximum number shown
                    </FormLabel>
                    <Slider
                        value={maxCitRefShown}
                        min={1}
                        max={6}
                        step={1}
                        onChange={this.handleSliderChange}
                    />
                </Grid>
                <Grid item sm={12}>
                    <Graph graph={graph} options={options} events={events} />
                </Grid>
            </Grid>
        );
    }
}

export default PaperGraph;
