// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const PromSection = require('../../../models/prom-section')
const Prom = require('../../../models/prom')
const PatientProm = require('../../../models/patient-prom')
const Patient = require('../../../models/patient')
const crypt = require('../../../services/crypt')
const User = require('../../../models/user')
const Lang = require('../../../models/lang')
const StructureProm = require('../../../models/structure-prom')

/**
 * @api {get} https://health29.org/api/group/sections/:groupId Get list Sections
 * @apiName getSections
 * @apiDescription This method return the section list of the proms of a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupId = <group_id>
 *   this.http.get('https://health29.org/api/group/sections/'+groupId)
 *    .subscribe( (res : any) => {
 *      console.log('Get sections ok');
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
 * @apiParam {String} groupId The unique Id of the group of patients.
 * @apiSuccess {Object[]} Result List with the sections objects:{"_id":(section Id),"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id":<section_id>,
 *     "description":<section description>,
 *     "name":<section name>,
 *     "enabled":true,
 * 	   "order":2
 *   },
 *  {...}
 * ]
 *
 */
function getSections (req, res){
	let groupId= req.params.groupId;
	PromSection.find({"createdBy": groupId}, function(err, sections) {
		var listSections = [];

		sections.forEach(function(section) {
			listSections.push(section);
		});

		res.status(200).send(listSections)
	});
}

/**
 * @api {get} https://health29.org/api/group/section/:promSectionId Get Prom Section by id
 * @apiName getSection
 * @apiDescription This method return a section of the proms of a group by identifier
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/group/section/'+promSectionId)
 *    .subscribe( (res : any) => {
 *      console.log('Get section by identifier ok');
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
 * @apiParam {String} promSectionId The unique Id of the section of the proms of a group.
 * @apiSuccess {Object} Result Sections object:{"_id":(section Id),"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "_id":<section_id>,
 *     "description":<section description>,
 *     "name":<section name>,
 *     "enabled":true,
 * 	   "order":2
 *   }
 *
 */
function getSection (req, res){
	let promSectionId= req.params.promSectionId;
	PromSection.findById(promSectionId, {"createdBy" : false },  (err, promSection) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!promSection) return res.status(202).send({message: 'There are no sections'})
		res.status(200).send({promSection})
	})
}

/**
 * @api {post} https://health29.org/api/group/section/:groupId Create new Prom Section
 * @apiPrivate
 * @apiName saveSection
 * @apiDescription This method creates a new section of the proms of a group.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *  var section = {"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
 *   this.http.post('https://health29.org/api/group/section/'+groupId,section)
 *    .subscribe( (res : any) => {
 *      console.log('Create new section ok');
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
 * @apiParam {String} groupId The unique Id of the group.
 * @apiSuccess {Object} promSection Sections object:{"_id":(section Id),"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
* @apiSuccess {String} message If the new prom section has been created correctly, it returns the message 'Section created'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 * 		"promSection":
 * 		{
 *     		"_id":<section_id>,
 *    		 "description":<section description>,
 *     		"name":<section name>,
 *    		 "enabled":true,
 * 	  		 "order":2
 *   	},
 * 		message: 'Section created'
 *	}
 *
 */
function saveSection (req, res){
	let groupId= req.params.groupId;
	let promSection = new PromSection()
	promSection.name = req.body.name
	promSection.description = req.body.description
	promSection.enabled = req.body.enabled
	promSection.order = req.body.order
	promSection.createdBy = groupId
	// when you save, returns an id in promSectionStored to access that social-info
	promSection.save((err, promSectionStored) => {
		if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})

		Lang.find({}, function(err, langs) {
			if(langs!=undefined){
				langs.forEach(function(lang) {
					StructureProm.findOne({"createdBy": groupId, "lang": lang.code}, {"createdBy" : false }, (err, structureProm) => {
						if(structureProm){
							var nuwValue = {promsStructure: [], section: promSection};
							(structureProm.data).push(nuwValue)

							var promId= structureProm._id
							StructureProm.findByIdAndUpdate(promId, structureProm, {new: true}, function(err, promUpdated){
							})
						}
					})
				});
			}
		});
		var copypromSectionStored = JSON.parse(JSON.stringify(promSectionStored));
		delete copypromSectionStored.createdBy;
		res.status(200).send({message: 'Section created', promSection: promSectionStored})

	})
}

