// functions for each call of the api on user. Use the user model

'use strict'
// add the user model
const { appInsights } = require('../../app_Insights')
let clientInsights = appInsights.defaultClient;
const User = require('../../models/user')
const ClinicalTrial = require('../../models/clinical-trial')
const Genotype = require('../../models/genotype')
const HeightHistory = require('../../models/height-history')
const Height = require('../../models/height')
const MedicalCare = require('../../models/medical-care')
const Medication = require('../../models/medication')
const OtherMedication = require('../../models/other-medication')
const PatientProm = require('../../models/patient-prom')
const Phenotype = require('../../models/phenotype')
const PhenotypeHistory = require('../../models/phenotype-history')
const Seizures = require('../../models/seizures')
const SocialInfo = require('../../models/social-info')
const Vaccination = require('../../models/vaccination')
const WeightHistory = require('../../models/weight-history')
const Weight = require('../../models/weight')


const serviceAuth = require('../../services/auth')
const serviceEmail = require('../../services/email')
const f29azureService = require("../../services/f29azure")
const crypt = require('../../services/crypt')
const Patient = require('../../models/patient')

function sendcode(req, res) {
	// attempt to authenticate user
	req.body.email = (req.body.email).toLowerCase();
	User.getAuthenticated(req.body.email, function (err, user, reason) {
		if (err) return res.status(500).send({ message: err })
		let randomstring = Math.floor(100000 + Math.random() * 900000);
		let dateTimeLogin = Date.now();
		if (user) {
			User.findOne({ 'email': req.body.email }, function (err, user2) {
				if (err){
					insights.error(err);
					return res.status(500).send({ message: `Error creating the user: ${err}` })
				}
				if (!user2) {
					return res.status(500).send({ message: `Fail2` })
				} else {
					User.findByIdAndUpdate(user2._id, { confirmationCode: randomstring, dateTimeLogin: dateTimeLogin }, { new: true }, (err, userUpdated) => {
						if (err){
							insights.error(err);
							return res.status(500).send({ message: `Error making the request: ${err}` })
						}else{
							if(userUpdated){
								//send email
								serviceEmail.sendEmailLogin(userUpdated.email, userUpdated.confirmationCode,  userUpdated.group, userUpdated.lang)
								return res.status(200).send({
									message: 'Check email'
								})
							}else{
								insights.error("The user does not exist");
								return res.status(404).send({ code: 208, message: `The user does not exist` })
							}
							
						}
						
					})
				}
			})
		} else {
			
			var reasons = User.failedLogin;
			clientInsights.trackEvent({name: "Login event fail", properties: {reason: Object.keys(reasons)[reason], headers: req.headers, body: req.body}});
			switch (reason) {
				case reasons.NOT_FOUND:
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.PASSWORD_INCORRECT:
					// note: these cases are usually treated the same - don't tell
					// the user *why* the login failed, only that it did
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.MAX_ATTEMPTS:
					// send email or otherwise notify user that account is
					// temporarily locked
					return res.status(202).send({
						message: 'Account is temporarily locked'
					})
					break;
				case reasons.UNACTIVATED:
					return res.status(202).send({
						message: 'Account is unactivated'
					})
					break;
				case reasons.BLOCKED:
					return res.status(202).send({
						message: 'Account is blocked'
					})
					break;
			}
		}

	})
}

function signUp(req, res){
	let randomstring = Math.random().toString(36).slice(-12)

	const user = new User({
		email: req.body.email.toLowerCase(),
		userName: req.body.userName,
		phone:req.body.phone,
	 	confirmationCode: randomstring,
		lang: req.body.lang,
		group: req.body.group,
		permissions: req.body.permissions,
		subgroup:req.body.subgroup,
		platform: 'H29'
	})
	User.findOne({'email': req.body.email }, function (err, user2) {
	  if (err) return res.status(500).send({ message: `Error creating the user: ${err}`})
		if (!user2){
			user.save((err,userCreated) => {
				if (err) return res.status(500).send({ message: `Error creating the user: ${err}`})
				if (!userCreated) return res.status(500).send({ message: `Error creating the user`})
				if(userCreated){
					res.status(200).send({ message: 'Account created'})
				}
			})

		}else{
			return res.status(202).send({ message: 'fail'})
		}
	})
}

