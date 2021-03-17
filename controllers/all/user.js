// functions for each call of the api on user. Use the user model

'use strict'


// add the user model
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


/**
 * @api {post} https://health29.org/api/api/recoverpass Request password change
 * @apiName recoverPass
 * @apiVersion 1.0.0
 * @apiGroup Account
 * @apiDescription This method allows you to send a request to change the password. At the end of this call, you need to check the email account to call [update password](#api-Account-updatePass).
 * @apiExample {js} Example usage:
 *   var formValue = { email: "example@ex.com"};
 *   this.http.post('https://health29.org/api/recoverpass',formValue)
 *    .subscribe( (res : any) => {
 *      if(res.message == "Email sent"){
 *        console.log("Account recovery email sent. Check the email to change the password");
 *      }
 *   }, (err) => {
 *     if(err.error.message == 'Fail sending email'){
 *        //contact with health29
 *      }else if(err.error.message == 'user not exists'){
 *       ...
 *      }else if(err.error.message == 'account not activated'){
 *       ...
 *      }
 *   }
 *
 * @apiParam (body) {String} email User email
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com"
 *     }
 * @apiSuccess {String} message Information about the request. If everything went correctly, return 'Email sent'
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Email sent"
 * }
 *
 * @apiSuccess (Eror 500) {String} message Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:
 * * Fail sending email
 * * user not exists
 * * account not activated
 */
function recoverPass(req, res){
	req.body.email = (req.body.email).toLowerCase();
	User.findOne({ 'email': req.body.email }, function (err, user) {
	  if (err) return res.status(500).send({ message: 'Error searching the user'})
		if (user){
				if(user.confirmed){
				//generamos una clave aleatoria y añadimos un campo con la hora de la clave proporcionada, cada que caduque a los 15 minutos
				let randomstring = Math.random().toString(36).slice(-12)
				user.randomCodeRecoverPass = randomstring;
				user.dateTimeRecoverPass = Date.now();

				//guardamos los valores en BD y enviamos Email
				user.save((err) => {
					if (err) return res.status(500).send({ message: 'Error saving the user'})

					serviceEmail.sendMailRecoverPass(req.body.email, randomstring, user.lang, user.group)
						.then(response => {
							return res.status(200).send({ message: 'Email sent'})
						})
						.catch(response => {
							//create user, but Failed sending email.
							//res.status(200).send({ token: serviceAuth.createToken(user),  message: 'Fail sending email'})
							res.status(500).send({ message: 'Fail sending email'})
						})
					//return res.status(200).send({ token: serviceAuth.createToken(user)})
				})
			}else{
				return res.status(500).send({ message: 'account not activated'})
			}
		}else{
			return res.status(500).send({ message: 'user not exists'})
		}
	})
}

/**
 * @api {post} https://health29.org/api/api/updatepass Update password
 * @apiName updatePass
 * @apiVersion 1.0.0
 * @apiGroup Account
 * @apiDescription This method allows you to change the password of an account. Before changing the password, you previously had to make a [request for password change](#api-Account-recoverPass).
 * @apiExample {js} Example usage:
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  var param = this.router.parseUrl(this.router.url).queryParams;
 *  var formValue = { email: param.email, password: passwordsha512, randomCodeRecoverPass: param.key };
 *   this.http.post('https://health29.org/api/updatepass',formValue)
 *    .subscribe( (res : any) => {
 *      if(res.message == "password changed"){
 *        console.log("Password changed successfully");
 *      }
 *   }, (err) => {
 *     if(err.error.message == 'invalid link'){
 *        ...
 *      }else if(err.error.message == 'link expired'){
 *        console.log('The link has expired after more than 15 minutes since you requested it. Re-request a password change.');
 *      }else if(err.error.message == 'Error saving the pass'){
 *        ...
 *      }
 *   }
 *
 * @apiParam (body) {String} email User email. In the link to request a change of password sent to the email, there is an email parameter. The value of this parameter will be the one to be assigned to email.
 * @apiParam (body) {String} password User password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParam (body) {String} randomCodeRecoverPass In the password change request link sent to the email, there is a key parameter. The value of this parameter will be the one that must be assigned to randomCodeRecoverPass.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com",
 *       "password": "f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f",
 *       "randomCodeRecoverPass": "0.xkwta99hoy"
 *     }
 * @apiSuccess {String} message Information about the request. If everything went correctly, return 'password changed'
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "password changed"
 * }
 *
 * @apiSuccess (Eror 500) {String} message Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:
 * * invalid link
 * * link expired (The link has expired after more than 15 minutes since you requested it. Re-request a password change.)
 * * Account is temporarily locked
 * * Error saving the pass

 */
