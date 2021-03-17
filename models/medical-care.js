// Visit schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const MedicalCareSchema = Schema({
	date: Date,
	data: Object,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('MedicalCare',MedicalCareSchema)
// we need to export the model so that it is accessible in the rest of the app
