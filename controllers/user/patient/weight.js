// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Weight = require('../../../models/weight')
const WeightHistory = require('../../../models/weight-history')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/weight/:patientId Get weight
 * @apiName getWeight
 * @apiDescription This method read Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/weight/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('weight: '+ res.weight);
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
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value Patient's weight.
 * @apiSuccess {Date} dateTime on which the weight was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"weight":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "dateTime":"2018-02-27T17:55:48.261Z"
 *   }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no weight'}
 * @apiSuccess (Success 202) {String} message If there is no weight for the patient, it will return: "There are no weight"
 */

function getWeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!weight) return res.status(202).send({message: 'There are no weight'})
		res.status(200).send({weight})
	})
}

/**
 * @api {get} https://health29.org/api/weights/:patientId Get history weight
 * @apiName getHistoryWeight
 * @apiDescription This method read History Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/weights/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('Get History weight ok');
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
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value For each weight: Patient's weight.
 * @apiSuccess {Date} dateTime For each weight: on which the weight was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "dateTime":"2018-02-27T17:55:48.261Z"
 *   }
 * ]
 *
 */

function getHistoryWeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	WeightHistory.find({createdBy: patientId}, {"createdBy" : false }).sort({ dateTime : 'asc'}).exec(function(err, weights){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listWeights = [];

		weights.forEach(function(weight) {
			listWeights.push(weight);
		});
		res.status(200).send(listWeights)
	});

}


/**
 * @api {post} https://health29.org/api/weight/:patientId New weight
 * @apiName saveWeight
 * @apiDescription This method create a weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var weight = {value: "43", dateTime: "2018-02-27T17:55:48.261Z"};
 *   this.http.post('https://health29.org/api/weight/'+patientId, weight)
 *    .subscribe( (res : any) => {
 *      console.log('weight: '+ res.weight);
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
 * @apiParam (body) {Object} value Patient's weight. You set the dateTime and the weight
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value Patient's weight. You get the weight
 * @apiSuccess {String} value Patient's weight. You get the dateTime
 * @apiSuccess {String} message If the weight has been created correctly, it returns the message 'Weight created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"weight":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Weight created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no weight'}
 * @apiSuccess (Success 202) {String} message If there is no weight for the patient, it will return: "There are no weight"
 */

function saveWeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let weight = new Weight()
	weight.value = req.body.value
	weight.dateTime = req.body.dateTime
	weight.createdBy = patientId

	Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight2) => {
		if(!weight2){
			// when you save, returns an id in weightStored to access that social-info
			weight.save((err, weightStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

				//save in WeightHistory
				let weightHistory = new WeightHistory()
				weightHistory.value = req.body.value
				weightHistory.dateTime = req.body.dateTime
				weightHistory.createdBy = patientId
				weightHistory.save((err, weightHistoryStored) => {
				})
				//podría devolver weightHistoryStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
				Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight3) => {
					if (err) return res.status(500).send({message: `Error making the request: ${err}`})
					if(!weight3) return res.status(202).send({message: `There are no weight`})
					res.status(200).send({message: 'Weight created', weight: weight3})
				})

			})
		}else{
			return res.status(202).send({ message: 'weight exists', weight: weight2})
		}
	})

}

/**
 * @api {put} https://health29.org/api/weight/:weightId Update weight
 * @apiName updateWeight
 * @apiDescription This method update the weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var weight = {value: "43", dateTime:"2018-02-27T17:55:48.261Z"};
 *   this.http.put('https://health29.org/api/weight/'+weightId, weight)
 *    .subscribe( (res : any) => {
 *      console.log('weight: '+ res.weight);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} weightId Weight unique ID. More info here:  [Get weightId](#api-Weight-getWeight)
 * @apiParam (body) {Object} value Patient's weight. You set the dateTime and the weight
 * @apiSuccess {String} _id Weight unique ID.
 * @apiSuccess {String} value Patient's weight. You get the weight
 * @apiSuccess {String} value Patient's weight. You get the dateTime
 * @apiSuccess {String} message If the weight has been updated correctly, it returns the message 'Weight updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"weight":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Weight updated"
 * }
 *
 */

function updateWeight (req, res){
	let weightId= req.params.weightId;
	let update = req.body
	Weight.findById(weightId, (err, weight) => {
		var patientId = weight.createdBy;
		WeightHistory.find({createdBy: patientId}).sort({ dateTime : 'desc'}).exec(function(err, weights){
			if(weights.length>0){
				var dateLastWeight = new Date(weights[0].dateTime);
				var dateNewWeight = new Date(req.body.dateTime);
				if(dateLastWeight.getTime() <= dateNewWeight.getTime()){
					Weight.findByIdAndUpdate(weightId, update, {select: '-createdBy', new: true}, (err,weightUpdated) => {
						if (err) return res.status(500).send({message: `Error making the request: ${err}`})

						//save in WeightHistory
						Weight.findByIdAndUpdate(weightId, update, {new: true}, (err,weightCreatedBy) => {
							let weightHistory = new WeightHistory()
							weightHistory.value = req.body.value
							weightHistory.dateTime = weightUpdated.dateTime
							weightHistory.createdBy = weightCreatedBy.createdBy
							weightHistory.save((err, weightHistoryStored) => {
							})
						})

						res.status(200).send({message: 'Weight updated', weight: weightUpdated})

					})
				}else{
					//save in WeightHistory
					let weightHistory = new WeightHistory()
					weightHistory.value = req.body.value
					weightHistory.dateTime = req.body.dateTime
					weightHistory.createdBy = patientId
					weightHistory.save((err, weightHistoryStored) => {
						var copyweightHistoryStored = JSON.parse(JSON.stringify(weightHistoryStored));
						delete copyweightHistoryStored.createdBy;
						res.status(200).send({message: 'history updated', weight: copyweightHistoryStored})
					})
				}
			}else{
				//save in WeightHistory
				let weightHistory = new WeightHistory()
				weightHistory.value = req.body.value
				weightHistory.dateTime = req.body.dateTime
				weightHistory.createdBy = patientId
				weightHistory.save((err, weightHistoryStored) => {
					var copyweightHistoryStored = JSON.parse(JSON.stringify(weightHistoryStored));
					delete copyweightHistoryStored.createdBy;
					res.status(200).send({message: 'history updated', weight: copyweightHistoryStored})
				})
			}
		})
	})


}

/**
 * @api {delete} https://health29.org/api/weight/:heightId Delete weight
 * @apiName deleteWeight
 * @apiDescription This method delete Weight of a patient
 * @apiGroup Weight
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/weight/'+weightId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete weight ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} weightId Weight unique ID.
 * @apiSuccess {String} message If the weight has been deleted correctly, it returns the message 'The weight has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		message: "The weight has been eliminated"
 * }
 *
 */
function deleteWeight (req, res){
	let weightId=req.params.weightId

	WeightHistory.findById(weightId, (err, weight) => {
		if (err) return res.status(500).send({message: `Error deleting the weight: ${err}`})
		if(weight){
			weight.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the weight: ${err}`})
				res.status(200).send({message: `The weight has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The weight does not exist'})
		}
	})
}

module.exports = {
	getWeight,
	getHistoryWeight,
	saveWeight,
	updateWeight,
	deleteWeight
}
