'use strict'

// add the social-info model
const Prom = require('../models/prom')

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

module.exports = {
	exportProms
}
