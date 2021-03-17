// Group schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const Group = require('./group')

const { conndbaccounts } = require('../db_connect')

const AlertsSchema = Schema({
    groupId: {type:String, default:"None"},
    type: {type:String, default:""},
    identifier: {type:String, default:""},
    //translatedName: [{lang: {type:String, default:""}, value: {type:String, default:""}}],
    translatedName: {type: Object, default: []},
    launchDate: {type: Date, default: Date.now},
    endDate: {type: Date},
    url: {type:Object, default:[]},
	role: { type: String, enum: ['SuperAdmin', 'Admin', 'User'], default: 'User'},
    color: {type:String, default:""},
    logo: {type:String, default:""},
    importance: {type:String, default:""},
    receiver: {type:Object, default:[]},
	createdBy: { type: Schema.Types.ObjectId, ref: "Group"}
})

module.exports = conndbaccounts.model('Alerts',AlertsSchema)
// we need to export the model so that it is accessible in the rest of the app