/**
 * @api {put} https://health29.org/api/group/section/:promSectionId Update Prom Section
 * @apiPrivate
 * @apiName updateSection
 * @apiDescription This method updates a section of the proms of a group.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *  var section = {"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
 *   this.http.put('https://health29.org/api/group/section/'+promSectionId,section)
 *    .subscribe( (res : any) => {
 *      console.log('Update section ok');
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
 * @apiParam {String} promSectionId The unique Id of the section of the proms of a group.
 * @apiSuccess {Object} promSection Sections object:{"_id":(section Id),"description":(section description string),"name":(section name string),"enabled":(section visible boolean),"order":(section order in platform number)}
 * @apiSuccess {String} message If the prom section has been updated correctly, it returns the message 'Section updated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 * 		"promSection":
 * 		{
 *     		"_id":<section_id>,
 *    		 "description":<section description>,
 *     		"name":<section name>,
 *    		 "enabled":true,
 * 	  		 "order":2
 *   	},
 * 		message: 'Section updated'
 *	}
 *
 */
function updateSection (req, res){
	let promSectionId= req.params.promSectionId;
	let update = req.body
	let machacar = update.machacar;
	PromSection.findById(promSectionId, (err, promSectionOld) => {
		PromSection.findByIdAndUpdate(promSectionId, update, {select: '-createdBy', new: true}, (err,promSectionUpdated) => {

			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(promSectionUpdated){
				Lang.find({}, async function(err, langs) {
					if(langs!=undefined){

						for (var indice = 0; indice < langs.length; indice++) {
							var result = await processObj(langs[indice], update, promSectionId, promSectionOld, machacar);
						}
					}
				});
			}

			res.status(200).send({message: 'Section updated', promSection: promSectionUpdated})

		})
	})
}

async function processObj(lang, update, promSectionId, promSectionOld, machacar){
	StructureProm.findOne({"createdBy": update.createdBy, "lang": lang.code}, {"createdBy" : false }, (err, structureProm) => {
		if(structureProm){
			var enc = false;
			for (var i = 0; i < structureProm.data.length && !enc; i++) {
				if(structureProm.data[i].section._id == promSectionId){
					if(promSectionOld.name==update.name){
						if(!machacar){
							update.name = structureProm.data[i].section.name;
						}else{
							update.name = update.name;
						}
					}
					if(promSectionOld.description==update.description){
						if(!machacar){
							update.description = structureProm.data[i].section.description;
						}else{
							update.description = update.description;
						}
					}

					structureProm.data[i].section = update
					StructureProm.findByIdAndUpdate(structureProm._id, structureProm, {new: true}, function(err, promUpdated){
					})
					enc = true;
				}

			}
			return {data:structureProm };
		}else{
			return {data:'' };
		}
	})
}

/**
 * @api {delete} https://health29.org/api/group/section/:promSectionId Delete Prom Section by id
 * @apiPrivate
 * @apiName deleteSection
 * @apiDescription This method deletes a section of the proms of a group by identifier
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.delete('https://health29.org/api/group/section/'+promSectionId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete section by identifier ok');
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
 * @apiParam {String} promSectionId The unique Id of the section of the proms of a group.
 * @apiSuccess {String} message If the prom section has been deleted correctly, it returns the message 'The section has been eliminated'.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *     "message":'The section has been eliminated'
 *   }
 *
 */
function deleteSection (req, res){
	let promSectionId=req.params.promSectionId

	PromSection.findById(promSectionId, (err, promSection) => {
		if (err) return res.status(500).send({message: `Error deleting the section: ${err}`})
		if(promSection){
			var myquery = { section: promSectionId };
			Prom.find(myquery,(err,promsFound)=>{
				if(err) return res.status(500).send({message: `Error deleting the proms of the section: ${err}`})
				if(promsFound){
					promsFound.forEach(function(prom){
						prom.remove(err => {
							if(err) return res.status(500).send({message: `Error deleting the proms of the section: ${err}`})
						});

					})
				}
			})
			promSection.remove(err => {
				if(err) return res.status(500).send({message: `Error deleting the section: ${err}`})

				Lang.find({}, function(err, langs) {
					if(langs!=undefined){
						langs.forEach(function(lang) {
							StructureProm.findOne({"createdBy": promSection.createdBy, "lang": lang.code}, {"createdBy" : false }, (err, structureProm) => {
								if(structureProm){
									var enc = false;
									for (var i = 0; i < structureProm.data.length && !enc; i++) {
										if(structureProm.data[i].section._id == promSectionId){
											delete structureProm.data[i];

											//eliminate all the null values from the data
											structureProm.data = (structureProm.data).filter(function(x) { return x !== null })
											StructureProm.findByIdAndUpdate(structureProm._id, structureProm, {new: true}, function(err, promUpdated){
											})
											enc = true;
										}

									}
								}
							})
				    });
					}
			  });

				res.status(200).send({message: `The section has been eliminated`})
			})
		}else{
			 return res.status(202).send({message: 'The section does not exist'})
		}
	})
}

module.exports = {
	getSections,
	getSection,
	saveSection,
	updateSection,
	deleteSection
}
