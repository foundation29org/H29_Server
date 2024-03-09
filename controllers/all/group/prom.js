// functions for each call of the api on group. Use the group model

'use strict'

// add the group model
const Group = require('../../../models/group')
const Prom = require('../../../models/prom')
const crypt = require('../../../services/crypt')
const User = require('../../../models/user')
const Lang = require('../../../models/lang')
const StructureProm = require('../../../models/structure-prom')


/**
 * @api {get} https://health29.org/api/group/proms Get the proms of a section
 * @apiName getPromsSectionGroup
 * @apiDescription This method return the proms of an specific section
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var sectionId = <sectionId>
 *   this.http.get('https://health29.org/api/group/proms'+sectionId)
 *    .subscribe( (res : any) => {
 *      console.log('Get proms from <sectionId> ok');
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
 * @apiParam {String} sectionId The section unique id
 * @apiSuccess {Object[]} Result Result Returns a list of proms objects.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
*			"_id" : <prom id>,
 *			"relatedTo" : <prom id related>,
 *			"width" : "12",
 *			"periodicity" : 1,
 *			"order" : 2,
 *			"section" : <section id>,
 *			"question" : "I don’t know",
 *			"responseType" : "Toogle",
 *			"name" : "PI don’t know",
 *			"enabled" : true,
 *			"isRequired" : false,
 *			"values" : [ ],
 *			"marginTop" : false,
 *			"hideQuestion" : false,
 *			"__v" : 0
 * 		}
 * ]
 */
function getPromsSection(req, res) {
	let sectionId = req.params.sectionId;
	Prom.find({ "section": sectionId }, function (err, proms) {
		var listProms = [];

		proms.forEach(function (prom) {
			listProms.push(prom);
		});

		res.status(200).send(listProms)
	});
}


/**
 * @api {get} https://health29.org/api/group/proms/:groupId Get Proms Group
 * @apiName getPromSectionGroup
 * @apiDescription This method return the proms of a group
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   this.http.get('https://health29.org/api/group/proms/'+groupId)
 *    .subscribe( (res : any) => {
 *      console.log('proms: '+ res);
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
 * @apiParam {String} groupId The name of the group of patients. More info here:  [Get groupName](#api-Groups-getGroupsNames)
 * @apiSuccess {String} _id Prom unique ID.
 * @apiSuccess {String} name
 * @apiSuccess {string="Text","Number","Date","Time","Toogle","Choise","ChoiseSet"} responseType
 * @apiSuccess {string} question
 * @apiSuccess {String[]} values
 * @apiSuccess {String} section
 * @apiSuccess {Number} order
 * @apiSuccess {Number} periodicity
 * @apiSuccess {Boolean} isRequired
 * @apiSuccess {Boolean} enabled
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "_id":"5a6f4b83f660d806744f3ef6",
 *     "name":"",
 *     "responseType":"",
 *     "question":"",
 *     "values":[],
 *     "section":"",
 *     "order":2,
 *     "periodicity":7,
 *     "isRequired": false,
 *     "enabled": false
 *   },
 *  {...}
 * ]
 *
 */
function getPromSection(req, res) {
	let groupId = req.params.promSectionId;
	Prom.findOne({ 'createdBy': groupId }, { "createdBy": false }, function (err, proms) {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		if (!proms) return res.status(404).send({ code: 208, message: 'The proms does not exist' })

		//var proms = {data:group.proms};
		res.status(200).send(proms)
	})
}

/**
 * @api {post} https://health29.org/api/group/prom/ Save prom Group
 * @apiPrivate
 * @apiName savePromSectionGroup
 * @apiDescription This method save prom. Only superadmin user can save new proms.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-code-<groupId>
 *   this.http.get('https://health29.org/api/group/prom/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Save prom ok');
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
 * @apiParam {String} userId-code-groupId The user and the group unique id: (userId)-code-(groupId)
 * @apiSuccess {Object} Result Returns a message with the information of the execution and the values of the prom created
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		"message": 'Prom created',
 * 		prom: {
 *			"_id" : <prom id>,
 *			"relatedTo" : <prom id related>,
 *			"width" : "12",
 *			"periodicity" : 1,
 *			"order" : 2,
 *			"section" : <section id>,
 *			"question" : "I don’t know",
 *			"responseType" : "Toogle",
 *			"name" : "PI don’t know",
 *			"enabled" : true,
 *			"isRequired" : false,
 *			"values" : [ ],
 *			"marginTop" : false,
 *			"hideQuestion" : false,
 *			"__v" : 0
 * 		}
 */
