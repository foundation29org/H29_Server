'use strict'

const mongoose = require ('mongoose')
const config = require('./config')

const conndbaccounts = mongoose.createConnection(config.dbaccounts, { useMongoClient: true })
const conndbdata = mongoose.createConnection(config.dbdata, { useMongoClient: true })

function getConnectionTarget(connectionString) {
	const parts = connectionString.split('@')
	return parts.length > 1 ? parts[1] : 'unknown'
}

function logConnectionEvents(name, connection, connectionString) {
	console.log('[mongo] %s target: %s', name, getConnectionTarget(connectionString))
	console.log('[mongo] %s initial readyState: %s', name, connection.readyState)

	connection.on('connected', function() {
		console.log('[mongo] %s connected, readyState: %s', name, connection.readyState)
	})

	connection.on('error', function(err) {
		console.log('[mongo] %s error: %s', name, err && err.message ? err.message : err)
	})

	connection.on('disconnected', function() {
		console.log('[mongo] %s disconnected, readyState: %s', name, connection.readyState)
	})
}

logConnectionEvents('accounts', conndbaccounts, config.dbaccounts)
logConnectionEvents('data', conndbdata, config.dbdata)

module.exports = {
	conndbaccounts,
	conndbdata
}
