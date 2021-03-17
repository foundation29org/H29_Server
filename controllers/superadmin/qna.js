// functions for each call of the api on SuperAdmin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Qna = require('../../models/qna')
const crypt = require('../../services/crypt')


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
 * @api {post} https://health29.org/api/superadmin/qna/ Create new Knowledgebase/qna in specific language as superadmin
 * @apiPrivate
 * @apiName createKnowledgeBaseSuperadmin
 * @apiDescription This method creates new Knowledgebase/qna in specific language. Only for SuperAdmins.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   var body = {lang: <lang_code>, group: <group_name>, actualKnowledge.knowledgeBaseID}
 *   this.http.post('https://health29.org/api/superadmin/qna/'+userId,body)
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

		if(user.role == 'SuperAdmin'){

			let lang = req.body.lang
			let group = req.body.group
			let knowledgeBaseID = req.body.knowledgeBaseID

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
						var copyqnaStored = JSON.parse(JSON.stringify(qnaStored));
						delete copyqnaStored.createdBy;
						res.status(200).send({message: 'Qna created', qna: copyqnaStored})
					})
				}

			})

		}else{
				res.status(401).send({message: 'without permission'})
			}

	})
}

/**
 * @api {delete} https://health29.org/api/superadmin/qna/ Delete Knowledgebase/qna as superadmin
 * @apiPrivate
 * @apiName deleteKnowledgeBaseSuperadmin
 * @apiDescription This method deletes specific Knowledgebase/qna. Only for Superadmins.
 * @apiGroup knowledgeBases
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-knowledgeBaseID-<knowledgeBaseID>
 *   this.http.delete('https://health29.org/api/superadmin/qna/'+params)
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

		if(user.role == 'SuperAdmin'){
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


module.exports = {
	getKnowledgeBaseIDS,
	getKnowledgeBaseID,
	createKnowledgeBase,
	deleteKnowledgeBase
}
