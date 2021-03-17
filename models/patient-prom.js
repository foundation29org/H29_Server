// Prom schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')
const PromSchema = require('./prom')


const { conndbdata } = require('../db_connect')

const PatientPromSchema = Schema({
	data: Schema.Types.Mixed,
	date: {type: Date, default: Date.now},
	definitionPromId: { type: Schema.Types.ObjectId, ref: "PromSchema"},
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})


module.exports = conndbdata.model('PatientProm',PatientPromSchema)
// we need to export the model so that it is accessible in the rest of the app