function signIn(req, res){
    // attempt to authenticate user
	req.body.email = (req.body.email).toLowerCase();
	
	User.getAuthenticated(req.body.email, function(err, user, reason) {
		if (err) return res.status(500).send({ message: err })

		// login was successful if we have a user
		if (user) {
			User.findOne({ 'email': req.body.email, 'confirmationCode': req.body.confirmationCode }, function (err, userFound) {
				if (err){
					insights.error(err);
					return res.status(500).send({ message: `Error creating the user: ${err}` })
				}
				if (!userFound) {
					return res.status(500).send({ message: `Login failed` })
				} else {
					var limittime = new Date(); // just for example, can be any other time
					var myTimeSpan = 5*60*1000; // 5 minutes in milliseconds
					limittime.setTime(limittime.getTime() - myTimeSpan);
					if(limittime.getTime() < userFound.dateTimeLogin.getTime()){

						//update lastLogin
						let update = Date.now()
						let userId = userFound._id
						User.findByIdAndUpdate(userId, {lastLogin: update}, (err, userUpdated) => {
							console.log('lastLogin updated')
						})
						return res.status(200).send({
							message: 'You have successfully logged in',
							token: serviceAuth.createToken(user),
							lang: user.lang
						})
					}else{
						return res.status(500).send({ message: `Login failed` })
					}
				}
			})
		}
		// otherwise we can determine why we failed
		else {
			var reasons = User.failedLogin;
			clientInsights.trackEvent({name: "Login event fail", properties: {reason: Object.keys(reasons)[reason], headers: req.headers, body: req.body}});
			switch (reason) {
				case reasons.NOT_FOUND:
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.PASSWORD_INCORRECT:
					// note: these cases are usually treated the same - don't tell
					// the user *why* the login failed, only that it did
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.MAX_ATTEMPTS:
					// send email or otherwise notify user that account is
					// temporarily locked
					return res.status(202).send({
						message: 'Account is temporarily locked'
					})
					break;
				case reasons.UNACTIVATED:
					return res.status(202).send({
						message: 'Account is unactivated'
					})
					break;
				case reasons.BLOCKED:
					return res.status(202).send({
						message: 'Account is blocked'
					})
					break;
			}

		}
	})
}


/**
 * @api {get} https://health29.org/api/users/:id Get user
 * @apiName getUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiDescription This methods read data of a User
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/users/'+userId)
 *    .subscribe( (res : any) => {
 *      console.log(res.userName);
 *   }, (err) => {
 *     ...
 *   }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId User unique ID. More info here:  [Get token and userId](#api-Access_token-signIn)
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} userName UserName of the User.
 * @apiSuccess {String} lang lang of the User.
 * @apiSuccess {String} group Group of the User.
 * @apiSuccess {Date} signupDate Signup date of the User.
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"user":
 *  {
 *   "email": "John@example.com",
 *   "userName": "Doe",
 *   "lang": "en",
 *   "group": "nameGroup",
 *   "signupDate": "2018-01-26T13:25:31.077Z"
 *  }
 * }
 *
 */
function getUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "role" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!user) return res.status(404).send({code: 208, message: `The user does not exist`})

		res.status(200).send({user})
	})
}

function getSettings (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"userName": false, "lang": false, "email": false, "signupDate": false, "_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "randomCodeRecoverPass" : false, "dateTimeRecoverPass" : false, "role" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!user) return res.status(404).send({code: 208, message: `The user does not exist`})

		res.status(200).send({user})
	})
}


/**
 * @api {put} https://health29.org/api/users/:id Update user
 * @apiName updateUser
 * @apiVersion 1.0.0
 * @apiDescription This method allows to change the user's data
 * @apiGroup Users
 * @apiExample {js} Example usage:
 *   this.http.put('https://health29.org/api/users/'+userId, this.user)
 *    .subscribe( (res : any) => {
 *      console.log('User update: '+ res.user);
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId User unique ID. More info here:  [Get token and userId](#api-Access_token-signIn)
 * @apiParam (body) {String} [userName] UserName of the User.
 * @apiParam (body) {String} [lang] lang of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} userName UserName of the User.
 * @apiSuccess {String} lang lang of the User.
 * @apiSuccess {String} group Group of the User.
 * @apiSuccess {Date} signupDate Signup date of the User.
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {"user":
 *  {
 *   "email": "John@example.com",
 *   "userName": "Doe",
 *   "lang": "en",
 *   "group": "nameGroup",
 *   "signupDate": "2018-01-26T13:25:31.077Z"
 *  }
 * }
 *
 */

