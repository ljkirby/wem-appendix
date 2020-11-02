
const defaultGraphOptions = {
  nodes: {
    font: {
      size: 15,
    }
  },
  layout: {
    //improvedLayout: true
    hierarchical: {
      direction: 'UD', 
      sortMethod: 'directed'
    }
  },
  edges: {
    color: "#000000"
  },
  physics: {
    enabled: false,
    hierarchicalRepulsion: {
      nodeDistance: 250,
    },
  }, 
  height: '100%', 
  width: '100%', 
  autoResize: true
};

export default defaultGraphOptions;
