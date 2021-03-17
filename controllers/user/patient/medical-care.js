// functions for each call of the api on social-info. Use the vaccination model

'use strict'

// add the vaccination model
const MedicalCare = require('../../../models/medical-care')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/medicalcare/:patientId Get medical care
 * @apiName getMedicalCare
 * @apiDescription This method read medical care of a patient
 * @apiGroup MedicalCare
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/medicalcare/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('medicalcare: '+ res);
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
 * @apiSuccess {String} _id Medical care unique ID.
 * @apiSuccess {Object} data Patient's medical care.
 * @apiSuccess {Date} date on which the medical care was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		"_id" : <medical care id>,
 * 		"date" : {
 * 			"$date" : 1582909945550
 * 		},
 * 		"data" : [
 * 			{
 * 				"data" : [
 * 					{
 * 						"uploadingGenotype" : false,
 * 						"hospitalrecord" : "2020-02-26-Reportmedicalcare0-0.pdf",
 * 						"date" : null,
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "general"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"hospital" : "UMCG (Groningen)",
 * 						"clinician" : "Neurologist",
 * 						"date" : "2020-03-23T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "specificVisit"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"treatment" : "5e71e390b5e9be197c63d202",
 * 						"reason" : "Respiratory",
 * 						"hospital" : "UMCG (Groningen)",
 * 						"enddate" : "2016-02-16T23:00:00.000Z",
 * 						"startdate" : "2016-02-07T23:00:00.000Z",
 * 						"date" : null,
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "hospitalization"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"treatment" : "5e6b6e1a331f001ad479a29a",
 * 						"hospital" : "RadboudUMC (Nijmegen)",
 * 						"date" : "2020-03-15T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "emergencies"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"typeoftest" : "24h holter",
 * 						"date" : "2020-03-03T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "cardiotest"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "respiratorytests"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "bonehealthtest"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "bloodtest"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"uploadingGenotype" : false,
 * 						"hospitalrecord" : "2020-02-26-Reportmedicalcare8-0.pdf",
 * 						"typeoftest" : "Tendonectomy",
 * 						"date" : "2020-02-26T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "surgery"
 * 			}
 * 		]
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medicalCare'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medicalCare"
 */
function getMedicalCare (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	MedicalCare.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, medicalCare) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!medicalCare) return res.status(202).send({message: 'There are no medicalCare'})
		res.status(200).send({medicalCare})
	})
}


