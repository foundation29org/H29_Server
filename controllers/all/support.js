// functions for each call of the api on user. Use the user model

'use strict'

// add the user model
const User = require('../../models/user')
const Support = require('../../models/support')
const Group = require('../../models/group')
const serviceEmail = require('../../services/email')
const crypt = require('../../services/crypt')


function sendMsgSupport(req, res){
	let userId= crypt.decrypt(req.body.userId);

	User.findOne({ '_id': userId }, function (err, user) {
	  if (err) return res.status(500).send({ message: 'Error searching the user'})
		if (user){

			let support = new Support()
			support.platform = 'H29'
			support.type = req.body.type
			support.subject = req.body.subject
			support.description = req.body.description
			support.groupId = req.body.groupId
			support.createdBy = userId

			//guardamos los valores en BD y enviamos Email
			support.save((err, supportStored) => {
				if (err) return res.status(500).send({ message: 'Error saving the msg'})
				Group.findById(support.groupId, function (err, group) {
					var emailTo = null;
					if (group){
						emailTo = group.email
					}

					serviceEmail.sendMailSupport(user.email, user.lang, supportStored, emailTo)
						.then(response => {
							return res.status(200).send({ message: 'Email sent'})
						})
						.catch(response => {
							//create user, but Failed sending email.
							//res.status(200).send({ token: serviceAuth.createToken(user),  message: 'Fail sending email'})
							res.status(500).send({ message: 'Fail sending email'})
						})

				})


				//return res.status(200).send({ token: serviceAuth.createToken(user)})
			})
		}else{
			return res.status(500).send({ message: 'user not exists'})
		}
	})
}

function getUserMsgs(req, res){
	let userId= crypt.decrypt(req.params.userId);
	Support.find({createdBy: userId}).sort({ order : 'desc'}).exec(function(err, msgs){

			if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			var listmsgs = [];

			msgs.forEach(function(u) {
				//la condición siguiente undefined mas adelante se quitará, cuando se limpien los mensajes antiguos que no tenían el valor plataforma
				if(u.platform == 'H29' || u.platform == undefined){
					listmsgs.push({subject:u.subject, description: u.description, date: u.date, status: u.status, type: u.type, id: u._id});
				}
			});

			//res.status(200).send({patient, patient})
			// if the two objects are the same, the previous line can be set as follows
			res.status(200).send({listmsgs})
	})
}

function getAllMsgs(req, res){
	let userId= crypt.decrypt(req.params.userId);
	var groupId = req.body.groupId;
	User.findById(userId, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user) => {
		if (err) return res.status(500).send({message: 'Error making the request:'})
		if(!user) return res.status(404).send({code: 208, message: 'The user does not exist'})
		if(user.role == 'SuperAdmin'){
			Support.find({platform:"H29"}).sort({ order : 'desc'}).exec(function(err, msgs){
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				var listmsgs = [];
				if(msgs.length>0){
					msgs.forEach(function(u) {
						//if(u.platform=='H29' || u.platform==undefined){
							User.findById(u.createdBy, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user2) => {
								if(user2){
									listmsgs.push({ subject:u.subject, description: u.description, date: u.date, status: u.status, statusDate: u.statusDate, type: u.type, _id: u._id, files: u.files, email: user2.email, lang: user2.lang, id: u._id});
								}else{
									listmsgs.push({ subject:u.subject, description: u.description, date: u.date, status: u.status, statusDate: u.statusDate, type: u.type, _id: u._id, files: u.files, email: '', lang: '', id: u._id});

								}
								if(listmsgs.length == msgs.length){
									res.status(200).send({listmsgs})
								}
							});
						//}
					});
				}
				else{
					res.status(200).send({listmsgs})
				}

			});

					//res.status(200).send({patient, patient})
					// if the two objects are the same, the previous line can be set as follows

			//})

		}else if(user.role == 'Admin'){
			Support.find({platform:"H29", groupId: groupId}).sort({ order : 'desc'}).exec(function(err, msgs){
				if (err) return res.status(500).send({message: `Error making the request: ${err}`})
				var listmsgs = [];
				if(msgs.length>0){
					msgs.forEach(function(u) {
						//if(u.platform=='H29' || u.platform==undefined){
							User.findById(u.createdBy, {"_id" : false , "__v" : false, "confirmationCode" : false, "loginAttempts" : false, "lastLogin" : false}, (err, user2) => {
								if(user2){
									listmsgs.push({ subject:u.subject, description: u.description, date: u.date, status: u.status, statusDate: u.statusDate, type: u.type, _id: u._id, files: u.files, email: user2.email, lang: user2.lang, id: u._id});
								}else{
									listmsgs.push({ subject:u.subject, description: u.description, date: u.date, status: u.status, statusDate: u.statusDate, type: u.type, _id: u._id, files: u.files, email: '', lang: '', id: u._id});

								}
								if(listmsgs.length == msgs.length){
									res.status(200).send({listmsgs})
								}
							});
						//}
					});
				}
				else{
					res.status(200).send({listmsgs})
				}

			});
		}else{
			res.status(401).send({message: 'without permission'})
		}

	})

}

function updateMsg (req, res){
	let supportId= req.params.supportId;
	let update = req.body

	Support.findByIdAndUpdate(supportId, update, {select: '-createdBy', new: true}, (err,supportUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

		res.status(200).send({message: 'Msg updated', msg: supportUpdated})

	})
}


module.exports = {
	sendMsgSupport,
	getUserMsgs,
	getAllMsgs,
	updateMsg
}
