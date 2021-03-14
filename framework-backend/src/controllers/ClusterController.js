//dependencies
const express = require('express');
const Response = require('../models/response');
const { execFileSync } = require('child_process');
//setup
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

const CURRENT_WORKING_DIRECTORY = "/Users/<anon-author>/repos/wem/wem-server/src/controllers";

router.get('/cluster/:projectname/:static/:dynamic/:classnames/:classterms/:commit/:contributor', async (req, res) => {
    try {

        console.log(req.params);

        let { 
          projectname,
          static, 
          dynamic, 
          classnames, 
          classterms, 
          commit, 
          contributor
        } = req.params;

        let scriptArguments = `${projectname} ${static} ${dynamic} ${classnames} ${classterms} ${commit} ${contributor}`;
           

        let scriptPath = '../../weightGraphScripts/generateWeightedGraphWithArguments.sh';

        let shellOutput = await execFileSync(`${scriptPath}`, scriptArguments.split(" "), {
          cwd: CURRENT_WORKING_DIRECTORY, 
          encoding: "utf-8"
        });

        const resultsFileName =`${static}-static-${dynamic}-dynamic-${classnames}-classnames-${classterms}-classterms-${commit}-commit-${contributor}-contributor.mdg.rsf`

        const clusterResultsFile = `../weightGraphScripts/bunch/${req.params.projectname}/${resultsFileName}`;
        res.download(clusterResultsFile);
    }
    catch(err) {
        res.status(404).send(new Response(404, err, ""));
    }
});

router.get('/cluster/:projectname', async (req, res) => {
    try {
        let { weights } = req.body;

        let { 
          static, 
          dynamic, 
          classnames, 
          classterms, 
          commit, 
          contributor
        } = req.params;

        const { projectname } = req.params;

        let scriptArguments = `${projectname} ${static} ${dynamic} ${classnames} ${classterms} ${commit} ${contributor}`;
           

        let scriptPath = '../../weightGraphScripts/generateWeightedGraphWithArguments.sh';

        let fileName = await execFileSync(`${scriptPath}`, scriptArguments.split(" "), {
          cwd: CURRENT_WORKING_DIRECTORY
        });
        const resultsFileName =`${static}-static-${dynamic}-dynamic-${classnames}-classnames-${classterms}-classterms-${commit}-commit-${contributor}-contributor.mdg.rsf`

        const clusterResultsFile = `../weightGraphScripts/bunch/${req.params.projectname}/${resultsFileName}`;
        res.download(clusterResultsFile);
    }
    catch(err) {
        res.status(404).send(new Response(404, err, ""));
    }
});

module.exports.router = router;
