// Medication schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const OtherMedicationSchema = Schema({
	name: String,
	dose: String,
	startDate: {type: Date, default: Date.now},
	endDate: {type: Date, default: null},
	type: String,
	compassionateUse: {type: String, default: ''},
	freesideEffects: {type: String, default: ''},
	schedule: String,
	otherSchedule: String,
	notes: String,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('OtherMedication',OtherMedicationSchema)
// we need to export the model so that it is accessible in the rest of the app
