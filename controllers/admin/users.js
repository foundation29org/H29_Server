// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Patient = require('../../models/patient')
const crypt = require('../../services/crypt')


/**
 * @api {get} https://health29.org/api/admin/subscribeUsers/ Request list of subscribe users to group alert/notification
 * @apiName getSubscribeUsers
 * @apiPrivate
 * @apiDescription This method request the list of subscribe users to group alert/notification
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var param = <group_name>
 *   this.http.get('https://health29.org/api/admin/subscribeUsers/'+param)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of subscribe users to group alerts ok');
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
 * @apiParam {Object} groupName The name of the group.
 * @apiSuccess {Object[]} Result Returns list objects with the information of the users and patients subscribed to group alerts/notifications.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 * 		{
 * 			"userId": <userId>,
 * 			"userName": <userName>,
 * 			"email": <userEmail>,
 * 			"signupDate": <signupDate>,
 * 			"blockedaccount": <blockedaccount>,
 * 			"patientId":<idencrypt>,
 * 			"patientName": <patientName>,
 * 			"surname": <patientSurname>,
 * 			"death": <boolean death>,
 * 			"notes": <patient notes>
 * 		}
 * 	]
 *
 *
 */
function getSubscribeUsers(req, res){
	let group = req.params.groupName;
	User.find({group: group, role: 'User'},(err, users) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		var tempusers = users;
		var totalPatients = 0;
		var patientsAddded = 0;
		var countpos = 0;
		var listUsers = [];
		if(!users){
			res.status(200).send(listUsers)
		}else{
			if(users.length==0){
				res.status(200).send(listUsers)
			}else{
				for(var i = 0; i < users.length; i++) {
					Patient.find({"createdBy": users[i]._id},(err, patients) => {
						countpos++;
						if(patients.length>0){
							totalPatients = totalPatients + patients.length;
							patients.forEach(function(u) {

								if(u.subscriptionToGroupAlerts!=false){
									var id = u._id.toString();
									var idencrypt= crypt.encrypt(id);
									//listpatients.push({sub:idencrypt, patientName: u.patientName, surname: u.surname});
									var enc = false;
									var userEmail = '';
									var signupDate = null;
									var userName = '';
									var userId = '';
									var blockedaccount = false;
									for(var j = 0; j < tempusers.length && !enc; j++) {
										if((tempusers[j]._id).toString() === (u.createdBy).toString()){
											userEmail =  tempusers[j].email
											signupDate = tempusers[j].signupDate
											userName = tempusers[j].userName
											var idUserDecrypt = tempusers[j]._id.toString();
											userId = crypt.encrypt(idUserDecrypt);
											blockedaccount = tempusers[j].blockedaccount
											enc = true;
										}
									}
									listUsers.push({userId: userId, userName: userName, email: userEmail, signupDate: signupDate, blockedaccount: blockedaccount, patientId:idencrypt, patientName: u.patientName, surname: u.surname, death: u.death, notes: u.notes});
									patientsAddded++;
								}
								else{
									patientsAddded++;
								}
							});
						}else{
							listUsers.push({});
							//patientsAddded++;
						}
						if(patientsAddded==totalPatients && countpos==users.length){
							var result = [];
							for(var j = 0; j < listUsers.length; j++) {
								if(listUsers[j].patientId!=undefined){
									result.push(listUsers[j]);
								}
							}
							res.status(200).send(result)
						}
					})
				}
			}
		}



	})

}

/**
 * @api {get} https://health29.org/api/admin/users/ Request list of users of the group.
 * @apiName getUsers
 * @apiPrivate
 * @apiDescription This method request the list of users of the group.
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var param = <group_name>
 *   this.http.get('https://health29.org/api/admin/users/'+param)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of the users of the group ok');
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
 * @apiParam {Object} groupName The name of the group.
 * @apiSuccess {Object[]} Result Returns list objects with the information of the users and patients subscribed to group alerts/notifications.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 * 		{
 * 			"userId": <userId>,
 * 			"userName": <userName>,
 * 			"email": <userEmail>,
 * 			"signupDate": <signupDate>,
 * 			"blockedaccount": <blockedaccount>,
 * 			"patientId":<idencrypt>,
 * 			"patientName": <patientName>,
 * 			"surname": <patientSurname>,
 * 			"death": <boolean death>,
 * 			"notes": <patient notes>
 * 		}
 * 	]
 *
 *
 */
