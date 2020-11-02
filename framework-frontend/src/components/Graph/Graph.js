import { Graph } from "react-d3-graph";
import React from "react";
import ReactDOM from "react-dom";


const d3Graph = (props) => {

  const onClickGraph = function() {
    props.onClickGraph(this.data);
  }

  return (
  <Graph
    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
    data={props.data}
    config={props.config}
    onClickNode={props.onClickNode}
    onDoubleClickNode={props.onDoubleClickNode}
    onRightClickNode={props.onRightClickNode}
    onClickGraph={onClickGraph}
    onClickLink={props.onClickLink}
    onRightClickLink={props.onRightClickLink}
    onMouseOverNode={props.onMouseOverNode}
    onMouseOutNode={props.onMouseOutNode}
    onMouseOverLink={props.onMouseOverLink}
    onMouseOutLink={props.onMouseOutLink}
    onNodePositionChange={props.onNodePositionChange}
  />
  )
}

export default d3Graph;
