// Vaccination schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const VaccinationSchema = Schema({
	name: String,
	freetext: String,
	date: Date,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('Vaccination',VaccinationSchema)
// we need to export the model so that it is accessible in the rest of the app