function savePromSection(req, res) {

	var params = req.params.userIdAndgroupId;
	params = params.split("-code-");
	let userId = crypt.decrypt(params[0]);
	let groupId = params[1];

	User.findById(userId, { "_id": false, "__v": false, "confirmationCode": false, "loginAttempts": false, "confirmed": false, "lastLogin": false }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error making the request:' })
		if (!user) return res.status(404).send({ code: 208, message: 'The user does not exist' })

		if (user.role == 'SuperAdmin') {
			let prom = new Prom()
			prom.name = req.body.name
			prom.responseType = req.body.responseType
			prom.question = req.body.question
			prom.values = req.body.values
			prom.section = req.body.section
			prom.order = req.body.order
			prom.periodicity = req.body.periodicity
			prom.annotations = req.body.annotations
			prom.isRequired = req.body.isRequired
			prom.enabled = req.body.enabled
			prom.width = req.body.width
			prom.relatedTo = req.body.relatedTo
			prom.disableDataPoints = req.body.disableDataPoints
			prom.createdBy = groupId

			// ordeno los proms por orden
			Prom.find({ section: req.body.section }).sort({ order: 'asc' }).exec((err, promIntheSameSectionFound) => {
				// Si hay más proms en la misma sección
				if (promIntheSameSectionFound.length > 0) {

					// Me quedo con el orden del nuevo DataPoint
					var newOrder = req.body.order;

					// Comprobar si newOrder existía ya en la lista de proms de la sección
					var existOrder = false;
					for (var i = 0; i < promIntheSameSectionFound.length; i++) {
						if (promIntheSameSectionFound[i].order == newOrder) {
							existOrder = true;
						}
					}
					if (existOrder == true) {
						// Calculo maxOrder
						var maxOrder = undefined;
						for (var i = 0; i < promIntheSameSectionFound.length; i++) {
							if (maxOrder == undefined) {
								maxOrder = promIntheSameSectionFound[i].order;
							}
							else if (promIntheSameSectionFound[i].order > maxOrder) {
								maxOrder = promIntheSameSectionFound[i].order;
							}
						}

						// Si newOrder > maxOrder (el nuevo está "fuera" de la lista)
						if (newOrder > maxOrder) {

							// Se guarda el nuevo dataPoint
							prom.save((err, promStored) => {
								if (err) res.status(500).send({ message: `Failed to save in the database: ${err} ` })
								Lang.find({}, function (err, langs) {
									if (langs != undefined) {
										langs.forEach(function (lang) {
											StructureProm.findOne({ "createdBy": groupId, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
												if (structureProm) {
													var enc = false;
													for (var i = 0; i < structureProm.data.length && !enc; i++) {
														if (structureProm.data[i].section._id == req.body.section) {
															enc = true;
															if (prom.values.length > 0) {
																for (var k = 0; k < prom.values.length; k++) {
																	prom.values[k] = { original: prom.values[k].value, translation: prom.values[k].value, annotations: prom.values[k].annotations }
																}
															}
															var nuwValue = { data: [], structure: prom };
															(structureProm.data[i].promsStructure).push(nuwValue)

															var promId = structureProm._id
															StructureProm.findByIdAndUpdate(promId, structureProm, { new: true }, function (err, promUpdated) {
															})
														}
													}
												}
											})
										});
									}
								});
								var copypromStored = JSON.parse(JSON.stringify(promStored));
								delete copypromStored.createdBy;
								return res.status(200).send({ message: 'Prom created', prom: copypromStored })

							})
						}
						// Si newOrder < maxOrder (el nuevo está "dentro" de la lista)
						else if (newOrder <= maxOrder) {
							// busco los datapoints cuyo order >= newOrder
							var promstoUpdate = [];
							for (var i = 0; i < promIntheSameSectionFound.length; i++) {
								if (promIntheSameSectionFound[i].order >= newOrder) {
									promIntheSameSectionFound[i].order = (promIntheSameSectionFound[i].order + 1);
									promstoUpdate.push({ id: promIntheSameSectionFound[i]._id, prom: promIntheSameSectionFound[i] })
								}
							}
							// Actualizo los datapoints cuyo order >= newOrder
							for (var i = 0; i < promstoUpdate.length; i++) {
								Prom.findByIdAndUpdate(promstoUpdate[i].id, promstoUpdate[i].prom, { new: false }, (err, promOrderUpdated) => {
									if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
								})
							}
							// Guardo el nuevo datapoint
							// when you save, returns an id in promStored to access that social-info
							prom.save((err, promStored) => {
								if (err) res.status(500).send({ message: `Failed to save in the database: ${err} ` })
								Lang.find({}, function (err, langs) {
									if (langs != undefined) {
										langs.forEach(function (lang) {
											StructureProm.findOne({ "createdBy": groupId, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
												if (structureProm) {
													var enc = false;
													for (var i = 0; i < structureProm.data.length && !enc; i++) {
														if (structureProm.data[i].section._id == req.body.section) {
															enc = true;
															if (prom.values.length > 0) {
																for (var k = 0; k < prom.values.length; k++) {
																	prom.values[k] = { original: prom.values[k].value, translation: prom.values[k].value, annotations: prom.values[k].annotations }
																}
															}
															var nuwValue = { data: [], structure: prom };
															(structureProm.data[i].promsStructure).push(nuwValue)

															var promId = structureProm._id
															StructureProm.findByIdAndUpdate(promId, structureProm, { new: true }, function (err, promUpdated) {
															})
														}
													}
												}
											})
										});
									}
								});
								var copypromStored = JSON.parse(JSON.stringify(promStored));
								delete copypromStored.createdBy;
								return res.status(200).send({ message: 'Prom created', prom: promStored })

							})
						}
					}
					else {
						// guardo el nuevo datapoint
						// when you save, returns an id in promStored to access that social-info
						prom.save((err, promStored) => {
							if (err) res.status(500).send({ message: `Failed to save in the database: ${err} ` })
							Lang.find({}, function (err, langs) {
								if (langs != undefined) {
									langs.forEach(function (lang) {
										StructureProm.findOne({ "createdBy": groupId, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
											if (structureProm) {
												var enc = false;
												for (var i = 0; i < structureProm.data.length && !enc; i++) {
													if (structureProm.data[i].section._id == req.body.section) {
														enc = true;
														if (prom.values.length > 0) {
															for (var k = 0; k < prom.values.length; k++) {
																prom.values[k] = { original: prom.values[k].value, translation: prom.values[k].value, annotations: prom.values[k].annotations }
															}
														}
														var nuwValue = { data: [], structure: prom };
														(structureProm.data[i].promsStructure).push(nuwValue)

														var promId = structureProm._id
														StructureProm.findByIdAndUpdate(promId, structureProm, { new: true }, function (err, promUpdated) {
														})
													}
												}
											}
										})
									});
								}
							});
							var copypromStored = JSON.parse(JSON.stringify(promStored));
							delete copypromStored.createdBy;
							return res.status(200).send({ message: 'Prom created', prom: promStored })

						})
					}
				}
				// Si NO hay más proms en la misma sección
				else {
					// guardo el nuevo datapoint
					// when you save, returns an id in promStored to access that social-info
					prom.save((err, promStored) => {
						if (err) res.status(500).send({ message: `Failed to save in the database: ${err} ` })
						Lang.find({}, function (err, langs) {
							if (langs != undefined) {
								langs.forEach(function (lang) {
									StructureProm.findOne({ "createdBy": groupId, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
										if (structureProm) {
											var enc = false;
											for (var i = 0; i < structureProm.data.length && !enc; i++) {
												if (structureProm.data[i].section._id == req.body.section) {
													enc = true;
													if (prom.values.length > 0) {
														for (var k = 0; k < prom.values.length; k++) {
															prom.values[k] = { original: prom.values[k].value, translation: prom.values[k].value, annotations: prom.values[k].annotations }
														}
													}
													var nuwValue = { data: [], structure: prom };
													(structureProm.data[i].promsStructure).push(nuwValue)

													var promId = structureProm._id
													StructureProm.findByIdAndUpdate(promId, structureProm, { new: true }, function (err, promUpdated) {
													})
												}
											}
										}
									})
								});
							}
						});
						var copypromStored = JSON.parse(JSON.stringify(promStored));
						delete copypromStored.createdBy;
						return res.status(200).send({ message: 'Prom created', prom: promStored })

					})
				}

			});

		} else {
			res.status(401).send({ message: 'without permission' })
		}

	})
}

