// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const SocialInfo = require('../../../models/social-info')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')


/**
 * @api {get} https://health29.org/api/socialinfos/:patientId Get social info
 * @apiName getSocialInfo
 * @apiDescription This method read social info of a patient
 * @apiGroup Social info
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/socialinfos/'+patientId)
 *    .subscribe( (res : any) => {
 *      console.log('social info: '+ res.socialInfo);
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
 * @apiSuccess {String} _id Social info unique ID.
 * @apiSuccess {String} profession Profession of the patient.
 * @apiSuccess {String} hoursWork Number of hours worked per week.
 * @apiSuccess {string="volunteer","paid","no"} work Work of the Patient
 * @apiSuccess {String} currentEducation Current education of the Patient. field can be ...
 * @apiSuccess {String} completedEducation Completed education of the Patient. field can be ...
 * @apiSuccess {string="regularEducation","specialEducation"} education Type of education.
 * @apiSuccess {String[]="gaming","music","sports", "movies", "mindgames", "scouting", "other"} interests
 * @apiSuccess {String[]="swimming","wheelchairHockey","soccer", "hourseRiding", "other"} sports
 * @apiSuccess {String[]="parent","sibling","helpers", "friends", "helperdog"} support
 * @apiSuccess {String[]="parent","institution","partner", "friend", "independent", "other"} livingSituation
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"socialInfo":
 *   {
 *     "_id":"5a6f4b83f660d806744f3ef6",
 *     "profession":"",
 *     "hoursWork":"",
 *     "work":"no",
 *     "currentEducation":"",
 *     "completedEducation":"",
 *     "education":"regularEducation",
 *     "interests":["gaming","music"],
 *     "sports":["other"],
 *     "support":["helpers","friends"],
 *     "livingSituation":["partner"]
 *   }
 * }
 *
 * HTTP/1.1 202 OK
 * {message: 'There are no social info'}
 * @apiSuccess (Success 202) {String} message If there is no social information for the patient, it will return: "There are no social info"
 */
function getSocialInfo (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	SocialInfo.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, socialInfo) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!socialInfo) return res.status(202).send({message: 'There are no social info'})
		res.status(200).send({socialInfo})
		/*Patient.populate(socialInfo, {path: "createdBy"},function(err, socialInfo){
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(!socialInfo) return res.status(202).send({message: `There are no social info`})

			res.status(200).send({socialInfo})
    });*/
	})
}

/**
 * @api {post} https://health29.org/api/socialinfos/:patientId New social info
 * @apiName saveSocialInfo
 * @apiDescription This method read social info of a patient
 * @apiGroup Social info
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var socialInfo = {education: '', completedEducation: '', currentEducation: '', work: '', hoursWork: '', profession: '', livingSituation: '', support: [], sports: [], interests: []};
 *   this.http.post('https://health29.org/api/socialinfos/'+patientId, socialInfo)
 *    .subscribe( (res : any) => {
 *      console.log('social info: '+ res.socialInfo);
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
 * @apiParam (body) {String} [profession] Profession of the patient.
 * @apiParam (body) {String} [hoursWork] Number of hours worked per week.
 * @apiParam (body) {string="volunteer","paid","no"} [work] Work of the Patient
 * @apiParam (body) {String} [currentEducation] Current education of the Patient. field can be ...
 * @apiParam (body) {String} [completedEducation] Completed education of the Patient. field can be ...
 * @apiParam (body) {string="regularEducation","specialEducation"} [education] Type of education.
 * @apiParam (body) {String[]="gaming","music","sports", "movies", "mindgames", "scouting", "other"} [interests]
 * @apiParam (body){String[]="swimming","wheelchairHockey","soccer", "hourseRiding", "other"} [sports]
 * @apiParam (body) {String[]="parent","sibling","helpers", "friends", "helperdog"} [support]
 * @apiParam (body) {String[]="parent","institution","partner", "friend", "independent", "other"} [livingSituation]
 * @apiSuccess {Object} socialInfo All the values that you can pass as a parameter, and also the _id that has been assigned to it (Social info unique ID)
 * @apiSuccess {String} message If the social info has been created correctly, it returns the message 'Social Info created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"socialInfo":
 *   {
 *     "_id":"5a6f4b83f660d806744f3ef6",
 *     "profession":"",
 *     "hoursWork":"",
 *     "work":"no",
 *     "currentEducation":"",
 *     "completedEducation":"",
 *     "education":"regularEducation",
 *     "interests":["gaming","music"],
 *     "sports":["other"],
 *     "support":["helpers","friends"],
 *     "livingSituation":["partner"]
 *   },
 * "message": "Social Info created"
 * }
 *
 */
