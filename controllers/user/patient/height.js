// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const Height = require('../../../models/height')
const HeightHistory = require('../../../models/height-history')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/height/:patientId Get height
 * @apiName getHeight
 * @apiDescription This method read Height of a patient
 * @apiGroup Height
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/height/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('height: '+ res.height);
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
 * @apiSuccess {String} _id Height unique ID.
 * @apiSuccess {String} value Patient's height.
 * @apiSuccess {Date} dateTime on which the height was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"height":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *     "dateTime":"2018-02-27T17:55:48.261Z"
 *   }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no height'}
 * @apiSuccess (Success 202) {String} message If there is no height for the patient, it will return: "There are no height"
 */

function getHeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	Height.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, height) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!height) return res.status(202).send({message: 'There are no height'})
		res.status(200).send({height})
	})
}


/**
 * @api {get} https://health29.org/api/heights/:patientId Get history height
 * @apiName getHistoryHeight
 * @apiDescription This method read History Height of a patient
 * @apiGroup Height
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/heights/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('Get history heights ok');
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
 * @apiSuccess {String} _id History Height unique ID.
 * @apiSuccess {String} value For each height: Patient's height.
 * @apiSuccess {Date} dateTime For each height: on which the height was saved.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id":<history height id>,
 *     "value":"43",
 *     "dateTime":"2018-02-27T17:55:48.261Z"
 *   }
 * ]
 *
 */
function getHistoryHeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);

	HeightHistory.find({createdBy: patientId}, {"createdBy" : false }).sort({ dateTime : 'asc'}).exec(function(err, heights){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listHeights = [];

		heights.forEach(function(height) {
			listHeights.push(height);
		});
		res.status(200).send(listHeights)
	});

}

/**
 * @api {post} https://health29.org/api/height/:patientId New height
 * @apiName saveHeight
 * @apiDescription This method create a height of a patient
 * @apiGroup Height
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var height = {value: "43", dateTime: "2018-02-27T17:55:48.261Z"};
 *   this.http.post('https://health29.org/api/height/'+patientId, height)
 *    .subscribe( (res : any) => {
 *      console.log('height: '+ res.height);
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
 * @apiParam (body) {Object} value Patient's height. You set the dateTime and the height
 * @apiSuccess {String} _id Height unique ID.
 * @apiSuccess {String} value Patient's height. You get the height
 * @apiSuccess {String} value Patient's height. You get the dateTime
 * @apiSuccess {String} message If the height has been created correctly, it returns the message 'Height created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"height":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Height created"
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no height'}
 * @apiSuccess (Success 202) {String} message If there is no height for the patient, it will return: "There are no height"
 */

function saveHeight (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let height = new Height()
	height.value = req.body.value
	height.technique = req.body.technique
	height.dateTime = req.body.dateTime
	height.createdBy = patientId

	Height.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, height2) => {
		if(!height2){
			// when you save, returns an id in heightStored to access that social-info
			height.save((err, heightStored) => {
				if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

				//save in HeightHistory
				let heightHistory = new HeightHistory()
				heightHistory.value = req.body.value
				heightHistory.technique = req.body.technique
				heightHistory.dateTime = req.body.dateTime
				heightHistory.createdBy = patientId
				heightHistory.save((err, heightHistoryStored) => {
				})
				//podría devolver heightHistoryStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
				Height.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, height3) => {
					if (err) return res.status(500).send({message: `Error making the request: ${err}`})
					if(!height3) return res.status(202).send({message: `There are no height`})
					res.status(200).send({message: 'Height created', height: height3})
				})

			})
		}else{
			return res.status(202).send({ message: 'height exists', height: height2})
		}
	})

}

