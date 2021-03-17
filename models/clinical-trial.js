// Vaccination schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const ClinicalTrialSchema = Schema({
	nameClinicalTrial: String,
	takingClinicalTrial: String,
	drugName: String,
	center: String,
	date: Date,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('ClinicalTrial',ClinicalTrialSchema)
// we need to export the model so that it is accessible in the rest of the app