function saveSocialInfo (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	let socialInfo = new SocialInfo()
	socialInfo.education = req.body.education
	socialInfo.completedEducation = req.body.completedEducation
	socialInfo.currentEducation = req.body.currentEducation
	socialInfo.work = req.body.work
	socialInfo.hoursWork = req.body.hoursWork
	socialInfo.profession = req.body.profession
	socialInfo.livingSituation = req.body.livingSituation
	socialInfo.support = req.body.support
	socialInfo.sports = req.body.sports
	socialInfo.interests = req.body.interests
	socialInfo.moreInterests = req.body.moreInterests
	socialInfo.createdBy = patientId
	// when you save, returns an id in socialInfoStored to access that social-info
	socialInfo.save((err, socialInfoStored) => {
		if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

		//podría devolver socialInfoStored, pero no quiero el field createdBy, asi que hago una busqueda y que no saque ese campo
		SocialInfo.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, socialInfo2) => {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(!socialInfo2) return res.status(202).send({message: `There are no social info`})
			res.status(200).send({message: 'Social Info created', socialInfo: socialInfo2})
		})

	})
}

/**
 * @api {put} https://health29.org/api/socialinfos/:socialInfoId Update social info
 * @apiName updateSocialInfo
 * @apiDescription This method read social info of a patient
 * @apiGroup Social info
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var socialInfo = {education: '', completedEducation: '', currentEducation: '', work: '', hoursWork: '', profession: '', livingSituation: '', support: [], sports: [], interests: []};
 *   this.http.put('https://health29.org/api/socialinfos/'+socialInfoId, socialInfo)
 *    .subscribe( (res : any) => {
 *      console.log('social info: '+ res.socialInfo);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} _id Social info unique ID. More info here:  [Get socialInfoId](#api-Social_info-getSocialInfo)
 * @apiParam (body) {String} [profession] Profession of the patient.
 * @apiParam (body) {String} [hoursWork] Number of hours worked per week.
 * @apiParam (body) {string="volunteer","paid","no"} [work] Work of the Patient
 * @apiParam (body) {String} [currentEducation] Current education of the Patient. field can be ...
 * @apiParam (body) {String} [completedEducation] Completed education of the Patient. field can be ...
 * @apiParam (body) {string="regularEducation","specialEducation"} [education] Type of education.
 * @apiParam (body) {String[]="gaming","music","sports", "movies", "mindgames", "scouting", "other"} [interests]
 * @apiParam (body){String[]="swimming","wheelchairHockey","soccer", "hourseRiding", "other"} [sports]
 * @apiParam (body) {String[]="parent","sibling","helpers", "friends", "helperdog"} [support]
 * @apiParam (body) {String[]="parent","institution","partner", "friend", "independent", "other"} [livingSituation]
 * @apiSuccess {Object} socialInfo All the values that you can pass as a parameter, and also the _id that has been assigned to it (Social info unique ID)
 * @apiSuccess {String} message If the social info has been updated correctly, it returns the message 'Social Info updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"socialInfo":
 *   {
 *     "_id":"5a6f4b83f660d806744f3ef6",
 *     "profession":"",
 *     "hoursWork":"",
 *     "work":"no",
 *     "currentEducation":"",
 *     "completedEducation":"",
 *     "education":"regularEducation",
 *     "interests":["gaming","music"],
 *     "sports":["other"],
 *     "support":["helpers","friends"],
 *     "livingSituation":["partner"]
 *   },
 * "message": "Social Info updated"
 * }
 *
 */
function updateSocialInfo (req, res){
	let socialInfoId= req.params.socialInfoId;
	let update = req.body

	SocialInfo.findByIdAndUpdate(socialInfoId, update, {select: '-createdBy', new: true}, (err,socialInfoUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Social Info updated', socialInfo: socialInfoUpdated})

	})
}


/**
 * @api {delete} https://health29.org/api/socialinfos/:socialInfoId Delete social info
 * @apiName deleteSocialInfo
 * @apiDescription This method deletes social info of a patient
 * @apiGroup Social info
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/socialinfos/'+socialInfoId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete social info ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} _id Social info unique ID. More info here:  [Get socialInfoId](#api-Social_info-getSocialInfo)
 * @apiSuccess {String} message If the social info has been deleted correctly, it returns the message 'The social info has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "The social info has been eliminated"
 * }
 *
 */
function deleteSocialInfo (req, res){
	let socialInfoId=req.params.socialInfoId

	SocialInfo.findById(socialInfoId, (err, socialInfo) => {
		if (err) return res.status(500).send({message: `Error deleting the social info: ${err}`})
		if(socialInfo){
			socialInfo.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the social info: ${err}`})
				res.status(200).send({message: `The social info has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The phenotype does not exist'})
		}
	})
}

module.exports = {
	getSocialInfo,
	saveSocialInfo,
	updateSocialInfo,
	deleteSocialInfo
}
