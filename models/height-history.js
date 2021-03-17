// WeightHistory schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Patient = require('./patient')

const { conndbdata } = require('../db_connect')

const HeightHistorySchema = Schema({
	dateTime: {type: Date, default: Date.now},
	value: String,
	technique: String,
	createdBy: { type: Schema.Types.ObjectId, ref: "Patient"}
}, {
    versionKey: false // You should be aware of the outcome after set to false
})

module.exports = conndbdata.model('HeightHistory',HeightHistorySchema)
// we need to export the model so that it is accessible in the rest of the app