function updateUser (req, res){
	let userId= crypt.decrypt(req.params.userId);
	let update = req.body

	User.findByIdAndUpdate(userId, update, {select: '-_id userName lang email signupDate massunit lengthunit modules', new: true}, (err, userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ user: userUpdated})
	})
}

function senddeletecode(req, res) {
	// attempt to authenticate user
	req.body.email = (req.body.email).toLowerCase();
	User.getAuthenticated(req.body.email, function (err, user, reason) {
		if (err) return res.status(500).send({ message: err })
		let randomstring = Math.floor(100000 + Math.random() * 900000);
		let dateTimeLogin = Date.now();
		if (user) {
			User.findOne({ 'email': req.body.email }, function (err, user2) {
				if (err){
					insights.error(err);
					return res.status(500).send({ message: `Error creating the user: ${err}` })
				}
				if (!user2) {
					return res.status(500).send({ message: `Fail2` })
				} else {
					User.findByIdAndUpdate(user2._id, { confirmationCode: randomstring, dateTimeLogin: dateTimeLogin }, { new: true }, (err, userUpdated) => {
						if (err){
							insights.error(err);
							return res.status(500).send({ message: `Error making the request: ${err}` })
						}else{
							if(userUpdated){
								//send email
								serviceEmail.sendEmailDelete(userUpdated.email, userUpdated.confirmationCode,  userUpdated.group, userUpdated.lang)
								return res.status(200).send({
									message: 'Check email'
								})
							}else{
								insights.error("The user does not exist");
								return res.status(404).send({ code: 208, message: `The user does not exist` })
							}
							
						}
						
					})
				}
			})
		} else {
			
			var reasons = User.failedLogin;
			clientInsights.trackEvent({name: "Login event fail", properties: {reason: Object.keys(reasons)[reason], headers: req.headers, body: req.body}});
			switch (reason) {
				case reasons.NOT_FOUND:
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.PASSWORD_INCORRECT:
					// note: these cases are usually treated the same - don't tell
					// the user *why* the login failed, only that it did
					return res.status(202).send({
						message: 'Login failed'
					})
					break;
				case reasons.MAX_ATTEMPTS:
					// send email or otherwise notify user that account is
					// temporarily locked
					return res.status(202).send({
						message: 'Account is temporarily locked'
					})
					break;
				case reasons.UNACTIVATED:
					return res.status(202).send({
						message: 'Account is unactivated'
					})
					break;
				case reasons.BLOCKED:
					return res.status(202).send({
						message: 'Account is blocked'
					})
					break;
			}
		}

	})
}


/**
 * @api {delete} https://health29.org/api/users/:id Delete user
 * @apiName deleteUser
 * @apiVersion 1.0.0
 * @apiDescription This method allows to delete a user
 * @apiGroup Users
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/users/'+userId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete user ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {String} userId User unique ID. More info here:  [Get token and userId](#api-Access_token-signIn)
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 *     {message: `Error deleting the user: ${err}`}
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{message: `The user has been deleted.`}
 *
 */