/**
 * @api {post} https://health29.org/api/group/prom/ Proms update Group
 * @apiName updatePromSectionGroup
 * @apiPrivate
 * @apiDescription This method update prom. Only superadmin user can update proms.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var userId = <userId>
 *   this.http.get('https://health29.org/api/group/prom/'+userId)
 *    .subscribe( (res : any) => {
 *      console.log('Update prom ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiParam {String} userId The user unique id.
 * @apiSuccess {Object} Result Returns a message with the information of the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		"message": 'Prom updated'
 * 	}
 */
function updatePromSection(req, res) {

	let userId = crypt.decrypt(req.params.userId);
	User.findById(userId, { "_id": false, "__v": false, "confirmationCode": false, "loginAttempts": false, "confirmed": false, "lastLogin": false }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error making the request:' })
		if (!user) return res.status(404).send({ code: 208, message: 'The user does not exist' })

		if (user.role == 'SuperAdmin') {
			let promId = req.body._id;
			let update = req.body
			let machacar = update.machacar;
			Prom.find(promId, (err, promold) => {
				// ordeno los proms por orden:
				Prom.find({ section: req.body.section }).sort({ order: 'asc' }).exec((err, promIntheSameSectionFound) => {
					// Si hay más proms en la misma sección
					if (promIntheSameSectionFound.length > 0) {
						var updateOrder = req.body.order;

						// Calculo maxOrder
						var maxOrder = undefined;
						for (var i = 0; i < promIntheSameSectionFound.length; i++) {
							if (maxOrder == undefined) {
								maxOrder = promIntheSameSectionFound[i].order;
							}
							else if (promIntheSameSectionFound[i].order > maxOrder) {
								maxOrder = promIntheSameSectionFound[i].order;
							}
						}

						// Calculo previousOrder
						var previousOrder = undefined;
						for (var i = 0; i < promIntheSameSectionFound.length; i++) {
							if (promIntheSameSectionFound[i]._id == promId) {
								previousOrder = promIntheSameSectionFound[i].order
							}
						}

						// Casos
						var promstoUpdate = [];
						if (updateOrder > maxOrder) {
							for (var i = 0; i < promIntheSameSectionFound.length; i++) {
								if (promIntheSameSectionFound[i].order > previousOrder) {
									promIntheSameSectionFound[i].order = promIntheSameSectionFound[i].order - 1;
									promstoUpdate.push({ id: promIntheSameSectionFound[i]._id, prom: promIntheSameSectionFound[i] })
								}
							}
						}
						else if (updateOrder <= maxOrder) {
							if (updateOrder < previousOrder) {
								for (var i = 0; i < promIntheSameSectionFound.length; i++) {
									if ((updateOrder <= promIntheSameSectionFound[i].order) && (promIntheSameSectionFound[i].order < previousOrder)) {
										promIntheSameSectionFound[i].order = promIntheSameSectionFound[i].order + 1;
										promstoUpdate.push({ id: promIntheSameSectionFound[i]._id, prom: promIntheSameSectionFound[i] })
									}
								}
							}
							else if (updateOrder > previousOrder) {
								for (var i = 0; i < promIntheSameSectionFound.length; i++) {
									if ((previousOrder < promIntheSameSectionFound[i].order) && (promIntheSameSectionFound[i].order <= updateOrder)) {
										promIntheSameSectionFound[i].order = promIntheSameSectionFound[i].order - 1;
										promstoUpdate.push({ id: promIntheSameSectionFound[i]._id, prom: promIntheSameSectionFound[i] })
									}
								}

							}
						}
						for (var i = 0; i < promstoUpdate.length; i++) {
							Prom.findByIdAndUpdate(promstoUpdate[i].id, promstoUpdate[i].prom, { new: true }, async function (err, promUpdated) {
								if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
								if (promUpdated) {
									Lang.find({}, async function (err, langs) {
										if (langs != undefined) {
											for (var indice = 0; indice < langs.length; indice++) {
												var resultOtherProms = await processObj(langs[indice], promUpdated, promUpdated.section, promIntheSameSectionFound, machacar);
											}
										}
									});
								}
								//return res.status(200).send({message: 'Prom updated'})
							})
						}
						Prom.findByIdAndUpdate(promId, update, { new: true }, async function (err, promUpdated) {
							if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
							if (promUpdated) {
								Lang.find({}, async function (err, langs) {
									if (langs != undefined) {
										for (var indice = 0; indice < langs.length; indice++) {
											var result = await processObj(langs[indice], promUpdated, req.body.section, promold, machacar);
										}
									}
								});
							}
							return res.status(200).send({ message: 'Prom updated' })
						})
					}
				})

			})


		} else {
			res.status(401).send({ message: 'without permission' })
		}

	})

}

