import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Container, 
  Typography, 
  Button, 
  Slider, 
  CircularProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(32),
      minHeight: theme.spacing(50),
    },
    position: 'absolute', 
    right: 20, 
    top: 75, 
    zIndex: 10000, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  input: {
    marginBottom: 20, 
    width: 150, 
    alignSelf: 'center', 
    fontFamily: 'Roboto', 
    margin: 'auto'
  }, 
  menuTitle: {
    fontFamily: 'Helvetica', 
    textAlign: 'center',
    marginTop: 20, 
    marginBottom: 20, 
    color: 'darkgrey'
  }, 
  container: {
    height: '100%', 
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignContent: 'center', 
  }, 
  submitButton: {
    marginBottom: 20, 
  }, 
  slider: {
    width: 150
  }
}));

export default function ConfigMenu(props) {
  const classes = useStyles();
  const [Static, setStatic] = useState(0);
  const [dynamic, setDynamic] = useState(0);
  const [classnames, setClassNames] = useState(0);
  const [classterms, setClassTerms] = useState(0);
  const [commit, setCommit] = useState(0);
  const [contributor, setContributor] = useState(0);

  let totalWeight = (
    parseFloat(Static) + 
    parseFloat(dynamic) + 
    parseFloat(classnames) + 
    parseFloat(classterms) +
    parseFloat(contributor) + 
    parseFloat(commit)
  );

  let canCluster = totalWeight == 1 || (totalWeight > 0.99998 && totalWeight < 1.0001); 

  return (
   <div className={classes.root}>
      <Paper elevation={10}>
        <Container fixed className={classes.container}>
          <Typography
            className={classes.menuTitle}
            gutterBottom
          >
          MINIMUM EDGE WEIGHT
          </Typography>
          <Slider
            value={props.minEdgeWeight}
            onChange={(e, value) => props.onMinEdgeWeightChange(value)}
            defaultValue={0}
            className={classes.slider}
            valueLabelDisplay="auto"
            marks={true}
            step={10}
          />
          <Typography
            className={classes.menuTitle}
            gutterBottom
          >
          CLUSTERING WEIGHTS
          </Typography>
          <TextField 
            name="staticWeight"
            className={classes.input}
            label="STATIC"
            variant="filled"
            onChange={({target}) => setStatic(target.value)}
            defaultValue={0.0}
          />
          <TextField 
            name="dynamicWeight"
            className={classes.input}
            label="DYNAMIC"
            variant="filled"
            onChange={({target}) => setDynamic(target.value)}
            defaultValue={0.0}
          />
          <TextField 
            name="classNamesWeight"
            className={classes.input}
            label="CLASS NAMES"
            variant="filled"
            onChange={({target}) => setClassNames(target.value)}
            defaultValue={0.0}
          />
          <TextField 
            name="classTermsWeight"
            className={classes.input}
            label="CLASS TERMS"
            variant="filled"
            onChange={({target}) => setClassTerms(target.value)}
            defaultValue={0.0}
          />
          <TextField 
            name="commitsWeight"
            className={classes.input}
            label="COMMITS"
            variant="filled"
            onChange={({target}) => setCommit(target.value)}
            defaultValue={0.0}
          />
          <TextField 
            name="contributorsWeight"
            className={classes.input}
            label="CONTRIBUTORS"
            variant="filled"
            onChange={({target}) => setContributor(target.value)}
            defaultValue={0.0}
          />
          { props.isLoading?
            <div 
              style={{
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                marginBottom: '16px'
              }}
            >
            <CircularProgress /> 
            </div>
            :
          <Button 
            className={classes.submitButton}
            variant="contained"
            color="primary"
            disabled={!canCluster}
            onClick={() => props.onSubmit({
              Static, 
              dynamic, 
              classnames, 
              classterms, 
              commit, 
              contributor
            })}
          >
            CLUSTER
          </Button>
          }
          {props.hasClustered && 
            <Button 
              className={classes.submitButton}
              variant="outlined"
              color="primary"
              onClick={props.onToggleShowClusters}
            >
              {props.showClusters? "HIDE CLUSTERS" : "SHOW CLUSTERS"}
            </Button>
          }
      </Container>
      </Paper>
    </div>
  );
}
