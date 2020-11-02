import React, { createRef } from "react";
import ReactDOM from "react-dom";
import Graph from '../Graph';
import {
  defaultGraphConfig,
  defaultCoordinates, 
  clusterColors
} from '../utils/';
import Node from '../Node';
import Tabs from '../Tabs';
import ConfigMenu from '../ConfigMenu';
import { readRemoteFile } from 'react-papaparse'

//const SERVER_ADDRESS = 'http://35.209.89.180:8080/';
const SERVER_ADDRESS = 'http://localhost:8080/';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        projectName: 'PartsUnlimitedMRP',
        relationshipTypes: [
          'static', 
          'dynamic', 
          'classnames', 
          'classterms', 
          'contributor', 
          'commit'
        ],
        dependencyGraphs: {
          static: {}, 
          dynamic: {}, 
          commit: {}, 
          contributor: {}, 
          classnames: {}, 
          classterms: {}, 
        },
        selectedRelationshipType: 'static',
        minLinkWeight: 1,
        graphDataLoaded: false,
        depGraphsLoaded: false,
        showClusters: false,
        hasClustered: false,
        loadingClusters: false,
        minEdgeWeight: 0,

        fullscreen: true,
        data: {
          nodes: [],
          links: []
        }, 
        config: defaultGraphConfig,
    } 
  }

  componentDidMount = async () => {
    try {
      await this.fetchGraphFiles();
    }
    catch (err) {
      console.log(err);
    }
  }

  convertCSVtoGraph = (csvRows) => {

    const { minLinkWeight } = this.state; 

    let nodes = {};
    let links = [];

    csvRows.forEach((row, index) => {
      if(row[0] === "Source" || row[0] === "") {
        return;
      }
      else {
        const caller = row[0];
        const callee = row[1];
        let callerLabel = caller.replaceAll('.', '.<br/>');
        callerLabel = callerLabel.replaceAll('Mongo', 'Mongo<br/>');
        let calleeLabel = callee.replaceAll('.', '.<br/>');
        calleeLabel = calleeLabel.replaceAll('Mongo', 'Mongo<br/>');
        const linkWeight = Number(row[2]);


        if( linkWeight >= minLinkWeight)
        {
          if(!(caller in nodes)) {
            nodes[caller] = {
              id: caller, 
              label: callerLabel, 
              title: `TBD - Short description of ${caller}`, 
            };
          }
          if(!(callee in nodes)) {
            nodes[callee] = {
              id: callee, 
              label: calleeLabel, 
              title: `TBD - Short description of ${callee}`,
            };
          }

          let newLink = {
            source: caller, 
            target: callee, 
            linkWeight: linkWeight,
            value: linkWeight/4, 
            label: (linkWeight/5).toString(),
            labelProperty: "label"
          };

          links.push(newLink);
        }
      }
    });

    let updatedNodes = Object.values(nodes);
    let updatedEdges = links;

    let updatedData = {
      nodes: updatedNodes, 
      links: updatedEdges
    };

    return updatedData;
  }

  generateCustomNode = (node) => {
    return <Node showClusters={this.state.showClusters} node={node} config={defaultGraphConfig.node} />;
  }

  updateRelationshipType = async (relationshipType) => {
    let { data, dependencyGraphs, config, minEdgeWeight } = this.state;

    let updatedLinks = dependencyGraphs[relationshipType].links.filter(l => l.linkWeight >= minEdgeWeight );

    let isDirected = true;
    switch(relationshipType) {
      case "static": 
        break;
      case "dynamic": 
        break;
      default: 
        isDirected = false;
        break;
    }

    let updatedConfig = {...config, directed: isDirected };

    let updatedData = {
      ...data,
      links: updatedLinks
    };
    await this.setStateAsync({ 
      data: updatedData, 
      config: updatedConfig,
      selectedRelationshipType: relationshipType
    });
  }

  loadDependencyGraph = async (data, relationshipType, isFinalGraph) => {
      const graph = this.convertCSVtoGraph(data, relationshipType);
      let { dependencyGraphs } = this.state; 
      dependencyGraphs[relationshipType] = graph;
      this.setState({ dependencyGraphs });

      if(isFinalGraph)
      {
        this.setState({depGraphsLoaded: true});
        let { selectedRelationshipType, dependencyGraphs } = this.state; 

        let selectedGraphData = dependencyGraphs[selectedRelationshipType]; 

        await this.setStateAsync({ data: selectedGraphData });
        await this.setStateAsync({ graphDataLoaded: true });
        await this.unfreezeNodes();
      }
  }

  visualizeClusterResults = async (clusterData) => {

    let clusters = {};
    let classToClusterMap = {};

    clusterData.forEach((row) => {
      let clusterName = row[1];
      let clusteredClass = row[2];

      if(typeof clusterName !== "string"){
        return;
      }

      if(!(clusterName in clusters)){
        clusters[clusterName] = [];
      }
      clusters[clusterName].push(clusteredClass);
      classToClusterMap[clusteredClass] = clusterName;
    });

    this.setState({ 
      clusterResults: clusters, 
    });

    let clusterStyles = {
      unclustered: {
        color: 'lightgrey', 
        label: -1
      }
    };
    Object.keys(clusters).forEach((clusterName, index) => {
      clusterStyles[clusterName] = {
        label: index + 1, 
        color: clusterColors[index]
      };
    });

    let { nodes } = this.state.data;

    let updatedNodes = [];
    nodes.forEach((node, index) => {
      let updatedNode = node;

      let nodeCluster = "unclustered";
      if(node.id in classToClusterMap) {
        nodeCluster = classToClusterMap[node.id]; 
      }

      let clusterStyle = clusterStyles[nodeCluster];

      updatedNode.clusterColor = clusterStyle.color;
      updatedNode.clusterLabel = clusterStyle.label;

      updatedNodes[index] = updatedNode;
    });

    await this.setStateAsync({
      data: {
        ...this.state.data, 
        nodes: updatedNodes
      }, 
      showClusters: true
    });

    this.setState({
      loadingClusters: false, 
      hasClustered: true 
    });

    // for each Object.keys(clusters), define cluster node styles in separate object
    // Object.keys(clusters).forEach((cluster) => cluster.forEach(class) => { })

  }

  fetchClusterResults = async (weights) => {
    const { relationshipTypes, projectName } = this.state;
    try {

      let {
        Static, 
        dynamic, 
        classnames, 
        classterms, 
        commit, 
        contributor
      } = weights;

      //let clusterType = "structural";
      //const clusterPath = `clusters/${projectName}/${clusterType}.mdg.rsf`;
      let weightParams = `/${Static}/${dynamic}/${classnames}/${classterms}/${commit}/${contributor}`;
      let { projectName } = this.state;
      const clusterPath = SERVER_ADDRESS + "cluster/" + projectName + weightParams;

      this.setState({ loadingClusters: true });

      readRemoteFile(clusterPath,
      {
        downloadRequestHeaders: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS", 
          "Access-Control-Allow-Headers": "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json", 
          "Access-Control-Allow-Credentials": "true"
        },
        complete: ({ data }) => this.visualizeClusterResults(data) 
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  fetchGraphFiles = async () => {
    const { relationshipTypes, projectName } = this.state;
    try {
      relationshipTypes.forEach((relationshipType, index) => {

        const csvPath = `dependencyGraphs/${projectName}/${relationshipType}.csv`;
        const isFinalGraph = (index === (relationshipTypes.length - 1));

        readRemoteFile(csvPath, {
          complete: ({ data }) => this.loadDependencyGraph(data, relationshipType, isFinalGraph) 
        });
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  /**
   * This function decorates nodes and links with positions. The motivation
   * for this function its to set `config.staticGraph` to true on the first render
   * call, and to get nodes and links statically set to their initial positions.
   * @param  {Object} nodes nodes and links with minimalist structure.
   * @return {Object} the graph where now nodes containing (x,y) coords.
   */
  decorateGraphNodesWithInitialPositioning = nodes => {
    if(nodes != null && nodes != undefined && nodes.length > 0) {
      return nodes.map(n =>
        Object.assign({}, n, {
          x: n.x || defaultCoordinates.nodes.find(node => node.id === n.id).x,
          y: n.y || defaultCoordinates.nodes.find(node => node.id === n.id).y,
        })
      ) 
    }
    else {
      return nodes;
    }
  };

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    })
  }

  freezeNodes = async () => {
    let updatedConfig = this.state.config;

    updatedConfig.staticGraph = true;

    await this.setStateAsync({config: updatedConfig});
  } 

  unfreezeNodes = async () => {
    let updatedConfig = this.state.config;

    updatedConfig.staticGraph = false;

    await this.setStateAsync({config: updatedConfig});
  } 

  // graph event callbacks
  onClickGraph = async (data) => {

  };

  onClickNode =(nodeId) => {
    console.log(this.graph);
    this.setState({
        data: {
            ...this.state.data,
            focusedNodeId: this.state.data.focusedNodeId !== nodeId ? nodeId : null
        }
    });
  };

  onDoubleClickNode = (nodeId) => {
    //window.alert(`Double clicked node ${nodeId}`);
  };

  onRightClickNode =(event, nodeId) => {
    //window.alert(`Right clicked node ${nodeId}`);
  };

  onMouseOverNode =(nodeId) => {
    //window.alert(`Mouse over node ${nodeId}`);
  };

  onMouseOutNode =(nodeId) => {
    //window.alert(`Mouse out node ${nodeId}`);
  };

  onMouseOverLink =(source, target) => {
    //window.alert(`Mouse over in link between ${source} and ${target}`);
    let updatedLinks = this.state.data.links;
    let selectedLinkIndex = updatedLinks.findIndex((link) => (link.source === source && link.target === target));
    updatedLinks[selectedLinkIndex].renderLabel = true;

    this.setState({
      data: {
        ...this.state.data, 
        links: updatedLinks
      }
    });
  };

  onMouseOutLink =(source, target) => {
    let updatedLinks = this.state.data.links;
    let selectedLinkIndex = updatedLinks.findIndex((link) => (link.source === source && link.target === target));
    updatedLinks[selectedLinkIndex].renderLabel = false;

    this.setState({
      data: {
        ...this.state.data, 
        links: updatedLinks
      }
    });
  };

  onClickLink = (source, target) => {
    //window.alert(`Clicked link between ${source} and ${target}`);
  };

  onRightClickLink = (event, source, target) => {
    //window.alert(`Right clicked link between ${source} and ${target}`);
  };


  onNodePositionChange = (nodeId, x, y) => {
    let { data } = this.state;
    let { nodes } = data;

    let nodeIndex = nodes.findIndex(node => node.id === nodeId);

    let updatedNode = nodes[nodeIndex];
    updatedNode.x = x;
    updatedNode.y = y;

    nodes[nodeIndex] = updatedNode;

    data[nodes] = nodes;

    this.setState({ data });
  };

  handleRelationshipTypeChange = async (newValue) => {
    await this.freezeNodes();
    await this.updateRelationshipType(newValue);
    await this.unfreezeNodes();
    this.setState({ selectedRelationshipType: newValue });
  }

  onCluster = async (weights) => {
    Object.keys(weights).forEach((relationshipType) => {
      if(weights[relationshipType] == undefined 
        || weights[relationshipType] == null
        || typeof parseFloat(weights[relationshipType]) != 'number'
        || parseFloat(weights[relationshipType]) <= 0
      ) 
      {
        weights[relationshipType] = "0";
      }
    });
    await this.fetchClusterResults(weights);
  }

  onToggleShowClusters = () => {
    let {showClusters} = this.state;
    this.setState({
      showClusters: !showClusters, 
    }, () => console.log(this.state.hasClustered));
  }

  getFilteredEdgeWeights = () => {
  }

  onMinEdgeWeightChange = async (value) => {
    let { data, dependencyGraphs, config, selectedRelationshipType } = this.state;

    let updatedLinks = dependencyGraphs[selectedRelationshipType].links.filter((l) => l.linkWeight >= value);

    await this.freezeNodes();
    let updatedData = {
      ...data,
      links: updatedLinks
    };
    await this.setStateAsync({ 
      data: updatedData, 
      minEdgeWeight: value
    });
    await this.unfreezeNodes();
  }


  render() {

    const { 
      graphDataLoaded, 
      data, 
      fullscreen, 
      selectedRelationshipType, 
      showClusters, 
      hasClustered,
      loadingClusters
    } = this.state;

    const graphData = {
      nodes: (graphDataLoaded)? this.decorateGraphNodesWithInitialPositioning(data.nodes) : [],
      links: data.links,
      focusedNodeId: data.focusedNodeId,
    };

    let config = this.state.config;
    config.node.viewGenerator = (node) => this.generateCustomNode(node);

    const graphProps = {
      id: "graph",
      data: graphData,
      config: config,
      onClickNode: this.onClickNode,
      onDoubleClickNode: this.onDoubleClickNode,
      onRightClickNode: this.onRightClickNode,
      onClickGraph: this.onClickGraph,
      onClickLink: this.onClickLink,
      onRightClickLink: this.onRightClickLink,
      onMouseOverNode: this.onMouseOverNode,
      onMouseOutNode: this.onMouseOutNode,
      onMouseOverLink: this.onMouseOverLink,
      onMouseOutLink: this.onMouseOutLink,
      onNodePositionChange: this.onNodePositionChange,
      onZoomChange: this.onZoomChange,
    };

    if (fullscreen) {
        graphProps.config = Object.assign({}, graphProps.config, {
          height: window.innerHeight,
          width: window.innerWidth,
        });
    }

    return (
      <div style={{height: '100vh', width: '100vw'}}>
      <Tabs 
        handleChange={this.handleRelationshipTypeChange}
        value={selectedRelationshipType}
      />
      <ConfigMenu 
        onSubmit={this.onCluster}
        showClusters={showClusters}
        hasClustered={hasClustered}
        onToggleShowClusters={this.onToggleShowClusters}
        onMinEdgeWeightChange={this.onMinEdgeWeightChange}
        isLoading={loadingClusters}
      />
      <div style={{
        position: 'absolute', 
        top: 0, 
        height: '100vh', 
        width: '100vw'
      }}>
      { graphDataLoaded &&
          <Graph 
            {...graphProps}
          />
      }
      </div>
      </div>
    )
  }
}

export default App;
