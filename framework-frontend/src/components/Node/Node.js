import React from "react";
import {Tooltip} from '@material-ui/core/';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: 13,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}
const Node = (props) => {
  let color = props.node.fill;
  let fontColor = "black";

  if(props.showClusters) {
    color = props.node.clusterColor;
  }
  if(props.node.highlighted) {
    //color = "red";
    fontColor = "white";
  }
  return (
    <div style={{
       width: props.config.size.width/10, 
       height: props.config.size.height/10,
       display: 'flex', 
       textAlign: 'center',
       alignItems: 'center',
       alignContent: 'center',
       justifyContent: 'center'
      }}
    >
      <div 
         style={{
           width: props.config.size.width/10, 
           height: props.config.size.height/20,
           wordWrap: 'normal', 
           fontSize: props.config.fontSize, 
           position: 'absolute', 
           top: props.config.size.height/20 - 4, 
           left: '8px'
         }}
      > 
      { props.showClusters && (props.node.clusterLabel !== -1) &&
        <ClusterLabel 
          label={props.node.clusterLabel} 
          color={color}
        />
      }
    <BootstrapTooltip title={props.node.id}>
      <div 
         style={{
           backgroundColor: color, 
           color: {fontColor}, 
           width: props.config.size.width/10 - 12, 
           height: props.config.size.height/20,
           display: 'flex',
           textAlign: 'center',
           alignItems: 'center',
           alignContent: 'center',
           justifyContent: 'center', 
           zIndex:'-100', 
           borderStyle: 'solid', 
           borderWidth: (props.node.highlighted)? '2px' : '1px', 
           borderColor: (props.node.highlighted)? 'darkred' : 'grey', 
         }}
          dangerouslySetInnerHTML={{__html: props.node.label}}
         />
    </BootstrapTooltip>
      </div>
    </div>
  )
}

const ClusterLabel = (props) => (
  <span
    style={{
      height: '20px', 
      width: '20px', 
      borderRadius: '50%',
      position: 'absolute',
      top: '-7px', 
      left: '-7px',
      backgroundColor: props.color, 
      display: 'flex', 
      textAlign: 'center', 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderStyle: 'solid', 
      borderWidth: '1px',
      borderColor: 'black',
      color: props.fontColor
    }}
  >
    <b>
      {props.label}
    </b>
  </span>
)


export default Node;
