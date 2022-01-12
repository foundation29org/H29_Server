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

async function getProm(section, patientId, listSections, listProms, result, res, numberofSections) {
	var promList = [];
	await Prom.find({ section: section._id }).sort({ order: 'asc' }).exec(function (err, proms) {
		if (err) return res.status(500).send({ message: `Error activating account: ${err}` })
		promList = proms;
	});
	for (var i = 0; i < promList.length; i++) {
		if (promList[i].enabled) {
			var promData = []; // data de cada prom
			var promData = await getPromData(promList[i], patientId, res, promData);
			if (promData != undefined) {
				listProms.push(promData);
			}
		}
	}

	listSections.push({ listProms, name: section.name, enabled: section.enabled, id: section.id });
	if (listSections.length == numberofSections) {
		//Tenemos los datos para todas las secciones
		result["courseOfDisease"]=listSections;
		return result
	}
}

async function getPromData2(prom, patientId, res, promData) {
	await PatientProm.findOne({ createdBy: patientId, "definitionPromId": prom._id }).sort({ date: 'desc' }).exec(function (err, patientprom) {
		if (err) return res.status(500).send({ message: `Error activating account: ${err}` })
		var infoProm;
		var dateProm;
		if (patientprom) {
			console.log(patientprom);
			infoProm = patientprom.data;
			dateProm = patientprom.date;
		} else {
			infoProm = "";
			dateProm = "";
		}
		promData.push({
			name: prom.name,
			relatedTo: prom.relatedTo,
			enabled: prom.enabled,
			promId: prom.id,
			question: prom.question,
			values: prom.values,
			width: prom.width,
			hideQuestion: prom.hideQuestion,
			responseType: prom.responseType,
			data: infoProm,
			date: dateProm
		});
	});
	return promData;
}

async function getPromData(prom, patientId, res, promData) {
	await PatientProm.find({ createdBy: patientId, "definitionPromId": prom._id }).sort({ date: 'desc' }).exec(function (err, patientpromList) {
		if (err) return res.status(500).send({ message: `Error activating account: ${err}` })

		for (var i = 0; i < patientpromList.length; i++) {
			var infoProm;
			var dateProm;
			if (patientpromList[i]) {
				infoProm = patientpromList[i].data;
				dateProm = patientpromList[i].date;
			} else {
				infoProm = "";
				dateProm = "";
			}
			promData.push({
				name: prom.name,
				dependsOn: prom.relatedTo,
				annotations: prom.annotations,
				enabled: prom.enabled,
				promId: prom.id,
				question: prom.question,
				values: prom.values,
				width: prom.width,
				hideQuestion: prom.hideQuestion,
				responseType: prom.responseType,
				data: infoProm,
				date: dateProm
			});
		}
	});
	return promData;
}

