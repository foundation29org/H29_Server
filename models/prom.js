// Prom schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')
const PromSection = require('./prom-section')


const { conndbaccounts } = require('../db_connect')

const PromSchema = Schema({
	name: String,
	responseType: String,
	question: String,
	hideQuestion: {type: Boolean, default: false},
	marginTop: {type: Boolean, default: false},
	annotations: Array,
	values: Array,
	section: { type: Schema.Types.ObjectId, ref: "PromSection"},
	order:Number,
	periodicity: Number,
	isRequired: {type: Boolean, default: false},
	enabled: {type: Boolean, default: false},
	createdBy: { type: Schema.Types.ObjectId, ref: "Group"},
	width: String,
	hpo: String,
	relatedTo: { type: Schema.Types.ObjectId, ref: "PromSchema"},
	disableDataPoints: { type: Schema.Types.ObjectId, ref: "PromSchema"}

})


module.exports = conndbaccounts.model('Prom',PromSchema)
// we need to export the model so that it is accessible in the rest of the app
