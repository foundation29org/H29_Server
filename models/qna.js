// Qna schema
'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema
const User = require('./user')

const { conndbaccounts } = require('../db_connect')

const QnaSchema = Schema({
	group: { type: String, required: true},
	knowledgeBaseID: { type: String, required: true},
	lang: { type: String, required: true},
	categories:{type:Object,default:[]}
})

module.exports = conndbaccounts.model('Qna',QnaSchema)
// we need to export the model so that it is accessible in the rest of the app
