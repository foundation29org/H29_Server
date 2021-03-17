// Prom schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')


const { conndbaccounts } = require('../db_connect')

const StructurePromSchema = Schema({
	data: Schema.Types.Mixed,
	lang: { type: String, required: true},
	createdBy: { type: Schema.Types.ObjectId, ref: "Group"}
})


module.exports = conndbaccounts.model('StructureProm',StructurePromSchema)
// we need to export the model so that it is accessible in the rest of the app