function updatePass(req, res){
	const user0 = new User({
		password: req.body.password
	})
	req.body.email = (req.body.email).toLowerCase();
	User.findOne({ 'email': req.body.email }, function (err, user) {
	  if (err) return res.status(500).send({ message: 'Error searching the user'})
		if (user){
			const userToSave=user;
			userToSave.password = req.body.password
			//ver si el enlace a caducado, les damos 15 minutos para reestablecer la pass
			var limittime = new Date(); // just for example, can be any other time
			var myTimeSpan = 15*60*1000; // 15 minutes in milliseconds
			limittime.setTime(limittime.getTime() - myTimeSpan);

			//var limittime = moment().subtract(15, 'minutes').unix();

			if(limittime.getTime() < userToSave.dateTimeRecoverPass.getTime()){
				if(userToSave.randomCodeRecoverPass == req.body.randomCodeRecoverPass){


					bcrypt.genSalt(10, (err, salt) => {
						if (err) return res.status(500).send({ message: 'error salt'})
						bcrypt.hash(userToSave.password, salt, null, (err, hash) => {
							if (err) return res.status(500).send({ message: 'error hash'})

							userToSave.password = hash
							User.findByIdAndUpdate(userToSave._id, userToSave, (err, userUpdated) => {
								if (err) return res.status(500).send({message: 'Error saving the pass'})
								if (!userUpdated) return res.status(500).send({message: 'not found'})

								return res.status(200).send({ message: 'password changed'})
							})
						})
					})



				}else{
					return res.status(500).send({ message: 'invalid link'})
				}
			}else{
				return res.status(500).send({ message: 'link expired'})
			}
		}else{
			//return res.status(500).send({ message: 'user not exists'})
			return res.status(500).send({ message: 'invalid link'})
		}
	})
}

/**
 * @api {post} https://health29.org/api/api/newPass New password
 * @apiName newPass
 * @apiVersion 1.0.0
 * @apiGroup Account
 * @apiDescription This method allows you to change the password of an account. It is another way to change the password, but in this case, you need to provide the current and the new password, and it does not require validation through the mail account. In this case, it requires authentication in the header.
 * @apiExample {js} Example usage:
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  var newpasswordsha512 = sha512("jisd?87Tg");
 *  var formValue = { email: "example@ex.com", actualpassword: passwordsha512, newpassword: newpasswordsha512 };
 *   this.http.post('https://health29.org/api/newPass',formValue)
 *    .subscribe( (res : any) => {
 *      if(res.message == "password changed"){
 *        console.log("Password changed successfully");
 *      }else if(res.message == 'Login failed'){
 *        console.log('The current password is incorrect');
 *      }else if(res.message == 'Account is temporarily locked'){
 *        console.log('Account is temporarily locked');
 *      }else if(res.message == 'Account is unactivated'){
 *        ...
 *      }
 *   }, (err) => {
 *     ...
 *   }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam (body) {String} email User email. In the link to request a change of password sent to the email, there is an email parameter. The value of this parameter will be the one to be assigned to email.
 * @apiParam (body) {String} actualpassword Actual password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParam (body) {String} newpassword New password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com",
 *       "actualpassword": "f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f",
 *       "newpassword": "k847y603939a53656948480ce71f1ce46457b4745fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe45t"
 *     }
 * @apiSuccess {String} message Information about the request. If everything went correctly, return 'password changed'
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "password changed"
 * }
 *
 * @apiSuccess (Success 202) {String} message Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:
 * * Not found
 * * Login failed (if the current password is incorrect)
 * * Account is temporarily locked
 * * Account is unactivated
 */