function getUsers (req, res){
	let group = req.params.groupName;
	User.find({group: group, role: 'User'},(err, users) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var tempusers = users;
		var totalPatients = 0;
		var patientsAddded = 0;
		var countpos = 0;
		var listUsers = [];
		if(!users){
			res.status(200).send(listUsers)
		}else{
			if(users.length==0){
				res.status(200).send(listUsers)
			}else{
				for(var i = 0; i < users.length; i++) {
					Patient.find({"createdBy": users[i]._id},(err, patients) => {
						countpos++;
						if(patients.length>0){
							totalPatients = totalPatients + patients.length;
							patients.forEach(function(u) {
								var id = u._id.toString();
								var idencrypt= crypt.encrypt(id);
								//listpatients.push({sub:idencrypt, patientName: u.patientName, surname: u.surname});
								var enc = false;
								var userEmail = '';
								var signupDate = null;
								var userName = '';
								var userId = '';
								var conditionAccepted = false;
								var blockedaccount = false;
								var subgroup = '';
								for(var j = 0; j < tempusers.length && !enc; j++) {
									if((tempusers[j]._id).toString() === (u.createdBy).toString()){
										userEmail =  tempusers[j].email
										signupDate = tempusers[j].signupDate
										userName = tempusers[j].userName
										var idUserDecrypt = tempusers[j]._id.toString();
										userId = crypt.encrypt(idUserDecrypt);
										blockedaccount = tempusers[j].blockedaccount
										subgroup = tempusers[j].subgroup
										conditionAccepted = tempusers[j].termsAccepted.conditionAccepted
										enc = true;
									}
								}
								listUsers.push({userId: userId, userName: userName, email: userEmail, conditionAccepted: conditionAccepted,signupDate: signupDate, blockedaccount: blockedaccount, patientId:idencrypt, patientName: u.patientName, surname: u.surname, death: u.death, notes: u.notes, country: u.country, subgroup: subgroup});
								patientsAddded++;
							});
						}else{
							listUsers.push({});
							//patientsAddded++;
						}
						if(patientsAddded==totalPatients && countpos==users.length){
							var result = [];
							for(var j = 0; j < listUsers.length; j++) {
								if(listUsers[j].patientId!=undefined){
									result.push(listUsers[j]);
								}
							}
							res.status(200).send(result)
						}
					})
				}
			}
		}



	})

}

/**
 * @api {post} https://health29.org/api/admin/patients/ Set patient dead
 * @apiPrivate
 * @apiName setDeadPatient
 * @apiDescription This method set the value of dead for a patient.
 * @apiGroup Patients
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var patientId = <patientId>
 *   var body = {death: <death_value>}
 *   this.http.post('https://health29.org/api/admin/patients/'+patientId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of dead for patient ok');
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
 * @apiParam {String} patientId The unique identifier for the patient.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Dead updated',
 * 		}
 *
 */
function setDeadPatient (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	Patient.findByIdAndUpdate(patientId, { death: req.body.death }, {select: '-createdBy', new: true}, (err,patientUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ message: 'Dead updated'})
	})

}

/**
 * @api {post} https://health29.org/api/admin/users/subgroup/ Set subgroup user
 * @apiPrivate
 * @apiName setSubgroupUser
 * @apiDescription This method set the value of subgroup for a user.
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {subgroup: <subgroup_value>}
 *   this.http.post('https://health29.org/api/admin/users/subgroup/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of subgroup for user ok');
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
 * @apiParam {String} userId The unique identifier for the user.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Subgroup updated',
 * 		}
 *
 */
function setSubgroupUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	User.findByIdAndUpdate(userId, { subgroup: req.body.subgroup }, {select: '-createdBy', new: true}, (err,userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ message: 'Subgroup updated'})
	})

}

