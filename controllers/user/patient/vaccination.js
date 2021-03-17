// functions for each call of the api on social-info. Use the vaccination model

'use strict'

// add the vaccination model
const Vaccination = require('../../../models/vaccination')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/vaccinations/:patientId Get vaccinations list
 * @apiName getVaccinations
 * @apiDescription This method read Vaccination of a patient
 * @apiGroup Vaccination
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/vaccinations/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('vaccination: '+ res.vaccination);
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
 * @apiSuccess {String} _id Vaccination unique ID.
 * @apiSuccess {String} value Patient's Vaccination.
 * @apiSuccess {Date} dateTime on which the vaccination was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"vaccination":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "dateTime":"2018-02-27T17:55:48.261Z"
 *   }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no vaccination'}
 * @apiSuccess (Success 202) {String} message If there is no vaccination for the patient, it will return: "There are no vaccination"
 */
function getVaccinations (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	Vaccination.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(function(err, vaccinations){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listVaccinations = [];

		vaccinations.forEach(function(vaccination) {
			listVaccinations.push(vaccination);
		});
		res.status(200).send(listVaccinations)
	});
}


/**
 * @api {post} https://health29.org/api/vaccination/:patientId New vaccination
 * @apiName saveVaccination
 * @apiDescription This method create a vaccination of a patient
 * @apiGroup Vaccination
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var vaccination = {value: "43", dateTime: "2018-02-27T17:55:48.261Z"};
 *   this.http.post('https://health29.org/api/vaccination/'+patientId, vaccination)
 *    .subscribe( (res : any) => {
 *      console.log('vaccination: '+ res.vaccination);
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
 * @apiParam (body) {Object} value Patient's vaccination. You set the dateTime and the vaccination
 * @apiSuccess {String} _id Vaccination unique ID.
 * @apiSuccess {String} value Patient's vaccination. You get the vaccination
 * @apiSuccess {String} value Patient's vaccination. You get the dateTime
 * @apiSuccess {String} message If the vaccination has been created correctly, it returns the message 'Vaccination created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"vaccination":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Vaccination created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no vaccination'}
 * @apiSuccess (Success 202) {String} message If there is no vaccination for the patient, it will return: "There are no vaccination"
 */

function saveVaccination (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	Vaccination.find({createdBy: patientId, name: req.body.name}).sort({ date : 'asc'}).exec(function(err, vaccinations){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listVaccinations = [];
		var failmsg= '';
		var bd = new Date(req.body.date);

		vaccinations.forEach(function(vaccination) {
			if(vaccination.name!="Other"){
				var med = new Date(vaccination.date);

				if(bd.getTime()==med.getTime()){
					failmsg = 'imposible';
				}
			}
		});

		if(failmsg != 'imposible'){
			let vaccination = new Vaccination()
			vaccination.name = req.body.name
			vaccination.freetext = req.body.freetext
			vaccination.date = req.body.date
			vaccination.createdBy = patientId

			// when you save, returns an id in vaccinationStored to access that social-info
			vaccination.save((err, vaccinationStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
				var copyvaccination = JSON.parse(JSON.stringify(vaccinationStored));
				delete copyvaccination.createdBy;
				res.status(200).send({message: 'Vaccination created', vaccination: copyvaccination})

			})
		}else{
				res.status(200).send({message: 'fail', vaccination: []})
		}


	});


}

/**
 * @api {delete} https://health29.org/api/vaccination/:vaccinationId Delete vaccination
 * @apiName deleteVaccination
 * @apiDescription This method delete Vaccination by identifier
 * @apiGroup Vaccination
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/vaccination/'+vaccinationId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete vaccination ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} vaccinationId Vaccination unique ID.
 * @apiSuccess {String} message If the vaccination has been deleted correctly, it returns the message 'The vaccination has been deleted'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "The vaccination has been deleted"
 * }
 *
 */


function deleteVaccination (req, res){
	let vaccinationId=req.params.vaccinationId

	Vaccination.findById(vaccinationId, (err, vaccination) => {
		if (err) return res.status(500).send({message: `Error deleting the vaccination: ${err}`})
		if (vaccination){
			vaccination.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the vaccination: ${err}`})
				res.status(200).send({message: `The vaccination has been deleted`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the vaccination: ${err}`})
		}

	})
}

module.exports = {
	getVaccinations,
	saveVaccination,
	deleteVaccination
}
