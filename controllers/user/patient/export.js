// functions for each call of the api on social-info. Use the social-info model

'use strict'

// add the social-info model
const SocialInfo = require('../../../models/social-info')
const Patient = require('../../../models/patient')
const User = require('../../../models/user')
const Group = require('../../../models/group')
const MedicalCare = require('../../../models/medical-care')
const ClinicalTrial = require('../../../models/clinical-trial')
const PromSection = require('../../../models/prom-section')
const PatientProm = require('../../../models/patient-prom')
const Prom = require('../../../models/prom')
const Height = require('../../../models/height')
const HeightHistory = require('../../../models/height-history')
const Weight = require('../../../models/weight')
const WeightHistory = require('../../../models/weight-history')
const Vaccination = require('../../../models/vaccination')
const Medication = require('../../../models/medication')
const OtherMedication = require('../../../models/other-medication')
const Phenotype = require('../../../models/phenotype')
const PhenotypeHistory = require('../../../models/phenotype-history')
const Genotype = require('../../../models/genotype')

const crypt = require('../../../services/crypt')

async function getProm(section, patientId, listSections, listProms, result, res, numberofSections){
	var promList = [];
	await Prom.find({section: section._id}).sort({order : 'asc'}).exec(function(err, proms) {
		if (err) return res.status(500).send({ message: `Error activating account: ${err}`})
		promList = proms;
	});
	for (var i = 0; i < promList.length; i++){
		if(promList[i].enabled){
			var promData = []; // data de cada prom
			var promData = await getPromData(promList[i], patientId, res, promData);
			if(promData != undefined){
				listProms.push(promData);
			}
		}
	}

	listSections.push({listProms, name: section.name, enabled: section.enabled, id: section.id});
	if(listSections.length == numberofSections){
		//Tenemos los datos para todas las secciones
		result.push({data: listSections, name:"courseOfDisease"})
		return result
	}
}

async function getPromData(prom, patientId, res, promData){
	await PatientProm.findOne({createdBy: patientId, "definitionPromId": prom._id}).sort({ date : 'desc'}).exec(function(err, patientprom){
		if (err) return res.status(500).send({ message: `Error activating account: ${err}`})
		var infoProm;
		if (patientprom){
			infoProm = patientprom.data;
		}else{
			infoProm = "";
		}
		promData.push({name:prom.name,
		relatedTo: prom.relatedTo,
		enabled: prom.enabled,
		promId: prom.id,
		question: prom.question,
		values: prom.values,
		width: prom.width,
		hideQuestion: prom.hideQuestion,
		responseType: prom.responseType,
		data:infoProm});
	});
	return promData;
}