async function processObj(lang, promUpdated, section, promold, machacar) {
	await StructureProm.findOne({ "createdBy": promUpdated.createdBy, "lang": lang.code }, { "createdBy": false }, async function (err, structureProm) {
		var promUpdatedCopy = JSON.parse(JSON.stringify(promUpdated));
		if (structureProm) {
			var enc = false;
			for (var i = 0; i < structureProm.data.length && !enc; i++) {
				if (structureProm.data[i].section._id == section) {
					enc = true;
					var enc2 = false;
					for (var j = 0; j < structureProm.data[i].promsStructure.length && !enc2; j++) {

						var par1 = JSON.stringify(structureProm.data[i].promsStructure[j].structure._id);
						var par2 = JSON.stringify(promUpdated._id);
						if (par1 == par2) {
							enc2 = true;
							if (promUpdated.values.length > 0) {
								//mirar si ha cambiado algún valor, si es así, machacar traduciones

								for (var k = 0; k < promUpdated.values.length; k++) {
									if (machacar) {
										promUpdatedCopy.values[k] = { original: promUpdated.values[k].value, translation: promUpdated.values[k].value, annotations: promUpdated.values[k].annotations }
									} else {
										if (structureProm.data[i].promsStructure[j].structure.values[k] == undefined) {
											promUpdatedCopy.values[k] = { original: promUpdated.values[k].value, translation: promUpdated.values[k].value, annotations: promUpdated.values[k].annotations }
										} else {
											promUpdatedCopy.values[k] = { original: promUpdated.values[k].value, translation: structureProm.data[i].promsStructure[j].structure.values[k].translation, annotations: promUpdated.values[k].annotations }
										}
									}

								}
							} else {
								promUpdatedCopy.values = [];
							}
							if (promUpdated.question != promold.question) {
								if (!machacar) {
									promUpdatedCopy.question = structureProm.data[i].promsStructure[j].structure.question
								} else {
									var saveQuestion = promUpdated.question
									promUpdatedCopy.question = saveQuestion
								}

							} else {
								if (!machacar) {
									promUpdatedCopy.question = structureProm.data[i].promsStructure[j].structure.question
								} else {
									var saveQuestion = structureProm.data[i].promsStructure[j].structure.question
									promUpdatedCopy.question = saveQuestion
								}

							}
							structureProm.data[i].promsStructure[j].structure = promUpdatedCopy;
							await StructureProm.findByIdAndUpdate(structureProm._id, structureProm, { new: true }, async function (err, promUpdated2) {
								return { data: structureProm };
							})
						}
					}

				}
			}
		} else {
			return { data: '' };
		}
	})

}

