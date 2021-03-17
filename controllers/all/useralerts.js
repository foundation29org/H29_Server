// functions for each call of the api on Healthbot. Use the bot-qna model
'use strict'

// add the bot-qna model
const Useralerts = require('../../models/useralerts')

// add other required models
const Group = require('../../models/group')
const crypt = require('../../services/crypt')
const Alerts = require('../../models/alerts')
const Patient = require('../../models/patient')
const User = require('../../models/user')


/**
 * @api {get} https://health29.org/api/useralertsp/ Request list of patient alerts.
 * @apiName getUserAlerts
 * @apiDescription This method request the list of patient alerts.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   this.http.get('https://health29.org/api/useralerts/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of alerts of a patient ok');
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
 * @apiParam {Object} patientId The unique identifier of a patient.
 * @apiSuccess {Object[]} Result Returns list of alerts of a patient
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 * 	    	"_id" : <user alert id>,
 * 	    	"showDate" : {
 * 	    		"$date" : 1576796400000
 * 	    	},
 * 	    	"launch" : false,
 * 	    	"snooze" : "1",
 * 	    	"state" : "Read",
 * 	    	"patientId" : <patientId>,
 * 	    	"alertId" : <alertId>,
 * 	    	"__v" : 0
 * 	    }
 * 	]
 *
 *
 */

async function getUserAlerts (req, res){
    let patientId=crypt.decrypt(req.params.patientId);
    var date=new Date();
    var listUseralerts = [];
    await Useralerts.find({patientId:patientId}, {"createdBy" : false }, (err, useralertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})

        for(var i=0;i<useralertsfound.length;i++){
            if(Date.parse(date)>=Date.parse(useralertsfound[i].showDate)){
                listUseralerts.unshift(useralertsfound[i]);
            }
        }

    });
    return res.status(200).send({listUseralerts:listUseralerts})

}

/**
 * @api {post} https://health29.org/api/useralerts/ Create new alert for a patient
 * @apiPrivate
 * @apiName saveUserAlerts
 * @apiDescription This method creates new alert for a patient
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   var body = <user alert data>
 *   this.http.post('https://health29.org/api/useralerts/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert for a patient ok');
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
 * @apiParam {Object} patientId The unique identifier of a patient.
 * @apiSuccess {Object} Result Object with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {message: 'User alerts save'}
 */

function saveUserAlerts (req, res){
    let patientId=crypt.decrypt(req.params.patientId);
    let alertId=req.body.alertId;
    Useralerts.findOne({patientId: patientId,alertId: alertId}, async function (err, newuseralertfound) {
        if(newuseralertfound==null){
            // Si no existía creamos una alerta nueva con los datos proporcionados
            let newUseralert = new Useralerts();
            newUseralert.alertId = req.body.alertId;
            newUseralert.patientId = patientId;
            newUseralert.state = "Not read";
            newUseralert.showDate = req.body.showDate;
            newUseralert.createdBy = req.body.createdBy;
            newUseralert.launch = false;
            await newUseralert.save((err, newUseralertStored) => {
                if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                return res.status(200).send({message: 'User alerts save'})
            });
        }
        else if ((newuseralertfound!=null)&&(newuseralertfound!=undefined)){
            newuseralertfound.state = "Not read";
            newuseralertfound.showDate = req.body.showDate;
            newuseralertfound.launch = false;
            await Useralerts.findByIdAndUpdate(req.body._id, newuseralertfound, (err,useralertsUpdated) => {
                if (err){ return res.status(500).send({message: `Error making the request: ${err}`}) }
                return res.status(200).send({message: 'User alerts updated'})
            })
        }


    });
}

/**
 * @api {post} https://health29.org/api/useralerts/checkingReceiver/ Create new alert for a patient by alert according the type: selected users or broadcast
 * @apiPrivate
 * @apiName saveUserAlertsCheckingAlertReceive
 * @apiDescription This method creates new alert for a patient by alert according the type: selected users or broadcast
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   var body = <alertId>
 *   this.http.post('https://health29.org/api/useralerts/checkingReceiver/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert for a patient by alert according the type: selected users or broadcast ok');
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
 * @apiParam {Object} patientId The unique identifier of a patient.
 * @apiSuccess {Object} Result Object with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {message: 'User alerts updated'}
 */