function deleteUser (req, res){
	let userId=req.params.userId
	userId= crypt.decrypt(userId);
	
	User.findOne({ 'email': req.body.email, 'confirmationCode': req.body.confirmationCode, '_id': userId }, function (err, userFound) {
		if (err){
			insights.error(err);
			return res.status(500).send({ message: `Error creating the user: ${err}` })
		}
		if (!userFound) {
			return res.status(500).send({ message: `Login failed` })
		} else {
			var limittime = new Date(); // just for example, can be any other time
			var myTimeSpan = 5*60*1000; // 5 minutes in milliseconds
			limittime.setTime(limittime.getTime() - myTimeSpan);
			if(limittime.getTime() < userFound.dateTimeLogin.getTime()){
				Patient.findOne({"createdBy": userId},(err, patient) => {
					if (err) return res.status(500).send({message: `Error making the request: ${err}`})
					if(patient){
						var patientId = patient._id.toString();
						var patientIdCrypt=crypt.encrypt(patient._id.toString());
						var containerName=patientIdCrypt.substr(1).toString();
						deleteClinicalTrials(patientId);
						deleteGenotypes(patientId);
						deleteHeightHistory(patientId);
						deleteHeight(patientId);
						deleteMedicalCare(patientId);
						deleteMedication(patientId);
						deleteOtherMedication(patientId);
						deletePatProm(patientId);
						deletePhenotype(patientId);
						deletePhenotypeHistory(patientId);
						deleteSeizures(patientId);
						deleteSocialInfo(patientId);
						deleteVaccination(patientId);
						deleteWeightHistory(patientId);
						deleteWeight(patientId);
						deletePatient(patientId, containerName);
					}
					
					
				})
				confirmDeleteUser(res, userId);

			}else{
				return res.status(500).send({ message: `Login failed` })
			}
		}
	})
}

function deleteClinicalTrials (patientId){
	ClinicalTrial.find({ 'createdBy': patientId }, (err, clinicalTrials) => {
		if (err) console.log({message: `Error deleting the medications: ${err}`})
		clinicalTrials.forEach(function(clinicalTrial) {
			clinicalTrial.remove(err => {
				if(err) console.log({message: `Error deleting the clinicalTrials: ${err}`})
			})
		});
	})
}

function deleteGenotypes (patientId){
	Genotype.find({ 'createdBy': patientId }, (err, genotypes) => {
		if (err) console.log({message: `Error deleting the genotypes: ${err}`})
		genotypes.forEach(function(genotype) {
			genotype.remove(err => {
				if(err) console.log({message: `Error deleting the genotypes: ${err}`})
			})
		});
	})
}

function deleteHeightHistory (patientId){
	HeightHistory.find({ 'createdBy': patientId }, (err, heightHistories) => {
		if (err) console.log({message: `Error deleting the heightHistories: ${err}`})
		heightHistories.forEach(function(heightHistory) {
			heightHistory.remove(err => {
				if(err) console.log({message: `Error deleting the heightHistories: ${err}`})
			})
		});
	})
}

function deleteMedication (patientId){
	Medication.find({ 'createdBy': patientId }, (err, medications) => {
		if (err) console.log({message: `Error deleting the medications: ${err}`})
		medications.forEach(function(medication) {
			medication.remove(err => {
				if(err) console.log({message: `Error deleting the medications: ${err}`})
			})
		});
	})
}

function deleteOtherMedication (patientId){
	OtherMedication.find({ 'createdBy': patientId }, (err, otherMedications) => {
		if (err) console.log({message: `Error deleting the otherMedications: ${err}`})
		otherMedications.forEach(function(otherMedication) {
			otherMedication.remove(err => {
				if(err) console.log({message: `Error deleting the otherMedications: ${err}`})
			})
		});
	})
}

function deletePatProm (patientId){
	PatientProm.find({ 'createdBy': patientId }, (err, patientProms) => {
		if (err) console.log({message: `Error deleting the patientProms: ${err}`})
		patientProms.forEach(function(patientProm) {
			patientProm.remove(err => {
				if(err) console.log({message: `Error deleting the patientProms: ${err}`})
			})
		});
	})
}

function deletePhenotype (patientId){
	Phenotype.find({ 'createdBy': patientId }, (err, phenotypes) => {
		if (err) console.log({message: `Error deleting the phenotype: ${err}`})
		phenotypes.forEach(function(phenotype) {
			phenotype.remove(err => {
				if(err) console.log({message: `Error deleting the phenotype: ${err}`})
				
			})
		});
	})
}

function deletePhenotypeHistory (patientId){
	PhenotypeHistory.find({ 'createdBy': patientId }, (err, phenotypeHistories) => {
		if (err) console.log({message: `Error deleting the phenotypeHistory: ${err}`})
			phenotypeHistories.forEach(function(phenotypeHistory) {
				phenotypeHistory.remove(err => {
					if(err) console.log({message: `Error deleting the phenotypeHistory: ${err}`})
				})
			});
	})
}