/**
 * @api {delete} https://health29.org/api/group/prom/ Proms delete Group
 * @apiName deletePromSectionGroup
 * @apiPrivate
 * @apiDescription This method delete prom. Only superadmin user can delete proms.
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userId>-code-<promId>
 *   this.http.delete('https://health29.org/api/group/prom/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete prom ok');
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
 * @apiParam {String} userId-code-promId The user and the prom unique id: (userId)-code-(promId)
 * @apiSuccess {Object} Result Returns a message with the information of the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		"message": 'The prom has been eliminated'
 * 	}
 */
function deletePromSection(req, res) {
	var params = req.params.userIdAndpromId;
	params = params.split("-code-");
	let userId = crypt.decrypt(params[0]);
	let promId = params[1];
	Prom.findById(promId, (err, prom) => {
		if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
		if (prom) {
			Prom.find({ section: prom.section }).sort({ order: 'asc' }).exec((err, promIntheSameSectionFound) => {
				if (promIntheSameSectionFound) {
					var updateOrderStructureProm = false;
					var promstoUpdate = [];
					for (var i = 0; i < promIntheSameSectionFound.length; i++) {
						// Hay que verificar el order: Si ya existe hay que ordenar los demás a partir de este
						if (promIntheSameSectionFound[i].order > prom.order) {
							updateOrderStructureProm = true;
							//promIntheSameSectionFound[i].order=(promIntheSameSectionFound[i].order)-(promIntheSameSectionFound[i].order-prom.order);
							promIntheSameSectionFound[i].order = (promIntheSameSectionFound[i].order) - 1;
							promstoUpdate.push({ id: promIntheSameSectionFound[i]._id, prom: promIntheSameSectionFound[i] })
						}

					}
					for (var i = 0; i < promstoUpdate.length; i++) {
						Prom.findByIdAndUpdate(promstoUpdate[i].id, promstoUpdate[i].prom, (err, promOrderUpdated) => {
							if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
						})
					}
					var tempProm = prom;
					prom.remove(err => {
						if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
						Lang.find({}, function (err, langs) {
							if (langs != undefined) {
								langs.forEach(function (lang) {
									StructureProm.findOne({ "createdBy": prom.createdBy, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
										if (structureProm) {
											var enc = false;
											for (var i = 0; i < structureProm.data.length && !enc; i++) {
												if (structureProm.data[i].section._id == prom.section) {
													var enc2 = false;
													for (var j = 0; j < structureProm.data[i].promsStructure.length && !enc2; j++) {
														if (structureProm.data[i].promsStructure[j].structure._id == promId) {
															delete structureProm.data[i].promsStructure[j];

															//eliminate all the null values from the data
															structureProm.data[i].promsStructure = (structureProm.data[i].promsStructure).filter(function (x) { return x !== null })
															StructureProm.findByIdAndUpdate(structureProm._id, structureProm, { new: true }, function (err, promUpdated) {
															})
															enc2 = true;
														}
													}
													enc = true;
												}

											}
										}
									})
								});
							}
						});

						res.status(200).send({ message: `The prom has been eliminated` })
					})
				}
				else {
					var tempProm = prom;
					prom.remove(err => {
						if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
						Lang.find({}, function (err, langs) {
							if (langs != undefined) {
								langs.forEach(function (lang) {
									StructureProm.findOne({ "createdBy": prom.createdBy, "lang": lang.code }, { "createdBy": false }, (err, structureProm) => {
										if (structureProm) {
											var enc = false;
											for (var i = 0; i < structureProm.data.length && !enc; i++) {
												if (structureProm.data[i].section._id == prom.section) {
													var enc2 = false;
													for (var j = 0; j < structureProm.data[i].promsStructure.length && !enc2; j++) {
														if (structureProm.data[i].promsStructure[j].structure._id == promId) {
															delete structureProm.data[i].promsStructure[j];

															//eliminate all the null values from the data
															structureProm.data[i].promsStructure = (structureProm.data[i].promsStructure).filter(function (x) { return x !== null })
															StructureProm.findByIdAndUpdate(structureProm._id, structureProm, { new: true }, function (err, promUpdated) {
															})
															enc2 = true;
														}
													}
													enc = true;
												}

											}
										}
									})
								});
							}
						});

						res.status(200).send({ message: `The prom has been eliminated` })
					})
				}
			})
		} else {
			return res.status(202).send({ message: 'The prom does not exist' })
		}
	})

}

