'use strict'

let appInsights = require('applicationinsights');
const config = require('./config')

//appInsights.setup(config.APPINSIGHTS_INSTRUMENTATIONKEY);
appInsights.setup(config.APPINSIGHTS_INSTRUMENTATIONKEY).setAutoCollectRequests(false);
appInsights.start();

module.exports = {
	appInsights
}
