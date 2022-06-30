'use strict'

// add the social-info model
const Prom = require('../models/prom')
const User = require('../models/user')
const Useralerts = require('../models/useralerts')
const PatientProm = require('../models/patient-prom')
const fs = require('fs');

async function exportProms(req, res) {
    let groupId=req.params.groupId;
        try {
            var proms = await getProms(groupId);
            var data = await getData(proms);
            return res.status(200).send({ message: 'Exported data proms group: '+groupId, data: data })
        } catch (e) {
            console.error("Error: ", e);
            return res.status(200).send({ message: 'Error', data: e })
        }
}

function getProms(groupId) {
	return new Promise(resolve => {
		var listProms = [];
		Prom.find({ createdBy: groupId}, function (err, proms) {
			if (proms) {
				proms.forEach(prom => {
					listProms.push(prom);
				});
			}

			resolve(listProms);
		});

	});
}

async function getData(proms) {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		//await User.find({platform : "Dx29", email: 'testpatient2@test.com'},async (err, sections) => {
		if (proms.length > 0) {
			for (var index in proms) {
				promises.push(updateProms(proms[index]));
			}
		} else {
			resolve('No data')
		}



		await Promise.all(promises)
			.then(async function (data) {
				var dataRes = [];
				/*data.forEach(function (dataPatientsUser) {
					dataPatientsUser.forEach(function (dataPatient) {
						dataRes.push(dataPatient);
					});
				});*/
				console.log('termina')
				resolve(data)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}

async function updateProms(prom) {
	return new Promise(async function (resolve, reject) {
        
        /*if(prom._id=='60004ae7a053534588116d1b'){
            console.log(prom);
            await Prom.findByIdAndUpdate(prom._id, prom, { new: true }, async function (err, promUpdated) {
                if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
                if (promUpdated) {
                    resolve(promUpdated);
                }else{
                    resolve([]);
                }
            })
        }else{
            resolve(prom);
        }*/
        resolve(prom);
        /*await Prom.findByIdAndUpdate(prom._id, prom, { new: true }, async function (err, promUpdated) {
            if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
            if (promUpdated) {
                resolve(promUpdated);
            }else{
                resolve([]);
            }
        })*/
	});
}

async function migrate(req, res) {
        try {
            /*var users = await getUsers();
            var data = await changeGroup(users);
			var data2 = await changeuseralerts();
			var data3 = await changedatapotins();*/
            return res.status(200).send({ message: 'migrated users', data: data, data: data2, data: data3 })
        } catch (e) {
            console.error("Error: ", e);
            return res.status(200).send({ message: 'Error', data: e })
        }
}

function getUsers() {
	return new Promise(resolve => {
		var listUsers = [];
		User.find({group: 'Duchenne Parent Project Netherlands', role: 'User'},(err, users) => {
			if (users) {
				users.forEach(user => {
					listUsers.push(user);
				});
			}

			resolve(listUsers);
		});

	});
}

async function changeGroup(users) {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		if (users.length > 0) {
			for (var index in users) {
				promises.push(updateGroup(users[index]));
			}
		} else {
			resolve('No data')
		}



		await Promise.all(promises)
			.then(async function (data) {
				console.log('termina')
				resolve(data)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}

async function updateGroup(user) {
	return new Promise(async function (resolve, reject) {
		await User.findByIdAndUpdate(user._id, { group: 'Duchenne Parent Project International', subgroup: 3900}, { new: true }, async function (err, userUpdated) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			if (userUpdated) {
				resolve(userUpdated);
			}else{
				resolve({});
			}
		})
	});
}

async function changeuseralerts() {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		var objToTranslate = JSON.parse(fs.readFileSync('./assets/useralertsdev.json', 'utf8'));
			console.log(objToTranslate);
			if (objToTranslate.length > 0) {
				for (var index in objToTranslate) {
					console.log(objToTranslate[index]);
					promises.push(updateUserAlert(objToTranslate[index]));
				}
			} else {
				resolve('No data')
			}
		await Promise.all(promises)
			.then(async function (data) {
				console.log('termina')
				resolve(data)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}

async function updateUserAlert(alertids) {
	return new Promise(async function (resolve, reject) {
		await Useralerts.find({alertId:alertids.idned},async function(err,userAlertsFound){
			var promises = [];
			if (userAlertsFound.length > 0) {
				for (var index in userAlertsFound) {
					promises.push(updatealert(userAlertsFound[index], alertids));
				}
			} else {
				resolve('No data')
			}
			await Promise.all(promises)
				.then(async function (data) {
					console.log('termina')
					resolve(data)
				})
				.catch(function (err) {
					console.log('Manejar promesa rechazada (' + err + ') aquí.');
					return null;
				});
			})
	});
}

async function updatealert(alert, alertids) {
	return new Promise(async function (resolve, reject) {
		await Useralerts.findByIdAndUpdate(alert._id, { alertId: alertids.idint}, { new: true }, async function (err, alertUpdated) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			if (alertUpdated) {
				resolve(alertUpdated);
			}else{
				resolve({});
			}
		})
	});
}

async function changedatapotins() {
	return new Promise(async function (resolve, reject) {
		var promises = [];
		var objToTranslate = JSON.parse(fs.readFileSync('./assets/promsdev.json', 'utf8'));
			console.log(objToTranslate);
			if (objToTranslate.length > 0) {
				for (var index in objToTranslate) {
					console.log(objToTranslate[index]);
					promises.push(searchdatapoint(objToTranslate[index]));
				}
			} else {
				resolve('No data')
			}
		await Promise.all(promises)
			.then(async function (data) {
				console.log('termina')
				resolve(data)
			})
			.catch(function (err) {
				console.log('Manejar promesa rechazada (' + err + ') aquí.');
				return null;
			});

	});
}


async function searchdatapoint(datapointsids) {
	return new Promise(async function (resolve, reject) {
		await PatientProm.find({"definitionPromId": datapointsids.idned},async function(err,patientpromsFound){
			var promises = [];
			if (patientpromsFound.length > 0) {
				for (var index in patientpromsFound) {
					promises.push(updatepatientprom(patientpromsFound[index], datapointsids));
				}
			} else {
				resolve('No data')
			}
			await Promise.all(promises)
				.then(async function (data) {
					console.log('termina')
					resolve(data)
				})
				.catch(function (err) {
					console.log('Manejar promesa rechazada (' + err + ') aquí.');
					return null;
				});
			})
	});
}

async function updatepatientprom(patientprom, datapointsids) {
	return new Promise(async function (resolve, reject) {
		console.log(patientprom._id);
		console.log(datapointsids.idint);
		if(patientprom.metainfo.length>0){
			for(var index in patientprom.metainfo){
				for(var index2 in datapointsids.valuesned){
					if(patientprom.metainfo[index].idanswer==datapointsids.valuesned[index2]){
						patientprom.metainfo[index].idanswer=datapointsids.valuesint[index2];
					}
				}
				
			}
		}
		await PatientProm.findByIdAndUpdate(patientprom._id, { definitionPromId: datapointsids.idint, metainfo: patientprom.metainfo}, { new: true }, async function (err, alertUpdated) {
			if (err) return res.status(500).send({ message: `Error making the request: ${err}` })
			if (alertUpdated) {
				resolve(alertUpdated);
			}else{
				resolve({});
			}
		})
	});
}


module.exports = {
	exportProms,
	migrate
}
