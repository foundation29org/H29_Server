// functions for each call of the api on section. Use the prom-section model

'use strict'

const PromSection = require('../../../models/prom-section')
const Prom = require('../../../models/prom')
const crypt = require('../../../services/crypt')
const User = require('../../../models/user')
const PatientProm = require('../../../models/patient-prom')

/**
 * @api {get} https://health29.org/api/proms Get the proms from patient
 * @apiName getProms from patient
 * @apiDescription This method return the proms of an specific patient
 * @apiGroup Datapoints
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var query = {"groupId":<groupId>,"patientId":<patientId>}
 *   this.http.get('https://health29.org/api/proms'+query)
 *    .subscribe( (res : any) => {
 *      console.log('Get proms ok');
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
 * @apiParam {String} groupId A string with the information of the group unique id [Get groupId](#api-Groups-getGroup)
 * @apiParam {String} patientId The patient id
 * @apiSuccess {Object[]} Result Returns an object with the information for one section, the list of proms associated and the answer of the patient. [{"section":(section data),"promsStructure":[{"structure":(prom generic data),"data":(patient prom answer)}]]
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
 * 			"section": {
 *     			"_id":<section_id>,
 *     			"description":<section description>,
 *     			"name":<section name>,
 *     			"enabled":true,
 * 	   			"order":2
 * 			},
 * 			"promsStructure": {
 * 				"structure": {
 *					"_id" : <prom id>,
 *					"relatedTo" : <prom id related>,
 *					"width" : "12",
 *					"periodicity" : 1,
 *					"order" : 2,
 *					"section" : <section id>,
 *					"question" : "I don’t know",
 *					"responseType" : "Toogle",
 *					"name" : "PI don’t know",
 *					"enabled" : true,
 *					"isRequired" : false,
 *					"values" : [ ],
 *					"marginTop" : false,
 *					"hideQuestion" : false,
 *					"__v" : 0
 * 				},
 * 				"data": true
 * 			}
 * 		}
 * ]
 */
function getDataPromsSection (req, res){
	let groupId= req.query.groupId;
	let patientId= crypt.decrypt(req.query.patientId);

	PromSection.find({createdBy: groupId}, {"createdBy" : false }).sort({ order : 'asc'}).exec(function(err, sections){
		var listSections = [];

    sections.forEach(function(section) {
      listSections.push(section);
    });

		getInfoProms(listSections, res, patientId);

	});

	/*PromSection.find({"createdBy": groupId}, function(err, sections) {
    var listSections = [];

    sections.forEach(function(section) {
      listSections.push(section);
    });

		getInfoProms(listSections, res, patientId);


  });*/
}

async function getInfoProms(listSections, res, patientId){
	var promsStructure = [];
	if(listSections.length>0){
		for (var i = 0; i < listSections.length; i++) {
			if(listSections[i].enabled){
					var res0 = await getInfoProms2(listSections[i], patientId);
					if(res0!=undefined){
						promsStructure.push({section:listSections[i], promsStructure:res0})
					}
			}
		}
		for (var j = 0; j < promsStructure.length; j++) {
			for (var k = 0; k < promsStructure[j].promsStructure.length; k++) {
				var res0 = await getInfoProms3(promsStructure[j].promsStructure[k].structure, patientId);
				promsStructure[j].promsStructure[k].data = res0;
			}
		}
		res.status(200).send(promsStructure)
	}else{
		res.status(200).send(promsStructure)
	}

}

async function getInfoProms2(sectionInfo, patientId){
	var listProms = [];
	await Prom.find({"section": sectionInfo._id}, {"createdBy" : false }, function(err, proms) {
		proms.forEach(function(prom) {
			if(prom.enabled){
				//var res2 = await getInfoProms3(prom, patientId)

				listProms.push({structure:prom , data:{}})
			}
		});
	});
	return listProms
}

async function getInfoProms3(prom, patientId){
	var infoProm = [];
	await PatientProm.findOne({createdBy: patientId, "definitionPromId": prom._id}, {"createdBy" : false }).sort({ date : 'desc'}).exec(function(err, patientprom){
		if (err) infoProm = [];
		if (patientprom){
			infoProm = patientprom.data;
			if(prom.responseType=='Number'){
				infoProm = parseInt(infoProm)
			}
		}else{
			infoProm = [];
			if(prom.responseType=='Number'){
				infoProm = null;
			}
			if(prom.responseType=='Text'){
				infoProm = '';
			}
			if(prom.responseType=='Toogle'){
				infoProm = false;
			}
		}

	});



	return infoProm;
}

