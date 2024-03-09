// functions for each call of the api on user. Use the user model

'use strict'
// add the user model
const { appInsights } = require('../../app_Insights')
let clientInsights = appInsights.defaultClient;
const User = require('../../models/user')
const serviceAuth = require('../../services/auth')
const serviceEmail = require('../../services/email')
const crypt = require('../../services/crypt')
const bcrypt = require('bcrypt-nodejs')
const Patient = require('../../models/patient')
const Group = require('../../models/group')
const DUCHENNENETHERLANDS = 'Duchenne Parent Project Netherlands'
const DUCHENNEINTERNATIONAL = 'Duchenne Parent Project International'

//const APIKEY='yaX9mN0KygVgCuQZTDQUmsEsQJfAmpu5';
const authy = require('authy')('yaX9mN0KygVgCuQZTDQUmsEsQJfAmpu5');

function activateUser(req, res){
	req.body.email = (req.body.email).toLowerCase();
	const user = new User({
		email: req.body.email,
		key: req.body.key,
		confirmed: true
	})
	User.findOne({ 'email': req.body.email }, function (err, user2) {
	  if (err) return res.status(500).send({ message: `Error activating account: ${err}`})
		if (user2){
			if(user2.confirmationCode==req.body.key){
				user2.confirmed=true;
				let update = user2;
				let userId = user2._id
				User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
					if (err) return res.status(500).send({message: `Error making the request: ${err}`})

					res.status(200).send({ message: 'activated'})
				})
			}else{
				return res.status(200).send({ message: 'error'})
			}
		}else{
			return res.status(500).send({ message: `user not exists: ${err}`})
		}
	})
}

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
			// A los usuarios de Duchenne crearles la cuenta de authy
			if(req.body.group==DUCHENNENETHERLANDS|| req.body.group == DUCHENNEINTERNATIONAL){
				let email = req.body.email.toLowerCase();
				let phone=req.body.phone;
				let codePhone=req.body.countryselectedPhoneCode;
				Group.findOne({name:req.body.group},(err,groupFound)=>{
					if (err) return res.status(500).send({ message: `Error finding the group: ${err}`})
					if(groupFound){
						// Post new user
						authy.register_user(email,phone,codePhone,false,function (err, res0) {
							if(err){
								console.log(err)
								return res.status(500).send({ message: `Error registering the user in Authy: ${err}`})
							}
							//Guardar para ese user el userId de authy
							user.authyId=res0.user.id;
							user.save((err,userCreated) => {
								if (err) return res.status(500).send({ message: `Error creating the user: ${err}`})

								serviceEmail.sendMailVerifyEmailAndDownloadAuthy(req.body.email,groupFound.email, randomstring, req.body.lang, req.body.group)
									.then(response => {
										res.status(200).send({ message: 'Account created'})
									})
									.catch(response => {
										//create user, but Failed sending email.
										res.status(200).send({ message: 'Fail sending email'})
									})
							})
						});
					}
				});

			}
			else{
				user.save((err,userCreated) => {
					if (err) return res.status(500).send({ message: `Error creating the user: ${err}`})

					serviceEmail.sendMailVerifyEmail(req.body.email.toLowerCase(), randomstring, req.body.lang, req.body.group)
						.then(response => {
							res.status(200).send({ message: 'Account created'})
						})
						.catch(response => {
							//create user, but Failed sending email.
							//res.status(200).send({ token: serviceAuth.createToken(user),  message: 'Fail sending email'})
							res.status(200).send({ message: 'Fail sending email'})
						})
					//return res.status(200).send({ token: serviceAuth.createToken(user)})
				})
			}

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
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "role" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!user) return res.status(404).send({code: 208, message: `The user does not exist`})

		res.status(200).send({user})
	})
}

function getSettings (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"userName": false, "lang": false, "email": false, "signupDate": false, "_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "randomCodeRecoverPass" : false, "dateTimeRecoverPass" : false, "confirmed" : false, "role" : false, "lastLogin" : false}, (err, user) => {
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

	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
		if (user){
			user.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the user: ${err}`})
				res.status(200).send({message: `The user has been deleted.`})
			})
		}else{
			 return res.status(404).send({code: 208, message: `Error deleting the user: ${err}`})
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
	activateUser,
	sendcode,
	signUp,
	signIn,
	getUser,
	getSettings,
	updateUser,
	deleteUser,
	changeTerms
}
