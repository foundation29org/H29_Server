// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const OtherMedication = require('../../../models/other-medication')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/othermedications/:patientId Get Other medication list
 * @apiName getOtherMedications
 * @apiDescription This method read Other Medication of a patient
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/othermedications/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
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
 * @apiSuccess {String} medicationId For each medication: Medication unique ID.
 * @apiSuccess {String} notes For each medication: Other medication notes.
 * @apiSuccess {String} type For each medication: Other value.
 * @apiSuccess {String} dose For each medication: Other medication dose.
 * @apiSuccess {String} name For each medication: Other medication name.
 * @apiSuccess {Date} endDate For each medication: on which the patient ends with other medication.
 * @apiSuccess {Date} startDate For each medication: on which the patient starts with other medication.
 * @apiSuccess {String} freesideEffects For each medication: Other medication freesideEffects added by the patient.
 * @apiSuccess {String} compassionateUse For each medication: Other medication compassionate use.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
*   [{
 *     "_id":"<other medication id>,
 *		"notes" : "",
 *		"type" : "Other",
 *		"dose" : "1000",
 *		"name" : "test",
 *		"endDate" : null,
 *		"startDate" : {
 *			"$date" : 1610406000000
 *		},
 *		"freesideEffects" : "",
 *		"compassionateUse" : ""
 *   }]
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */

function getMedications (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	OtherMedication.find({createdBy: patientId}, {"createdBy" : false }).sort({ endDate : 'asc'}).exec(function(err, medications){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listMedications = [];

		medications.forEach(function(medication) {
			listMedications.push(medication);
		});
		res.status(200).send(listMedications)
	});
}

/**
 * @api {get} https://health29.org/api/othermedicationID/:medicationId Get Other medication by identifier
 * @apiName getOtherMedicationsId
 * @apiDescription This method read a Other Medication by its identifier
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/othermedicationID/'+medicationId)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiSuccess {String} medicationId Medication unique ID.
 * @apiSuccess {String} notes Other medication notes.
 * @apiSuccess {String} type Other value.
 * @apiSuccess {String} dose Other medication dose.
 * @apiSuccess {String} name Other medication name.
 * @apiSuccess {Date} endDate on which the patient ends with other medication.
 * @apiSuccess {Date} startDate on which the patient starts with other medication.
 * @apiSuccess {String} freesideEffects Other medication freesideEffects added by the patient.
 * @apiSuccess {String} compassionateUse Other medication compassionate use.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "_id":"<other medication id>,
 *		"notes" : "",
 *		"type" : "Other",
 *		"dose" : "1000",
 *		"name" : "test",
 *		"endDate" : null,
 *		"startDate" : {
 *			"$date" : 1610406000000
 *		},
 *		"freesideEffects" : "",
 *		"compassionateUse" : ""
 *   }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */

function getMedicationsId (req, res){
	//let medicationId= crypt.decrypt(req.params.medicationId);
	OtherMedication.findOne({"_id": req.params.medicationId}, {"createdBy" : false }, (err, medication) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!medication) return res.status(202).send({message: 'There are no medication'})
		res.status(200).send({medication})
	})
}

/**
 * @api {get} https://health29.org/api/othermedicationName/:patientIdAndMedicationName Get Other medication for patient and by name
 * @apiName getOtherMedicationName
 * @apiDescription This method read Medication of a patient by name
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/othermedicationName/'+patientId-code-MedicationName)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId-code-medicationName Patient unique ID. More info here:  [Get patientId](#api-Patients-getPatientsUser)
 * @apiSuccess {String} medicationId For each medication: Medication unique ID.
 * @apiSuccess {String} notes For each medication: Other medication notes.
 * @apiSuccess {String} type For each medication: Other value.
 * @apiSuccess {String} dose For each medication: Other medication dose.
 * @apiSuccess {String} name For each medication: Other medication name.
 * @apiSuccess {Date} endDate For each medication: on which the patient ends with other medication.
 * @apiSuccess {Date} startDate For each medication: on which the patient starts with other medication.
 * @apiSuccess {String} freesideEffects For each medication: Other medication freesideEffects added by the patient.
 * @apiSuccess {String} compassionateUse For each medication: Other medication compassionate use.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "_id":"<other medication id>,
 *		"notes" : "",
 *		"type" : "Other",
 *		"dose" : "1000",
 *		"name" : "test",
 *		"endDate" : null,
 *		"startDate" : {
 *			"$date" : 1610406000000
 *		},
 *		"freesideEffects" : "",
 *		"compassionateUse" : ""
 *   }
 *
 * HTTP/1.1 202 OK
 * {message: 'medication not found'}
 * @apiSuccess (Success 202) {String} message If there is no medication with this name for the patient, it will return: "medication not found"
 */