/**
 * @api {post} https://health29.org/api/medicalcare/:patientId Create or update medical care
 * @apiName saveMedicalCare
 * @apiDescription This method create or update medical care of a patient
 * @apiGroup MedicalCare
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 * var medicalcare = {		
 * 		"date" : {
 * 			"$date" : 1582909945550
 * 		},
 * 		"data" : [
 * 			{
 * 				"data" : [
 * 					{
 * 						"uploadingGenotype" : false,
 * 						"hospitalrecord" : "2020-02-26-Reportmedicalcare0-0.pdf",
 * 						"date" : null,
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "general"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"hospital" : "UMCG (Groningen)",
 * 						"clinician" : "Neurologist",
 * 						"date" : "2020-03-23T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "specificVisit"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"treatment" : "5e71e390b5e9be197c63d202",
 * 						"reason" : "Respiratory",
 * 						"hospital" : "UMCG (Groningen)",
 * 						"enddate" : "2016-02-16T23:00:00.000Z",
 * 						"startdate" : "2016-02-07T23:00:00.000Z",
 * 						"date" : null,
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "hospitalization"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"treatment" : "5e6b6e1a331f001ad479a29a",
 * 						"hospital" : "RadboudUMC (Nijmegen)",
 * 						"date" : "2020-03-15T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "emergencies"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"typeoftest" : "24h holter",
 * 						"date" : "2020-03-03T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "cardiotest"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "respiratorytests"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "bonehealthtest"
 * 			},
 * 			{
 * 				"data" : [ ],
 * 				"name" : "bloodtest"
 * 			},
 * 			{
 * 				"data" : [
 * 					{
 * 						"uploadingGenotype" : false,
 * 						"hospitalrecord" : "2020-02-26-Reportmedicalcare8-0.pdf",
 * 						"typeoftest" : "Tendonectomy",
 * 						"date" : "2020-02-26T23:00:00.000Z",
 * 						"choise" : ""
 * 					}
 * 				],
 * 				"name" : "surgery"
 * 			}
 * 		]
 * }
 *   this.http.post('https://health29.org/api/medicalcare/'+patientId,medicalcare)
 *    .subscribe( (res : any) => {
 *      console.log('medicalcare: '+ res);
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
 * @apiSuccess {String} _id Medical care unique ID.
 * @apiSuccess {Object} medicalcare Patient's medical care.
 * @apiSuccess {String} message If the medical care has been created correctly, it returns the message 'MedicalCare created'. If the medical care has been updated correctly, it returns the message 'MedicalCare updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		"message":"MedicalCare created",
 * 		"medicalCare":
 * 			{
 * 				"_id" : <medical care id>,
 * 				"date" : {
 * 				"$date" : 1582909945550
 * 			},
 * 			"data" : [
 * 				{
 * 					"data" : [
 * 						{
 * 							"uploadingGenotype" : false,
 * 							"hospitalrecord" : "2020-02-26-Reportmedicalcare0-0.pdf",
 * 							"date" : null,
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "general"
 * 				},
 * 				{
 * 					"data" : [
 * 						{
 * 							"hospital" : "UMCG (Groningen)",
 * 							"clinician" : "Neurologist",
 * 							"date" : "2020-03-23T23:00:00.000Z",
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "specificVisit"
 * 				},
 * 				{
 * 					"data" : [
 * 						{
 * 							"treatment" : "5e71e390b5e9be197c63d202",
 * 							"reason" : "Respiratory",
 * 							"hospital" : "UMCG (Groningen)",
 * 							"enddate" : "2016-02-16T23:00:00.000Z",
 * 							"startdate" : "2016-02-07T23:00:00.000Z",
 * 							"date" : null,
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "hospitalization"
 * 				},
 * 				{
 * 					"data" : [
 * 						{
 * 							"treatment" : "5e6b6e1a331f001ad479a29a",
 * 							"hospital" : "RadboudUMC (Nijmegen)",
 * 							"date" : "2020-03-15T23:00:00.000Z",
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "emergencies"
 * 				},
 * 				{
 * 					"data" : [
 * 						{
 * 							"typeoftest" : "24h holter",
 * 							"date" : "2020-03-03T23:00:00.000Z",
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "cardiotest"
 * 				},
 * 				{
 * 					"data" : [ ],
 * 					"name" : "respiratorytests"
 * 				},
 * 				{
 * 					"data" : [ ],
 * 					"name" : "bonehealthtest"
 * 				},
 * 				{
 * 					"data" : [ ],
 * 					"name" : "bloodtest"
 * 				},
 * 				{
 * 					"data" : [
 * 						{
 * 							"uploadingGenotype" : false,
 * 							"hospitalrecord" : "2020-02-26-Reportmedicalcare8-0.pdf",
 * 							"typeoftest" : "Tendonectomy",
 * 							"date" : "2020-02-26T23:00:00.000Z",
 * 							"choise" : ""
 * 						}
 * 					],
 * 					"name" : "surgery"
 * 				}
 * 			]
 *		}
 * }
 */
function saveMedicalCare (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let update = req.body

	let medicalCare = new MedicalCare()
	medicalCare.data = req.body
	medicalCare.date = Date.now()
	medicalCare.createdBy = patientId

	MedicalCare.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, medicalCareSearched) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!medicalCareSearched) {


			// when you save, returns an id in medicalCareStored to access that MEDICALCARE
			medicalCare.save((err, medicalCareStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
				var copymedicalCareStored = JSON.parse(JSON.stringify(medicalCareStored));
				delete copymedicalCareStored.createdBy;
				res.status(200).send({message: 'MedicalCare created', medicalCare: copymedicalCareStored})

			})
		}else{
			MedicalCare.findByIdAndUpdate(medicalCareSearched._id, { data: req.body }, {select: '-createdBy', new: true}, (err,medicalCareUpdated) => {
				res.status(200).send({message: 'MedicalCare updated', height: medicalCareUpdated})
			})


		}
	})


}


module.exports = {
	getMedicalCare,
	saveMedicalCare
}
