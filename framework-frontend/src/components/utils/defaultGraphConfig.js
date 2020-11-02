import React from "react";
import Node from '../Node';


const defaultGraphConfig = {
    nodeHighlightBehavior: true,
    highlightOpacity: 0.4,
    highlightDegree: 1,
    directed: true,
    staticGraph: true,
    node: {
      labelProperty: 'label',
      color: 'lightblue',
      highlightColor: 'pink',
      highlightStrokeWidth: 500,
      renderLabel: false,
      fontSize: 12,
      size: {
        width: 1600, 
        height: 1000
      }
    },
    link: {
      highlightColor: 'red',
      fontsize: 13,
      semanticStrokeWidth: true,
      color: 'darkgrey', 
      markerHeight: 100 
    },
};

const generateCustomNode = (node) => {
  return <Node node={node} config={defaultGraphConfig.node} />;
}

export default defaultGraphConfig;
