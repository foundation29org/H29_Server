// functions for each call of the api on social-info. Use the vaccination model

'use strict'

// add the ClinicalTrial model
const ClinicalTrial = require('../../../models/clinical-trial')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')

/**
 * @api {get} https://health29.org/api/clinicaltrial/:patientId Get ClinicalTrial
 * @apiName getClinicalTrial
 * @apiDescription This method read ClinicalTrial of a patient
 * @apiGroup ClinicalTrial
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/clinicaltrial/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('Get ClinicalTrial ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiSuccess {String} _id ClinicalTrial unique ID.
 * @apiSuccess {String} nameClinicalTrial ClinicalTrial name.
 * @apiSuccess {String} drugName Name of the drug.
 * @apiSuccess {String} takingClinicalTrial State of taking the drug.
 * @apiSuccess {Date} date Date on which the ClinicalTrial was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  	 {
 *     		"_id": <clinicalTrialId>,
 *     		"date" : {
 *     			"$date" : 1549843200000
 *     		},
 *     		"drugName" : "qwe",
 *     		"takingClinicalTrial" : "Yes, currently",
 *     		"nameClinicalTrial" : "adsa",
 *   	}
 * ]
 *
 */
function getClinicalTrial (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	ClinicalTrial.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(function(err, clinicaltrials){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var listClinicalTrials = [];

		clinicaltrials.forEach(function(clinicaltrial) {
			listClinicalTrials.push(clinicaltrial);
		});
		res.status(200).send(listClinicalTrials)
	});
}

/**
 * @api {post} https://health29.org/api/clinicaltrial/:patientId New ClinicalTrial
 * @apiName saveClinicalTrial
 * @apiDescription This method create a ClinicalTrial of a patient
 * @apiGroup ClinicalTrial
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var ClinicalTrial = {
 *     		"date" : {
 *     			"$date" : 1549843200000
 *     		},
 *     		"drugName" : "qwe",
 *     		"takingClinicalTrial" : "Yes, currently",
 *     		"nameClinicalTrial" : "adsa",
 *   	}
 *   this.http.post('https://health29.org/api/clinicaltrial/'+patientId, ClinicalTrial)
 *    .subscribe( (res : any) => {
 *      console.log('Save ClinicalTrial ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiParam (body) {Object} data Patient's clinicaltrial.
 * @apiSuccess {String} _id ClinicalTrial unique ID.
 * @apiSuccess {String} nameClinicalTrial ClinicalTrial name.
 * @apiSuccess {String} drugName Name of the drug.
 * @apiSuccess {String} takingClinicalTrial State of taking the drug.
 * @apiSuccess {Date} date Date on which the ClinicalTrial was saved.
 * @apiSuccess {String} message If the clinicaltrial has been created correctly, it returns the message 'Clinical trial created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"clinicalTrial":
 *   {
 *     		"_id": <clinicalTrialId>,
 *     		"date" : {
 *     			"$date" : 1549843200000
 *     		},
 *     		"drugName" : "qwe",
 *     		"takingClinicalTrial" : "Yes, currently",
 *     		"nameClinicalTrial" : "adsa",
 *   },
 * 	message: "Clinical trial created"
 * }
 *
 */

function saveClinicalTrial (req, res){

	let patientId= crypt.decrypt(req.params.patientId);
	let clinicalTrial = new ClinicalTrial()
	clinicalTrial.nameClinicalTrial = req.body.nameClinicalTrial
	clinicalTrial.takingClinicalTrial = req.body.takingClinicalTrial
	clinicalTrial.drugName = req.body.drugName
	clinicalTrial.center = req.body.center
	clinicalTrial.date = req.body.date
	clinicalTrial.endDate = req.body.endDate
	clinicalTrial.createdBy = patientId
	// when you save, returns an id in clinicalTrialStored to access that social-info
	clinicalTrial.save((err, clinicalTrialStored) => {
		if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

		//podría devolver clinicalTrialStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
		ClinicalTrial.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, clinicalTrial2) => {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(!clinicalTrial2) return res.status(202).send({message: `There are no clinical trial`})
			var copyclinicalTrial2 = JSON.parse(JSON.stringify(clinicalTrial2));
		  delete copyclinicalTrial2.createdBy;
			res.status(200).send({message: 'Clinical trial created', clinicalTrial: copyclinicalTrial2})
		})

	})


}