function newPass(req, res){
	req.body.email = (req.body.email).toLowerCase();
	User.getAuthenticated(req.body.email, req.body.actualpassword, function(err, userToUpdate, reason) {
		if (err) return res.status(500).send({ message: err })

			// login was successful if we have a user
			if (userToUpdate) {
				bcrypt.genSalt(10, (err, salt) => {
					if (err) return res.status(500).send({ message: 'error salt'})
					bcrypt.hash(req.body.newpassword, salt, null, (err, hash) => {
						if (err) return res.status(500).send({ message: 'error hash'})

						userToUpdate.password = hash
						User.findByIdAndUpdate(userToUpdate._id, userToUpdate, (err, userUpdated) => {
							if (err) return res.status(500).send({message: 'Error saving the pass'})
							if (!userUpdated) return res.status(500).send({message: 'not found'})

							return res.status(200).send({ message: 'password changed'})
						})
					})
				})
			}else{
				// otherwise we can determine why we failed
				var reasons = User.failedLogin;
				switch (reason) {
						case reasons.NOT_FOUND:
						return res.status(202).send({
							message: 'Not found'
						})
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
 * @api {post} https://health29.org/api/api/signUp New account
 * @apiName signUp
 * @apiVersion 1.0.0
 * @apiGroup Account
 * @apiDescription This method allows you to create a user account in health 29
 * @apiExample {js} Example usage:
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  var formValue = { email: "example@ex.com", userName: "Peter", password: passwordsha512, lang: "en", group: "None"};
 *   this.http.post('https://health29.org/api/signup',formValue)
 *    .subscribe( (res : any) => {
 *      if(res.message == "Account created"){
 *        console.log("Check the email to activate the account");
 *      }else if(res.message == 'Fail sending email'){
 *        //contact with health29
 *      }else if(res.message == 'user exists'){
 *       ...
 *      }
 *   }, (err) => {
 *     ...
 *   }
 *
 * @apiParam (body) {String} email User email
 * @apiParam (body) {String} userName User name
 * @apiParam (body) {String} password User password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParam (body) {String} lang Lang of the User. For this, go to  [Get the available languages](#api-Languages-getLangs).
 * We currently have 5 languages, but we will include more. The current languages are:
 * * English: en
 * * Spanish: es
 * * German: de
 * * Dutch: nl
 * * Portuguese: pt
 * @apiParam (body) {String} [group] Group to which the user belongs, if it does not have a group or do not know the group to which belongs, it will be 'None'. If the group is not set, it will be set to 'None' by default.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com",
 *       "userName": "Peter",
 *       "password": "f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f",
 *       "group": "None",
 *       "lang": "en"
 *     }
 * @apiSuccess {String} message Information about the request. One of the following answers will be obtained:
 * * Account created (The user should check the email to activate the account)
 * * Fail sending email
 * * user exists
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Account created"
 * }
 *
 */

function signUp(req, res){
	let randomstring = Math.random().toString(36).slice(-12)

	const user = new User({
		email: req.body.email.toLowerCase(),
		userName: req.body.userName,
		password: req.body.password,
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
			return res.status(202).send({ message: 'user exists'})
		}
	})
}


/**
 * @api {post} https://health29.org/api/api/signin Get the token (and the userId)
 * @apiName signIn
 * @apiVersion 1.0.0
 * @apiGroup Access token
 * @apiDescription This method gets the token and the language for the user. This token includes the encrypt id of the user, token expiration date, role, and the group to which it belongs.
 * The token are encoded using <a href="https://en.wikipedia.org/wiki/JSON_Web_Token" target="_blank">jwt</a>
 * <br>
 * <br>
 * The functionality of this method is directly related to the second authentication factor. That is, you have to take into account if the user you want to perform the operation with belongs or not to a patient group that has configured the 2FA.According to this, the answers obtained will be different. In this case, you will have to use the methods: [requestApproval](#api-SignIn_2FA-Request_approval) and [updatePhone](#api-SignIn_2FA-Update_phone).
 * At the moment the only patient group that has the functionality of 2FA implemented is Duchenne Parent Project Netherlands.
 * <br>
 * <br>
 * We use the <a href="https://www.npmjs.com/package/fingerprintjs2" target="_blank">fingerprintjs2 library</a> for configuring the params.
 *

 * @apiExample {js} Example for general usage
 *  // Obtain device id and information previously
 *  var formValue = { email: "aa@aa.com", password: passwordsha512, device: {id:this.deviceId,info:this.deviceInformation} };
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  this.http.post('https://health29.org/api/signin',formValue)
 *    .subscribe( (res : any) => {
 *      if(res.message == "You have successfully logged in"){
 *        console.log(res.lang);
 *        console.log(res.token);
 *      }else{
 *        this.isloggedIn = false;
 *      }
 *   }, (err) => {
 *     this.isloggedIn = false;
 *   }
 *
 *  @apiExample {js} Example for users with 2FA
 *  // Obtain device id and information previously
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  var formValue = { email: "aa@aa.com", password: passwordsha512, device: {id:this.deviceId,info:this.deviceInformation} };
 *  this.http.post('https://health29.org/api/signin',formValue)
 *  .subscribe( (res : any) => {
 *      if(res.message == "You have successfully logged in"){
 *        console.log(res.lang);
 *        console.log(res.token);
 *      }
 * 		else if(res.type=="2FA request approval"){
 * 			// Use the requestApproval method described in "SignIn 2FA" section to continue. The login is not yet complete since Authy authorization is required by the user.
 * 		}
 *      else if(res.type=="Update Phone"){
 * 			//In this case the user has not yet provided information about his telephone number, so  use the updatePhone method described in "SignIn 2FA" section and then retry login with this method.
 * 		}
 * 		else{
 *        this.isloggedIn = false;
 *      }
 *   }, (err) => {
 *     this.isloggedIn = false;
 *   }
 *  @apiExample {js} Obtain device id and information.
 *  // DeviceID:
 *  if(localStorage.getItem('deviceid')){
 *  	this.deviceId=localStorage.getItem('deviceid')
 *  }else{
 *  	this.deviceId = sha512(Math.random().toString(36).substr(2, 9));
 *  	localStorage.setItem('deviceid', this.deviceId)
 *  }
 *  // Device information:
 * 	setTimeout(() =>{
 * 		Fingerprint2.get((components:any) => {
 * 			console.log(components)
 * 			var timezone="";
 * 			var platform="";
 * 			var userAgent="";
 * 			for(var i=0;i<components.length;i++){
 * 				if(components[i].key=="timezone"){
 * 					timezone=components[i].value;
 * 				}
 * 				else if(components[i].key=="platform"){
 * 					platform=components[i].value;
 * 				}
 * 	 			else if(components[i].key=="userAgent"){
 * 					userAgent=components[i].value;
 * 				}
 * 			}
 * 			this.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}
 * 		})
 * 	}, 500)
 *
 * @apiParam (body) {String} email User email
 * @apiParam (body) {String} password User password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParam (body) {json} device Device information: timezone, platform and userAgent.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com",
 *       "password": "f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f",
 * 		 "device":{
 * 			"timezone":"Europe/Madrid",
 * 			"platform":"Win32",
 * 			"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
 * 		  }
 *     }
 * @apiSuccess {String} message If all goes well, the system should return 'You have successfully logged in'
 * @apiSuccess {String} token You will need this <strong>token</strong> in the header of almost all requests to the API. Whenever the user wants to access a protected route or resource, the user agent should send the JWT, in the Authorization header using the Bearer schema.
 * <p>The data contained in the token are: encrypted <strong>userId</strong>, expiration token, group, and role.
 * To decode them, you you must use some jwt decoder <a href="https://en.wikipedia.org/wiki/JSON_Web_Token" target="_blank">jwt</a>. There are multiple options to do it, for example for javascript: <a href="https://github.com/hokaccha/node-jwt-simple" target="_blank">Option 1</a> <a href="https://github.com/auth0/jwt-decode" target="_blank">Option 2</a>
 * When you decode, you will see that it has several values, these are:</p>
 * <p>
 * <ul>
 *  <li>sub: the encrypted userId. This value will also be used in many API queries. It is recommended to store only the token, and each time the userId is required, decode the token.</li>
 *  <li>exp: The expiration time claim identifies the expiration time on or after which the JWT must not be accepted for processing.</li>
 *  <li>group: Group to which the user belongs, if it does not have a group, it will be 'None'. </li>
 *  <li>role: Role of the user. Normally it will be 'User'.</li>
 * </ul>
 * </p>
 * @apiSuccess {String} lang Lang of the User.

 * @apiSuccess (Success 200 2FA) {String} type Information that 2FA is required: "2FA request approval"
 * @apiSuccess (Success 200 UpdatePhone) {String} type Information that update phone information for the user is required: "Update Phone"

 * @apiSuccess (Success 202) {String} message Information about the request. The credentials are incorrect or something has gone wrong. One of the following answers will be obtained:
 * * Not found
 * * Login failed
 * * Account is temporarily locked
 * * Account is unactivated
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "You have successfully logged in",
 *  "token": "eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k",
 *  "lang": "en"
 * }
 *
 */

function signIn(req, res){
    // attempt to authenticate user
	req.body.email = (req.body.email).toLowerCase();
	let device=req.body.device;
	let deviceId=device.id;
	let deviceInformation=device.info;
	User.getAuthenticated(req.body.email, req.body.password, function(err, user, reason) {
		if (err) return res.status(500).send({ message: err })

		// login was successful if we have a user
		if (user) {
			User.findById(user._id,(err,userFound)=>{
				// handle login success
				// A los usuarios de Duchenne crearles la cuenta de authy si no la tenian, hay que pedirles que rellenen el numero de telefono y el código postal
				if((userFound.group==DUCHENNENETHERLANDS || userFound.group==DUCHENNEINTERNATIONAL)&&((userFound.authyId==null)||(userFound.authyId==undefined))){
					return res.status(200).send({type:"Update Phone"});
				}
				// Si el usuario es de Duchenne y tiene authy creado pedir confirmación de la app si no tiene el device asociado o no ha hecho login en ese día
				else if((userFound.group==DUCHENNENETHERLANDS || userFound.group==DUCHENNEINTERNATIONAL)&&((userFound.authyId!=null)&&(userFound.authyId!=undefined))){
					if((userFound.authyDeviceId.length>0)&&(userFound.authyDeviceId!=null)&&(userFound.authyDeviceId!=undefined)){
						// compruebo si ya se habia hecho login desde esa IP
						var loginWithTheSameIp=false;
						for(var j =0;j<userFound.authyDeviceId.length;j++){
							if(deviceId==userFound.authyDeviceId[j]){
								loginWithTheSameIp=true;
							}
						}
						// Si ya se habia hecho login con esa IP
						if(loginWithTheSameIp==true){

							// Hay que comprobar si se ha hecho login en el mismo MES antes
							var date = new Date();

							// Si si que se habia hecho en el mismo mes y con la misma IP entonces OK (no se pide)
							if(Date.parse(userFound.lastLogin.getMonth())==Date.parse(date.getMonth())){
								return res.status(200).send({
									message: 'You have successfully logged in',
									token: serviceAuth.createToken(user),
									lang: user.lang
								})
							}
							// Si aun no se habia hecho login, pido autorizacion a Authy y elimino la IP de la lista de dispositivos del usuario
							else{
								for(var j =0;j<userFound.authyDeviceId.length;j++){
									if(deviceId==userFound.authyDeviceId[j]){
										userFound.authyDeviceId.splice(j,1);
									}
								}
								User.findByIdAndUpdate(userFound._id,userFound,(err,userUpdated)=>{
									if (err) return res.status(500).send({ message: `Error updating the user: ${err}`})
									return res.status(200).send({type:"2FA request approval"});
								})

							}

						}

						// Si aun no se ha hecho login desde esa IP pido autorizacion a Authy
						else{
							return res.status(200).send({type:"2FA request approval"});
						}
					}
					// Si el usuario es de Duchenne, esta registrado en Authy pero no tiene devices asociados: pido confirmación
					else{
						return res.status(200).send({type:"2FA request approval"});
					}

				}
				// Si no es de Duchenne no se requiere 2FA y el usuario esta Logado OK
				else{
					return res.status(200).send({
						message: 'You have successfully logged in',
						token: serviceAuth.createToken(user),
						lang: user.lang
					})
				}
			});
		}
		// otherwise we can determine why we failed
		else {
			var reasons = User.failedLogin;
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
 * @api {post} https://health29.org/api/api/signin/requestApproval Update phone
 * @apiName Update phone
 * @apiVersion 1.0.0
 * @apiGroup SignIn 2FA
 * @apiDescription This method gets the response about update the phone information of the user and the registration in Authy application. An email will be sent to indicate the next steps for the user.
 *
 * @apiExample {js} Example usage
 *  var email="aa@aa.com";
 *  var param={countryselectedPhoneCode:"+34",phone:"66666666",device:{id:this.deviceId,info:this.deviceInformation}};
 *  this.http.post('https://health29.org/api/signin/updatePhone/'+emain,params)
 *  .subscribe( (res : any) => {
 *		if(res.message=="User Registered in Authy"){
 *	    	// User registration OK
 *		}
 * 		else{
 * 			// User registration KO
 * 		}
 *  });
 * @apiExample {js} Obtain device id and information.
 *  // DeviceID:
 *  if(localStorage.getItem('deviceid')){
 *  	this.deviceId=localStorage.getItem('deviceid')
 *  }else{
 *  	this.deviceId = sha512(Math.random().toString(36).substr(2, 9));
 *  	localStorage.setItem('deviceid', this.deviceId)
 *  }
 *  // Device information:
 * 	setTimeout(() =>{
 * 		Fingerprint2.get((components:any) => {
 * 			console.log(components)
 * 			var timezone="";
 * 			var platform="";
 * 			var userAgent="";
 * 			for(var i=0;i<components.length;i++){
 * 				if(components[i].key=="timezone"){
 * 					timezone=components[i].value;
 * 				}
 * 				else if(components[i].key=="platform"){
 * 					platform=components[i].value;
 * 				}
 * 	 			else if(components[i].key=="userAgent"){
 * 					userAgent=components[i].value;
 * 				}
 * 			}
 * 			this.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}
 * 		})
 * 	}, 500)
 *
 *
 * @apiParam {String} email User email.
 * @apiParam (body) {String} phone The phone number
 * @apiParam (body) {String} countryselectedPhoneCode The country code
 * @apiParam (body) {String} device device information: timezone, platform and userAgent.

 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"countryselectedPhoneCode":"+34",
 * 			"phone":"666666666",
 * 			"device":{
 * 				"timezone":"Europe/Madrid",
 * 				"platform":"Win32",
 * 				"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
 * 			}
 * 		}
 *
 * @apiSuccess (Success 200) {String} message If all goes well, the system should return "2FA approved" and the token.
 * @apiSuccess (Success 200) {String} type The type param of the request indicate you if the request of send approval to authy is done correctly.
 * @apiSuccess (Success 200) {String} token You will need this <strong>token</strong> in the header of all requests to the API functions for Authy.
 *
 * @apiSuccess (Failed 400) {String} string Information about the request was failed: Bad Request sending approval
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "type": "2FA approved",
 *  "token": "eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k",
 * }
 *
 */
function registerUserInAuthy(req,res){
	let email= req.params.email.toLowerCase();
	let countryCode = req.body.countryselectedPhoneCode;
	let phone = req.body.phone;

	User.findOne({email:email},(err,userFound)=>{
		if (err) return res.status(500).send({ message: `Error finding the user: ${err}`})
		if(userFound){
			Group.findOne({name:userFound.group},(err,groupFound)=>{
				if (err) return res.status(500).send({ message: `Error finding the group: ${err}`})
				if(groupFound){
					authy.register_user(userFound.email,phone,countryCode,false,function (err, res0) {
						if(err){
							console.log(err)
							return res.status(500).send({ message: `Error registering the user in Authy: ${err}`})
						}

						User.findByIdAndUpdate(userFound._id,{phone:phone,authyId:res0.user.id},(err,userUpdated) =>{
							if (err) return res.status(500).send({ message: `Error updating the user: ${err}`})
							let randomstring = Math.random().toString(36).slice(-12)
							serviceEmail.sendMailDownloadAuthy(userFound.email,groupFound.email, randomstring, userUpdated.lang, userUpdated.group)
							.then(response => {
								res.status(200).send({ message: 'User Registered in Authy'})
							})
							.catch(response => {
								res.status(200).send({ message: 'Fail sending email'})
							})
						})
					});
				}
			})

		}

	})


}
/**
 * @api {post} https://health29.org/api/api/signin/requestApproval Request Authy approval
 * @apiName Request approval
 * @apiVersion 1.0.0
 * @apiGroup SignIn 2FA
 * @apiDescription This method gets the token and the response for the request approval to Authy for a user.
 * <br>
 * <br>
 * You will have to use the function [Check status 2FA](#api-SignIn_2FA-Check_status_2FA)
 * <br>
 * <br>
 * We use the <a href="https://www.npmjs.com/package/fingerprintjs2" target="_blank">fingerprintjs2 library</a> for configuring the params.
 *
 * @apiExample {js} Example usage
 *  var params="aa@aa.com";
 *  this.http.post('https://health29.org/api/signin/requestApproval/'+params,this.deviceInformation)
 *  .subscribe( (res : any) => {
 *		if(res.type=="2FA approved"){
 *			// In this case the application has been correctly sent to Authy. Now, to continue, you must use the status2FA method described in "SignIn 2FA" section to check the user's response.
 *			// The login is not yet complete since Authy authorization is required by the user.
 * 		}
 * 		else{
 * 			this.isloggedIn = false;
 * 		}
 *  });
 *
 * @apiExample {js} Obtain device id and information.
 *  // DeviceID:
 *  if(localStorage.getItem('deviceid')){
 *  	this.deviceId=localStorage.getItem('deviceid')
 *  }else{
 *  	this.deviceId = sha512(Math.random().toString(36).substr(2, 9));
 *  	localStorage.setItem('deviceid', this.deviceId)
 *  }
 *  // Device information:
 * 	setTimeout(() =>{
 * 		Fingerprint2.get((components:any) => {
 * 			console.log(components)
 * 			var timezone="";
 * 			var platform="";
 * 			var userAgent="";
 * 			for(var i=0;i<components.length;i++){
 * 				if(components[i].key=="timezone"){
 * 					timezone=components[i].value;
 * 				}
 * 				else if(components[i].key=="platform"){
 * 					platform=components[i].value;
 * 				}
 * 	 			else if(components[i].key=="userAgent"){
 * 					userAgent=components[i].value;
 * 				}
 * 			}
 * 			this.deviceInformation={timezone:timezone,platform:platform,userAgent:userAgent}
 * 		})
 * 	}, 500)
 *
 * @apiParam {String} email User email.
 *
 * @apiParam (body) {json} device Device information: timezone, platform and user Agent of the user device.
 * @apiParamExample {json} Request-Example:
 * 		{
 * 			"timezone":"Europe/Madrid",
 * 			"platform":"Win32",
 * 			"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb…ML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
 * 		}
 *
 * @apiSuccess (Success 200) {String} message If all goes well, the system should return "2FA approved" and the token.
 * @apiSuccess (Success 200) {String} type The type param of the request indicate you if the request of send approval to authy is done correctly.
 * @apiSuccess (Success 200) {String} token You will need this <strong>token</strong> for review the request status from Authy.
 *
 * @apiSuccess (Failed 400) {String} string Information about the request was failed: Bad Request sending approval
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "type": "2FA approved",
 *  "token": "eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k",
 * }
 *
 */
function sendApprovalRequest(req,res){
	let email = req.params.email.toLowerCase();

	let deviceInformation=req.body.deviceInformation


	User.findOne({email:email},(err,userFound)=>{
		if (err) return res.status(500).send({ message: err })
		if (userFound){
			var dataToSend="";
			switch(userFound.lang){
				case 'es':
					dataToSend="Solicitud de acceso a Health29 en "+deviceInformation.timezone.toString()+" con un dispositivo: "+deviceInformation.platform.toString();

					break;
				case 'en':
					dataToSend="Request to login to Health29 in "+deviceInformation.timezone.toString()+" with a device: "+deviceInformation.platform.toString();
					break;
				case 'nl':
					dataToSend="Verzoek om in te loggen op Health29 in "+deviceInformation.timezone.toString()+" met een apparaat: "+deviceInformation.platform.toString();
					break;
			}
			authy.send_approval_request(userFound.authyId, {
				message: dataToSend
			}, null, null,  function(err, authResponse) {
				if (err) {
					console.log(err)
					return res.status(400).send('Bad Request sending approval');
				} else {
					return res.status(200).send({type:"2FA approved",token: authResponse.approval_request.uuid});
				}
			});
		}
	});

}

/**
 * @api {get} https://health29.org/api/api/signin/status2FA Get status of Authy request
 * @apiName Check status 2FA
 * @apiVersion 1.0.0
 * @apiGroup SignIn 2FA
 * @apiDescription This method gets status of the operation of send request of approval to Authy.
 * <br>
 * <br>
 * You will have to use the function [Check 2FA login](#api-SignIn_2FA-isLogged2FA)
 *
 * @apiExample {js} Example usage:
 * // Obtain the deviceId previously:
 * // if(localStorage.getItem('deviceid')){
 * // 		this.deviceId=localStorage.getItem('deviceid')
 * // }else{
 * // 		this.deviceId = sha512(Math.random().toString(36).substr(2, 9));
 * // 		localStorage.setItem('deviceid', this.deviceId)
 * // }
 * // The token variable is the one obtained after the call to requestApproval method
 * email="aa@aa.com"
 * var params=token+"-code-"+email+"-code-"+this.deviceId;
 * var params="aa@aa.com";
 * this.http.get('https://health29.org/api/signin/requestApproval/'+params)
 * .subscribe( (res : any) => {
 * 		if (res.status == 'approved') {
 *			// The user accept in Authy app. Use [isLogged2FA](#api-Access_token-signIn)  method described in "Sign in -2FA" section for continue.
 * 		}
 * 		else if(res.status == 'denied'){
 * 			this.isloggedIn = false;
 * 		}
 * });
 * @apiParam {String} token The token obtained after the call to RequestApproval method
 * @apiParam {String} email User email
 * @apiParam {String} deviceId The ID of the user device
 *
 * @apiSuccess {json} status {status:requestStatus} The request status could be:
 *  * approved
 *  * pending
 *  * denied
 *
 * @apiSuccess (Failed 400) {String} Information about the request was failed: 'Bad Request.'
 * @apiSuccess (Failed 500) {json} Error with the user. {message:'User not found'}

 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  status:"approved"
 * }
 *
 */
function getStatus2FA(req,res){
	let params = (req.params.tokenAndEmailAndDeviceId).split("-code-")
	let token=params[0];
	let email=params[1].toLowerCase();
	let deviceId=params[2];
	User.findOne({email:email},(err,userFound)=>{
		if (err) return res.status(500).send({ message: err });
		if(userFound){
			authy.check_approval_status(token, async function (err, authResponse) {
				if (err) {
				res.status(400).send('Bad Request.');
				} else {
					// New Device to Update
					if(authResponse.approval_request.status=='approved'){
						if((userFound.authyDeviceId!=null)&&(userFound.authyDeviceId!=undefined)){
							userFound.authyDeviceId.push(deviceId)
						}
						else{
							userFound.authyDeviceId=deviceId;
						}
						await User.findByIdAndUpdate(userFound._id,userFound,(err,userUpdated)=>{
							if (err) return res.status(500).send({ message: err });
							res.status(200).send({status: authResponse.approval_request.status});
						})
					}
					// pending or denied
					else{
						res.status(200).send({status: authResponse.approval_request.status});
					}
				}

			});
		}
		else{
			if (err) return res.status(500).send({ message: 'User not found' });
		}
	});
}
/**
 * @api {post} https://health29.org/api/api/signin/isLogged2FA Check 2FA login
 * @apiName isLogged2FA
 * @apiVersion 1.0.0
 * @apiGroup SignIn 2FA
 * @apiDescription This method gets the token and the language for the user. This token includes the encrypt id of the user, token expiration date, role, and the group to which it belongs.
 * The token are encoded using <a href="https://en.wikipedia.org/wiki/JSON_Web_Token" target="_blank">jwt</a>
 *
 * @apiExample {js} Example usage:
 *  var passwordsha512 = sha512("fjie76?vDh");
 *  var formValue = { email: email, password: passwordsha512 };
 *   this.http.post('https://health29.org/api/signin/isLogged2FA/',formValue)
 * .subscribe( (res : any) => {
 * 		if(res.message == "You have successfully logged in"){
 * 			console.log(res.lang);
 * 			console.log(res.token);
 * 			this.isloggedIn = true;
 * 		}
 * 		else{
 *			this.isloggedIn = false;
 * 		}
 * });
 *
 * @apiParam (body) {String} email User email. In the link to request a change of password sent to the email, there is an email parameter. The value of this parameter will be the one to be assigned to email.
 * @apiParam (body) {String} password User password using hash <a href="https://es.wikipedia.org/wiki/SHA-2" target="_blank">sha512</a>
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "example@ex.com",
 *       "password": "f74f2603939a53656948480ce71f1ce46457b6654fd22c61c1f2ccd3e2c96d1cd02d162b560c4beaf1ae45f4574571dc5cbc1ce040701c0b5c38457988aa00fe97f"
 *     }
 * @apiSuccess {String} message If all goes well, the system should return 'You have successfully logged in'
 * @apiSuccess {String} token You will need this <strong>token</strong> in the header of almost all requests to the API. Whenever the user wants to access a protected route or resource, the user agent should send the JWT, in the Authorization header using the Bearer schema.
 * <p>The data contained in the token are: encrypted <strong>userId</strong>, expiration token, group, and role.
 * To decode them, you you must use some jwt decoder <a href="https://en.wikipedia.org/wiki/JSON_Web_Token" target="_blank">jwt</a>. There are multiple options to do it, for example for javascript: <a href="https://github.com/hokaccha/node-jwt-simple" target="_blank">Option 1</a> <a href="https://github.com/auth0/jwt-decode" target="_blank">Option 2</a>
 * When you decode, you will see that it has several values, these are:</p>
 * <p>
 * <ul>
 *  <li>sub: the encrypted userId. This value will also be used in many API queries. It is recommended to store only the token, and each time the userId is required, decode the token.</li>
 *  <li>exp: The expiration time claim identifies the expiration time on or after which the JWT must not be accepted for processing.</li>
 *  <li>group: Group to which the user belongs, if it does not have a group, it will be 'None'. </li>
 *  <li>role: Role of the user. Normally it will be 'User'.</li>
 * </ul>
 * </p>
 *
 * @apiSuccess {String} lang Lang of the User.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "You have successfully logged in",
 *  "token": "eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k",
 *  "lang": "en"
 * }
 *
 */
function isLogged2FA(req,res){
	let email=(req.body.email).toLowerCase();
	User.getAuthenticated(email, req.body.password, function(err, user, reason) {
		if (err) return res.status(500).send({ message: err })

		// login was successful if we have a user
		if (user) {
			return res.status(200).send({
				message: 'You have successfully logged in',
				token: serviceAuth.createToken(user),
				lang: user.lang
			})
		}else{
			return res.status(200).send({ message: reason })
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
	User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "role" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!user) return res.status(404).send({code: 208, message: `The user does not exist`})

		res.status(200).send({user})
	})
}

function getSettings (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"userName": false, "lang": false, "email": false, "signupDate": false, "_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "randomCodeRecoverPass" : false, "dateTimeRecoverPass" : false, "confirmed" : false, "role" : false, "lastLogin" : false}, (err, user) => {
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

module.exports = {
	activateUser,
	recoverPass,
	updatePass,
	newPass,
	signUp,
	signIn,
	registerUserInAuthy,
	sendApprovalRequest,
	getStatus2FA,
	isLogged2FA,
	getUser,
	getSettings,
	updateUser,
	deleteUser
}
