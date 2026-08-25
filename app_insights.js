'use strict'

const { TelemetryClient } = require('applicationinsights')
const config = require('./config')

function toConnectionString(value) {
	if (!value) {
		return value
	}
	return String(value).includes('InstrumentationKey=')
		? value
		: `InstrumentationKey=${value}`
}

let client = null

try {
	client = new TelemetryClient(
		toConnectionString(config.APPINSIGHTS_INSTRUMENTATIONKEY),
		{ useGlobalProviders: false }
	)
	client.initialize()
} catch (err) {
	console.error('[appinsights] setup failed:', err && err.message ? err.message : err)
	client = null
}

function trackEvent(telemetry) {
	try {
		if (!client) {
			return
		}
		client.trackEvent(telemetry)
	} catch (err) {
		console.error('[appinsights] trackEvent failed:', err && err.message ? err.message : err)
	}
}

module.exports = {
	trackEvent
}
