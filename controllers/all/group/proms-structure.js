// functions for each call of the api on section. Use the prom-section model

'use strict'

const PromSection = require('../../../models/prom-section')
const Prom = require('../../../models/prom')
const crypt = require('../../../services/crypt')
const User = require('../../../models/user')
const StructureProm = require('../../../models/structure-prom')


/**
 * @api {get} https://health29.org/api/translationstructureproms Get the translations of the proms of a group
 * @apiName getPromsStructure
 * @apiDescription This method return the translations of the proms of a group in a specific language
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <lang>-code-<groupId>
 *   this.http.get('https://health29.org/api/translationstructureproms/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get translations of the proms of a group in a specific language ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiParam {String} lang-code-groupId The language selected and group unique id
 * @apiSuccess {Object} Result Result Returns a object with the translations of the proms of the group for each section of the platform in specific language.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 *	"lang" : "en",
 *	"data" : [
 *		{
 *			"section" : {
 *				"_id" : <sectionId>,
 *				"description" : "Diagnosis data for Sanfilippo patients",
 *				"name" : "Diagnosis",
 *				"__v" : 0,
 *				"order" : 1,
 *				"enabled" : true
 *			},
 *			"promsStructure" : [
 *				{
 *					"data" : [ ],
 *					"structure" : {
 *						"_id" : <promId>,
 *						"disableDataPoints" : null,
 *						"relatedTo" : null,
 *						"width" : "6",
 *						"periodicity" : 1,
 *						"order" : 2,
 *						"section" : <sectionId>,
 *						"question" : "Diagnosis",
 *						"responseType" : "RadioButtons",
 *						"name" : "Diagnosis",
 *						"__v" : 0,
 *						"enabled" : true,
 *						"isRequired" : false,
 *						"values" : [
 *							{
 *								"original" : "MPS III - type A",
 *								"translation" : "MPS III - type A"
 *							},
 *							{
 *								"original" : "MPS III - type B",
 *								"translation" : "MPS III - type B"
 *							},
 *							{
 *								"original" : "MPS III - type C",
 *								"translation" : "MPS III - type C"
 *							},
 *							{
 *								"original" : "MPS III - type D",
 *								"translation" : "MPS III - type D"
 *							}
 *						],
 *						"marginTop" : false,
 *						"hideQuestion" : true
 *					}
 *				}
 *			],
 *			" anchor":"Diagnosis"
 *		}
 * }
 */

function getPromsStructure (req, res){
	var params= req.params.langAndgroupId;
	params = params.split("-code-");
	let lang= params[0];
	let groupId = params[1];
	PromSection.find({createdBy: groupId}, {"createdBy" : false }).sort({ order : 'asc'}).exec(async function(err, sections){
	//PromSection.find({"createdBy": groupId}, {"createdBy" : false }, function(err, sections) {
		var listSections = [];
		var long = 0;
		sections.forEach(function(section) {
			listSections.push(section);
			if(section.enabled){
				long++;
			}
		});

		getInfoProms(listSections, res, groupId, lang, long);

	});
}

async function getInfoProms(listSections, res, groupId, lang, long){
	var promsStructure = [];
	if(listSections.length>0){
		var cont = 0;
		for (var i = 0; i < listSections.length; i++) {
			if(listSections[i].enabled){
					var res0 = await getInfoProms2(listSections[i]);
					if(res0!=undefined){
						promsStructure.push({section:listSections[i], promsStructure:res0, anchor: listSections[i].name})
						cont++;
						if(long==cont){
							for (var j = 0; j < promsStructure.length; j++) {
								for (var k = 0; k < promsStructure[j].promsStructure.length; k++) {
									promsStructure[j].promsStructure[k].data = [];
								}
							}
							res.status(200).send(promsStructure)
						}
					}else{
					}
					/*await PromSection.findOne({"_id":listSections[i]._id}, (err,promSectionFound)=>{
						if(promSectionFound){
							if(res0!=undefined){
								promsStructure.push({section:listSections[i], anchor: promSectionFound.name,promsStructure:res0})
							}
						}
					})*/
			}
		}





	}else{
		res.status(200).send(promsStructure)
	}

}

async function getInfoProms2(sectionInfo){
	var listProms = [];
	await Prom.find({"section": sectionInfo._id}, {"createdBy" : false }, async function(err, proms) {
		proms.forEach(function(prom) {
			if(prom.enabled){

				listProms.push({structure:prom , data:{}})
			}
			else{
			}
		});
	});
	return listProms
}