async function exportData(req, res) {
	let patientId = crypt.decrypt(req.params.patientId);
	var result = {};
	let date = new Date();
	var metadata = { date: date };
	result["metadata"]=metadata;
	// get all patient data
	Patient.findById(patientId, { "_id": false, "createdBy": false }, (err, patient) => {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		if (patient) {
			result["patient"]=patient;
		}
		SocialInfo.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, socialInfo) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			if (socialInfo) {
				result["socialInfo"]=socialInfo;
			}
			Height.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, height) => {
				if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
				if (height) {
					result["height"]=height;
				}
				HeightHistory.find({ createdBy: patientId }, { "createdBy": false }).sort({ dateTime: 'asc' }).exec(function (err, heights) {
					if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
					var listHeights = [];
					heights.forEach(function (height) {
						listHeights.push(height);
					});
					result["heightHistory"]=listHeights;

					Weight.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, weight) => {
						if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
						if (weight) {
							result["weight"]=weight;
						}

						WeightHistory.find({ createdBy: patientId }, { "createdBy": false }).sort({ dateTime: 'asc' }).exec(function (err, weights) {
							if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
							var listWeights = [];
							weights.forEach(function (weight) {
								listWeights.push(weight);
							});
							result["weightHistory"]=listWeights;

							Medication.find({ createdBy: patientId }, { "createdBy": false }).sort({ endDate: 'asc' }).exec(function (err, medications) {
								if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
								var listMedications = [];
								medications.forEach(function (medication) {
									listMedications.push(medication);
								});
								result["medication"]=listMedications;

								Vaccination.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(async function (err, vaccinations) {
									if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
									var listVaccinations = [];
									vaccinations.forEach(function (vaccination) {
										listVaccinations.push(vaccination);
									});
									result["vaccination"]=listVaccinations;

									OtherMedication.find({ createdBy: patientId }, { "createdBy": false }).sort({ endDate: 'asc' }).exec(function (err, medications) {
										if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
										var listMedications = [];
										medications.forEach(function (medication) {
											listMedications.push(medication);
										});
										result["otherMedication"]=listMedications;
										
										Phenotype.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, phenotype) => {
											if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
											if (phenotype) {
												result["phenotype"]=phenotype;
											}

											PhenotypeHistory.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(function (err, phenotypeHistory) {
												if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
												var listPhenotypeHistory = [];
												phenotypeHistory.forEach(function (phenotype) {
													listPhenotypeHistory.push(phenotype);
												});
												result["phenotypeHistory"]=listPhenotypeHistory;

												Genotype.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, genotype) => {
													if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
													if (genotype) {
														result["genotype"]=genotype;
													}
													//CoD
													Patient.findById(patientId, (err, patient) => {
														if (err) return res.status(500).send({ message: `Error deleting the case: ${err}` })
														if (patient) {
															var p = JSON.parse(JSON.stringify(patient));
															User.findById(p.createdBy, (err, user) => {
																if (err) return res.status(500).send({ message: `Error deleting the user: ${err}` })
																if (user) {
																	result["user"]=user;
																	var u = JSON.parse(JSON.stringify(user));
																	Group.findOne({ 'name': u.group }, (err, group) => {
																		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
																		if (group) {
																			var g = JSON.parse(JSON.stringify(group));
																			PromSection.find({ createdBy: g._id }).sort({ order: 'asc' }).exec(async function (err, sections) {
																				if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
																				var listSections = []; //el de result
																				if (sections) {
																					for (var i = 0; i < sections.length; i++) {
																						var listProms = []; // los proms de una section
																						var data = await getProm(sections[i], patientId, listSections, listProms, result, res, sections.length);
																						if (data != undefined) {
																							MedicalCare.findOne({ "createdBy": patientId }, { "createdBy": false }, async function (err, medicalCare) {
																								if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
																								if (medicalCare) {
																									result["medicalCare"]=medicalCare;
																								}
																								ClinicalTrial.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(function (err, clinicaltrials) {
																									if (err) return res.status(500).send({ message: `Error making the request: ${err}` })

																									var listClinicalTrials = [];
																									clinicaltrials.forEach(function (clinicalTrial) {
																										listClinicalTrials.push(clinicalTrial);
																									});
																									result["clinicalTrials"]=listClinicalTrials;
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

async function exportSubgroups(req, res) {
	let subgroups = req.body;
	try {
		var users = await getUsers(subgroups);
		var data = await getData(users);
		let date = new Date();
		var metadata = { date: date, organizations: {} };
		return res.status(200).send({ message: 'Exported data', data: data, metadata: metadata })
	} catch (e) {
		console.error("Error: ", e);
		return res.status(200).send({ message: 'Error', data: e })
	}



}

function getUsers(subgroups) {
	return new Promise(resolve => {
		var listUsers = [];
		User.find({
			'subgroup': { $in: subgroups },
			'role': 'User'
		}, function (err, users) {
			if (users) {
				users.forEach(user => {
					listUsers.push(user);
				});
			}

			resolve(listUsers);
		});

	});
}

async function getData(users) {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		//await User.find({platform : "Dx29", email: 'testpatient2@test.com'},async (err, users) => {
		if (users.length > 0) {
			for (var index in users) {
				promises.push(getPatientInfo(users[index]));
			}
		} else {
			resolve('No data')
		}



		await Promise.all(promises)
			.then(async function (data) {
				var dataRes = [];
				data.forEach(function (dataPatientsUser) {
					dataPatientsUser.forEach(function (dataPatient) {
						dataRes.push(dataPatient);
					});
				});
				console.log('termina')
				resolve(dataRes)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}

async function getPatientInfo(user) {
	return new Promise(async function (resolve, reject) {

		var promises2 = [];
		await Patient.find({ createdBy: user._id }, (err, patientsFound) => {
			for (var indexPatient in patientsFound) {
				promises2.push(getAllPatientInfo(patientsFound[indexPatient], indexPatient, user.subgroup));
			}

			Promise.all(promises2)
				.then(function (data) {
					//console.log('datos del paciente:');
					//resolve({ user: user, data: data})
					resolve(data)
				})
				.catch(function (err) {
					console.log('Manejar promesa rechazada (' + err + ') aquí.');
					return null;
				});

		});




	});
}

async function getAllPatientInfo(patient, index, subgroup) {
	return new Promise(async function (resolve, reject) {
		//console.log(patient);
		let patientId = patient._id;
		var promises3 = [];
		promises3.push(getSocialInfo(patientId));
		//promises3.push(getHeightInfo(patientId));
		promises3.push(getHeightHistoryInfo(patientId));
		//promises3.push(getWeightInfo(patientId));
		promises3.push(getWeightHistoryInfo(patientId));
		promises3.push(getMedications(patientId));
		promises3.push(getVaccinations(patientId));
		promises3.push(getOtherMedication(patientId));
		//promises3.push(getPhenotype(patientId, index));
		promises3.push(getPhenotypeHistory(patientId, index));
		promises3.push(getGenotype(patientId));
		promises3.push(getMedicalCare(patientId));
		promises3.push(getClinicalTrial(patientId));
		promises3.push(getDatapoints(patientId));

		await Promise.all(promises3)
			.then(async function (data) {
				//console.log(data);
				/* var resPatientData = [];
				 resPatientData.push({data:patient, name:"patient"});
				 resPatientData.push({info:data})*/
				let patientIdEnc = crypt.encrypt(patientId.toString());
				var patientInfo = {};
				patientInfo['socialInfo'] = data[0];
				patientInfo['heightHistory'] = data[1];
				patientInfo['weightHistory'] = data[2];
				patientInfo['medication'] = data[3];
				patientInfo['vaccination'] = data[4];
				patientInfo['otherMedication'] = data[5];
				patientInfo['phenotypeHistory'] = data[6];
				patientInfo['genotype'] = data[7];
				patientInfo['medicalCare'] = data[8];
				patientInfo['clinicalTrials'] = data[9];
				patientInfo['datapoints'] = data[10];
				resolve({ patientId: patientIdEnc, patientInfo: patientInfo, organization: subgroup })
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});
	});
}

async function getSocialInfo(patientId) {
	return new Promise(async function (resolve, reject) {
		await SocialInfo.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, socialInfo) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('Social info done.');
			if (socialInfo) {
				resolve(socialInfo);
			} else {
				resolve([]);
			}
		})
	});
}

async function getHeightInfo(patientId) {
	return new Promise(async function (resolve, reject) {
		await Height.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, height) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('height done.');
			if (height) {
				resolve(height);
			} else {
				resolve([]);
			}
		})
	});
}

async function getHeightHistoryInfo(patientId) {
	return new Promise(async function (resolve, reject) {
		await HeightHistory.find({ createdBy: patientId }, { "createdBy": false }).sort({ dateTime: 'asc' }).exec(function (err, heights) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('HeightHistory done.');
			var listHeights = [];
			heights.forEach(function (weight) {
				listHeights.push(weight);
			});
			resolve(listHeights);
		})
	});
}

async function getWeightInfo(patientId) {
	return new Promise(async function (resolve, reject) {
		await Weight.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, weight) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('Weight done.');
			if (weight) {
				resolve(weight);
			} else {
				resolve([]);
			}
		})
	});
}

async function getWeightHistoryInfo(patientId) {
	return new Promise(async function (resolve, reject) {
		await WeightHistory.find({ createdBy: patientId }, { "createdBy": false }).sort({ dateTime: 'asc' }).exec(function (err, weights) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('WeightHistory done.');
			var listWeights = [];
			weights.forEach(function (weight) {
				listWeights.push(weight);
			});
			resolve(listWeights);
		})
	});
}

async function getMedications(patientId) {
	return new Promise(async function (resolve, reject) {
		await Medication.find({ createdBy: patientId }, { "createdBy": false }).sort({ endDate: 'asc' }).exec(function (err, medications) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('Medication done.');
			var listMedications = [];
			medications.forEach(function (medication) {
				listMedications.push(medication);
			});
			resolve(listMedications);
		})
	});
}

async function getVaccinations(patientId) {
	return new Promise(async function (resolve, reject) {
		await Vaccination.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(async function (err, vaccinations) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('Vaccination done.');
			var listVaccinations = [];
			vaccinations.forEach(function (vaccination) {
				listVaccinations.push(vaccination);
			});
			resolve(listVaccinations);
		})
	});
}

async function getOtherMedication(patientId) {
	return new Promise(async function (resolve, reject) {
		await OtherMedication.find({ createdBy: patientId }, { "createdBy": false }).sort({ endDate: 'asc' }).exec(function (err, medications) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('OtherMedication done.');
			var listMedications = [];
			medications.forEach(function (medication) {
				listMedications.push(medication);
			});
			resolve(listMedications);
		})
	});
}

async function getPhenotype(patientId, index) {
	return new Promise(async function (resolve, reject) {

		await Phenotype.findOne({ "createdBy": patientId }, { "createdBy": false }, async (err, phenotype) => {
			//console.log('Phenotype done.');
			if (phenotype) {
				resolve({ data: phenotype, name: "phenotype" });
			} else {
				resolve({ data: [], name: "phenotype" });
			}
		})
	});
}

async function getPhenotypeHistory(patientId, index) {
	return new Promise(async function (resolve, reject) {
		await PhenotypeHistory.find({ createdBy: patientId }).sort({ date: 'asc' }).exec(async function (err, phenotypeHistory) {
			//console.log('PhenotypeHistory done.');
			var listPhenotypeHistory = [];
			phenotypeHistory.forEach(function (phenotype) {
				listPhenotypeHistory.push(phenotype);
			});
			//result.push({phenotypeHistory:listPhenotypeHistory});
			//console.log('datos de '+ patientId)
			resolve(listPhenotypeHistory);
		});
	});
}

async function getGenotype(patientId) {
	return new Promise(async function (resolve, reject) {
		await Genotype.findOne({ "createdBy": patientId }, { "createdBy": false }, (err, genotype) => {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('Genotype done.');
			if (genotype) {
				resolve(genotype);
			} else {
				resolve([]);
			}
		})
	});
}

async function getMedicalCare(patientId) {
	return new Promise(async function (resolve, reject) {
		await MedicalCare.findOne({ "createdBy": patientId }, { "createdBy": false }, async function (err, medicalCare) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('MedicalCare done.');
			if (medicalCare) {
				resolve(medicalCare);
			} else {
				resolve([]);
			}
		})
	});
}

async function getClinicalTrial(patientId) {
	return new Promise(async function (resolve, reject) {
		await ClinicalTrial.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'asc' }).exec(function (err, clinicaltrials) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			//console.log('ClinicalTrial done.');
			var listClinicalTrials = [];
			clinicaltrials.forEach(function (clinicalTrial) {
				listClinicalTrials.push(clinicalTrial);
			});
			resolve(listClinicalTrials);
		})
	});
}

async function getDatapoints2(patientId) {
	return new Promise(async function (resolve, reject) {
		await PatientProm.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'desc' }).exec(function (err, patientpromList) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })

			var listPatientpromList = [];
			//console.log('PatientProm init');
			patientpromList.forEach(async function (promData) {
				var data = await getPromInfo(promData);
				listPatientpromList.push(data);
				//console.log('other prom');
			});
			//console.log('PatientProm done.');
			resolve({ data: listPatientpromList, name: "datapoints" });
		})
	});
}

async function getDatapoints(patientId) {
	return new Promise(async function (resolve, reject) {
		await PatientProm.find({ createdBy: patientId }, { "createdBy": false }).sort({ date: 'desc' }).exec(async function (err, patientpromList) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			var listPatientpromList = [];
			//console.log('PatientProm init');
			for (const promData of patientpromList) {
				await Prom.findOne({ _id: promData.definitionPromId }, (err1, prom) => {
					if (err1) {
						console.log(err);
					}
					if (prom != undefined) {
						//console.log(prom)
						var answerAnnotations = [];
						if(prom.values.length>0){
							for (var j = 0; j < prom.values.length; j++) {
								if(promData.data==prom.values[j].value){
									answerAnnotations = prom.values[j].annotations;
								}
							}
						}
						var res = { definitionPromId: promData.definitionPromId, date: promData.date, answer: promData.data, question: prom.question, dependsOn: prom.relatedTo, responseType: prom.responseType, section: prom.section, annotations: prom.annotations, answerAnnotations: answerAnnotations }
						listPatientpromList.push(res);
					} else {
						listPatientpromList.push(promData);
					}
					//console.log('oher prom added');
				});
			}
			//console.log('PatientProm done');
			resolve(listPatientpromList);
		})
	});
}

async function getPromInfo(dataprom) {
	await Prom.findOne({ _id: dataprom.definitionPromId }, (err, prom) => {
		if (err) return res.status(500).send({ message: `Error activating account: ${err}` })
		if (prom != undefined) {
			dataprom.question = prom.question
			dataprom.relatedTo = prom.relatedTo
			dataprom.section = prom.section
			dataprom.responseType = prom.responseType
			var res = { definitionPromId: dataprom.definitionPromId, date: dataprom.date, data: dataprom.data, question: prom.question, relatedTo: prom.relatedTo, responseType: prom.responseType, section: prom.section }
			return res;
		} else {
			return dataprom;
		}
	});
}


function getSectionsGroup(req, res) {
	let groupName = req.params.groupName;
	//Group.findById(groupName, {"_id" : false }, (err, group) => {
	//Group.find({"name": groupName}, function(err, group) {
	Group.findOne({ 'name': groupName }, (err, group) => {
		if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
		if (!group) return res.status(202).send({ message: `The group does not exist` })
		if (group) {
			PromSection.find({ "createdBy": group._id }, { "createdBy": false }, function (err, sections) {
				var listSections = [];

				sections.forEach(function (section) {
					listSections.push(section);
				});

				res.status(200).send(listSections)
			});
		}

	})
}

module.exports = {
	exportData,
	exportSubgroups,
	getSectionsGroup
}
