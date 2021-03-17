// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Patient = require('../../models/patient')
const Group = require('../../models/group')
const MedicalCare = require('../../models/medical-care')
const ClinicalTrial = require('../../models/clinical-trial')
const PromSection = require('../../models/prom-section')
const PatientProm = require('../../models/patient-prom')
const Prom = require('../../models/prom')
const Genotype = require('../../models/genotype')
const SocialInfo = require('../../models/social-info')
const Weight = require('../../models/weight')
const Height = require('../../models/height')
const Vaccination = require('../../models/vaccination')
const Medication = require('../../models/medication')
const OtherMedication = require('../../models/other-medication')
const crypt = require('../../services/crypt')

/**
 * @api {get} https://health29.org/api/admin/answers/getanswer Request the answers of a specific patient
 * @apiName getAnswers
 * @apiDescription This method requests the values of the answers of a specific patient
 * @apiGroup Stats
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   this.http.get('https://health29.org/api/admin/answers/getanswer'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of answers of a specific patient ok');
 *     }, (err) => {
 *      ...
 *     }
 * 
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 *
 * @apiParam {String} patientId The unique identifier of a patient
 * @apiSuccess {Object} Result Returns the object with the patient answers for each section/question.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			specificVisit:true/false/'not answered',
 *			hospitalization:true/false/'not answered',
 *			emergencies:true/false/'not answered',
 *			cardiotest:true/false/'not answered',
 *			respiratorytests:true/false/'not answered',
 *			bonehealthtest:true/false/'not answered',
 *			bloodtest:true/false/'not answered',
 *			surgery:true/false/'not answered'
 * 		}
 */
async function getAnswers (req, res){
	let patientId = crypt.decrypt(req.body.patientId)
	await Patient.findById(patientId, {"_id" : false , "createdBy" : false }, async function(err, patient){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if (patient){
			// check if has type's answer
			var answer = ''
			//var data = false
			switch(req.body.type){
				case 'genotype':
					answer = getAnswersType(patient.answers, req.body.type)
					break;
				case 'clinicaltrials':
					answer = getAnswersType(patient.answers, req.body.type)
					break;
				case 'drugs':
					answer = getAnswersType(patient.answers, req.body.type)
					break;
				case 'otherDrugs':
					answer = getAnswersType(patient.answers, req.body.type)
					break;
				case 'vaccinations':
					answer = getAnswersType(patient.answers, req.body.type)
					break;
				case 'medicalCare':
					answer = []
					answer.push({specificVisit:getAnswersType(patient.answers, 'specificVisit'),
						hospitalization:getAnswersType(patient.answers, 'hospitalization'),
						emergencies:getAnswersType(patient.answers, 'emergencies'),
						cardiotest:getAnswersType(patient.answers, 'cardiotest'),
						respiratorytests:getAnswersType(patient.answers, 'respiratorytests'),
						bonehealthtest:getAnswersType(patient.answers, 'bonehealthtest'),
						bloodtest:getAnswersType(patient.answers, 'bloodtest'),
						surgery:getAnswersType(patient.answers, 'surgery')})
					//data = getAnswersData()
					break;
				default:
					//tengo que buscar de CoD:
					answer = getAnswersType(patient.answers, req.body.type)
					//answer = "not answered"
					//data = false
					break;
			}
			res.status(200).send({answer})
		}
	})
	//res.status(200).send(true)
}

function getAnswersType(answersArray, type){
	var result
	if(answersArray.length > 0){
		var hasType = false;
		var i = 0
		while(i < answersArray.length && hasType == false){
			if(answersArray[i].type == type){
				hasType = true
				result = answersArray[i].answer
			}
			i++
		}
		if(hasType == false){
			result = 'not answered'
		}
	}
	else{
		result = 'not answered'
	}
	return result
}

