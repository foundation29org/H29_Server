// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Qna = require('../../models/qna')
const crypt = require('../../services/crypt')

/**
 * @api {get} https://health29.org/api/qnas Request list of qnas/knowledgeBases identifiers for a group
 * @apiName getKnowledgeBaseIDS
 * @apiDescription This method request the list of qnas/knowledgeBases identifiers for a group in all languages configured.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var query = { group: <group_name> }
 *   this.http.get('https://health29.org/api/qnas',{params:query})
 *    .subscribe( (res : any) => {
 *      console.log('Get list of qnas identifiers for a group ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiHeader {String} authorization Users unique access-key. For this, go to  [Get token](#api-Access_token-signIn)
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciPgDIUzI1NiJ9.eyJzdWIiOiI1M2ZlYWQ3YjY1YjM0ZTQ0MGE4YzRhNmUyMzVhNDFjNjEyOThiMWZjYTZjMjXkZTUxMTA9OGVkN2NlODMxYWY3IiwiaWF0IjoxNTIwMzUzMDMwLCJlcHAiOjE1NTE4ODkwMzAsInJvbGUiOiJVc2VyIiwiZ3JvdDEiOiJEdWNoZW5uZSBQYXJlbnQgUHJfrmVjdCBOZXRoZXJsYW5kcyJ9.MloW8eeJ857FY7-vwxJaMDajFmmVStGDcnfHfGJx05k"
 *     }
 * @apiParam {Object} groupName The name of the group: { group: (group_name) }
 * @apiSuccess {Object[]} Result Returns list of knowledgeBases with the information of the ID and the lang: [{knowledgeBaseID:qna.knowledgeBaseID, lang: qna.lang}]
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 * 		{
 * 			knowledgeBaseID: <knowledgeBaseID>,
 * 			lang: <lang_code>
 * 		}
 * 	]
 *
 *
 */
function getKnowledgeBaseIDS (req, res){
	let group = req.query.group;
	Qna.find({group: group},(err, qnas) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		var listQnas = [];

		qnas.forEach(function(qna) {
      	listQnas.push({knowledgeBaseID:qna.knowledgeBaseID, lang: qna.lang});
    });

    res.status(200).send(listQnas)

	})

}

/**
 * @api {get} https://health29.org/api/qnas Request list of qnas/knowledgeBases identifiers for a group in specific language
 * @apiName getKnowledgeBaseID
 * @apiDescription This method request the list of qnas/knowledgeBases identifiers for a group in specific language.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var query = { group: <group_name>, lang: <lang_code> }
 *   this.http.get('https://health29.org/api/qna',{params:query})
 *    .subscribe( (res : any) => {
 *      console.log('Get list of qnas identifiers for a group in specific language ok');
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
 * @apiParam {String} groupName The name of the group: { group: (group_name) }
 * @apiParam {String} lang The code of the language: { lang: (lang_code) }
 * @apiSuccess {Object} Result Returns the identifier of knowledgeBase for specific group and language
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			knowledgeBaseID: <knowledgeBaseID>,
 * 		}
 *
 */
function getKnowledgeBaseID (req, res){
	let lang = req.query.lang;
	let group = req.query.group;
	//Qna.findOne({ 'group': group, 'lang': lang }, function (err, qna) {
	Qna.findOne({ 'group': group, 'lang': lang }, (err, qna) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!qna) return res.status(202).send({message: 'There are no qna'})
		res.status(200).send({knowledgeBaseID:qna.knowledgeBaseID})
	})
}

/**
 * @api {post} https://health29.org/api/admin/qna/ Create new Knowledgebase/qna in specific language
 * @apiPrivate
 * @apiName createKnowledgeBase
 * @apiDescription This method creates new Knowledgebase/qna in specific language. Only for Admins.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {lang: <lang_code>, group: <group_name>, actualKnowledge.knowledgeBaseID}
 *   this.http.post('https://health29.org/api/admin/qna/'+userId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new Knowledgebase ok');
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
 * 			"message": 'Qna created',
 * 		}
 *
 */
function createKnowledgeBase (req, res){
	let userId= crypt.decrypt(req.params.userId);
	//añado  {"_id" : false} para que no devuelva el _id
	User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'Admin'){

			let lang = req.body.lang;
			let group = req.body.group;
			let knowledgeBaseID = req.body.knowledgeBaseID;
			let categories= req.body.categories;

			Qna.findOne({ 'group': group, 'lang': lang }, (err, qnafound) => {
				if (err) res.status(403).send({message: 'fail'})
				if(qnafound) res.status(200).send({message: 'already exists'})

				if(!qnafound) {
					let qna = new Qna()
					qna.lang = lang
					qna.group = group
					qna.knowledgeBaseID = knowledgeBaseID

					qna.save((err, qnaStored) => {
						if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

						res.status(200).send({message: 'Qna created', qna: qnaStored})
					})
				}

			})

		}else{
				res.status(401).send({message: 'without permission'})
			}

	})
}

