// Group schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')

const { conndbaccounts } = require('../db_connect')

const UseralertsSchema = Schema({
    alertId: {type:String, default:""},
    patientId: {type:String, default:""},
    state: {type:String, default:"Not read"},
    snooze: {type:String, default:"1"},
    showDate: {type: Date},
    launch: {type: Boolean, default: false},
    createdBy: { type: Schema.Types.ObjectId, ref: "Group"}
})

module.exports = conndbaccounts.model('Useralerts',UseralertsSchema)
// we need to export the model so that it is accessible in the rest of the app