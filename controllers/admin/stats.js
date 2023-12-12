// functions for each call of the api on admin. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Patient = require('../../models/patient')
const Group = require('../../models/group')
const MedicalCare = require('../../models/medical-care')
const ClinicalTrial = require('../../models/clinical-trial')
const PromSection = require('../../models/prom-section')
const PatientProm = require('../../models/patient-prom')
const Prom = require('../../models/prom')
const Genotype = require('../../models/genotype')
const SocialInfo = require('../../models/social-info')
const Weight = require('../../models/weight')
const Height = require('../../models/height')
const Vaccination = require('../../models/vaccination')
const Medication = require('../../models/medication')
const OtherMedication = require('../../models/other-medication')
const crypt = require('../../services/crypt')
const StructureProm = require('../../models/structure-prom')

/**
 * @api {get} https://health29.org/api/admin/stats/ Request the statistics for all patients in the group
 * @apiName getUsersStats
 * @apiPrivate
 * @apiDescription This method requests the statistics for all patients in the group
 * @apiGroup Stats
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupName>-code-<GroupId>-code-<Lang>
 *   this.http.get('https://health29.org/api/admin/admin/stats/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get the statistics for all patients in the group ok');
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
 * @apiParam {String} groupName-code-GroupId-code-Lang The name of the group, the unique identifier of the group and the code of the language.
 * @apiSuccess {Object[]} Result Returns a list with the information for all patients of the group:
 * 		- userId
 * 		- userName
 * 		- email
 * 		- lastLogin
 * 		- blockedaccount
 * 		- patientId
 * 		- answers: A list of objects with the information of the answers of the patient with the format:
 * 			- type: the section/the question
 * 			- answer: the value of the answer if exists (if user not answer this object not exists)
 * 		- stats: The information of the stats for this patient with the format:
 * 			- section: section name
 * 			- order: section order in the statistics object
 * 			- data: the information of the patient in each section, with the format:
 * 				- name: name of subsection
 * 				- stats: the values saved in the database for this subsection and patient, or 0 if not exists.
 * 				- answer: for some subsections is needed more information about the patient information, i.e. if the patient
 * 					has or not uploaded any files. By default this field is null.
 * 				- contentLength: same as previous, i.e the number of files uploaded by the patient or the number of medications/drugs. By default this field is null.
 *				- order: subsection order in the statistics object
 * 		- totalStats: the total percentage of the patient profile filled, with the format:
 * 			- totalStats:Math.round(sumTotal/numStats)
 * 			- name: "totalStats"
 *
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
 * 			"userId": <userId>,
 * 			"userName": <userName>,
 * 			"email": <userEmail>,
 * 			"lastLogin": <lastLogin>,
 * 			"blockedaccount": <blockedaccount>,
 * 			"patientId":<idencrypt>,
 * 			"answers": [
 * 				"type": "specificVisit"
 * 				"answer": true
 * 			],
 * 			"stats": [
 * 				{
 * 					"section":"SocialInfo",
 * 					"order":1,
 * 					"data":[
 * 						{
 * 							"name":"education",
 * 							"stats": "Primary",
 * 							answer:null,
 * 							contentLength:null,
 * 							order:1
 * 						},
 * 						{
 * 							name:"work",
 * 							stats: "yes",
 * 							answer:null,
 * 							contentLength:null,
 * 							order:2
 *						}
 *					]
 * 				}
 * 			}
 * 			"totalStats": {
 * 				"totalStats": <total stats percentage>,
 * 				"name": "totalStats"
 *			}
 * 		}
 * ]
 */