/**
 * @api {post} https://health29.org/api/admin/users/state/ Set blockedaccount state for a user
 * @apiPrivate
 * @apiName setStateUser
 * @apiDescription This method set the value of blockedaccount state for a user.
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {blockedaccount: <blockedaccount_value>}
 *   this.http.post('https://health29.org/api/admin/users/state/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Set value of blockedaccount state for a user ok');
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
 * @apiParam {String} userId The unique identifier for the user.
 * @apiSuccess {Object} Result Returns the user updated
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"email": <user email>,
 * 			"role": 'User',
 * 			"group": <group name>,
 * 			"confirmed": true,
 * 			"confirmationCode": <confirmationCode>,
 * 			"signupDate": <signupDate>,
 * 			"lastLogin": <lastLogin>,
 * 			"userName": <userName>,
 * 			"loginAttempts": 0,
 * 			"lang":'en',
 * 			"massunit": 'kg',
 * 			"lengthunit": 'cm',
 * 			"blockedaccount": {type: Boolean, default: false},
 * 			"platform": "H29",
 * 			"subgroup": 0
 * 		}
 *
 *
 */
function setStateUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	let update = req.body
	User.findByIdAndUpdate(userId, { blockedaccount: req.body.blockedaccount }, {new: true}, (err, userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ user: userUpdated})
	})

}


/**
 * @api {get} https://health29.org/api/admin/getPatientsForUserList/ Request list of patients from list user identifiers.
 * @apiName getPatientListForListOfUserIds
 * @apiDescription This method request the list of patients from list user identifiers.
 * @apiGroup Patients
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var param = [<list user Ids>]
 *   this.http.get('https://health29.org/api/admin/getPatientsForUserList/'+param)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of the patients from list user identifiers ok');
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
 * @apiParam {String[]} UserIds A list with the user identifiers.
 * @apiSuccess {Object[]} Result Returns a message with information about the execution and the list with identifiers of the patients
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * 		"message": 'Patient Ids',
 * 		"patientIdsList":[<patientIdsList>]}
 *
 *
 */
async function getPatientListForListOfUserIds(req,res){
	let userIdsList=req.params.userIdList.split(",");
	var patientIdsList=[]
	var cont = 0;
	for(var i =0;i<userIdsList.length;i++){
		var userId=crypt.decrypt(userIdsList[i])
		await Patient.findOne({createdBy:userId},(err,patientFound)=>{
			if(err){
				console.log(err)
				return res.status(500).send(patientIdsList)
			}
			if(patientFound){
				patientIdsList.push(crypt.encrypt(String(patientFound._id)))
			}
			cont++;
			if(userIdsList.length==cont){
			    return res.status(200).send({message: 'Patient Ids', patientIdsList:patientIdsList})
			}
		})
	}

}

/**
 * @api {get} https://health29.org/api/admin/getPatientsForOrganization/ Request list of patients of the organization (subgroup).
 * @apiName getPatientListForOrganization
 * @apiPrivate
 * @apiDescription This method request the list of patients of the organization (subgroup).
 * @apiGroup Patients
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var param = <subgroup>&<date>
 *   this.http.get('https://health29.org/api/admin/getPatientsForOrganization/'+param)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of patients of the organization ok');
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
 * @apiParam {String} subgroup&Date The subgroup name and datenow.
 * @apiSuccess {Object[]} Result Returns a message with information about the execution and the list with identifiers of the patients
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * 		"message": 'Patient Ids',
 * 		"patientIdsList":[<patientIdsList>]}
 *
 *
 */
async function getPatientListForOrganization(req,res){
	let userIdsList=req.params.subgroup.split("&");
	let subgroup = userIdsList[0];
	User.find({subgroup: subgroup, role: 'User'},async function (err, users){
		var patientIdsList=[]
		if(users.length==0){
			return res.status(200).send({message: 'no patients'})
		}else{
			var cont = 0;
			for(var i = 0; i < users.length; i++) {
				await Patient.findOne({"createdBy": users[i]._id}, async (err, patientFound) => {
					if(err){
						console.log(err)
						return res.status(500).send(patientIdsList)
					}
					if(patientFound){
						patientIdsList.push(crypt.encrypt(String(patientFound._id)))
					}
					cont++;

					if(users.length==cont){
						//return patientIdsList
							return res.status(200).send({message: 'Patient Ids', patientIdsList:patientIdsList})
					}
				})
			}


		}

		})
}

module.exports = {
	getSubscribeUsers,
	getUsers,
	setDeadPatient,
	setSubgroupUser,
	setStateUser,
	getPatientListForListOfUserIds,
	getPatientListForOrganization
}