function saveUserAlertsCheckingAlertReceive (req, res){
    let patientId=crypt.decrypt(req.params.patientId);
    let alertId=req.body.alertId;

    Alerts.findById(alertId,(err,alertFound)=>{
        if(alertFound){
            if(alertFound.receiver.type=="broadcast"){
                Useralerts.findOne({patientId: patientId,alertId: alertId}, async function (err, newuseralertfound) {
                    if(newuseralertfound==null){
                        // Si no existía creamos una alerta nueva con los datos proporcionados
                        let newUseralert = new Useralerts();
                        newUseralert.alertId = req.body.alertId;
                        newUseralert.patientId = patientId;
                        newUseralert.state = req.body.state;
                        newUseralert.showDate = req.body.showDate;
                        newUseralert.createdBy = req.body.createdBy;
                        newUseralert.launch = req.body.launch;
                        await newUseralert.save((err, newUseralertStored) => {
                            if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                            return res.status(200).send({message: 'User alerts save'})
                        });
                    }
                    else if ((newuseralertfound!=null)&&(newuseralertfound!=undefined)){
                        await Useralerts.findByIdAndUpdate(req.body._id, req.body, (err,useralertsUpdated) => {
                            if (err){ return res.status(500).send({message: `Error making the request: ${err}`}) }
                            return res.status(200).send({message: 'User alerts updated'})
                        })
                    }


                });
            }
            else if(alertFound.receiver.type=="selectUsers"){
                Patient.findById(patientId,(err,patientFound)=>{
                    if(patientFound){
                        User.findById(patientFound.createdBy,(err,userFound)=>{
                            if(userFound){
                                var toSave=false;
                                for(var i =0;i<alertFound.receiver.data.length;i++){
                                    if((userFound.userName==alertFound.receiver.data[i].name)&&(userFound.email==alertFound.receiver.data[i].email)){
                                        toSave = true;
                                        Useralerts.findOne({patientId: patientId,alertId: alertId}, async function (err, newuseralertfound) {
                                            if(newuseralertfound==null){
                                                // Si no existía creamos una alerta nueva con los datos proporcionados
                                                let newUseralert = new Useralerts();
                                                newUseralert.alertId = req.body.alertId;
                                                newUseralert.patientId = patientId;
                                                newUseralert.state = req.body.state;
                                                newUseralert.showDate = req.body.showDate;
                                                newUseralert.createdBy = req.body.createdBy;
                                                newUseralert.launch = req.body.launch;
                                                await newUseralert.save((err, newUseralertStored) => {
                                                    if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                                    return res.status(200).send({message: 'User alerts save'})
                                                });
                                            }
                                            else if ((newuseralertfound!=null)&&(newuseralertfound!=undefined)){
                                                await Useralerts.findByIdAndUpdate(req.body._id, req.body, (err,useralertsUpdated) => {
                                                    if (err){ return res.status(500).send({message: `Error making the request: ${err}`}) }
                                                    return res.status(200).send({message: 'User alerts updated'})
                                                })
                                            }
                                        });
                                    }
                                }
                                if(toSave==false){
                                    return res.status(200).send({message: 'No user Alert to save for this patient'})
                                }
                            }
                        })
                    }
                })
            }
        }
    });

}

/**
 * @api {get} https://health29.org/api/useralerts/alertId/ Request list of a patient alerts by alert id
 * @apiName getUserAlertsByAlertId
 * @apiPrivate
 * @apiDescription This method request list of a patient alerts by alert id
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>-code-<alertId>
 *   this.http.get('https://health29.org/api/useralerts/alertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of a patient alerts by alert id ok');
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
 * @apiParam {String} patientId-code-alertId The unique identifier of a patient and alert
 * @apiSuccess {Object[]} Result Returns list of alerts of a patient
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 * 	    	"_id" : <user alert id>,
 * 	    	"showDate" : {
 * 	    		"$date" : 1576796400000
 * 	    	},
 * 	    	"launch" : false,
 * 	    	"snooze" : "1",
 * 	    	"state" : "Read",
 * 	    	"patientId" : <patientId>,
 * 	    	"alertId" : <alertId>,
 * 	    	"__v" : 0
 * 	    }
 * 	]
 *
 *
 */
function getUserAlertsByAlertId (req, res){

    var params= req.params.patientIdAndAlertId;
	params = params.split("-code-");
	let patientId= crypt.decrypt(params[0]);
    let alertId = params[1];

    Useralerts.findOne({patientId:patientId, alertId:alertId}, {"createdBy" : false }, (err, useralertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        return res.status(200).send(useralertsfound)
    });

}

/**
 * @api {delete} https://health29.org/api/useralerts/alertId/ Delete list of a patient alerts by alert id
 * @apiPrivate
 * @apiName deleteUserAlertsByAlertId
 * @apiDescription This method deletes list of a patient alerts by alert id
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>-code-<alertId>
 *   this.http.delete('https://health29.org/api/useralerts/alertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete list of a patient alerts by alert id ok');
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
 * @apiParam {String} patientId-code-alertId The unique identifier of a patient and alert
 * @apiSuccess {Object[]} Result Returns an object with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {"message":"delete user alerts for patient"}
 *
 */

