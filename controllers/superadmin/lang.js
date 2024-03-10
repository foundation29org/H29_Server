// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Lang = require('../../models/lang')
const crypt = require('../../services/crypt')
const fs = require('fs');

/**
 * @api {post} https://health29.org/api/superadmin/lang/ Update lang file
 * @apiPrivate
 * @apiName updateLangFileSuperadmin
 * @apiDescription This method updates lang file. Only for superadmin.
 * @apiGroup Languages
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>
 *   var body = { lang: <lang_code>, jsonData: <json assets format> }
 *   this.http.post('https://health29.org/api/superadmin/lang'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Request new translation ok');
 *     }, (err) => {
 *      ...
 *     }
 * // -----------------------------------------------------------------------
 * // Example Json assets format
 * {
 *   "menu":{
 *     "Dashboard": "Home"
 *     "Login": "Login",
 *     "Register": "Register"
 *   },
 *   "profile":{
 * 	  "Save the changes": "Please, save the changes",
 *   }
 * }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {Object} userId The user unique id.
 * @apiSuccess {Object} Result Returns a message with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * 		"message":'uploaded'
 * 	}
 *
 *
 */
function updateLangFile (req, res){
	let userId= crypt.decrypt(req.params.userId);
	let lang = req.body.lang;
	let jsonData = req.body.jsonData;
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'SuperAdmin'){
			//subir file
			fs.writeFile('./dist/assets/i18n/'+lang+'.json', JSON.stringify(jsonData), (err) => {
        if (err) {
          res.status(403).send({message: 'not uploaded'})
        }

      	res.status(200).send({message: 'uploaded'})
      });


		}else{
			res.status(401).send({message: 'without permission'})
		}

	})
}

/**
 * @api {put} https://health29.org/api/superadmin/lang/ Create new language for the platform texts
 * @apiPrivate
 * @apiName addlangSuperadmin
 * @apiDescription This method creates a new language for the platform texts. Only for superadmin
 * @apiGroup Languages
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = userId
 *   var body = { code: <lang_code>, name: <lang_name> }
 *   this.http.put('https://health29.org/api/superadmin/lang'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Request new language ok');
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
 * @apiParam {Object} userId The user unique id.
 * @apiSuccess {Object} Result Returns a message with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * 		"message":'added'
 * 	}
 *
 *
 */
function addlang (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'SuperAdmin'){

		  let code = req.body.code;
			let name = req.body.name;
			Lang.findOne({ 'code': code }, function (err, langfound) {
				if (err) res.status(403).send({message: 'fail'})
				if(langfound) res.status(200).send({message: 'already exists'})

				if(!langfound) {
					//traducir el filePath
					var objToTranslate = JSON.parse(fs.readFileSync('./dist/assets/i18n/en.json', 'utf8'));
					processObj(objToTranslate, code, name, res);
				}

			})

		}else{
				res.status(401).send({message: 'without permission'})
			}

	})
}


async function processObj(obj, code, name, res){

	//subir file
	fs.writeFile('./dist/assets/i18n/'+code+'.json', JSON.stringify(obj), (err) => {
		if (err) {
			res.status(403).send({message: 'not added'})
		}

		//fs.createReadStream('./dist/assets/i18n/en.json').pipe(fs.createWriteStream('./dist/assets/i18n/'+code+'.json'));

		let lang = new Lang()
		lang.name = name
		lang.code = code
		lang.save((err, langSaved) => {
			if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
			res.status(200).send({message: 'added', isSupported: true})
		})
	});

	//return obj
}


/**
 * @api {delete} https://health29.org/api/superadmin/lang/ Delete language for the platform texts
 * @apiPrivate
 * @apiName deletelangSuperadmin
 * @apiDescription This method deletes a language for the platform texts. Only for superadmin
 * @apiGroup Languages
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-code-<lang_code>
 *   this.http.delete('https://health29.org/api/superadmin/lang'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete language ok');
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
 * @apiParam {Object} userId-code-lang_code The user unique id and the code of the language to delete.
 * @apiSuccess {Object} Result Returns a message with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * 		"message":'deleted'
 * 	}
 *
 *
 */
function deletelang (req, res){

	var params= req.params.userIdAndLang;
	params = params.split("-code-");
	let userId= crypt.decrypt(params[0]);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'SuperAdmin'){

		  let code = params[1];

			fs.unlink('./dist/assets/i18n/'+code+'.json',function(err){
        if(err) res.status(403).send({message: 'fail'});

				Lang.findOne({code: code},(err, langFound) => {
					if (err) return res.status(500).send({message: `Error deleting the lang: ${err}`})
					if(langFound){
						langFound.remove(err => {
								if(err) res.status(202).send({message: 'error, not found'})
								res.status(200).send({message: 'deleted'})
							})
						}else{
							 res.status(202).send({message: 'error, not found'})
						}
				})

		   });
		}else{
				res.status(401).send({message: 'without permission'})
			}

	})
}

module.exports = {
	updateLangFile,
	addlang,
	deletelang
}
