// Group schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')

const { conndbaccounts } = require('../db_connect')

const PromSectionSchema = Schema({
	name: String,
	description: String,
	enabled: {type: Boolean, default: true},
	order: {type: Number, default: 0},
	createdBy: { type: Schema.Types.ObjectId, ref: "Group"}
})


module.exports = conndbaccounts.model('PromSection',PromSectionSchema)
// we need to export the model so that it is accessible in the rest of the app
