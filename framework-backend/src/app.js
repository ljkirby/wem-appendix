//Configuration file for UBSafe Backend

var express = require('express'); //import express
var app = express();
var cors = require('cors');

var ClusterController = require('./controllers/ClusterController').router;

app.use(cors());
app.use('/', ClusterController);

module.exports = app;