async function exportData (req, res){
	let patientId= crypt.decrypt(req.params.patientId);
	var result = [];

	// get all patient data
	Patient.findById(patientId, {"_id" : false , "createdBy" : false }, (err, patient) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
		if(patient){
			result.push({data:patient, name:"patient"});
		}
		SocialInfo.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, socialInfo) => {
			if (err) return res.status(500).send({message: `Error making the request: ${err}`})
			if(socialInfo){
				result.push({data:socialInfo, name:"socialInfo"});
			}
			Height.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, height) => {
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				if(height){
					result.push({data:height, name:"height"});
				}
				HeightHistory.find({createdBy: patientId}, {"createdBy" : false }).sort({ dateTime : 'asc'}).exec(function(err, heights){
					if (err) return res.status(500).send({message: `Error making the request: ${err}`})
					var listHeights = [];
					heights.forEach(function(height) {
						listHeights.push(height);
					});
					result.push({data:listHeights, name:"heightHistory"});

					Weight.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, weight) => {
						if (err) return res.status(500).send({message: `Error making the request: ${err}`})
						if(weight){
							result.push({data:weight, name:"weight"});
						}

						WeightHistory.find({createdBy: patientId}, {"createdBy" : false }).sort({ dateTime : 'asc'}).exec(function(err, weights){
							if (err) return res.status(500).send({message: `Error making the request: ${err}`})
							var listWeights = [];
							weights.forEach(function(weight) {
								listWeights.push(weight);
							});
							result.push({data:listWeights, name:"weightHistory"});

							Medication.find({createdBy: patientId}, {"createdBy" : false }).sort({ endDate : 'asc'}).exec(function(err, medications){
								if (err) return res.status(500).send({message: `Error making the request: ${err}`})
								var listMedications = [];
								medications.forEach(function(medication) {
									listMedications.push(medication);
								});

								result.push({data:listMedications, name:"medication"});

								Vaccination.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(async function(err, vaccinations){
									if (err) return res.status(500).send({message: `Error making the request: ${err}`})
									var listVaccinations = [];
									vaccinations.forEach(function(vaccination) {
										listVaccinations.push(vaccination);
									});

									result.push({data:listVaccinations, name:"vaccination"});

									OtherMedication.find({createdBy: patientId}, {"createdBy" : false }).sort({ endDate : 'asc'}).exec(function(err, medications){
										if (err) return res.status(500).send({message: `Error making the request: ${err}`})
										var listMedications = [];
										medications.forEach(function(medication) {
											listMedications.push(medication);
										});

										result.push({data:listMedications, name:"otherMedication"});
										Phenotype.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, phenotype) => {
											if (err) return res.status(500).send({message: `Error making the request: ${err}`})
											if(phenotype){
												result.push({data:phenotype, name:"phenotype"});
											}

											PhenotypeHistory.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(function(err, phenotypeHistory){
												if (err) return res.status(500).send({message: `Error making the request: ${err}`})
												var listPhenotypeHistory = [];
												phenotypeHistory.forEach(function(phenotype) {
													listPhenotypeHistory.push(phenotype);
												});
												result.push({data:listPhenotypeHistory, name:"phenotypeHistory"});

												Genotype.findOne({"createdBy": patientId}, {"createdBy" : false }, (err, genotype) => {
													if (err) return res.status(500).send({message: `Error making the request: ${err}`})
													if(genotype){
														result.push({data:genotype, name:"genotype"});
													}
													//CoD
													Patient.findById(patientId, (err, patient) => {
														if (err) return res.status(500).send({message: `Error deleting the case: ${err}`})
														if(patient){
															var p = JSON.parse(JSON.stringify(patient));
															User.findById(p.createdBy, (err, user) => {
																if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
																if (user){
																	result.push({data:user, name:"user"});
																	var u = JSON.parse(JSON.stringify(user));
																	Group.findOne({ 'name': u.group}, (err, group) => {
																		if (err) return res.status(500).send({message: `Error making the request: ${err}`})
																		if(group){
																			var g = JSON.parse(JSON.stringify(group));
																			PromSection.find({createdBy: g._id}).sort({ order : 'asc'}).exec(async function(err, sections){
																				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
																				var listSections = []; //el de result
																				if(sections){
																					for(var i=0;i<sections.length;i++){
																						var listProms = []; // los proms de una section
																						var data = await getProm(sections[i], patientId, listSections, listProms, result, res, sections.length);
																						if(data != undefined){
																							MedicalCare.findOne({"createdBy": patientId}, {"createdBy" : false }, async function (err, medicalCare){
																								if (err) return res.status(500).send({message: `Error making the request: ${err}`})
																								if(medicalCare){
																									result.push({data: medicalCare, name:"medicalCare"})
																								}
																								ClinicalTrial.find({createdBy: patientId}, {"createdBy" : false }).sort({ date : 'asc'}).exec(function(err, clinicaltrials){
																									if (err) return res.status(500).send({message: `Error making the request: ${err}`})

																									var listClinicalTrials = [];
																									clinicaltrials.forEach(function(clinicalTrial) {
																										listClinicalTrials.push(clinicalTrial);
																									});

																									result.push({data:listClinicalTrials, name:"clinicalTrials"});
																									res.status(200).send(data)

																								})
																							})

																						}
																					}

																				}

																				//sections.forEach(async function(section) {

																				//})
																			})
																		}
																	})
																}
															})
														}
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	})
}


module.exports = {
	exportData
}