/**
 * @api {post} https://health29.org/api/proms/ Save or update patient proms
 * @apiName saveProms
 * @apiDescription This method save or update the proms answers of the patient: patient proms
 * @apiGroup Datapoints
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var patientId = <patientId>
 *   var patientPromList = <list patient prom>
 *   this.http.post('https://health29.org/api/proms/'+patientId,patientPromList)
 *    .subscribe( (res : any) => {
 *      console.log('Update patient prom ok');
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
 * @apiParam {String} patientId The patient unique id
 * @apiParam (body) {String} [relatedTo] Prom unique ID, which the one is related to.
 * @apiParam (body) {String} width Prom size.
 * @apiParam (body) {Number} periodicity Prom periodicity.
 * @apiParam (body) {Number} order Prom order in the section.
 * @apiParam (body) {String} section Section thath the prom belogs to, unique ID.
 * @apiParam (body) {String} question Prom text.
 * @apiParam (body) {String} responseType "Text","Number","Date","Time","Toogle","Choise","ChoiseSet".
 * @apiParam (body) {String} name Prom text identifier.
 * @apiParam (body) {String} enabled If prom is or not visible in Health29 platform.
 * @apiParam (body) {String} [isRequired] If prom is requiered by others.
 * @apiSuccess {Object} Returns a message with the information of the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		"message": 'Proms saved'
 * 	}
 */
function saveProms (req, res){
	let patientId= crypt.decrypt(req.params.patientId)
	var listPromsChanged = req.body;
	var res0 = saveOneProm(listPromsChanged, patientId);
	res.status(200).send({message: 'Proms saved'})
}

async function saveOneProm(listPromsChanged, patientId){
	for (var i = 0; i < listPromsChanged.length; i++) {
	var functionDone = false;
	let patientProm = new PatientProm()
	patientProm.data = listPromsChanged[i].data
	patientProm.definitionPromId = listPromsChanged[i].promId
	patientProm.createdBy = patientId
	// when you save, returns an id in socialInfoStored to access that social-info
	await patientProm.save((err, patientPromStored) => {
		functionDone = true;
		})
	}
	return functionDone
}

/**
 * @api {get} https://health29.org/api/proms/:groupId Get Proms Group
 * @apiName getPromsGroup
 * @apiPrivate
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
 * @apiParam {String} groupId The id of the group of patients. More info here:  [Get groupName](#api-Groups-getGroupsNames)
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
function getPromSection (req, res){
	let groupId= req.params.promSectionId;
  	Prom.findOne({ 'createdBy': groupId }, {"createdBy" : false }, function (err, proms) {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!proms) return res.status(404).send({code: 208, message: 'The proms does not exist'})

    //var proms = {data:group.proms};
		res.status(200).send(proms)
	})
}

/**
 * @api {get} https://health29.org/api/promshistory Get the history prom
 * @apiName getPromHistory from patient
 * @apiDescription This method return the history records of a prom of an specific patient
 * @apiGroup Datapoints
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var query = {"promId":<promId>,"patientId":<patientId>}
 *   this.http.get('https://health29.org/api/promshistory'+query)
 *    .subscribe( (res : any) => {
 *      console.log('Get prom hbistory ok');
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
 * @apiParam {String} promId A string with the information of the prom unique id [Get promId](#api-Datapoints-getProms_from_patient)
 * @apiParam {String} patientId The patient id
 * @apiSuccess {Object[]} Result Returns an object with the information of the history records for one prom. [{"data":"", "date": ""}]
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *     "data": "Intermediate",
 *     "date": "2021-02-15T17:37:44.872Z"
 *  },
 *  {
 *     "data": "Becker Muscular Dystrophy",
 *     "date": "2019-12-26T12:14:13.080Z"
 *  },
 *  {
 *     "data": "Duchenne Muscular Dystrophy",
 *     "date": "2019-11-28T17:25:49.426Z"
 *  }
 * ]
 */

function getPromHistory (req, res){
	let promId= req.query.promId;
	let patientId= crypt.decrypt(req.query.patientId);

  var myquery = { definitionPromId: promId, createdBy: patientId};

  PatientProm.find(myquery).sort({date: -1}).exec(function(err,promsFound){
    if(err) return res.status(500).send({message: `Error finding the prom: ${err}`})
    var listProms = [];
    if(promsFound){
      promsFound.forEach(function(prom) {
        listProms.push({data: prom.data, date: prom.date});
      });
    }
    res.status(200).send(listProms)
  });
}

module.exports = {
  getDataPromsSection,
  saveProms,
  getPromSection,
  getPromHistory
}