/**
 * @api {delete} https://health29.org/api/admin/qna/ Delete Knowledgebase/qna
 * @apiPrivate
 * @apiName deleteKnowledgeBase
 * @apiDescription This method deletes specific Knowledgebase/qna. Only for Admins.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-knowledgeBaseID-<knowledgeBaseID>
 *   this.http.delete('https://health29.org/api/admin/qna/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete specific Knowledgebase ok');
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
 * @apiParam {String} userId-knowledgeBaseID-knowledgeBaseID The unique identifiers for the user and the knowledgeBase
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'The knowledgeBase has been eliminated',
 * 		}
 *
 */
function deleteKnowledgeBase (req, res){
	var params= req.params.userIdAndknowledgeBaseID;
  params = params.split("-knowledgeBaseID-");
  let userId = crypt.decrypt(params[0]);
	let knowledgeBaseID = params[1];

	User.findById(userId, {"_id" : false , "password" : false, "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "confirmed" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})

		if(user.role == 'Admin'){
			Qna.findOne({knowledgeBaseID: knowledgeBaseID},(err, qna) => {
					if (err) return res.status(500).send({message: `Error deleting the knowledgeBase: ${err}`})
					if(qna){
						qna.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the knowledgeBase: ${err}`})
							res.status(200).send({message: 'The knowledgeBase has been eliminated'})
						})
					}else{
						 return res.status(202).send({message: 'The knowledgeBase does not exist'})
					}
				})

		}else{
      res.status(401).send({message: 'without permission'})
    }
	})
}

/**
 * @api {post} https://health29.org/api/admin/qna/setCategories/ Create new category in specific Knowledgebase
 * @apiPrivate
 * @apiName addCategories
 * @apiDescription This method creates new category in specific Knowledgebase/qna. Only for Admins.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>-code-<lang_code>
 *   var body = <category_name>
 *   this.http.post('https://health29.org/api/admin/qna/setCategories/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new category in specific qna ok');
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
 * @apiParam {String} groupId-code-lang_code The unique identifier for a group and the language code.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Qna updated',
 * 		}
 *
 */
function addCategories(req,res){
	let params=req.params.groupNameAndLang;
	params=params.split("-code-");
	let groupName=params[0];
	let lang=params[1];
	let categoryName=req.body.category;
	Qna.findOne({ 'group': groupName, 'lang': lang }, (err, qna) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!qna) return res.status(202).send({message: 'There are no qna'})
		//res.status(200).send({knowledgeBaseID:qna.knowledgeBaseID})
		qna.categories.push(categoryName);
		Qna.findByIdAndUpdate(qna._id,qna,(err,qnaUpdated)=>{
			if (err) res.status(500).send({message: `Failed to update in the database: ${err} `})
			res.status(200).send({message: 'Qna updated', qna: qnaUpdated})
		})

	})
}

/**
 * @api {get} https://health29.org/api/admin/qna/getCategories/ Request the list of categories present in a specific knowledgebase/qna
 * @apiName getCategories
 * @apiDescription This method request the list of categories of a specific qna/knowledgeBase.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <knowledgeBaseID>
 *   this.http.get('https://health29.org/api/admin/qna/getCategories/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of categories of qna ok');
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
 * @apiParam {String} knowledgeBaseID The unique identifier of a knowledgeBase
 * @apiSuccess {Object[]} Result Returns the list of categories of a specific qna/knowledgeBase.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			categories:["category1","category2"]
 * 		}
 *
 */
function getCategories(req,res){
	let knowledgeBaseID = req.params.knowledgeBaseID;
	Qna.findOne({ 'knowledgeBaseID': knowledgeBaseID}, (err, qna) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!qna) return res.status(202).send({message: 'There are no qna'})
		res.status(200).send({categories:qna.categories})
	})
}

/**
 * @api {delete} https://health29.org/api/admin/qna/deleteCategory/ Delete category of a specific Knowledgebase/qna
 * @apiPrivate
 * @apiName deleteCategory
 * @apiDescription This method deletes a category of a specific Knowledgebase/qna.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupName>-code-<lang>-code-<categoryName>
 *   this.http.delete('https://health29.org/api/admin/qna/deleteCategory/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete a category of a specific Knowledgebase ok');
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
 * @apiParam {String} groupName-code-lang-code-categoryName The group name, the code of the language and the name of the category.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'Qna updated',
 * 		}
 *
 */
function deleteCategory(req,res){
	let params=req.params.groupNameAndLang;
	params=params.split("-code-");
	let groupName=params[0];
	let lang=params[1];
	let categoryName=params[2];
	Qna.findOne({ 'group': groupName, 'lang': lang }, (err, qna) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!qna) return res.status(202).send({message: 'There are no qna'})
		//res.status(200).send({knowledgeBaseID:qna.knowledgeBaseID})
		qna.categories.splice(qna.categories.indexOf(categoryName), 1);
		//qna.categories.push(categoryName);
		Qna.findByIdAndUpdate(qna._id,qna,(err,qnaUpdated)=>{
			if (err) res.status(500).send({message: `Failed to delete category in the database: ${err} `})
			res.status(200).send({message: 'Qna updated', qna: qnaUpdated})
		})

	})
}


module.exports = {
	getKnowledgeBaseIDS,
	getKnowledgeBaseID,
	createKnowledgeBase,
	deleteKnowledgeBase,
	addCategories,
	getCategories,
	deleteCategory

}