function getUsers (req, res){
	let groupNameAndGroupIdAndLang= req.params.groupNameAndGroupIdAndLang;
	var listParams = groupNameAndGroupIdAndLang.split("-code-")
	let group = listParams[0];
	let groupId = listParams[1];
	let lang = listParams[2];
	// Lo primero me cargo la lista de proms para el grupo
	var listTotalSectionsAndContent=[]
	PromSection.find({createdBy: groupId}).sort({ order : 'asc'}).exec(async function(err, sections){
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		for(var i=0;i<sections.length;i++){
			var listProms=[]
			await getListTotalProms(sections[i]._id,listProms)
			listTotalSectionsAndContent.push({listProms:listProms, name: sections[i].name,id:sections[i]._id});
		}
		await User.find({group: group, role: 'User'},async function(err, users){
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
      
			var listUsers = [];
			if(!users){
				return res.status(200).send(listUsers)
			}else{
				if(users.length==0){
					return res.status(200).send(listUsers)
				}else{
					var patientList=[]
					var totalPatients = 0;
          var userCount = 0;
					for(var i = 0; i < users.length; i++) {
						//countpos++;
						await Patient.findOne({"createdBy": users[i]._id}, (err, patients)=>{
              if(err){
                 return res.status(500).send({message: `Error: ${err}`})
              }else{
                userCount++;
  							if(patients){
  								patientList.push(patients);
  								totalPatients++;
  								if(users.length==userCount){
  									calculeStatsForPatient(patientList,users,listUsers,groupId,lang,res,totalPatients,listTotalSectionsAndContent)
  								}
  							}else{
  								if(users.length==userCount){
  									calculeStatsForPatient(patientList,users,listUsers,groupId,lang,res,totalPatients,listTotalSectionsAndContent)
  								}
                }
              }


						});
					}
					/*Promise.all([calculeStatsForPatient(users,listUsers,groupId,lang,res)]).then(function(result){
						res.status(200).send(result)
					});*/
				}
			}
		})

	});



}
function getListTotalProms(sectionId,listProms){
	return new Promise((resolve,reject) => {
		Prom.find({section: sectionId}).sort({order : 'asc'}).exec((err, proms) => {
			if (err) return res.status(500).send({ message: `Error activating account: ${err}`})
			var promList = proms;
			for (var j = 0; j < promList.length; j++){
				if(promList[j].enabled && promList[j].responseType != "Title" && promList[j].responseType != "Label"){
					listProms.push(({name:promList[j].name,
						question: promList[j].question,
						responseType: promList[j].responseType,
						data:promList[j],
						id:promList[j]._id}));
				}
			}
		});
		resolve(listProms)
	});
}
async function calculeStatsForPatient(patientList,users,listUsers,groupId,lang,res,totalPatients,listTotalSectionsAndContent){
	var tempusers = users;
	var patientsAddded = 0;
	for(var i = 0; i < patientList.length; i++) {
		if(patientList[i]!=undefined){
			var id = patientList[i]._id.toString();
			var idencrypt= crypt.encrypt(id);
			var enc = false;
			var userEmail = '';
			var lastLogin = null;
			var userName = '';
			var userId = '';
			var blockedaccount = false;
			var answers= patientList[i].answers;
			for(var j = 0; j < tempusers.length && !enc; j++) {
				if((tempusers[j]._id).toString() === (patientList[i].createdBy).toString()){
					userEmail =  tempusers[j].email
					lastLogin = tempusers[j].lastLogin
					userName = tempusers[j].userName
					var idUserDecrypt = tempusers[j]._id.toString();
					userId = crypt.encrypt(idUserDecrypt);
					blockedaccount = tempusers[j].blockedaccount
					enc = true;
				}
			}
			var resultado = []
			var promises=[]
			promises.push(calculeSocialInfoStats(id, resultado,1))
			promises.push(calculeHeight(id,resultado,2));
			promises.push(calculeWeight(id,resultado,2));
			promises.push(calculePromStats(id,listTotalSectionsAndContent,resultado,answers,3));
			promises.push(calculeMedicalCareStats(id,resultado,4));
			promises.push(calculeMedication(id,resultado,5));
			promises.push(calculeOtherMedication(id,resultado,5))
			promises.push(calculeVaccinations(id,resultado,5));
			promises.push(calculeClinicalTrial(id,resultado,6));
			promises.push(calculeGenotypeStats(answers, resultado,7))

			await Promise.all(promises).then(function(resultado){
				// end patient stats
				calculeTotalStats(resultado[0])
				patientsAddded=patientsAddded+1;
				listUsers.push({userId: userId, userName: userName, email: userEmail,
					lastLogin: lastLogin, blockedaccount: blockedaccount,
					patientId:idencrypt, answers: answers, stats: resultado[0],
					totalStats: resultado[0][resultado[0].length - 1].totalStats
					});
				if(patientsAddded==totalPatients){
					var result = [];
					for(var j = 0; j < listUsers.length; j++) {
						if(listUsers[j].patientId!=undefined){
							result.push(listUsers[j]);
						}
					}
					return res.status(200).send(result)
				}
			})
		}
	}
}
function calculeSocialInfoStats(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		SocialInfo.findOne({"createdBy": id},(err, socialInfo)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(socialInfo){
				var socialInfo = JSON.parse(JSON.stringify(socialInfo));
				var cont = 0;
				var socialInfoResult = []
				if(socialInfo.completedEducation != ""){
					cont++
				}
				if(socialInfo.currentEducation != ""){
					cont++
				}
				if(socialInfo.education != ""){
					cont++
				}
				if(cont == 0){
					socialInfoResult[0] = 0
				}
				else{
					socialInfoResult[0] = Math.round((100 * cont)/ 3);
				}
				cont = 0;
				if(socialInfo.work != ""){
					cont++
				}
				if(socialInfo.hoursWork != ""){
					cont++
				}
				if(socialInfo.profession != ""){
					cont++
				}
				if(cont == 0){
					socialInfoResult[1] = 0
				}
				else{
					socialInfoResult[1] = Math.round((100 * cont)/ 3);
				}
				cont = 0;
				if(socialInfo.support.length != 0){
					cont++
				}
				if(socialInfo.livingSituation.length != 0){
					cont++
				}
				if(cont == 0){
					socialInfoResult[2] = 0
				}
				else{
					socialInfoResult[2] = Math.round((100 * cont)/ 2);
				}
				cont = 0;
				if(socialInfo.interests.length != 0 || socialInfo.otherinterest != ''){
					cont++
				}
				if(socialInfo.sports.length != 0 || socialInfo.othersport != ''){
					cont++
				}
				if(socialInfo.moreInterests != undefined && socialInfo.moreInterests != ""){
					cont++
				}
				if(cont == 0){
					socialInfoResult[3] = 0
				}
				else{
					socialInfoResult[3] = Math.round((100 * cont)/ 3);
				}
				resultado.push({section:"SocialInfo",order:orderSection,data:[
					{name:"education",stats: socialInfoResult[0],answer:null,contentLength:null,order:1},
					{name:"work",stats: socialInfoResult[1],answer:null,contentLength:null,order:2},
					{name:"livingSupport",stats: socialInfoResult[2],answer:null,contentLength:null,order:3},
					{name:"sportInterest",stats: socialInfoResult[3],answer:null,contentLength:null,order:4}
				]})

			}
			else{
				resultado.push({section:"SocialInfo",order:orderSection,data:[
					{name:"education",stats: 0,answer:null,contentLength:null,order:1},
					{name:"work",stats: 0,answer:null,contentLength:null,order:2},
					{name:"livingSupport",stats: 0,answer:null,contentLength:null,order:3},
					{name:"sportInterest",stats: 0,answer:null,contentLength:null,order:4}
				]})
			}
			resolve(resultado)

		});
	});

}
function calculeHeight(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		Height.findOne({"createdBy": id}, {"createdBy" : false}, (err, height)=> {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(height){
				resultado.push({section:"Anthropometry",order:orderSection,data:[
					{name:"height",stats: 100,answer:"uploaded",contentLength:null,order:1}
				]})
			}
			else{
				resultado.push({section:"Anthropometry",order:orderSection,data:[
					{name:"height",stats: 0,answer:"not uploaded",contentLength:null,order:1}
				]})
			}
			resolve(resultado)
		});
	});
}
function calculeWeight(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		Weight.findOne({"createdBy": id}, {"createdBy" : false }, (err, weight)=> {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(weight){
				resultado.push({section:"Anthropometry",order:orderSection,data:[
					{name:"weight",stats: 100,answer:"uploaded",contentLength:null,order:2}
				]})
			}
			else{
				resultado.push({section:"Anthropometry",order:orderSection,data:[
					{name:"weight",stats: 0,answer:"not uploaded",contentLength:null,order:2}
				]})
			}
			resolve(resultado);
		})
	});
}
function calculePromStats(id,listTotalSectionsAndContent,resultado,answers,orderSection){
	return new Promise(async function(resolve,reject) {
		var listSectionsAndContentPatient=[]
		var listPromsForPatient=[];
		PatientProm.find({createdBy: id}).sort({date : 'desc'}).exec((err, patientpromList)=>{
			if (err) return res.status(500).send({message: `Error activating account: ${err}`})
			for (var i=0;i<patientpromList.length;i++){
				var infoProm;
				if (patientpromList[i]){
					infoProm = patientpromList[i].data;
				}else{
					infoProm = "";
				}
				listPromsForPatient.push({id:patientpromList[i].definitionPromId,data:infoProm});
			}
			for(var i=0;i<listTotalSectionsAndContent.length;i++){
				var listProms=[]
				for(var j=0;j<listTotalSectionsAndContent[i].listProms.length;j++){
					var promId=listTotalSectionsAndContent[i].listProms[j].id;
					for (var k=0;k<listPromsForPatient.length;k++){
						var patientPromId=listPromsForPatient[k].id
						if(patientPromId.toString()==promId.toString()){
							if(j!=0){
							//if(listTotalSectionsAndContent[i].listProms[j].name != "Pregunta"){
								listProms.push(listPromsForPatient[k]);
							}
							else{
								answers.push({"type":listTotalSectionsAndContent[i].name,"answer":listPromsForPatient[k].data})
							}
						}
					}
				}
				listSectionsAndContentPatient.push({listProms:listProms, name:listTotalSectionsAndContent[i].name,id:listTotalSectionsAndContent[i].id});
			}
			resultado = calculeCourseOfTheDiseaseStats(listSectionsAndContentPatient, resultado,orderSection)
			resolve(resultado)
		});
	});
}
function calculeMedicalCareStats(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		MedicalCare.findOne({"createdBy": id}, {"createdBy" : false }, (err, medicalCare)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(medicalCare){
				var sectionsContent=[];
				var indexMedicalCareData=1;
				medicalCare.data.forEach(element => {
					sectionsContent.push({name:element.name,stats: element.data.length,answer:null,contentLength:null,order:indexMedicalCareData});
					indexMedicalCareData++
				});
				resultado.push({section:"MedicalCare",order:orderSection,data:sectionsContent})
			}
			else{
				resultado.push({section:"MedicalCare",order:orderSection,data:[
					{name:"general",stats: 0,answer:null,contentLength:null,order:1},
					{name:"specificVisit",stats: 0,answer:null,contentLength:null,order:2},
					{name:"hospitalization",stats: 0,answer:null,contentLength:null,order:3},
					{name:"emergencies",stats: 0,answer:null,contentLength:null,order:4},
					{name:"cardioTest",stats: 0,answer:null,contentLength:null,order:5},
					{name:"respiratoryTest",stats: 0,answer:null,contentLength:null,order:6},
					{name:"bonehealthTest",stats: 0,answer:null,contentLength:null,order:7},
					{name:"bloodTest",stats: 0,answer:null,contentLength:null,order:8},
					{name:"surgery",stats: 0,answer:null,contentLength:null,order:9}
				]})
			}
			resolve(resultado)
		})
	});
}
function calculeMedication(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		Medication.find({createdBy: id}).sort({ endDate : 'asc'}).exec((err, medications)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			var listMedications = [];
			medications.forEach(function(medication) {
				listMedications.push(medication);
			});
			resultado.push({section:"Medications",order:orderSection,data:[
				{name:"drugs",stats: listMedications.length,answer:null,contentLength:listMedications.length,order:1}
			]})
			resolve(resultado)
		})
	});
}
function calculeOtherMedication(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		OtherMedication.find({createdBy: id}).sort({ endDate : 'asc'}).exec((err, medications)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			var listMedications = [];
			medications.forEach(function(medication) {
				listMedications.push(medication);
			});
			resultado.push({section:"Medications",order:orderSection,data:[
				{name:"otherDrugs",stats: listMedications.length,answer:null,contentLength:listMedications.length,order:2}
			]})
			resolve(resultado)
		})
	});
}
function calculeVaccinations(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		Vaccination.find({createdBy: id}).sort({ date : 'asc'}).exec((err, vaccinations)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			var listVaccinations = [];
			vaccinations.forEach(function(vaccination) {
				listVaccinations.push(vaccination);
			});
			resultado.push({section:"Medications",order:orderSection,data:[
				{name:"vaccinations",stats: listVaccinations.length,answer:null,contentLength:listVaccinations.length,order:3}
			]})
			resolve(resultado)
		})
	});
}
function calculeClinicalTrial(id, resultado,orderSection){
	return new Promise((resolve,reject) => {
		ClinicalTrial.find({createdBy: id}).sort({ date : 'asc'}).exec((err, clinicaltrials)=>{
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			var listClinicalTrials = [];
			clinicaltrials.forEach(function(clinicaltrial) {
				listClinicalTrials.push(clinicaltrial);
			});
			resultado.push({section:"ClinicalTrials",order:orderSection,data:[
				{name:"clinicalTrials",stats: listClinicalTrials.length,answer:null,contentLength:listClinicalTrials.length,order:1}
			]})
			resolve(resultado)
		})
	});
}
function calculeGenotypeStats(answers,resultado,orderSection){
	var thereisFiles = false
	var indexGenotypeAnswers=1;
	answers.forEach(answer => {
		if(answer.type == "genotypeFiles"){
			thereisFiles = true
			if(answer.answer > 0){
				resultado.push({section:"Genotype",order:orderSection,data:[
					{name:"genotype",stats: 100,answer:"uploaded",contentLength:null,order:indexGenotypeAnswers}
				]})
			}
			else{
				resultado.push({section:"Genotype",order:orderSection,data:[
					{name:"genotype",stats: 0,answer:"not uploaded",contentLength:null,order:indexGenotypeAnswers}
				]})
			}
			indexGenotypeAnswers++;
		}
	});
	if(thereisFiles == false){
		resultado.push({section:"Genotype",order:orderSection,data:[
			{name:"genotype",stats: 0,answer:"not uploaded",contentLength:null,order:orderSection}
		]})
	}
	return resultado
}
function calculeTotalStats(result){
	var sumTotal=0;
	var numStats=0;
	for(var i=0;i<result.length;i++){

		if(result[i]!=undefined){
			if(result[i].data!=undefined){
				for (var j=0;j<result[i].data.length;j++){
					if(result[i].data[j].stats>0){
						sumTotal += 100;
					}
					else{
						sumTotal += 0;
					}
					numStats++;
				}
				/*result[i].data.forEach(function(resultData) {

				});*/
			}
		}
	}
	result.push({totalStats:Math.round(sumTotal/numStats), name: "totalStats"});
	return result;

}
function calculeCourseOfTheDiseaseStats(courseofthedisease,resultado,orderSection){
	var sectionsContent=[];
	for(var i=0;i<courseofthedisease.length;i++){
		if(indexCoD==undefined){
			var indexCoD=i+1;
		}
		if(courseofthedisease[i].name != null){
			var dataFound=false;

			if(courseofthedisease[i].listProms != undefined){
				courseofthedisease[i].listProms.forEach(function (prom) {
					if(prom.data != ""){
						dataFound=true;
					}
				})
			}
			if(dataFound==true){
				sectionsContent.push({name:courseofthedisease[i].name,id:courseofthedisease[i].id,stats: contPerCentCourseOfTheDisease(courseofthedisease[i].listProms),answer:"found",contentLength:null,order:indexCoD})
			}
			else{
				sectionsContent.push({name:courseofthedisease[i].name,id:courseofthedisease[i].id,stats: contPerCentCourseOfTheDisease(courseofthedisease[i].listProms),answer:"not found",contentLength:null,order:indexCoD})
			}
			indexCoD++;
		}
	};
	resultado.push({section:"CourseOfTheDisease",order:orderSection,data:sectionsContent})
	return resultado
}
function contPerCentCourseOfTheDisease(listPromsOfSection){
    if(listPromsOfSection != undefined){
		var cont = 0;
		var contData = 0;
		listPromsOfSection.forEach(function (prom) {
			if(prom.data != ""){
				contData++;
			}
			cont++;
		})
		if(isNaN(Math.round((100 * contData)/ cont)) == false){
			return Math.round((100 * contData)/ cont);
		}
		else{
			return 0;
		}

    }
    else{
      	return 0;
    }
}