function deleteUserAlertsByAlertId (req, res){
  var params= req.params.patientIdAndAlertId;
	params = params.split("-code-");
	let patientId= crypt.decrypt(params[0]);
    let alertId = params[1];

    Useralerts.find({patientId:patientId, alertId:alertId}, async function (err, useralertsfound) {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(useralertsfound){
            for (var i =0; i <useralertsfound.length;i++){
                await useralertsfound[i].remove(err => {
                    if(err) return res.status(202).send({message: 'error, not found'})
                })
            }

        }else{
            return res.status(202).send({message: 'error, not found'})
        }
    });
    return res.status(200).send({message: 'delete user alerts for patient:'})

}

/**
 * @api {get} https://health29.org/api/useralerts/useralertId/ Request list of alerts of a patient by identifier
 * @apiName getUserAlertsById
 * @apiPrivate
 * @apiDescription This method request the list of alerts of a patient by identifier.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userAlertId>
 *   this.http.get('https://health29.org/api/useralerts/useralertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of alerts of a patient by identifier ok');
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
 * @apiParam {Object} userAlertId The unique identifier of a alert of apatient.
 * @apiSuccess {Object[]} Result Returns list of alerts of a patient
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 * 	    	"_id" : <user alert id>,
 * 	    	"showDate" : {
 * 	    		"$date" : 1576796400000
 * 	    	},
 * 	    	"launch" : false,
 * 	    	"snooze" : "1",
 * 	    	"state" : "Read",
 * 	    	"patientId" : <patientId>,
 * 	    	"alertId" : <alertId>,
 * 	    	"__v" : 0
 * 	    }
 * 	]
 *
 *
 */


function getUserAlertsById (req, res){
    let useralertId=req.params.useralertId;

    Useralerts.findById(useralertId, {"createdBy" : false }, (err, useralertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        return res.status(200).send(useralertsfound)
    });

}

/**
 * @api {delete} https://health29.org/api/useralerts/useralertId/ Delete list of alerts of a patient by identifier
 * @apiPrivate
 * @apiName deleteUserAlertsById
 * @apiDescription This method deletes the list of alerts of a patient by identifier.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <userAlertId>
 *   this.http.delete('https://health29.org/api/useralerts/useralertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete list of alerts of a patient by identifier ok');
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
 * @apiParam {Object} userAlertId The unique identifier of a alert of apatient.
 * @apiSuccess {Object} Result Returns object with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {message: 'deleted user alert'}
 */
function deleteUserAlertsById (req, res){
    let useralertId=req.params.useralertId;

    Useralerts.findById(useralertId, (err, useralertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(useralertsfound){
            useralertsfound.remove(err => {
                if(err) return res.status(202).send({message: 'error, not found'})
                return res.status(200).send({message: 'deleted user alert:'})
            })

        }else{
            return res.status(202).send({message: 'error, not found'})
        }
    });

}

/**
 * @api {post} https://health29.org/api/useralerts/updatetoReadSelectedUserAlerts Update selected alerts of a patient with state read
 * @apiPrivate
 * @apiName changeStateToReadForSelectedUserAlertsForPatient
 * @apiDescription This method updates selected alerts of a patient with state read
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   var body = [<user alert list ids>]
 *   this.http.post('https://health29.org/api/useralerts/updatetoReadSelectedUserAlerts/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Update selected alerts of a patient with state read ok');
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
 * @apiParam {Object} patientId The unique identifier of a patient.
 * @apiSuccess {Object} Result Object with information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {message: 'All User Alerts go to state read'}
 */
async function changeStateToReadForSelectedUserAlertsForPatient(req,res){
    let patientId=crypt.decrypt(req.params.patientId);
    let listAlerts = req.body;

    for (var i=0;i<listAlerts.length;i++){
        await Useralerts.findOne({patientId:patientId,alertId:listAlerts[i].alertFound._id}, async (err, useralertsfound)=>{
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            if(useralertsfound){
                useralertsfound.state="Read";
                await useralertsfound.save((err,saveUserAlert) => {
                    if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                });

            }
            else{
            }

        });
    }
    return res.status(200).send({message: 'All User Alerts go to state read'})
}

function changeStateToLaunch(req,res){
    let patientId=crypt.decrypt(req.params.patientId);
    let alertId=req.body._id;
    Useralerts.find({patientId:patientId, alertId:alertId}, (err, useralertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        for(var i =0;i<useralertsfound.length;i++){
            useralertsfound[i].launch=true;
            var saveUserAlert=useralertsfound[i];
            useralertsfound[i].save((err,saveUserAlert) => {
                if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
            });
        }

        return res.status(200).send({message: 'Selected User Alert go to launch true'})

    });
}


module.exports = {
    getUserAlerts,
    saveUserAlerts,
    saveUserAlertsCheckingAlertReceive,
    getUserAlertsByAlertId,
    deleteUserAlertsByAlertId,
    getUserAlertsById,
    deleteUserAlertsById,
    changeStateToReadForSelectedUserAlertsForPatient,
    changeStateToLaunch
}
