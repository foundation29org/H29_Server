/*
* EXPRESS CONFIGURATION FILE
*/
'use strict'

const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars')
const app = express()
const api = require ('./routes')
const path = require('path')
//CORS middleware
const { appInsights }  = require('./app_Insights')
const crypt = require('./services/crypt')
let clientInsights = appInsights.defaultClient;

function setCrossDomain(req, res, next) {
  //instead of * you can define ONLY the sources that we allow.
  res.header('Access-Control-Allow-Origin', '*');
  //http methods allowed for CORS.
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //encrypt for Insights
  var body= crypt.encrypt(JSON.stringify(req.body));
  clientInsights.trackEvent({name: req.url, properties: {headers: req.headers, body: body}});
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