function deleteSeizures (patientId){
	Seizures.find({ 'createdBy': patientId }, (err, seizures) => {
		if (err) console.log({message: `Error deleting the seizures: ${err}`})
		seizures.forEach(function(seizure) {
			seizure.remove(err => {
				if(err) console.log({message: `Error deleting the seizures: ${err}`})
			})
		});
	})
}

function deleteSocialInfo (patientId){
	SocialInfo.find({ 'createdBy': patientId }, (err, socialInfos) => {
		if (err) console.log({message: `Error deleting the socialInfos: ${err}`})
		socialInfos.forEach(function(socialInfo) {
			socialInfo.remove(err => {
				if(err) console.log({message: `Error deleting the socialInfos: ${err}`})
			})
		});
	})
}

function deleteVaccination (patientId){
	Vaccination.find({ 'createdBy': patientId }, (err, vaccinations) => {
		if (err) console.log({message: `Error deleting the vaccinations: ${err}`})
		vaccinations.forEach(function(vaccination) {
			vaccination.remove(err => {
				if(err) console.log({message: `Error deleting the vaccinations: ${err}`})
			})
		});
	})
}

function deleteWeightHistory (patientId){
	WeightHistory.find({ 'createdBy': patientId }, (err, weightHistories) => {
		if (err) console.log({message: `Error deleting the weightHistories: ${err}`})
		weightHistories.forEach(function(weightHistory) {
			weightHistory.remove(err => {
				if(err) console.log({message: `Error deleting the weightHistories: ${err}`})
			})
		});
	})
}

function deleteWeight (patientId){
	Weight.find({ 'createdBy': patientId }, (err, weights) => {
		if (err) console.log({message: `Error deleting the weights: ${err}`})
		weights.forEach(function(weight) {
			weight.remove(err => {
				if(err) console.log({message: `Error deleting the weights: ${err}`})
			})
		});
	})
}

function deleteHeight (patientId){
	Height.find({ 'createdBy': patientId }, (err, heights) => {
		if (err) console.log({message: `Error deleting the heights: ${err}`})
		heights.forEach(function(height) {
			height.remove(err => {
				if(err) console.log({message: `Error deleting the heights: ${err}`})
			})
		});
	})
}

function deleteMedicalCare (patientId){
	MedicalCare.find({ 'createdBy': patientId }, (err, medicalCares) => {
		if (err) console.log({message: `Error deleting the medicalCares: ${err}`})
		medicalCares.forEach(function(medicalCare) {
			medicalCare.remove(err => {
				if(err) console.log({message: `Error deleting the medicalCares: ${err}`})
			})
		});
	})
}

function deletePatient (patientId, containerName){
	Patient.findById(patientId, (err, patient) => {
		if (err) console.log({message: `Error deleting the patient: ${err}`})
		if(patient){
			patient.remove(err => {
				if(err) console.log({message: `Error deleting the patient: ${err}`})
				f29azureService.deleteContainers(containerName)
			})
		}else{
				f29azureService.deleteContainers(containerName);
		}
	})
}

function confirmDeleteUser (res, userId){
	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
		if(user){
			user.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the user: ${err}`})
				//savePatient(userId);
				res.status(200).send({message: `The user has been deleted`})
			})
		}else{
			//savePatient(userId);
			 return res.status(202).send({message: 'The user has been deleted'})
		}
	})
}

function changeTerms (req, res){
	let userId= crypt.decrypt(req.params.userId);
	var date1 = new Date()
	var info = {displayed: true, conditionAccepted: req.body.value, date: date1};
	User.findByIdAndUpdate(userId, {termsAccepted: info}, {select: '-_id userName lang email signupDate massunit lengthunit modules', new: true}, (err, userUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({ message: 'Changed'})
	})
}

module.exports = {
	sendcode,
	signUp,
	signIn,
	getUser,
	getSettings,
	updateUser,
	senddeletecode,
	deleteUser,
	changeTerms
}