function getMedicationName(req,res){
	let patientIdAndMedicationName=req.params.patientIdAndMedicationName;
	patientIdAndMedicationName=patientIdAndMedicationName.split("-code-")
	let patientId=crypt.decrypt(patientIdAndMedicationName[0]);
	let medicationName=patientIdAndMedicationName[1];
	OtherMedication.findOne({createdBy:patientId,name:medicationName}, {"createdBy" : false },(err,medicationFound)=>{
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!medicationFound) return res.status(200).send({message:'medication not found'})
		return res.status(200).send(medicationFound)
	})
}

/**
 * @api {post} https://health29.org/api/othermedication/:patientId New Other medication
 * @apiName saveOtherMedication
 * @apiDescription This method create a new Other medication of a patient
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication = {value: "43", dateTime: "2018-02-27T17:55:48.261Z"};
 *   this.http.post('https://health29.org/api/othermedication/'+patientId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
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
 * @apiParam (body) {Object} value Patient's medication. You set the dateTime and the medication
 * @apiSuccess {String} _id Medication unique ID.
 * @apiSuccess {String} value Patient's medication. You get the medication
 * @apiSuccess {String} value Patient's medication. You get the dateTime
 * @apiSuccess {String} message If the medication has been created correctly, it returns the message 'Medication created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"medication":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Medication created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no medication'}
 * @apiSuccess (Success 202) {String} message If there is no medication for the patient, it will return: "There are no medication"
 */

function saveMedication (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	OtherMedication.find({createdBy: patientId, name: req.body.name}).sort({ endDate : 'asc'}).exec(function(err, medications){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listMedications = [];
		var failmsg= '';
		var bsd = new Date(req.body.startDate);
		var bed = new Date(req.body.endDate);

		medications.forEach(function(medication) {

			var msd = new Date(medication.startDate);
			var med = new Date(medication.endDate);

			if(!medication.endDate && !req.body.endDate){
				failmsg = 'imposible';
			}
			if(!medication.endDate && req.body.endDate){
					if(msd.getTime() <=bsd.getTime() || msd.getTime() <=bed.getTime() ){
						failmsg = 'imposible';
					}
			}
			if(!req.body.endDate && medication.endDate){
					if(bsd.getTime()<=med.getTime()){
						failmsg = 'imposible';
					}
			}

			if(medication.endDate && req.body.endDate){
				if((med.getTime()>=bsd.getTime() && msd.getTime()<=bed.getTime()) || (med.getTime()>=bsd.getTime() && med.getTime()<=bed.getTime()) || (msd.getTime()<=bed.getTime() && med.getTime()>=bed.getTime())){
					failmsg = 'imposible';
				}
			}
		/*	var result = new Date(req.body.startDate);
		  result.setDate(result.getDate() -1);*/

		});

		if(failmsg != 'imposible'){
			let otherMedication = new OtherMedication()
			otherMedication.name = req.body.name
			otherMedication.dose = req.body.dose
			otherMedication.startDate = req.body.startDate
			otherMedication.endDate = req.body.endDate
			otherMedication.type = req.body.type
      otherMedication.schedule = req.body.schedule
      otherMedication.otherSchedule = req.body.otherSchedule
      otherMedication.freesideEffects = req.body.freesideEffects
      otherMedication.compassionateUse = req.body.compassionateUse
			otherMedication.notes = req.body.notes
			otherMedication.createdBy = patientId

			// when you save, returns an id in medicationStored to access that social-info
			otherMedication.save((err, medicationStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
				var copymedicationStored = JSON.parse(JSON.stringify(medicationStored));
				delete copymedicationStored.createdBy;
				res.status(200).send({message: 'Dose created', medication: copymedicationStored})

			})
		}else{
				res.status(200).send({message: 'fail', medication: []})
		}


	});


}

/**
 * @api {put} https://health29.org/api/othermedication/:medicationId Update Other medication
 * @apiName updateOtherMedication
 * @apiDescription This method update the Other medication of a patient
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var medication = {value: "43", dateTime:"2018-02-27T17:55:48.261Z"};
 *   this.http.put('https://health29.org/api/othermedication/'+medicationId, medication)
 *    .subscribe( (res : any) => {
 *      console.log('medication: '+ res.medication);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Medication unique ID.
 * @apiParam (body) {Object} value Patient's medication.
 * @apiSuccess {String} value Patient's medication. You get the medication
 * @apiSuccess {String} value Patient's medication. You get the dateTime
 * @apiSuccess {String} message If the medication has been updated correctly, it returns the message 'Medication updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"medication":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * 	"message": "Medication updated"
 * }
 *
 */