/**
 * @api {post} https://health29.org/api/admin/answers/setanswers Save/Update the answers of a specific patient
 * @apiPrivate
 * @apiName setAnswers
 * @apiDescription This method creates or updates the answers of a specific patient.
 * @apiGroup Stats
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   var body = {
 * 			specificVisit:true,
 *			hospitalization:true,
 *			emergencies:'not answered',
 *			cardiotest:false,
 *			respiratorytests:false,
 *			bonehealthtest:'not answered',
 *			bloodtest:'not answered',
 *			surgery:'not answered'
 * 	 }
 *   this.http.post('https://health29.org/api/admin/admin/answers/setanswers'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create/Update the answers of a specific patient ok');
 *     }, (err) => {
 *      ...
 *     }
 * 
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 *
 * @apiParam {String} patientId The unique identifier of a patient.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Answer updated', 
 * 		}
 * 
 */
function setAnswers (req, res){
	let patientId = crypt.decrypt(req.body.patientId)

	Patient.findById(patientId, {"_id" : false , "createdBy" : false }, (err, patient) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if (patient){
			let newPatient = patient
			// check if has type's answer and change or add value
			switch(req.body.type){
				case 'genotype':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'genotype'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'genotypeFiles':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'genotypeFiles'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'clinicaltrials':
						if(newPatient.answers.length != 0){
							var hasType = false;
							for(var i = 0; i<newPatient.answers.length; i++){
								if(newPatient.answers[i].type == 'clinicaltrials'){
									newPatient.answers[i].answer = req.body.answer
									hasType = true
								}
							}
							if(hasType == false){
								newPatient.answers.push({type:req.body.type, answer: req.body.answer})
							}
						}
						else{
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					break;
				case 'drugs':
						if(newPatient.answers.length != 0){
							var hasType = false;
							for(var i = 0; i<newPatient.answers.length; i++){
								if(newPatient.answers[i].type == 'drugs'){
									newPatient.answers[i].answer = req.body.answer
									hasType = true
								}
							}
							if(hasType == false){
								newPatient.answers.push({type:req.body.type, answer: req.body.answer})
							}
						}
						else{
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					break;
				case 'otherDrugs':
						if(newPatient.answers.length != 0){
							var hasType = false;
							for(var i = 0; i<newPatient.answers.length; i++){
								if(newPatient.answers[i].type == 'otherDrugs'){
									newPatient.answers[i].answer = req.body.answer
									hasType = true
								}
							}
							if(hasType == false){
								newPatient.answers.push({type:req.body.type, answer: req.body.answer})
							}
						}
						else{
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					break;
				case 'vaccinations':
						if(newPatient.answers.length != 0){
							var hasType = false;
							for(var i = 0; i<newPatient.answers.length; i++){
								if(newPatient.answers[i].type == 'vaccinations'){
									newPatient.answers[i].answer = req.body.answer
									hasType = true
								}
							}
							if(hasType == false){
								newPatient.answers.push({type:req.body.type, answer: req.body.answer})
							}
						}
						else{
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					break;
				case 'specificVisit':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){

							if(newPatient.answers[i].type == 'specificVisit'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'hospitalization':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'hospitalization'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'emergencies':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'emergencies'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'cardiotest':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'cardiotest'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'respiratorytests':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'respiratorytests'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'bonehealthtest':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'bonehealthtest'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'bloodtest':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'bloodtest'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'surgery':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'surgery'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				case 'medicalCare':
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == 'medicalCare'){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
				default:
					if(newPatient.answers.length != 0){
						var hasType = false;
						for(var i = 0; i<newPatient.answers.length; i++){
							if(newPatient.answers[i].type == req.body.type){
								newPatient.answers[i].answer = req.body.answer
								hasType = true
							}
						}
						if(hasType == false){
							newPatient.answers.push({type:req.body.type, answer: req.body.answer})
						}
					}
					else{
						newPatient.answers.push({type:req.body.type, answer: req.body.answer})
					}
					break;
			}
			// update new patient
			Patient.findByIdAndUpdate(patientId, newPatient, {"createdBy" : false }, (err, patientUpdated) => {
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				if (patientUpdated){
					res.status(200).send({message: 'Answer updated'})
				}
			})
		}
	})

}

module.exports = {
	getAnswers,
	setAnswers
}
