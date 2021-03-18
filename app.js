/*
* EXPRESS CONFIGURATION FILE
*/
'use strict'

let appInsights = require('applicationinsights');
const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars')
const app = express()
const api = require ('./routes')
const path = require('path')
const config = require('./config')
//CORS middleware

appInsights.setup(config.APPINSIGHTS_INSTRUMENTATIONKEY);
//appInsights.setup(config.APPINSIGHTS_INSTRUMENTATIONKEY).setAutoCollectRequests(false);
appInsights.start();

function setCrossDomain(req, res, next) {
  //instead of * you can define ONLY the sources that we allow.
  res.header('Access-Control-Allow-Origin', '*');
  //http methods allowed for CORS.
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(setCrossDomain);

app.engine('.hbs', hbs({
	defaultLayout: 'default',
	extname: '.hbs'
}))
app.set('view engine', '.hbs')


// use the forward slash with the module api api folder created routes
app.use('/api',api)


app.use('/apidoc',express.static('apidoc', {'index': ['index.html']}))

/*app.use(express.static(path.join(__dirname, 'apidoc')));*/
/*app.get('/doc', function (req, res) {
    res.sendFile('apidoc/index.html', { root: __dirname });
 });*/

//ruta angular, poner carpeta dist publica
app.use(express.static(path.join(__dirname, 'dist')));
// Send all other requests to the Angular app
app.get('*', function (req, res, next) {
    res.sendFile('dist/index.html', { root: __dirname });
 });
module.exports = app