/**
 * @api {put} https://health29.org/api/clinicaltrial/:patientId Update ClinicalTrial
 * @apiName updateClinicalTrial
 * @apiDescription This method updates a ClinicalTrial of a patient
 * @apiGroup ClinicalTrial
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var ClinicalTrial = {
 *     		"date" : {
 *     			"$date" : 1549843200000
 *     		},
 *     		"drugName" : "qwe",
 *     		"takingClinicalTrial" : "Yes, currently",
 *     		"nameClinicalTrial" : "adsa",
 *   	}
 *   this.http.put('https://health29.org/api/clinicaltrial/'+patientId, ClinicalTrial)
 *    .subscribe( (res : any) => {
 *      console.log('Update ClinicalTrial ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiParam (body) {Object} data Patient's clinicaltrial.
 * @apiSuccess {String} _id ClinicalTrial unique ID.
 * @apiSuccess {String} nameClinicalTrial ClinicalTrial name.
 * @apiSuccess {String} drugName Name of the drug.
 * @apiSuccess {String} takingClinicalTrial State of taking the drug.
 * @apiSuccess {Date} date Date on which the ClinicalTrial was saved.
 * @apiSuccess {String} message If the clinicaltrial has been updated correctly, it returns the message 'Clinical trial updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"clinicalTrial":
 *   {
 *     		"_id": <clinicalTrialId>,
 *     		"date" : {
 *     			"$date" : 1549843200000
 *     		},
 *     		"drugName" : "qwe",
 *     		"takingClinicalTrial" : "Yes, currently",
 *     		"nameClinicalTrial" : "adsa",
 *   },
 * 	message: "Clinical trial updated"
 * }
 *
 */
function updateClinicalTrial (req, res){
	let clinicalTrialId= req.params.clinicalTrialId;
	let update = req.body

	ClinicalTrial.findByIdAndUpdate(clinicalTrialId, update, {select: '-createdBy', new: true}, (err,clinicalTrialUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var copyclinicalTrial2 = JSON.parse(JSON.stringify(clinicalTrialUpdated));
		delete copyclinicalTrial2.createdBy;
		res.status(200).send({message: 'Clinical trial updated', clinicalTrial: copyclinicalTrial2})

	})
}

/**
 * @api {delete} https://health29.org/api/clinicaltrial/:clinicalTrialId Delete ClinicalTrial
 * @apiName deleteClinicalTrial
 * @apiDescription This method deletes a ClinicalTrial of a patient
 * @apiGroup ClinicalTrial
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/clinicaltrial/'+clinicalTrialId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete ClinicalTrial ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} clinicalTrialId ClinicalTrial unique ID.
 * @apiSuccess {String} message If the clinicaltrial has been deleted correctly, it returns the message 'The clinicalTrial has been deleted'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		message: "The clinicalTrial has been deleted"
 * }
 *
 */

function deleteClinicalTrial (req, res){
	let clinicalTrialId=req.params.clinicalTrialId

	ClinicalTrial.findById(clinicalTrialId, (err, clinicalTrial) => {
		if (err) return res.status(500).send({message: `Error deleting the clinicalTrial: ${err}`})
		if (clinicalTrial){
			clinicalTrial.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the clinicalTrial: ${err}`})
				res.status(200).send({message: `The clinicalTrial has been deleted`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the clinicalTrial: ${err}`})
		}

	})
}

module.exports = {
	getClinicalTrial,
	saveClinicalTrial,
	updateClinicalTrial,
	deleteClinicalTrial
}
