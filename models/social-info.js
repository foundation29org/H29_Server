// SocialInfo schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const SocialInfoSchema = Schema({
	education: String,
	completedEducation: String,
	currentEducation: String,
	work: String,
	hoursWork: String,
	profession: String,
	livingSituation: Array,
	support: Array,
	sports: Array,
	interests: Array,
	moreInterests: String,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
})

module.exports = conndbdata.model('SocialInfo',SocialInfoSchema)
// we need to export the model so that it is accessible in the rest of the app