/**
 * @api {put} https://health29.org/api/height/:heightId Update height
 * @apiName updateHeight
 * @apiDescription This method update the height of a patient
 * @apiGroup Height
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var height = {value: "43", dateTime:"2018-02-27T17:55:48.261Z"};
 *   this.http.put('https://health29.org/api/height/'+heightId, height)
 *    .subscribe( (res : any) => {
 *      console.log('height: '+ res.height);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} heightId Height unique ID. More info here:  [Get heightId](#api-Height-getHeight)
 * @apiParam (body) {Object} value Patient's height. You set the dateTime and the height
 * @apiSuccess {String} _id Height unique ID.
 * @apiSuccess {String} value Patient's height. You get the height
 * @apiSuccess {String} value Patient's height. You get the dateTime
 * @apiSuccess {String} message If the height has been updated correctly, it returns the message 'Height updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"height":
 *   {
 *     "_id":"5a6f4b83f440d806744f3ef6",
 *     "value":"43",
 *    "dateTime":"2018-02-27T17:55:48.261Z"
 *   },
 * message: "Height updated"
 * }
 *
 */

function updateHeight (req, res){
	let heightId= req.params.heightId;
	let update = req.body
	Height.findById(heightId, (err, height) => {
		var patientId = height.createdBy;
		HeightHistory.find({createdBy: patientId}).sort({ dateTime : 'desc'}).exec(function(err, heights){
			if(heights.length>0){
				var dateLastHeight = new Date(heights[0].dateTime);
				var dateNewHeight = new Date(req.body.dateTime);
				if(dateLastHeight.getTime() <= dateNewHeight.getTime()){
					Height.findByIdAndUpdate(heightId, update, {select: '-createdBy', new: true}, (err,heightUpdated) => {
						if (err) return res.status(500).send({message: `Error making the request: ${err}`})

						//save in HeightHistory
						/*Height.findByIdAndUpdate(heightId, update, {new: true}, (err,heightCreatedBy) => {
							let heightHistory = new HeightHistory()
							heightHistory.value = req.body.value
							heightHistory.technique = req.body.technique
							heightHistory.dateTime = heightUpdated.dateTime
							heightHistory.createdBy = patientId
							heightHistory.save((err, heightHistoryStored) => {
							})
						})*/
						let heightHistory = new HeightHistory()
						heightHistory.value = req.body.value
						heightHistory.technique = req.body.technique
						heightHistory.dateTime = req.body.dateTime
						heightHistory.createdBy = patientId
						heightHistory.save((err, heightHistoryStored) => {
						})

						res.status(200).send({message: 'Height updated', height: heightUpdated})

					})
				}else{
					//save in HeightHistory
					let heightHistory = new HeightHistory()
					heightHistory.value = req.body.value
					heightHistory.technique = req.body.technique
					heightHistory.dateTime = req.body.dateTime
					heightHistory.createdBy = patientId
					heightHistory.save((err, heightHistoryStored) => {
						var copyheightHistoryStored = JSON.parse(JSON.stringify(heightHistoryStored));
						delete copyheightHistoryStored.createdBy;
						res.status(200).send({message: 'history updated', height: copyheightHistoryStored})
					})
				}
			}else{
				//save in HeightHistory
				let heightHistory = new HeightHistory()
				heightHistory.value = req.body.value
				heightHistory.dateTime = req.body.dateTime
				heightHistory.createdBy = patientId
				heightHistory.save((err, heightHistoryStored) => {
					var copyheightHistoryStored = JSON.parse(JSON.stringify(heightHistoryStored));
					delete copyheightHistoryStored.createdBy;
					res.status(200).send({message: 'history updated', height: copyheightHistoryStored})
				})
			}
		})
	})
}

/**
 * @api {delete} https://health29.org/api/height/:heightId Delete height
 * @apiName deleteHeight
 * @apiDescription This method delete Height of a patient
 * @apiGroup Height
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/heights/'+heightId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete height ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} heightId Height unique ID.
 * @apiSuccess {String} message If the height has been deleted correctly, it returns the message 'The height has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 		message: "The height has been eliminated"
 * }
 *
 */
function deleteHeight (req, res){
	let heightId=req.params.heightId

	HeightHistory.findById(heightId, (err, height) => {
		if (err) return res.status(500).send({message: `Error deleting the height: ${err}`})
		if(height){
			height.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the height: ${err}`})
				res.status(200).send({message: `The height has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The height does not exist'})
		}
	})
}

module.exports = {
	getHeight,
	getHistoryHeight,
	saveHeight,
	updateHeight,
	deleteHeight
}