function updateMedication (req, res){
	let medicationId= req.params.medicationId;
	let update = req.body

	OtherMedication.findByIdAndUpdate(medicationId, update, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Medication updated', medication: medicationUpdated})

	})
}

/**
 * @api {delete} https://health29.org/api/othermedications/:medicationId Delete Other medication by identifier
 * @apiName deleteOtherMedication
 * @apiDescription This method delete a specific Other Medication of a patient by identifier
 * @apiGroup Other Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/othermedications/'+medicationId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete medication ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} medicationId Other medication unique ID
 * @apiSuccess {String} message If Other medication has been deleted correctly, it returns the message 'The drug has been deleted'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message":"The drug has been deleted"
 *   }
 */
function deleteMedication (req, res){
	let medicationId=req.params.medicationId

	OtherMedication.findById(medicationId, (err, medication) => {
		if (err) return res.status(500).send({message: `Error deleting the drug: ${err}`})
		if(medication){
			medication.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the drug: ${err}`})
				res.status(200).send({message: `The drug has been deleted`})
			})
		}else{
			 return res.status(202).send({message: 'The drug does not exist'})
		}
	})
}


/**
 * @api {delete} https://health29.org/api/othermedications/update/:PatientIdAndMedicationId Delete Other medication input for a patient by identifier and update previous if exists
 * @apiName deleteOtherMedicationByIDAndUpdateStateForThePrevious
 * @apiDescription This method delete Other medication input for a patient by identifier and update state to current taking for the previous input if exists
 * @apiGroup Medication
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/othermedications/update/'+PatientId-code-MedicationId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete medication and update previous if exists ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} patientId-code-medicationId Patient and Other medication unique IDs
 * @apiSuccess {String} message If Other medication has been deleted correctly and there is not any medication previous, it returns the message 'The medication has been eliminated and there are not other medications'.
 * 	If Other medication has been deleted correctly and there is a medication previous, it returns the message 'Medication has been eliminated, and previous has been updated to current taking'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message":"Medication has been eliminated, and previous has been updated to current taking",
 *   }
 */
function deleteMedicationByIDAndUpdateStateForThePrevious(req,res){
	let params = req.params.PatientIdAndMedicationId;
	params = params.split("-code-");
	let patientId = crypt.decrypt(params[0]);
	let medicationId = params[1];

	OtherMedication.findById(medicationId,(err,medicationfound)=>{
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if (medicationfound){
			// Buscar todas las que tengan el mismo medication drug
			let name = medicationfound.name;
			OtherMedication.find({name:name, createdBy:patientId},(err,othermedication)=>{
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})

				if(othermedication.length>0){
					// No se ha encontrado ninguna otra, solo con la que se está trabajando
					if(othermedication.length==1){
						// Borro la medicacion de entrada segun el Id dado
						medicationfound.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the medication: ${err}`});
							res.status(200).send({message: `The medication has been eliminated and there are not other medications`})
						});
					}
					// Se han encontrado otras
					else{
						let lastEndDate = othermedication[0].endDate;
						let medicationToUpdate = othermedication[0];

						// Miro cual es la que tiene fecha mas actual
						// Me quedo con la que tiene fecha más actual
						for (var i =0;i<othermedication.length;i++){
							if(othermedication[i].endDate>lastEndDate){
								lastEndDate = othermedication[i].endDate;
								medicationToUpdate = othermedication[i]
							}
						}

						// Borro la medicacion de entrada segun el Id dado
						medicationfound.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the medication: ${err}`})
							//res.status(200).send({message: `The medication has been eliminated`})
							// Actualizo la medicacion con fecha mas actual a current taking
							medicationToUpdate.endDate=null;
							OtherMedication.findByIdAndUpdate(medicationToUpdate._id, medicationToUpdate, {select: '-createdBy', new: true}, (err,medicationUpdated) => {
								if (err) return res.status(500).send({message: `Error making the request: ${err}`})
								res.status(200).send({message: 'Medication has been eliminated, and previous has been updated to current taking', medication: medicationUpdated})

							})
						})


					}

				}
			})
		}
	})

}



module.exports = {
	getMedications,
	getMedicationsId,
	getMedicationName,
	saveMedication,
	updateMedication,
	deleteMedication,
	deleteMedicationByIDAndUpdateStateForThePrevious

}
