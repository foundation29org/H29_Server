'use strict'

const mongoose = require ('mongoose')
const config = require('./config')

mongoose.set('strictQuery', false)

// Mongoose 6 still returns a thenable Query when a callback is passed.
// `await Model.find(..., cb)` therefore executes the query twice and throws
// "Query was already executed", which crashes Node 24 as an unhandled rejection.
// Restore Mongoose 4 behavior: the callback owns the query, await is a no-op.
// If a callback is passed, do all work inside it. Never use results after await:
//   await Query.exec(function (err, docs) { local = docs })
//   use(local) // empty — await does not wait. Use: const docs = await Query.exec()
const originalQueryExec = mongoose.Query.prototype.exec
mongoose.Query.prototype.exec = function(op, callback) {
	if (typeof op === 'function' || typeof callback === 'function') {
		this.$__legacyCallback = true
	}
	return originalQueryExec.apply(this, arguments)
}

const originalQueryThen = mongoose.Query.prototype.then
mongoose.Query.prototype.then = function(onFulfilled, onRejected) {
	if (this.$__legacyCallback) {
		return Promise.resolve().then(onFulfilled, onRejected)
	}
	return originalQueryThen.call(this, onFulfilled, onRejected)
}

const mongoOptions = {
	tls: true,
	retryWrites: false
}

const conndbaccounts = mongoose.createConnection(config.dbaccounts, mongoOptions)
const conndbdata = mongoose.createConnection(config.dbdata, mongoOptions)

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
