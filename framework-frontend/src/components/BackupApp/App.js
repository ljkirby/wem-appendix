import React from "react";
import ReactDOM from "react-dom";
// import Graph from "react-graph-vis";
import Graph from '../Graph';
import defaultGraphOptions from '../utils/options.js';

import { readRemoteFile } from 'react-papaparse'

//import "./styles.css";
// need to import the vis network css in order to show tooltip
import "./network.css";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      networkLoaded: false,
      network: null,
      key: 'default',
      graph: { nodes: [], edges: [] }, 
      options: defaultGraphOptions, 
      events: {
        select: function(event) {
          var { nodes, edges } = event;
        }, 
        afterDrawing: (e) => {
          if(!this.state.networkLoaded)
          {
            this.state.network.fit();

            this.setState({networkLoaded: true});

            this.state.network.on("stabilizationIterationsDone", function () {
                this.state.network.setOptions( { physics: false } );
            });

          }
        }, 

        stabilized: () => {
          this.state.network.setOptions( { physics: false } );
        }
      }, 
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
    let nodes = {};
    let edges = [];

    csvRows.forEach((row, index) => {
      if(row[0] === "Source" || row[0] === "") {
        return;
      }
      else {
        let caller = row[0];
        let callee = row[1];
        let edgeWeight = Number(row[2]);


        if( edgeWeight > 3)
        {
          if(!(caller in nodes)) {
            nodes[caller] = {
              id: caller, 
              label: caller.replaceAll('.', '.\n'), 
              title: `TBD - Short description of ${caller}`
            };
          }
          if(!(callee in nodes)) {
            nodes[callee] = {
              id: callee, 
              label: callee.replaceAll('.', '.\n'), 
              title: `TBD - Short description of ${callee}`
            };
          }

          let newEdge = {
            from: caller, 
            to: callee, 
            value: edgeWeight
          };

          edges.push(newEdge);
        }
      }
    });

    var updatedNodes = Object.values(nodes);

    this.state.network.setData({
      nodes: updatedNodes, 
      edges: edges
    });
    this.state.network.fit();
  }

  fetchGraphFiles = async () => {
    try {
      readRemoteFile('dependencyGraphs/static/PartsUnlimitedMRPStaticGraph.csv', {
        complete: ({ data }) => { 
          this.convertCSVtoGraph(data);
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  onNetworkLoaded = (network) => {
      this.setState({ network });

      console.log("network loaded");

      network.on("click", function () {
        network.setOptions( { physics: false } );
        network.setOptions( { layout: { hierarchical: false }} );
      });

      network.on("hold", function () {
        console.log("HOLDING");
        network.setOptions( { physics: false } );
        network.setOptions( { layout: { hierarchical: false }} );
      });
  }

  render() {
    const { network, networkLoaded, key, graph, options, events } = this.state;
    if(networkLoaded) {
      network.fit();
    }
    return (
      <div style={{height: '100vh', width: '100vw'}}>
        <Graph
          key={key}
          graph={graph}
          options={options}
          events={events}
          getNetwork={network => this.onNetworkLoaded(network)}
        />
      </div>
    );
  }
}

export default App;