function batchImportPromAnnotations(req, res) {
	let userId = crypt.decrypt(req.params.userId);
	User.findById(userId, { "_id": false, "__v": false, "confirmationCode": false, "loginAttempts": false, "confirmed": false, "lastLogin": false }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error making the request:' })
		if (!user) return res.status(404).send({ code: 208, message: 'The user does not exist' })

		if (user.role == 'SuperAdmin') {
			var cont = 0;
			for (var k = 0; k < req.body.length; k++) {
				var promId = req.body[k].idProm;
				var annotations = req.body[k].annotations;
				var valueId = req.body[k].valueId

				if (valueId != '') {
					Prom.findById(promId, (err, prom) => {
						if (prom) {
							for (var k = 0; k < prom.values.length; k++) {
								if (prom.values[k]._id == valueId) {
									prom.values[k].annotations = annotations;
									Prom.findByIdAndUpdate(promId, prom, { new: false }, (err, promUpdated) => {
										console.log('updated')
									})
								}
							}
							cont++;
							if (cont == req.body.length) {
								return res.status(200).send({ message: 'Proms imported' })
							}
						} else {
							cont++;
							if (cont == req.body.length) {
								return res.status(200).send({ message: 'Proms imported' })
							}
						}
					})
				} else {
					Prom.findByIdAndUpdate(promId, { annotations: annotations }, { new: true }, (err, promUpdated) => {
						if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
						if (promUpdated) {
							console.log('updated')
						}
						cont++;
						if (cont == req.body.length) {
							return res.status(200).send({ message: 'Proms imported' })
						}
					})
				}

			}
		} else {
			res.status(401).send({ message: 'without permission' })
		}

	})

}