function getTranslationPromsStructure (req, res){
	var params= req.params.langAndgroupId;
	params = params.split("-code-");
	let lang= params[0];
	let groupId = params[1];
	StructureProm.findOne({"createdBy": groupId, "lang": lang}, {"createdBy" : false }, async function (err, structureProm) {
	//StructureProm.findOne({"createdBy": groupId, "lang": lang}, {"createdBy" : false }, (err, structureProm) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!structureProm) return res.status(202).send({message: 'There are no structureProm'})
		var resul = {_id: structureProm._id, lang: structureProm.lang, data: []};
		for (var i = 0; i < structureProm.data.length; i++) {
			if(structureProm.data[i]!=undefined){
				if(structureProm.data[i].section.enabled){
					var tempDataPoints = [];
					for (var j = 0; j < structureProm.data[i].promsStructure.length; j++) {
						if(structureProm.data[i].promsStructure[j].structure.enabled){
							//delete structureProm.data[i].promsStructure[j].structure.createdBy;
							tempDataPoints.push({data: structureProm.data[i].promsStructure[j].data, structure: structureProm.data[i].promsStructure[j].structure});
						}
					}
					resul.data.push({section: structureProm.data[i].section,anchor: structureProm.data[i].anchor,promsStructure: tempDataPoints});
			}
			}

		}

		res.status(200).send({structureProm:resul})
	})
}

/**
 * @api {post} https://health29.org/api/structureproms/ Save prom structure (translations)
 * @apiPrivate
 * @apiName savePromsStructure
 * @apiDescription This method saves prom structure (translations)
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var body = {"data":<prom structure>,"lang":"lang_code","groupId":<groupId>}
 *   this.http.post('https://health29.org/api/structureproms/',body)
 *    .subscribe( (res : any) => {
 *      console.log('Save prom structure ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiSuccess {Object} Result Returns the prom structure updated.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 *	"lang" : "en",
 *	"data" : [
 *		{
 *			"section" : {
 *				"_id" : <sectionId>,
 *				"description" : "Diagnosis data for Sanfilippo patients",
 *				"name" : "Diagnosis",
 *				"__v" : 0,
 *				"order" : 1,
 *				"enabled" : true
 *			},
 *			"promsStructure" : [
 *				{
 *					"data" : [ ],
 *					"structure" : {
 *						"_id" : <promId>,
 *						"disableDataPoints" : null,
 *						"relatedTo" : null,
 *						"width" : "6",
 *						"periodicity" : 1,
 *						"order" : 2,
 *						"section" : <sectionId>,
 *						"question" : "Diagnosis",
 *						"responseType" : "RadioButtons",
 *						"name" : "Diagnosis",
 *						"__v" : 0,
 *						"enabled" : true,
 *						"isRequired" : false,
 *						"values" : [
 *							{
 *								"original" : "MPS III - type A",
 *								"translation" : "MPS III - type A"
 *							},
 *							{
 *								"original" : "MPS III - type B",
 *								"translation" : "MPS III - type B"
 *							},
 *							{
 *								"original" : "MPS III - type C",
 *								"translation" : "MPS III - type C"
 *							},
 *							{
 *								"original" : "MPS III - type D",
 *								"translation" : "MPS III - type D"
 *							}
 *						],
 *						"marginTop" : false,
 *						"hideQuestion" : true
 *					}
 *				}
 *			],
 *			" anchor":"Diagnosis"
 *		}
 * }
 */
function savePromsStructure (req, res){

	let structureProm = new StructureProm()
	structureProm.data = req.body.data
	structureProm.lang = req.body.lang
	structureProm.createdBy = req.body.groupId
	// when you save, returns an id in structurePromStored to access that social-info
	structureProm.save((err, structurePromStored) => {
		if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
		var copystructurePromStored = JSON.parse(JSON.stringify(structurePromStored));
		delete copystructurePromStored.createdBy;
		res.status(200).send(copystructurePromStored)

	})
}

/**
 * @api {put} https://health29.org/api/structureproms/ Update prom structure (translations)
 * @apiPrivate
 * @apiName updatePromsStructure
 * @apiDescription This method updates prom structure (translations)
 * @apiGroup Groups
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var body = {"data":<prom structure>,"lang":"lang_code","groupId":<groupId>}
 *   this.http.put('https://health29.org/api/structureproms/',body)
 *    .subscribe( (res : any) => {
 *      console.log('Update prom structure ok');
 *     }, (err) => {
 *      ...
 *     }
 *
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Prom updated"
 * }
 */
function updatePromsStructure (req, res){
	let promId= req.params.promId;
	let update = req.body
	StructureProm.findByIdAndUpdate(promId, update, {new: true}, function(err, promUpdated){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		res.status(200).send({message: 'Prom updated'})
	})
}

module.exports = {
  getPromsStructure,
	getTranslationPromsStructure,
	savePromsStructure,
	updatePromsStructure
}