/**
 * @api {get} https://health29.org/api/admin/stats/translateCoDSections/ Translate the statistics labels for Course of the disease sections (datapoints sections) into a specific language
 * @apiName translateCoDSectionsStats
 * @apiPrivate
 * @apiDescription This method requests the translations of the statistics labels for Course of the disease sections (datapoints sections) into a specific language
 * @apiGroup Stats
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>-code-<lang_code>-code-<sections_CoD>
 *   this.http.get('https://health29.org/api/admin/admin/stats/translateCoDSections/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get the translations of CoD sections into specific language ok');
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
 * @apiParam {String} groupId-code-lang_code-code-sections_CoD The unique identifier of the group, the code of the language and the sections to translate.
 * 	The sections of CoD has the same format as the result from the field "section":"CourseOfTheDisease" from the [get statistics of a patient](#api-Stats-Request_the_statistics_for_all_patients_in_the_group) request.
 * @apiSuccess {Object[]} Result Returns a list with the original name of the parameter and the translation
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 * 		{
 * 			"originalSection":<original name>,
 * 			"translatedSection": <translation>
 * 		}
 * ]
 */
function translateCoDSectionsStats(req,res){
	let params = req.params.groupIdAndLangAndListSections;
	let paramsSplit = params.split("-code-")
	let groupId= paramsSplit[0]
	let lang=paramsSplit[1]
	let sections = req.body.sections;
	let listSections=sections;
	var result=[];
	StructureProm.findOne({"createdBy": groupId, "lang": lang}, {"createdBy" : false }, (err, structureProm)=> {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(!structureProm) return res.status(202).send({message: 'There are no structureProm'})
		for (var i = 0; i < structureProm.data.length; i++) {
			if(structureProm.data[i]!=undefined){
				listSections.forEach((section)=>{
					if(section.id==structureProm.data[i].section._id){
						result.push({originalSection:section.name, translatedSection: structureProm.data[i].section.name});
					}
				})
			}
		}
		return res.status(200).send(result)
	})
}
module.exports = {
	getUsers,
	translateCoDSectionsStats
}
