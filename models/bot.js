// Group schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')

const { conndbaccounts } = require('../db_connect')

const BotSchema = Schema({
	lang: {type:String, default:""},
    data: {type: Object, default: []},
	date: {type: Date, default: Date.now},
	curatedBy: {type:String, default:""},
	type: String,
	createdBy: { type: Schema.Types.ObjectId, ref: "Group"}
})

module.exports = conndbaccounts.model('Bot',BotSchema)
// we need to export the model so that it is accessible in the rest of the app