function batchImportPromAnnotations2(req, res) {
	let userId = crypt.decrypt(req.params.userId);
	User.findById(userId, { "_id": false, "__v": false, "confirmationCode": false, "loginAttempts": false, "confirmed": false, "lastLogin": false }, (err, user) => {
		if (err) return res.status(500).send({ message: 'Error making the request:' })
		if (!user) return res.status(404).send({ code: 208, message: 'The user does not exist' })

		if (user.role == 'SuperAdmin') {
			var cont = 0;
			for (var k = 0; k < req.body.length; k++) {
				var promId = req.body[k].idProm;
				var annotations = req.body[k].annotations;
				Prom.findById(promId, (err, prom) => {
					if (err) return res.status(500).send({ message: `Error deleting the prom: ${err}` })
					if (prom) {
						console.log('encontrado');
						console.log(annotations);
						Prom.findByIdAndUpdate(prom._id, { annotations: annotations }, { new: true }, (err, promUpdated) => {
							if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
							if (promUpdated) {
								console.log('updated')
							} else {
								console.log('not updated')
							}
							cont++;
							if (cont == req.body.length - 1) {
								return res.status(200).send({ message: 'Proms imported' })
							}
						})
					} else {
						cont++;
						if (cont == req.body.length - 1) {
							return res.status(200).send({ message: 'Proms imported' })
						}
					}
				})

			}


		} else {
			res.status(401).send({ message: 'without permission' })
		}

	})

}

module.exports = {
	getPromsSection,
	getPromSection,
	savePromSection,
	updatePromSection,
	deletePromSection,
	batchImportPromAnnotations
}
