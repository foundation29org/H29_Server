'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')
const crypt = require('./crypt')
const User = require('../models/user')

function createToken (user){
	var id = user._id.toString();
	var idencrypt= crypt.encrypt(id);
	const payload = {
		//el id siguiente no debería de ser el id privado, así que habrá que cambiarlo
		sub: idencrypt,
		iat: moment().unix(),
		exp: moment().add(1, 'years').unix(),//years //minutes
		role: user.role,
		group: user.group,
		subgroup: user.subgroup
	}
	return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken(token, method, roles){
	return (async () => {
		try{
			const payload = jwt.decode(token, config.SECRET_TOKEN)
			if(!roles.includes(payload.role)){
				const accessErr = new Error('Access denied.')
				accessErr.status = 403
				throw accessErr
			}
			const userId = crypt.decrypt(payload.sub)
			const user = await User.findById(userId).select('-__v -confirmationCode -loginAttempts -lastLogin')
			if(!user){
				const hackerErr = new Error('Hacker!')
				hackerErr.status = 403
				throw hackerErr
			}
			if(user.role != payload.role || String(userId) != String(user._id) || user.subrole != payload.subrole){
				const hackerErr = new Error('Hacker!')
				hackerErr.status = 403
				throw hackerErr
			}
			if(user.role == 'Researcher' && method != 'GET'){
				const permErr = new Error('You do not have permissions')
				permErr.status = 401
				throw permErr
			}
			if (payload.exp <= moment().unix()){
				const expErr = new Error('Token expired')
				expErr.status = 401
				throw expErr
			}
			return crypt.decrypt(payload.sub.toString())
		}catch (err){
			if(err && err.status){
				throw { status: err.status, message: err.message }
			}
			if(err && err.message == 'Token expired'){
				throw { status: 401, message: 'Token expired' }
			}
			console.error('[auth] decodeToken failed:', err && err.message ? err.message : err)
			throw { status: 401, message: 'Invalid Token' }
		}
	})()
}

module.exports = {
	createToken,
	decodeToken
}
