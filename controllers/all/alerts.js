// functions for each call of the api on Healthbot. Use the bot-qna model
'use strict'

// add the bot-qna model
const Alerts = require('../../models/alerts')

// add other required models
const Group = require('../../models/group')
const Patient = require('../../models/patient')
const User = require('../../models/user')
const Useralerts = require('../../models/useralerts')
const StructureProm = require('../../models/structure-prom')
const PromSection = require('../../models/prom-section')

const crypt = require('../../services/crypt')

/**
 * @api {get} https://health29.org/api/alerts/typeGroupFilterLang/ Request list of notifications/alerts of a group only for a specific language
 * @apiName getAlertByGroupAndTypeWithLangFilter
 * @apiPrivate
 * @apiDescription This method request the list of notifications/alerts of a group only for a specific language
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>-code-<Type>-code-<code_lang>
 *   this.http.get('https://health29.org/api/alerts/typeGroupFilterLang/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of notifications/alerts of a group only for a specific language ok');
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
 * @apiParam {Object} groupId-code-Type-code-lang_code The unique identifier of a group, the type of notifications/alerts and the code of the language selected.
 * @apiSuccess {Object[]} Result Returns list of notifications/alerts of a group
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 * 	]
 *
 *
 */
function getAlertByGroupAndTypeWithLangFilter (req, res){
    let params=req.params.groupIdAndTypeAndLang;
    params = params.split("-code-")
    Alerts.find({groupId:params[0], type:params[1]}, async function (err, alertsfound){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        var listAlertsByGroup = [];
        for (var i=0; i<alertsfound.length;i++){
            listAlertsByGroup.unshift(alertsfound[i])
        }
        var listAlertByGropuFilterByLang=[];
        for(var i=0;i<listAlertsByGroup.length;i++){
            var listPatientCreatedBy=[];

            for(var j=0;j<listAlertsByGroup[i].translatedName.length;j++){
                if(listAlertsByGroup[i].translatedName[j].code==params[2]){
                    if(listAlertsByGroup[i].translatedName[j].title!=""){
                        if(listAlertsByGroup[i].receiver.type=="selectUsers"){
                            //Modifico el campo receiver data para pasar al cliente directamente el nombre y el email
                            var listNameAndEmailForUsers=[];
                            for(var k=0;k<listAlertsByGroup[i].receiver.data.length;k++){

                                await Patient.findById(crypt.decrypt(listAlertsByGroup[i].receiver.data[k]), function (err,patientFound){
                                    if(err) return res.status(500).send({message: `Error making the request: ${err}`});
                                    if(patientFound){
                                        listPatientCreatedBy.push(patientFound.createdBy)


                                    }
                                })
                            }
                            for(var k=0;k<listPatientCreatedBy.length;k++){
                                await User.findById(listPatientCreatedBy[k], (err,userFound)=>{
                                    if(err) return res.status(500).send({message: `Error making the request: ${err}`});

                                    if(userFound){
                                        var userName=userFound.userName;
                                        var userEmail=userFound.email;
                                        listNameAndEmailForUsers.push({name:userName,email:userEmail});
                                    }

                                })
                            }
                            listAlertsByGroup[i].receiver.data=[];
                            listAlertsByGroup[i].receiver.data=listNameAndEmailForUsers;
                            listAlertByGropuFilterByLang.push(listAlertsByGroup[i])
                        }
                        else{
                            listAlertByGropuFilterByLang.push(listAlertsByGroup[i])
                        }
                    }
                }
            }
        }
        return res.status(200).send(listAlertByGropuFilterByLang)
    });

}


/**
 * @api {get} https://health29.org/api/alerts/ Request list of notifications/alerts of a group
 * @apiName getAlertByGroup
 * @apiPrivate
 * @apiDescription This method request the list of notifications/alerts of a group.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>
 *   this.http.get('https://health29.org/api/alerts/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of notifications/alerts of a group ok');
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
 * @apiParam {Object} groupId The unique identifier of a group.
 * @apiSuccess {Object[]} Result Returns list of notifications/alerts of a group
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 * 	]
 *
 *
 */
function getAlertByGroup (req, res){
    let groupId=req.params.groupId;
    Alerts.find({groupId:groupId}, (err, alertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        var listAlertsByGroup = [];
        alertsfound.forEach(function(alertModel) {
            listAlertsByGroup.unshift(alertModel);
        });
        return res.status(200).send(listAlertsByGroup)
    });

}

// For new users only
async function getAlertByGroupAndCreateUserAlertsForPatient(req,res){
    // Fecha de hoy
    let date = new Date();
    let params=req.params.groupIdAndPatientId;
    params = params.split('-code-')
    await Alerts.find({groupId:params[0]}, (err, alertsfound)=>{
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(alertsfound){
            // Ordeno las alertas por tipo
            var listAlerts6months=[];
            var listAlerts12months=[];
            var listOtherAlerts=[]
            for (var i =0;i<alertsfound.length;i++){
                if(alertsfound[i].type=='6months'){
                    listAlerts6months.push({alert:alertsfound[i],identifier:Number(alertsfound[i].identifier)});
                }
                else if (alertsfound[i].type=='12months'){
                    listAlerts12months.push({alert:alertsfound[i],identifier:Number(alertsfound[i].identifier)});
                }
                else{
                    listOtherAlerts.push({alert:alertsfound[i],identifier:null});
                }
            }
            // Las de tipo 6 y 12 meses las ordeno por identifier
            listAlerts6months.sort(function(a, b){
                return a.identifier - b.identifier;
            })

            listAlerts12months.sort(function(a, b){
                return a.identifier - b.identifier;
            })

            // Calculo el showDate de las userAlerts para las de 6 meses
            // Creo la useralert
            //var countMonthsDateTyp6=0;
            var monthsToSum=0;
            for (var i=0;i<listAlerts6months.length;i++){
                // Calculo del showDate - 2 casos
                // Caso 1: el LaunchDate de la alerta es > que el dia de hoy
                //  - Se actualiza en funcion de la alerta para que salgan cada una en un mes
                //  a partir de los 6 primeros meses desde el dia de LAUNCHDATE
                // Caso 2: el LaunchDate de la alerta es < que el dia de hoy
                //  - Se actualiza en funcion de la alerta para que salgan cada una en un mes
                //  a partir de los 6 primeros meses desde el dia de HOY
                var dateToShowUserAlert
                // Caso 1
                if(Date.parse(listAlerts6months[i].alert.launchDate)>Date.parse(date)){
                    //Partiendo de la fecha de LaunchDate
                    dateToShowUserAlert=listAlerts6months[i].alert.launchDate;
                    // Cojo el mes
                    var getMonthLaunchDate = dateToShowUserAlert.getMonth();
                    // Para pruebas lo voy a hacer con minutos
                    //var getMonthLaunchDate = dateToShowUserAlert.getMinutes();

                    // Evaluo cuantos meses hay que sumarle
                    // Las dos primeras se lanzan a la vez pasados los 6 meses desde que se cree la alerta
                    if((i==0)||(i==1)){
                        monthsToSum=6;
                    }
                    // Al resto se le suma 1 a la anterior
                    else{
                        monthsToSum=monthsToSum+1;
                    }
                    // Se los sumo
                    dateToShowUserAlert.setMonth(Number(getMonthLaunchDate)+Number(monthsToSum))
                    // Para pruebas lo voy a hacer con minutos
                    //dateToShowUserAlert.setMinutes(Number(getMonthLaunchDate)+Number(monthsToSum))
                }
                // Caso 2
                else{

                    //Partiendo de la fecha de HOY
                    var date1 = new Date()
                    dateToShowUserAlert=date1;
                    // Cojo el mes
                    var getMonthLaunchDate = dateToShowUserAlert.getMonth();
                    // Para pruebas lo voy a hacer con minutos

                    // Evaluo cuantos meses hay que sumarle
                    // Las dos primeras se lanzan a la vez pasados los 6 meses desde que se cree la alerta
                    if((i==0)||(i==1)){
                        monthsToSum=6;
                    }
                    // Al resto se le suma 1 a la anterior
                    else{
                        monthsToSum=monthsToSum+1;
                    }
                    // Se los sumo
                    dateToShowUserAlert.setMonth(Number(getMonthLaunchDate)+Number(monthsToSum))
                    // Para pruebas lo voy a hacer con minutos

                }
                // Evaluo el tipo de receiver:
                // - Si es broadcast creo la userAlert
                // - Si es selectUsers evaluo si el usuario esta entre la lista
                //   (Seguro que no está porque aun no se habia creado el paciente pero por prevenir)
                if(listAlerts6months[i].alert.receiver.type=="broadcast"){
                    let newUseralert = new Useralerts();
                    newUseralert.alertId = listAlerts6months[i].alert._id;
                    newUseralert.patientId = crypt.decrypt(params[1]);
                    newUseralert.state = "Not read";
                    newUseralert.snooze = "1"
                    newUseralert.showDate = dateToShowUserAlert;
                    newUseralert.launch = false;
                    newUseralert.save((err, newUseralertStored) => {
                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                    });
                }
                else if(listAlerts6months[i].alert.receiver.type=="selectUsers"){
                    for(var j=0;j<listAlerts6months[i].alert.receiver.data.length;j++){
                        if(listAlerts6months[i].alert.receiver.data[j]==crypt.decrypt(params[1])){
                            let newUseralert = new Useralerts();
                            newUseralert.alertId = listAlerts6months[i].alert._id;
                            newUseralert.patientId = crypt.decrypt(params[1]);
                            newUseralert.state = "Not read";
                            newUseralert.snooze = "1"
                            newUseralert.showDate = dateToShowUserAlert;
                            newUseralert.launch = false;

                            newUseralert.save((err, newUseralertStored) => {
                                if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                            });
                        }
                    }
                }
            }

            // Calculo el showDate de las userAlerts para las de 12 meses
            // Creo la useralert
            //var countMonthsDateTyp12=0;
            var monthsToSum=0;
            for (var i=0;i<listAlerts12months.length;i++){
                // Calculo del showDate - 2 casos
                // Caso 1: el LaunchDate de la alerta es > que el dia de hoy
                //  - Se actualiza en funcion de la alerta para que salgan cada una en un mes
                //  a partir de los 12 primeros meses desde el dia de LAUNCHDATE
                // Caso 2: el LaunchDate de la alerta es < que el dia de hoy
                //  - Se actualiza en funcion de la alerta para que salgan cada una en un mes
                //  a partir de los 12 primeros meses desde el dia de HOY
                var dateToShowUserAlert
                // Caso 1
                if(Date.parse(listAlerts12months[i].alert.launchDate)>Date.parse(date)){
                    //Partiendo de la fecha de LaunchDate
                    dateToShowUserAlert=listAlerts12months[i].alert.launchDate;
                    // Cojo el mes
                    var getMonthLaunchDate = dateToShowUserAlert.getMonth();
                    // Para pruebas lo voy a hacer con minutos
                    //var getMonthLaunchDate = dateToShowUserAlert.getMinutes();


                    // Evaluo cuantos meses hay que sumarle
                    // Las primera se lanza pasados los 12 meses desde que se cree la alerta
                    if(i==0){
                        monthsToSum=12;
                    }
                    // Al resto se le suma 1 a la anterior
                    else{
                        monthsToSum=monthsToSum+1;
                    }
                    // Se los sumo
                    dateToShowUserAlert.setMonth(Number(getMonthLaunchDate)+Number(monthsToSum))
                    // Para pruebas lo voy a hacer con minutos
                    //dateToShowUserAlert.setMinutes(Number(getMonthLaunchDate)+Number(monthsToSum))
                }
                // Caso 2
                else{
                    //Partiendo de la fecha de HOY
                    var date1 = new Date()
                    dateToShowUserAlert=date1;
                    // Cojo el mes
                    var getMonthLaunchDate = dateToShowUserAlert.getMonth();
                    // Para pruebas lo voy a hacer con minutos
                    //var getMonthLaunchDate = dateToShowUserAlert.getMinutes();

                    // Evaluo cuantos meses hay que sumarle
                    // Las primera se lanza pasados los 12 meses desde el dia de HOY
                    if(i==0){
                        monthsToSum=12;
                    }
                    // Al resto se le suma 1 a la anterior
                    else{
                        monthsToSum=monthsToSum+1;
                    }
                    // Se los sumo
                    dateToShowUserAlert.setMonth(Number(getMonthLaunchDate)+Number(monthsToSum))
                    // Para pruebas lo voy a hacer con minutos
                    //dateToShowUserAlert.setMinutes(Number(getMonthLaunchDate)+Number(monthsToSum))

                }

                // Evaluo el tipo de receiver:
                // - Si es broadcast creo la userAlert
                // - Si es selectUsers evaluo si el usuario esta entre la lista
                //   (Seguro que no está porque aun no se habia creado el paciente pero por prevenir)
                if(listAlerts12months[i].alert.receiver.type=="broadcast"){
                    let newUseralert = new Useralerts();
                    newUseralert.alertId = listAlerts12months[i].alert._id;
                    newUseralert.patientId = crypt.decrypt(params[1]);
                    newUseralert.state = "Not read";
                    newUseralert.snooze = "1"
                    newUseralert.showDate = dateToShowUserAlert;
                    newUseralert.launch = false;
                    newUseralert.save((err, newUseralertStored) => {
                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                    });
                }
                else if(listAlerts12months[i].alert.receiver.type=="selectUsers"){
                    for(var j=0;j<listAlerts12months[i].alert.receiver.data.length;j++){
                        if(listAlerts12months[i].alert.receiver.data[j]==crypt.decrypt(params[1])){
                            let newUseralert = new Useralerts();
                            newUseralert.alertId = listAlerts12months[i].alert._id;
                            newUseralert.patientId = crypt.decrypt(params[1]);
                            newUseralert.state = "Not read";
                            newUseralert.snooze = "1"
                            newUseralert.showDate = dateToShowUserAlert;
                            newUseralert.launch = false;

                            newUseralert.save((err, newUseralertStored) => {
                                if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                //return res.status(200).send({message: 'New User Alert created', Useralerts: newUseralertStored})
                            });
                        }
                    }
                }
            }



            // creo las userAlerts para el resto de alertas (ni 6 ni 12 meses)
            // en este caso hay que comprobar si la launchDate de la alerta es menor que el dia de hoy
            //       - Si es menor -> ShowDate = hoy
            //       - Si es mayor -> ShowDate = launchDate
            for (var i =0;i<listOtherAlerts.length;i++){
                // veifico la fecha
                var dateToShowUserAlert
                if(Date.parse(listOtherAlerts[i].alert.launchDate)>Date.parse(date)){
                    dateToShowUserAlert=listOtherAlerts[i].alert.launchDate;
                }
                else{
                    dateToShowUserAlert=date;
                }

                // Evaluo el tipo de receiver:
                // - Si es broadcast creo la userAlert
                // - Si es selectUsers evaluo si el usuario esta entre la lista
                //   (Seguro que no está porque aun no se habia creado el paciente pero por prevenir)

                if(listOtherAlerts[i].alert.receiver.type=="broadcast"){
                    let newUseralert = new Useralerts();
                    newUseralert.alertId = listOtherAlerts[i].alert._id;
                    newUseralert.patientId = crypt.decrypt(params[1]);
                    newUseralert.state = "Not read";
                    newUseralert.snooze = "1"
                    newUseralert.showDate = dateToShowUserAlert;
                    newUseralert.launch = false;
                    newUseralert.save((err, newUseralertStored) => {
                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                    });
                }
                else if(listOtherAlerts[i].alert.receiver.type=="selectUsers"){
                    for(var j=0;j<listOtherAlerts[i].alert.receiver.data.length;j++){
                        if(listOtherAlerts[i].alert.receiver.data[j]==crypt.decrypt(params[1])){
                            let newUseralert = new Useralerts();
                            newUseralert.alertId = listOtherAlerts[i].alert._id;
                            newUseralert.patientId = crypt.decrypt(params[1]);
                            newUseralert.state = "Not read";
                            newUseralert.snooze = "1"
                            newUseralert.showDate = dateToShowUserAlert;
                            newUseralert.launch = false;

                            newUseralert.save((err, newUseralertStored) => {
                                if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                            });
                        }
                    }
                }
            }
        }

    });
    return res.status(200).send({message: "User Alerts created for patient "})
}


/**
 * @api {delete} https://health29.org/api/alerts/ Delete list of notifications/alerts of a group
 * @apiPrivate
 * @apiName deleteAlertByGroup
 * @apiDescription This method request the list of notifications/alerts of a group.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>
 *   this.http.delete('https://health29.org/api/alerts/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete list of notifications/alerts of a group ok');
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
 * @apiParam {Object} groupId The unique identifier of a group.
 * @apiSuccess {Object[]} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "message": 'deleted'
 *  }
 */
function deleteAlertByGroup (req, res){
    let groupId=req.params.groupId;
    Alerts.find({groupId:groupId}, (err, alertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(alertsfound){
            alertsfound.forEach(function(alertModel) {
                alertModel.remove(err => {
                    if(err) return res.status(202).send({message: 'error, not found'})
                    return res.status(200).send({message: 'deleted'})
                })
            });

        }else{
            return res.status(202).send({message: 'error, not found'})
        }
    });

}


/**
 * @api {get} https://health29.org/api/alerts/alertId/ Request notification/alert by identifier
 * @apiName getAlertById
 * @apiPrivate
 * @apiDescription This method request a notification/alert by its identifier.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <alertId>
 *   this.http.get('https://health29.org/api/alerts/alertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get a notification/alert by its identifier ok');
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
 * @apiParam {Object} alertId The unique identifier of a notification/alert.
 * @apiSuccess {Object} Result Returns a notification/alert by its identifier.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *      {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 *
 */

function getAlertById (req, res){
    let alertId=req.params.alertId;
    if(alertId!=undefined){
        Alerts.findById(alertId,{"_id" : false}, (err, alertsfound) => {
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            return res.status(200).send(alertsfound)
        });
    }


}

/**
 * @api {delete} https://health29.org/api/alerts/alertId/ Delete notification/alert by identifier
 * @apiName deleteAlertById
 * @apiPrivate
 * @apiDescription This method deletes a notification/alert by its identifier.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <alertId>
 *   this.http.delete('https://health29.org/api/alerts/alertId/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete a notification/alert by its identifier ok');
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
 * @apiParam {Object} alertId The unique identifier of a notification/alert.
 * @apiSuccess {Object} Result Returns information about the execution.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "message": 'deleted'
 *  }
 */
function deleteAlertById (req, res){
    let alertId=req.params.alertId;
    Alerts.findById(alertId, (err, alertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(alertsfound){
            alertsfound.remove(err => {
                if(err) return res.status(202).send({message: 'error, not found'})
                return res.status(200).send({message: 'deleted'})
            })
        }else{
            return res.status(202).send({message: 'error, not found'})
        }
    });

}

/**
 * @api {post} https://health29.org/api/alerts/alertAndUserAlerts/selectedUser/ Create new alert and user alerts for selected users
 * @apiPrivate
 * @apiName saveAlertAndUpdateUserAlertsForSelectedUsers
 * @apiDescription This method creates new alert and only for the list of selected users, creates the user alerts too.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupId = <groupId>
 *   var body = {users: [<usersIds], alert: <alert_data>}
 *   this.http.post('https://health29.org/api/alerts/alertAndUserAlerts/selectedUser/'+groupId,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert and user alerts for selected users ok');
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
 * @apiParam {String} groupId The unique identifier for the group.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'New Alert and new user alerts created for users',
 * 		}
 *
 */
async function saveAlertAndUpdateUserAlertsForSelectedUsers(req,res){
    let groupId=req.params.groupid;

    let list=req.body.users;
    let alert = req.body.alert;

    //let list = patientIdsList;
    let type = alert.type;
    var patientIdsList=[]
    var patientIdsListDecrypt=[]
    for(var i =0;i<list.length;i++){
        if((list[i]!=undefined)){
            patientIdsListDecrypt.push(crypt.decrypt(list[i]));
            patientIdsList.push(list[i]);
        }
    }

    let newAlert = new Alerts();
    //newAlert.group = alert.group;
    newAlert.groupId = groupId;
    newAlert.type = alert.type;
    newAlert.identifier = alert.identifier;
    newAlert.translatedName = alert.translatedName;
    newAlert.launchDate = alert.launchDate;
    newAlert.endDate = alert.endDate;
    newAlert.url = alert.url;
    newAlert.role = alert.role;
    newAlert.color = alert.color;
    newAlert.logo = alert.logo;
    newAlert.importance = alert.importance;
    newAlert.receiver= {type:"selectUsers",data:patientIdsList};
    //newAlert.createdBy = alert.createdBy;

    newAlert.save((err, newAlertStored) => {
        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
    });

    for(var i =0;i<patientIdsListDecrypt.length;i++){
        if(patientIdsListDecrypt[i]!=undefined){
            // Crear nueva UserAlert para todos los pacientes de la lista
            await Patient.findById(patientIdsListDecrypt[i], async function (err, patientFound) {
                if(patientFound){
                    // Si el usuario esta suscrito a todas las alertas, se guardan las user alerts
                    if(patientFound.subscriptionToGroupAlerts==true){
                        //let patientId=patients[j]._id;
                        let patientId=patientFound._id;
                        let newUseralert = new Useralerts();
                        newUseralert.alertId = newAlert._id;
                        newUseralert.patientId = patientId;
                        newUseralert.state = "Not read";
                        newUseralert.snooze = "1"
                        newUseralert.showDate = newAlert.launchDate;
                        newUseralert.launch = false;

                        await newUseralert.save((err, newUseralertStored) => {
                            if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                        });
                    }
                    // Si el usuario no esta suscrito a las alertas de grupo, se guardan las user alerts que no sean de este tipo
                    else{
                        await Group.findById(groupId,async function (err,groupFound){
                            if(groupFound){
                                if(alert.type!=groupFound.name){
                                    //let patientId=patients[j]._id;
                                    let patientId=patientFound._id;
                                    let newUseralert = new Useralerts();
                                    newUseralert.alertId = newAlert._id;
                                    newUseralert.patientId = patientId;
                                    newUseralert.state = "Not read";
                                    newUseralert.snooze = "1"
                                    newUseralert.showDate = newAlert.launchDate;
                                    newUseralert.launch = false;

                                    await newUseralert.save((err, newUseralertStored) => {
                                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                    });

                                }
                            }
                        })
                    }
                }
            });
        }

    }
    return res.status(200).send({message: 'New Alert and new user alerts created for users'})



}

/**
 * @api {post} https://health29.org/api/alerts/alertAndUserAlerts/organization/ Create new alert and user alerts for organization users
 * @apiPrivate
 * @apiName saveAlertAndUpdateUserAlertsForOrganization
 * @apiDescription This method creates new alert and only for the for organization users, creates the user alerts too.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>-code-<patientId>
 *   var body = {users: [<usersIds], alert: <alert_data>}
 *   this.http.post('https://health29.org/api/alerts/alertAndUserAlerts/organization/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert and user alerts for organization users ok');
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
 * @apiParam {String} groupId-code-patientId The unique identifier for the group and the patient.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'New Alert and new user alerts created for users',
 * 		}
 *
 */
async function saveAlertAndUpdateUserAlertsForOrganization(req,res){
    let params=req.params.groupIdAndpatientId;
    params = params.split("-code-")
    let groupId=params[0];
    let list=req.body.users;
    let subgroup=params[1];

    //let list = patientIdsList;
    let alert = req.body.alert;
    let type = alert.type;
    var patientIdsList=[]
    var patientIdsListDecrypt=[]
    if(list.length>1){
      for(var i =0;i<list.length;i++){
          if((list[i]!=undefined)){
              patientIdsListDecrypt.push(crypt.decrypt(list[i]));
              patientIdsList.push(list[i]);
          }
      }
    }

    let newAlert = new Alerts();
    //newAlert.group = alert.group;
    newAlert.groupId = groupId;
    newAlert.type = alert.type;
    newAlert.identifier = alert.identifier;
    newAlert.translatedName = alert.translatedName;
    newAlert.launchDate = alert.launchDate;
    newAlert.endDate = alert.endDate;
    newAlert.url = alert.url;
    newAlert.role = alert.role;
    newAlert.color = alert.color;
    newAlert.logo = alert.logo;
    newAlert.importance = alert.importance;
    newAlert.receiver= {type:"organization", subgroup:subgroup, data:patientIdsList};
    //newAlert.createdBy = alert.createdBy;

    newAlert.save((err, newAlertStored) => {
        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
    });


    for(var i =0;i<patientIdsListDecrypt.length;i++){
        if(patientIdsListDecrypt[i]!=undefined){
            // Crear nueva UserAlert para todos los pacientes de la lista
            await Patient.findById(patientIdsListDecrypt[i], async function (err, patientFound) {
                if(patientFound){
                    // Si el usuario esta suscrito a todas las alertas, se guardan las user alerts
                    if(patientFound.subscriptionToGroupAlerts==true){
                        //let patientId=patients[j]._id;
                        let patientId=patientFound._id;
                        let newUseralert = new Useralerts();
                        newUseralert.alertId = newAlert._id;
                        newUseralert.patientId = patientId;
                        newUseralert.state = "Not read";
                        newUseralert.snooze = "1"
                        newUseralert.showDate = newAlert.launchDate;
                        newUseralert.launch = false;

                        await newUseralert.save((err, newUseralertStored) => {
                            if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                        });
                    }
                    // Si el usuario no esta suscrito a las alertas de grupo, se guardan las user alerts que no sean de este tipo
                    else{
                        await Group.findById(groupId,async function (err,groupFound){
                            if(groupFound){
                                if(alert.type!=groupFound.name){
                                    //let patientId=patients[j]._id;
                                    let patientId=patientFound._id;
                                    let newUseralert = new Useralerts();
                                    newUseralert.alertId = newAlert._id;
                                    newUseralert.patientId = patientId;
                                    newUseralert.state = "Not read";
                                    newUseralert.snooze = "1"
                                    newUseralert.showDate = newAlert.launchDate;
                                    newUseralert.launch = false;

                                    await newUseralert.save((err, newUseralertStored) => {
                                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                    });

                                }
                            }
                        })
                    }
                }
            });
        }

    }
    return res.status(200).send({message: 'New Alert and new user alerts created for users'})



}

/**
 * @api {post} https://health29.org/api/alerts/alertAndUserAlerts/allUser/ Create new alert and user alerts for all users of the group
 * @apiPrivate
 * @apiName Create new alert and user alerts for all users of the group
 * @apiDescription This method creates new alert and, for all users of the group, creates the user alerts too.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <groupId>
 *   var body = <alert_data>
 *   this.http.post('https://health29.org/api/alerts/alertAndUserAlerts/allUser/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert and user alerts for all users of the group ok');
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
 * @apiParam {String} groupId The unique identifier for the group.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'New Alert and new user alerts created for all users of the group',
 * 		}
 *
 */
function saveAlertAndUpdateUserAlertsBroadcast(req,res){
    let groupId=req.params.groupId;
    let newAlert = new Alerts();
    //newAlert.group = req.body.group;
    newAlert.groupId = groupId;
    newAlert.type = req.body.type;
    if(req.body.identifier!=undefined){
        newAlert.identifier = req.body.identifier;
    }
    //
    newAlert.translatedName = req.body.translatedName;
    newAlert.launchDate = req.body.launchDate;
    //newAlert.endDate = req.body.endDate;
    newAlert.url = req.body.url;
    //newAlert.role = req.body.role;
    //newAlert.color = req.body.color;
    //newAlert.logo = req.body.logo;
    //newAlert.importance = req.body.importance;
    newAlert.receiver= {type:"broadcast",data:[]};
    //newAlert.createdBy = req.body.createdBy;

    newAlert.save((err, newAlertStored) => {
        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
    });

    Group.findById(groupId,function(err,groupfound){
        User.find({group:groupfound.name},async function(err,userFound){
            for(var i =0; i<userFound.length;i++){
                if(userFound[i]!=undefined){
                    let userId = userFound[i]._id;

                    // Crear nueva UserAlert para todos los pacientes del grupo
                    await Patient.findOne({"createdBy": userId}, (err, patientFound)=> {
                        if(patientFound){
                            // Si es de tipo 6/12 meses evaluo la fecha del ultimo login
                            var showDate
                            if(userFound[i].lastLogin!=null){
                                if(Date.parse(userFound[i].lastLogin)>=Date.parse(newAlert.launchDate)){
                                    var monthOfLogin=userFound[i].lastLogin.getMonth();
                                    var numMonths
                                    if(newAlert.type=='6months'){
                                        if((newAlert.identifier=='1')||(newAlert.identifier=='2')){
                                            numMonths=6;
                                        }
                                        else{
                                            numMonths=6+(Number(newAlert.identifier)-2);
                                        }
                                    }
                                    else if(newAlert.type=='12months'){
                                        if((newAlert.identifier=='2')){
                                            numMonths=12;
                                        }
                                        else if(Number(newAlert.identifier)>2){
                                            numMonths=12+(Number(newAlert.identifier)-1);
                                        }
                                        else{
                                            numMonths=12;
                                        }

                                    }
                                    else{
                                        numMonths=0;
                                    }
                                    showDate=new Date(userFound[i].lastLogin);
                                    showDate.setMonth(monthOfLogin+numMonths)
                                }
                                else{
                                    var monthOfLogin=newAlert.launchDate.getMonth();
                                    var numMonths=0;
                                    if(newAlert.type=='6months'){
                                        if((newAlert.identifier=='1')||(newAlert.identifier=='2')){
                                            numMonths=6;
                                        }
                                        else{
                                            numMonths=6+(Number(newAlert.identifier)-2);
                                        }
                                    }
                                    else if(newAlert.type=='12months'){
                                        if((newAlert.identifier=='2')){
                                            numMonths=12;
                                        }
                                        else if(Number(newAlert.identifier)>2){
                                            numMonths=12+(Number(newAlert.identifier)-1);
                                        }
                                        else{
                                            numMonths=12;
                                        }

                                    }
                                    else{
                                        numMonths=0;
                                    }
                                    showDate=new Date(newAlert.launchDate);
                                    showDate.setMonth(Number(monthOfLogin)+Number(numMonths))

                                }
                            }
                            else{
                                var monthOfLogin=newAlert.launchDate.getMonth();
                                var numMonths=0;
                                if(newAlert.type=='6months'){
                                    if((newAlert.identifier=='1')||(newAlert.identifier=='2')){
                                        numMonths=6;
                                    }
                                    else{
                                        numMonths=6+(Number(newAlert.identifier)-2);
                                    }
                                }
                                else if(newAlert.type=='12months'){
                                    if((newAlert.identifier=='2')){
                                        numMonths=12;
                                    }
                                    else if(Number(newAlert.identifier)>2){
                                        numMonths=12+(Number(newAlert.identifier)-1);
                                    }
                                    else{
                                        numMonths=12;
                                    }

                                }
                                else{
                                    numMonths=0;
                                }
                                showDate=new Date(newAlert.launchDate);
                                showDate.setMonth(Number(monthOfLogin)+Number(numMonths))

                            }


                            // Si el usuario esta subscrito a las alertas de grupo:
                            if(patientFound.subscriptionToGroupAlerts==true){
                                let newUseralert = new Useralerts();
                                newUseralert.alertId = newAlert._id;
                                newUseralert.patientId = patientFound._id;
                                newUseralert.state = "Not read";
                                newUseralert.snooze = "1"
                                newUseralert.showDate = showDate;
                                newUseralert.launch = false;
                                newUseralert.save((err, newUseralertStored) => {
                                    if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                });
                            }
                            // Si el usuario NO esta subscrito a las alertas de grupo:
                            else if(patientFound.subscriptionToGroupAlerts==false){
                                if(req.body.type!=groupfound.name){
                                    let newUseralert = new Useralerts();
                                    newUseralert.alertId = newAlert._id;
                                    newUseralert.patientId = patientFound._id;
                                    newUseralert.state = "Not read";
                                    newUseralert.snooze = "1"
                                    newUseralert.showDate = showDate;
                                    newUseralert.launch = false;
                                    newUseralert.save((err, newUseralertStored) => {
                                        if (err) return res.status(500).send({message: `Failed to save in the database: ${err} `})
                                    });
                                }
                            }
                        }
                    });

                }

            }
            return res.status(200).send({message: 'New Alert and new user alerts created for all users of the group'})
        })
    });




}

/**
 * @api {post} https://health29.org/api/alerts/updateTranslations/ Update alert translations
 * @apiPrivate
 * @apiName updateAlertTranslations
 * @apiDescription This method updates alert translations.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <alertId>
 *   var body = <alert_data>
 *   this.http.post('https://health29.org/api/alerts/updateTranslations/'+params,body)
 *    .subscribe( (res : any) => {
 *      console.log('Create new alert and user alerts for all users of the group ok');
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
 * @apiParam {String} alertId The unique identifier for the alert.
 * @apiSuccess {Object} Result Returns the information about the execution and the alert updated
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 	{
 * 		 message: 'Alert updated',
 *       Alerts:
 *       {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 * 	}
 *
 */
function updateAlertTranslations(req,res){
    let alertId=req.params.alertId;
    let titleTranslation=req.body.titleTranslation;
    let textTranslation=req.body.textTranslation;
    let ListurlNameTranslation=req.body.urlNameTranslation;
    let langCode=req.body.langCode;

    // Actualizo la info de la alerta añadiendo en los campos de traducciones el texto, el titulo y el identificador de la url
    Alerts.findById(alertId,(err,alertFound)=>{
        for(var i =0;i<alertFound.translatedName.length;i++){
            if(alertFound.translatedName[i].code==langCode){
                alertFound.translatedName[i].title=titleTranslation;
                alertFound.translatedName[i].translation=textTranslation;
            }
        }
        for(var i =0;i<alertFound.url.length;i++){
            // Busco la url cuyo url sea igual que la que entra
            for(var k=0;k<ListurlNameTranslation.length;k++){
                if(ListurlNameTranslation[k].url==alertFound.url[i].url){
                    // Busco ahora el name con el code = langCode
                    for(var j=0;j<alertFound.url[i].name.length;j++){
                        if(alertFound.url[i].name[j].code==langCode){
                            // Actualizo el title de ese code
                            alertFound.url[i].name[j].translation=ListurlNameTranslation[k].translation;
                        }
                    }
                }
            }
        }
        Alerts.findByIdAndUpdate(alertId, alertFound, (err,alertsUpdated) => {
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            return res.status(200).send({message: 'Alert updated', Alerts: alertsUpdated})
        })

    });

}

/**
 * @api {delete} https://health29.org/api/alerts/alertAndUserAlerts/ Delete alert and user alerts associated
 * @apiPrivate
 * @apiName deleteAlertByIdAndUpdateUserAlerts
 * @apiDescription This method deletes alert and user alerts associated.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <alertId>
 *   this.http.delete('https://health29.org/api/alerts/alertAndUserAlerts/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Delete alert and user alerts associated ok');
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
 * @apiParam {String} alertId The unique identifier for the alert.
 * @apiSuccess {Object} Result Returns the information about the execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 		{
 * 			"message": 'deleted',
 * 		}
 *
 */
function deleteAlertByIdAndUpdateUserAlerts (req, res){
    let alertId=req.params.alertId;
    Alerts.findById(alertId, (err, alertsfound) => {
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(alertsfound){
            alertsfound.remove(err => {
                if(err) return res.status(202).send({message: 'error, not found'})
                //return res.status(200).send({message: 'deleted'})
            })
            //Remove the userAlerts related with this alert id
            Useralerts.find({alertId:alertId}, (err, useralertsfound) => {
                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                if(useralertsfound){
                    useralertsfound.forEach(function(useralertModel) {
                        useralertModel.remove(err => {
                            if(err) return res.status(202).send({message: 'error, not found'})
                            //return res.status(200).send({message: 'deleted user alerts '})
                        })
                    });
                    return res.status(200).send({message: 'deleted'})

                }else{
                    return res.status(202).send({message: 'error, not found'})
                }
            });
        }else{
            return res.status(202).send({message: 'error, not found'})
        }

    });

}


function getUserAlertsNotReadForPatientIdAndLang(req,res){
    let patientIdAndLang=req.params.patientIdAndLang.split("-code-");
    let patientId=crypt.decrypt(patientIdAndLang[0]);
    let lang = patientIdAndLang[1];
    var date=new Date();
    var listAlertsNotRead = [];

    Useralerts.find({patientId:patientId,state:"Not read"},async function(err,userAlertsFound){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(userAlertsFound){
            for(var i=0;i<userAlertsFound.length;i++){
                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if(alertFound){
                            // Comprobar si tiene endDate configurado
                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                    // Compruebo el idioma
                                    for(var j=0;j<alertFound.translatedName.length;j++){
                                        if(alertFound.translatedName[j].code==lang){
                                            if(alertFound.translatedName[j].title != ""){
                                                listAlertsNotRead.unshift(alertFound);
                                            }
                                        }
                                    }

                                }
                            }
                            // Si no tiene endDate configurado
                            else{
                                // Compruebo el idioma
                                for(var j=0;j<alertFound.translatedName.length;j++){
                                    if(alertFound.translatedName[j].code==lang){
                                        if(alertFound.translatedName[j].title != ""){
                                            listAlertsNotRead.unshift(alertFound);
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
            return res.status(200).send(listAlertsNotRead);
        }
        else{
            return res.status(200).send(listAlertsNotRead);
        }
    })

}


/**
 * @api {get} https://health29.org/api/alerts/alertsNotReadAndTranslatedName/ Request list alerts of patient not read
 * @apiName getAlertsNotReadAndTranslatedName
 * @apiDescription This method request the list of specific alerts of a patient not read and in selected language.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>-code-<lang>
 *   this.http.get('https://health29.org/api/alerts/alertsNotReadAndTranslatedName/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of specific alerts of a patient not read and in selected language ok');
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
 * @apiParam {String} patientId-code-lang The unique identifier of a patient and the code of the language selected.
 * @apiSuccess {Object[]} Result Returns list of specific alerts of a patient not read and in selected language
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 * 	]
 *
 *
 */
function getAlertsNotReadAndTranslatedName(req,res){
    let patientIdAndLang=req.params.patientIdAndLang;
    var listParams = patientIdAndLang.split("-code-")
    let patientId=crypt.decrypt(listParams[0]);
    let lang=listParams[1];
    let listAlertsNotRead=[];
    var date= new Date();
    var sectionsAndProms=[]
    // GET PROMS
    Patient.findById(patientId,(err,patientFound)=>{
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(patientFound){
            User.findById(patientFound.createdBy,(err,userFound)=>{
                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                if (userFound){
                    Group.findOne({name:userFound.group},(err,groupFound)=>{
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if(groupFound){
                            StructureProm.findOne({"createdBy": groupFound.id, "lang": lang}, {"createdBy" : false }, async function (err, structureProm) {
                                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                if(structureProm){
                                    var resul = {_id: structureProm._id, lang: structureProm.lang, data: []};
                                    for (var i = 0; i < structureProm.data.length; i++) {
                                        if(structureProm.data[i]!=undefined){
                                            if(structureProm.data[i].section.enabled){
                                                var tempDataPoints = [];
                                                for (var j = 0; j < structureProm.data[i].promsStructure.length; j++) {
                                                    if(structureProm.data[i].promsStructure[j].structure.enabled){
                                                        tempDataPoints.push({data: structureProm.data[i].promsStructure[j].data, structure: structureProm.data[i].promsStructure[j].structure});
                                                    }
                                                }
                                                var anchor="";
                                                await PromSection.findById(structureProm.data[i].section._id, (err,promSectionFound)=>{
                                                    if(promSectionFound){
                                                        anchor=promSectionFound.name;
                                                    }
                                                })
                                                resul.data.push({section: structureProm.data[i].section,anchor: anchor,promsStructure: tempDataPoints});

                                            }
                                        }

                                    }
                                    sectionsAndProms=resul;
                                    // FIND ALERTS AND CHECK IF THE URL ANCHOR IS IN PROM SECTIONS
                                    Useralerts.find({patientId:patientId,state:"Not read"},async function(err,userAlertsFound){
                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                        if(userAlertsFound){

                                            for(var i=0;i<userAlertsFound.length;i++){
                                                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                                                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                                        //CASO 1 ENCUENTRA LA ALERTA:
                                                        if(alertFound){
                                                            // Comprobar si tiene endDate configurado

                                                            //CASO 1.a TIENE ENDDATE CONFIGURADO
                                                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                                                //CASO 1.a.1 ENDATE OK
                                                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                                                    // Compruebo el idioma

                                                                    // Compruebo el idioma
                                                                    //RECORRO IDIOMAS
                                                                    for(var j=0;j<alertFound.translatedName.length;j++){

                                                                        // SI ESTA EL IDIOMA DEL USUARIO
                                                                        if(alertFound.translatedName[j].code==lang){
                                                                            // SI TIENE TITULO:
                                                                            if(alertFound.translatedName[j].title != ""){
                                                                                // Comprobamos si tiene anchor
                                                                                var urlName=[];
                                                                                var urlWithAnchor=false;
                                                                                var anchorFound=false;

                                                                                // RECORREMOS LAS URL
                                                                                for (var k=0;k<alertFound.url.length;k++){
                                                                                    // Compruebo si hay ancla de CoD y si este esta en la lista de secciones para guardar o no la alerta
                                                                                    anchorFound=false;
                                                                                    urlWithAnchor=false;

                                                                                    // SI TIENE ANCLA
                                                                                    if(alertFound.url[k].url.indexOf('#')>-1){

                                                                                        // SI EL ANCLA ES COD
                                                                                        if(alertFound.url[k].url.split('#')[0]=="/user/clinicinfo/courseofthedisease"){
                                                                                            urlWithAnchor=true;

                                                                                            // RECORRO LOS PROMS PAR VER SI EXISTE EL ANCLA
                                                                                            for(var l=0;l<sectionsAndProms.data.length;l++){

                                                                                                // SI EXISTE EL ANCLA
                                                                                                if(alertFound.url[k].url.split('#')[1]==sectionsAndProms.data[l].anchor){

                                                                                                    // MIRO LOS NOMBRES DE LA URL
                                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                                            if(alertFound.url[k].name[m].translation!=''){
                                                                                                                urlName.push(alertFound.url[k].name[m].translation);

                                                                                                                anchorFound=true;
                                                                                                            }

                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                        }

                                                                                        // SI EL ANCLA NO ES DE COD
                                                                                        else{
                                                                                            urlWithAnchor=false;
                                                                                            for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                if(alertFound.url[k].name[m].code==lang){
                                                                                                    if(alertFound.url[k].name[m].translation!=''){
                                                                                                        urlName.push(alertFound.url[k].name[m].translation);
                                                                                                        anchorFound=true;
                                                                                                    }

                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    // SI NO TIENE ANCLA
                                                                                    else{
                                                                                        urlWithAnchor=false;
                                                                                        for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                            if(alertFound.url[k].name[m].code==lang){
                                                                                                if(alertFound.url[k].name[m].translation!=''){
                                                                                                    urlName.push(alertFound.url[k].name[m].translation);
                                                                                                    anchorFound=true;
                                                                                                }

                                                                                            }
                                                                                        }
                                                                                    }

                                                                                }
                                                                                // TERMINO DE RECORRER LAS URL
                                                                                if((urlWithAnchor==true)&&(anchorFound==true)){
                                                                                    //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                    listAlertsNotRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                    //continue;
                                                                                }
                                                                                else if(urlWithAnchor==false){
                                                                                    //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                    listAlertsNotRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                    //continue;
                                                                                }
                                                                            } // FIN TITULO
                                                                        } // FIN CODE LANG
                                                                    }// FIN RECORRER IDIOMAS

                                                                }// FIN END DATE OK
                                                            } // FIN END DATE CONFIGURADO

                                                            // SI NO TIENE ENDDATE
                                                            else{
                                                                // Compruebo el idioma
                                                                //RECORRO IDIOMAS
                                                                for(var j=0;j<alertFound.translatedName.length;j++){

                                                                    // SI ESTA EL IDIOMA DEL USUARIO
                                                                    if(alertFound.translatedName[j].code==lang){
                                                                        // SI TIENE TITULO:
                                                                        if(alertFound.translatedName[j].title != ""){
                                                                            // Comprobamos si tiene anchor
                                                                            var urlName=[];
                                                                            var urlWithAnchor=false;
                                                                            var anchorFound=false;

                                                                            // RECORREMOS LAS URL
                                                                            for (var k=0;k<alertFound.url.length;k++){
                                                                                // Compruebo si hay ancla de CoD y si este esta en la lista de secciones para guardar o no la alerta
                                                                                anchorFound=false;
                                                                                urlWithAnchor=false;

                                                                                // SI TIENE ANCLA
                                                                                if(alertFound.url[k].url.indexOf('#')>-1){

                                                                                    // SI EL ANCLA ES COD
                                                                                    if(alertFound.url[k].url.split('#')[0]=="/user/clinicinfo/courseofthedisease"){
                                                                                        urlWithAnchor=true;

                                                                                        // RECORRO LOS PROMS PAR VER SI EXISTE EL ANCLA
                                                                                        for(var l=0;l<sectionsAndProms.data.length;l++){

                                                                                            // SI EXISTE EL ANCLA
                                                                                            if(alertFound.url[k].url.split('#')[1]==sectionsAndProms.data[l].anchor){

                                                                                                // MIRO LOS NOMBRES DE LA URL
                                                                                                for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                    if(alertFound.url[k].name[m].code==lang){
                                                                                                        if(alertFound.url[k].name[m].translation!=''){
                                                                                                            urlName.push(alertFound.url[k].name[m].translation);

                                                                                                            anchorFound=true;
                                                                                                        }

                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }

                                                                                    }

                                                                                    // SI EL ANCLA NO ES DE COD
                                                                                    else{
                                                                                        urlWithAnchor=false;
                                                                                        for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                            if(alertFound.url[k].name[m].code==lang){
                                                                                                if(alertFound.url[k].name[m].translation!=''){
                                                                                                    urlName.push(alertFound.url[k].name[m].translation);
                                                                                                    anchorFound=true;
                                                                                                }

                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                // SI NO TIENE ANCLA
                                                                                else{
                                                                                    urlWithAnchor=false;
                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                            if(alertFound.url[k].name[m].translation!=''){
                                                                                                urlName.push(alertFound.url[k].name[m].translation);
                                                                                                anchorFound=true;
                                                                                            }

                                                                                        }
                                                                                    }
                                                                                }

                                                                            }
                                                                            // TERMINO DE RECORRER LAS URL
                                                                            if((urlWithAnchor==true)&&(anchorFound==true)){
                                                                                //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                listAlertsNotRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                //continue;
                                                                            }
                                                                            else if(urlWithAnchor==false){
                                                                                //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                listAlertsNotRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                //continue;
                                                                            }
                                                                        } // FIN TITULO
                                                                    } // FIN CODE LANG
                                                                }// FIN RECORRER IDIOMAS

                                                            }
                                                        } //FIN ALERT FOUND
                                                    })
                                                }
                                            }
                                            return res.status(200).send(listAlertsNotRead);
                                        }
                                        else{
                                            return res.status(200).send(listAlertsNotRead);
                                        }
                                    })
                                }
                                else{
                                    Useralerts.find({patientId:patientId,state:"Not read"},async function(err,userAlertsFound){
                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                        if(userAlertsFound){
                                            for(var i=0;i<userAlertsFound.length;i++){
                                                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                                                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                                        if(alertFound){
                                                            // Comprobar si tiene endDate configurado
                                                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                                                    // Compruebo el idioma
                                                                    for(var j=0;j<alertFound.translatedName.length;j++){
                                                                        if(alertFound.translatedName[j].code==lang){
                                                                            if(alertFound.translatedName[j].title != ""){
                                                                                var urlName=[];
                                                                                for (var k=0;k<alertFound.url.length;k++){
                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                            urlName.push(alertFound.url[k].name[m].translation);
                                                                                            anchorFound=true;
                                                                                        }
                                                                                    }
                                                                                }
                                                                                listAlertsNotRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                            }
                                                            // Si no tiene endDate configurado
                                                            else{
                                                                // Compruebo el idioma
                                                                for(var j=0;j<alertFound.translatedName.length;j++){
                                                                    if(alertFound.translatedName[j].code==lang){
                                                                        if(alertFound.translatedName[j].title != ""){
                                                                            var urlName=[];
                                                                            for (var k=0;k<alertFound.url.length;k++){
                                                                                for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                    if(alertFound.url[k].name[m].code==lang){
                                                                                        urlName.push(alertFound.url[k].name[m].translation);
                                                                                    }
                                                                                }
                                                                            }
                                                                            listAlertsNotRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            return res.status(200).send(listAlertsNotRead);
                                        }
                                        else{
                                            return res.status(200).send(listAlertsNotRead);
                                        }
                                    })

                                }


                            })

                        }

                    })
                }

            })
        }
    })
}

/**
 * @api {get} https://health29.org/api/alerts/alertsReadAndTranslatedName/ Request list alerts of a patient read
 * @apiName getAlertsReadAndTranslatedName
 * @apiDescription This method request the list of specific alerts of a patient read and in selected language.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>-code-<lang>
 *   this.http.get('https://health29.org/api/alerts/alertsReadAndTranslatedName/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of specific alerts of a patient read and in selected language ok');
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
 * @apiParam {String} patientId-code-lang The unique identifier of a patient and the code of the language selected.
 * @apiSuccess {Object[]} Result Returns list of specific alerts of a patient not read and in selected language
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 *      {
 *      	"_id" : <alertId>,
 *      	"endDate" : null,
 *      	    "url" : [
 *      	        {
 *      	            "name" : [
 *      	                {
 *      	                    "translation" : "Take me to respiratory section",
 *      	                    "code" : "en"
 *      	                },
 *      	                {
 *      	                    "translation" : "Llévame a la sección respiratoria",
 *      	                    "code" : "es"
 *      	                },
 *      	                {
 *      	                    "translation" : "Ga naar de luchtwegen",
 *      	                    "code" : "nl"
 *      	                }
 *      	            ],
 *      	            "url" : "/user/clinicinfo/courseofthedisease#Respiratory condition"
 *      	        },
 *      	    ],
 *      	"launchDate" : {
 *      	    "$date" : 1576796400000
 *      	},
 *      	"translatedName" : [
 *      	    {
 *      	        "translation" : "It's important to follow up on your pulmonary function: have you recently visited your pulmonologist?",
 *      	        "title" : "Visits to pulmonologist",
 *      	        "code" : "en"
 *      	    },
 *      	    {
 *      	        "translation" : "Es importante hacer un seguimiento de tu función pulmonar: ¿has visitado recientemente a tu neumólogo?",
 *      	        "title" : "Visitas al neumólogo",
 *      	        "code" : "es"
 *      	    }
 *      	],
 *      	"identifier" : "1",
 *      	"type" : "6months",
 *      	"groupId" : <groupId>,
 *      	"importance" : "",
 *      	"logo" : "",
 *      	"color" : "",
 *      	"role" : "User",
 *      	"receiver" : {
 *      	    "type" : "broadcast",
 *      	    "data" : [ ]
 *      	}
 *      }
 * 	]
 *
 *
 */

function getAlertsReadAndTranslatedName(req,res){
    let patientIdAndLang=req.params.patientIdAndLang;
    var listParams = patientIdAndLang.split("-code-")
    let patientId=crypt.decrypt(listParams[0]);
    let lang=listParams[1];
    let listAlertsRead=[];
    var date= new Date();
    var sectionsAndProms=[]
    // GET PROMS
    Patient.findById(patientId,(err,patientFound)=>{
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(patientFound){
            User.findById(patientFound.createdBy,(err,userFound)=>{
                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                if (userFound){
                    Group.findOne({name:userFound.group},(err,groupFound)=>{
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if(groupFound){
                            StructureProm.findOne({"createdBy": groupFound.id, "lang": lang}, {"createdBy" : false }, async function (err, structureProm) {
                                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                if(structureProm){
                                    var resul = {_id: structureProm._id, lang: structureProm.lang, data: []};
                                    for (var i = 0; i < structureProm.data.length; i++) {
                                        if(structureProm.data[i]!=undefined){
                                            if(structureProm.data[i].section.enabled){
                                                var tempDataPoints = [];
                                                for (var j = 0; j < structureProm.data[i].promsStructure.length; j++) {
                                                    if(structureProm.data[i].promsStructure[j].structure.enabled){
                                                        tempDataPoints.push({data: structureProm.data[i].promsStructure[j].data, structure: structureProm.data[i].promsStructure[j].structure});
                                                    }
                                                }
                                                var anchor="";
                                                await PromSection.findById(structureProm.data[i].section._id, (err,promSectionFound)=>{
                                                    if(promSectionFound){
                                                        anchor=promSectionFound.name;
                                                    }
                                                })
                                                resul.data.push({section: structureProm.data[i].section,anchor: anchor,promsStructure: tempDataPoints});

                                            }
                                        }

                                    }
                                    sectionsAndProms=resul;
                                    // FIND ALERTS AND CHECK IF THE URL ANCHOR IS IN PROM SECTIONS
                                    Useralerts.find({patientId:patientId,state:"Read"},async function(err,userAlertsFound){
                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                        if(userAlertsFound){

                                            for(var i=0;i<userAlertsFound.length;i++){
                                                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                                                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                                        //CASO 1 ENCUENTRA LA ALERTA:
                                                        if(alertFound){
                                                            // Comprobar si tiene endDate configurado

                                                            //CASO 1.a TIENE ENDDATE CONFIGURADO
                                                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                                                //CASO 1.a.1 ENDATE OK
                                                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                                                    // Compruebo el idioma

                                                                    // Compruebo el idioma
                                                                    //RECORRO IDIOMAS
                                                                    for(var j=0;j<alertFound.translatedName.length;j++){

                                                                        // SI ESTA EL IDIOMA DEL USUARIO
                                                                        if(alertFound.translatedName[j].code==lang){
                                                                            // SI TIENE TITULO:
                                                                            if(alertFound.translatedName[j].title != ""){
                                                                                // Comprobamos si tiene anchor
                                                                                var urlName=[];
                                                                                var urlWithAnchor=false;
                                                                                var anchorFound=false;

                                                                                // RECORREMOS LAS URL
                                                                                for (var k=0;k<alertFound.url.length;k++){
                                                                                    // Compruebo si hay ancla de CoD y si este esta en la lista de secciones para guardar o no la alerta
                                                                                    anchorFound=false;
                                                                                    urlWithAnchor=false;

                                                                                    // SI TIENE ANCLA
                                                                                    if(alertFound.url[k].url.indexOf('#')>-1){

                                                                                        // SI EL ANCLA ES COD
                                                                                        if(alertFound.url[k].url.split('#')[0]=="/user/clinicinfo/courseofthedisease"){
                                                                                            urlWithAnchor=true;

                                                                                            // RECORRO LOS PROMS PAR VER SI EXISTE EL ANCLA
                                                                                            for(var l=0;l<sectionsAndProms.data.length;l++){

                                                                                                // SI EXISTE EL ANCLA
                                                                                                if(alertFound.url[k].url.split('#')[1]==sectionsAndProms.data[l].anchor){

                                                                                                    // MIRO LOS NOMBRES DE LA URL
                                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                                            if(alertFound.url[k].name[m].translation!=''){
                                                                                                                urlName.push(alertFound.url[k].name[m].translation);

                                                                                                                anchorFound=true;
                                                                                                            }

                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }

                                                                                        }

                                                                                        // SI EL ANCLA NO ES DE COD
                                                                                        else{
                                                                                            urlWithAnchor=false;
                                                                                            for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                if(alertFound.url[k].name[m].code==lang){
                                                                                                    if(alertFound.url[k].name[m].translation!=''){
                                                                                                        urlName.push(alertFound.url[k].name[m].translation);
                                                                                                        anchorFound=true;
                                                                                                    }

                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    // SI NO TIENE ANCLA
                                                                                    else{
                                                                                        urlWithAnchor=false;
                                                                                        for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                            if(alertFound.url[k].name[m].code==lang){
                                                                                                if(alertFound.url[k].name[m].translation!=''){
                                                                                                    urlName.push(alertFound.url[k].name[m].translation);
                                                                                                    anchorFound=true;
                                                                                                }

                                                                                            }
                                                                                        }
                                                                                    }

                                                                                }
                                                                                // TERMINO DE RECORRER LAS URL
                                                                                if((urlWithAnchor==true)&&(anchorFound==true)){
                                                                                    //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                    listAlertsRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                    //continue;
                                                                                }
                                                                                else if(urlWithAnchor==false){
                                                                                    //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                    listAlertsRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                    //continue;
                                                                                }
                                                                            } // FIN TITULO
                                                                        } // FIN CODE LANG
                                                                    }// FIN RECORRER IDIOMAS

                                                                }// FIN END DATE OK
                                                            } // FIN END DATE CONFIGURADO

                                                            // SI NO TIENE ENDDATE
                                                            else{
                                                                // Compruebo el idioma
                                                                //RECORRO IDIOMAS


                                                                for(var j=0;j<alertFound.translatedName.length;j++){

                                                                    // SI ESTA EL IDIOMA DEL USUARIO
                                                                    if(alertFound.translatedName[j].code==lang){
                                                                        // SI TIENE TITULO:
                                                                        if(alertFound.translatedName[j].title != ""){
                                                                            // Comprobamos si tiene anchor
                                                                            var urlName=[];
                                                                            var urlWithAnchor=false;
                                                                            var anchorFound=false;

                                                                            // RECORREMOS LAS URL
                                                                            for (var k=0;k<alertFound.url.length;k++){
                                                                                // Compruebo si hay ancla de CoD y si este esta en la lista de secciones para guardar o no la alerta
                                                                                anchorFound=false;
                                                                                urlWithAnchor=false;

                                                                                // SI TIENE ANCLA
                                                                                if(alertFound.url[k].url.indexOf('#')>-1){

                                                                                    // SI EL ANCLA ES COD
                                                                                    if(alertFound.url[k].url.split('#')[0]=="/user/clinicinfo/courseofthedisease"){
                                                                                        urlWithAnchor=true;

                                                                                        // RECORRO LOS PROMS PAR VER SI EXISTE EL ANCLA
                                                                                        for(var l=0;l<sectionsAndProms.data.length;l++){

                                                                                            // SI EXISTE EL ANCLA
                                                                                            if(alertFound.url[k].url.split('#')[1]==sectionsAndProms.data[l].anchor){

                                                                                                // MIRO LOS NOMBRES DE LA URL
                                                                                                for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                                    if(alertFound.url[k].name[m].code==lang){
                                                                                                        if(alertFound.url[k].name[m].translation!=''){
                                                                                                            urlName.push(alertFound.url[k].name[m].translation);

                                                                                                            anchorFound=true;
                                                                                                        }

                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }

                                                                                    }

                                                                                    // SI EL ANCLA NO ES DE COD
                                                                                    else{
                                                                                        urlWithAnchor=false;
                                                                                        for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                            if(alertFound.url[k].name[m].code==lang){
                                                                                                if(alertFound.url[k].name[m].translation!=''){
                                                                                                    urlName.push(alertFound.url[k].name[m].translation);
                                                                                                    anchorFound=true;
                                                                                                }

                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                // SI NO TIENE ANCLA
                                                                                else{
                                                                                    urlWithAnchor=false;
                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                            if(alertFound.url[k].name[m].translation!=''){
                                                                                                urlName.push(alertFound.url[k].name[m].translation);
                                                                                                anchorFound=true;
                                                                                            }

                                                                                        }
                                                                                    }
                                                                                }

                                                                            }
                                                                            // TERMINO DE RECORRER LAS URL
                                                                            if((urlWithAnchor==true)&&(anchorFound==true)){
                                                                                //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                listAlertsRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                //continue;
                                                                            }
                                                                            else if(urlWithAnchor==false){
                                                                                //nameAlertTranslated=(res2.translatedName[i].translation);
                                                                                listAlertsRead.push({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                                //continue;
                                                                            }
                                                                        } // FIN TITULO
                                                                    } // FIN CODE LANG
                                                                }// FIN RECORRER IDIOMAS

                                                            }
                                                        } //FIN ALERT FOUND
                                                    })
                                                }
                                            }
                                            return res.status(200).send(listAlertsRead);
                                        }
                                        else{
                                            return res.status(200).send(listAlertsRead);
                                        }
                                    })
                                }
                                else{
                                    Useralerts.find({patientId:patientId,state:"Read"},async function(err,userAlertsFound){
                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                        if(userAlertsFound){
                                            for(var i=0;i<userAlertsFound.length;i++){
                                                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                                                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                                                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                                        if(alertFound){
                                                            // Comprobar si tiene endDate configurado
                                                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                                                    // Compruebo el idioma
                                                                    for(var j=0;j<alertFound.translatedName.length;j++){
                                                                        if(alertFound.translatedName[j].code==lang){
                                                                            if(alertFound.translatedName[j].title != ""){
                                                                                var urlName=[];
                                                                                for (var k=0;k<alertFound.url.length;k++){
                                                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                        if(alertFound.url[k].name[m].code==lang){
                                                                                            urlName.push(alertFound.url[k].name[m].translation);
                                                                                            anchorFound=true;
                                                                                        }
                                                                                    }
                                                                                }
                                                                                listAlertsRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                            }
                                                            // Si no tiene endDate configurado
                                                            else{
                                                                // Compruebo el idioma
                                                                for(var j=0;j<alertFound.translatedName.length;j++){
                                                                    if(alertFound.translatedName[j].code==lang){
                                                                        if(alertFound.translatedName[j].title != ""){
                                                                            var urlName=[];
                                                                            for (var k=0;k<alertFound.url.length;k++){
                                                                                for(var m=0;m<alertFound.url[k].name.length;m++){
                                                                                    if(alertFound.url[k].name[m].code==lang){
                                                                                        urlName.push(alertFound.url[k].name[m].translation);
                                                                                    }
                                                                                }
                                                                            }
                                                                            listAlertsRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                            return res.status(200).send(listAlertsRead);
                                        }
                                        else{
                                            return res.status(200).send(listAlertsRead);
                                        }
                                    })

                                }


                            })

                        }

                    })
                }

            })
        }
    })
}

/**
 * @api {get} https://health29.org/api/alerts/patient/ Request list of specific alerts of a patient
 * @apiName getPatientAlerts
 * @apiPrivate
 * @apiDescription This method request the list of specific alerts of a patient .
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   this.http.get('https://health29.org/api/alerts/patient/'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of specific alerts of a patient');
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
 * @apiParam {String} patientId The unique identifier of a patient.
 * @apiSuccess {Object[]} Result Returns list of specific alerts of a patient.
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

function getPatientAlerts(req,res){
    let patientId=crypt.decrypt(req.params.patientId);
    var listTotalAlertsByGroup = [];
    var date=new Date();

    // Obtengo la lista total de alertas para el grupo al que pertenece el paciente que se han creado para ese paciente
    Patient.findById(patientId,(err,patientfound)=>{
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        User.findById(patientfound.createdBy,(err,userfound)=>{
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            Group.find({name:userfound.group},function (err,groupfound){
                if(groupfound.length>0){
                    Alerts.find({groupId:groupfound[0]._id}, function (err, alertsfound) {
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if((alertsfound!=undefined)&&(alertsfound!=[])&&(alertsfound!="")){
                            for (var i=0;i<alertsfound.length;i++){
                                if(alertsfound[i].receiver.type=="broadcast"){
                                    listTotalAlertsByGroup.unshift(alertsfound[i]);
                                }
                                else if(alertsfound[i].receiver.type=="selectUsers"){
                                    for (var j =0;j<alertsfound[i].receiver.data.length;j++){
                                        Patient.findById(crypt.decrypt(alertsfound[i].receiver.data[j]),(err,patientFound)=>{
                                            if(patientFound){
                                                User.findById(patientFound.createdBy,(err,userFound2)=>{
                                                    if(userFound2._id==userfound._id){
                                                        listTotalAlertsByGroup.unshift(alertsfound[i]);
                                                    }
                                                })
                                            }
                                        })


                                    }
                                }

                            }
                        }

                        // Incializo entonces la lista resultado, como que el paciente no esta suscrito a ninguna de la alertas
                        var listAlertsAndSubscriptionStateForPatient = [];
                        for (var i =0;i<listTotalAlertsByGroup.length;i++){
                            listAlertsAndSubscriptionStateForPatient.unshift({alert:listTotalAlertsByGroup[i],subscription:false})
                        }

                        // Compruebo si el paciente tiene todas las userAlerts para esas alertas creadas: si esta suscrito
                        Useralerts.find({patientId:patientId}, async function(err, useralertsfound) {
                            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                            if(useralertsfound.length>0){
                                for (var i =0; i<useralertsfound.length;i++){
                                    if(useralertsfound[i]!=undefined){
                                        let alertId=useralertsfound[i].alertId;
                                        if((alertId!=undefined)&&(alertId!=null)&&(alertId!="")){
                                            await Alerts.findById(alertId, (err, alertsfoundForUserAlert) => {
                                                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                                if((alertsfoundForUserAlert!=null)&&(alertsfoundForUserAlert!=undefined)){
                                                    for (var k=0; k<listAlertsAndSubscriptionStateForPatient.length;k++){
                                                        if(listAlertsAndSubscriptionStateForPatient[k].alert!=undefined){
                                                            if(listAlertsAndSubscriptionStateForPatient[k].alert.id==alertsfoundForUserAlert.id){
                                                                if(useralertsfound[i]!=undefined){
                                                                    if((alertsfoundForUserAlert.type==userfound.group)&&(patientfound.subscriptionToGroupAlerts==true)){
                                                                        listAlertsAndSubscriptionStateForPatient[k].subscription=true;
                                                                    }
                                                                    else if(alertsfoundForUserAlert.type!=userfound.group){
                                                                        listAlertsAndSubscriptionStateForPatient[k].subscription=true;
                                                                    }

                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                };
                                return res.status(200).send(listAlertsAndSubscriptionStateForPatient)
                            }
                            else if( useralertsfound.length==0){
                                return res.status(200).send({message:"User Alerts not found"})
                            }
                        });


                    });
                }
                else if(groupfound.length==0){
                    return res.status(200).send({message:"Group not found"})
                }
            });
        })
    });

}


function getPatientAlertsNotReadForBot(req,res){
    let patientIdAndLang=req.params.patientIdAndLang;
    var listParams = patientIdAndLang.split("-code-")
    let patientId=crypt.decrypt(listParams[0]);
    let lang=listParams[1];
    let listAlertsNotRead=[];
    var date = new Date();
    Useralerts.find({patientId:patientId,state:"Not read"},async function(err,userAlertsFound){
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        if(userAlertsFound){
            for(var i=0;i<userAlertsFound.length;i++){
                if(Date.parse(userAlertsFound[i].showDate)<=Date.parse(date)){
                    await Alerts.findById(userAlertsFound[i].alertId,(err,alertFound)=>{
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if(alertFound){
                            // Comprobar si tiene endDate configurado
                            if((alertFound.endDate!=null)&&(alertFound.endDate!=undefined)&&(alertFound.endDate!="")&&(alertFound.endDate!=[])){
                                if(Date.parse(alertFound.endDate)>=Date.parse(date)){
                                    // Compruebo el idioma
                                    for(var j=0;j<alertFound.translatedName.length;j++){
                                        if(alertFound.translatedName[j].code==lang){
                                            if(alertFound.translatedName[j].title != ""){
                                                var urlName=[];
                                                for (var k=0;k<alertFound.url.length;k++){
                                                    for(var m=0;m<alertFound.url[k].name.length;m++){
                                                        if(alertFound.url[k].name[m].code==lang){
                                                            urlName.push(alertFound.url[k].name[m].translation);
                                                            anchorFound=true;
                                                        }
                                                    }
                                                }
                                                listAlertsNotRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                            }
                                        }
                                    }

                                }
                            }
                            // Si no tiene endDate configurado
                            else{
                                // Compruebo el idioma
                                for(var j=0;j<alertFound.translatedName.length;j++){
                                    if(alertFound.translatedName[j].code==lang){
                                        if(alertFound.translatedName[j].title != ""){
                                            var urlName=[];
                                            for (var k=0;k<alertFound.url.length;k++){
                                                for(var m=0;m<alertFound.url[k].name.length;m++){
                                                    if(alertFound.url[k].name[m].code==lang){
                                                        urlName.push(alertFound.url[k].name[m].translation);
                                                    }
                                                }
                                            }
                                            listAlertsNotRead.unshift({name:alertFound.translatedName[j].translation,urlName:urlName,alertFound});
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
            return res.status(200).send(listAlertsNotRead);
        }
        else{
            return res.status(200).send(listAlertsNotRead);
        }
    })

}

/**
 * @api {get} https://health29.org/api/alerts/patient/checkDateForUserAlerts Check date of alerts and update user alerts
 * @apiPrivate
 * @apiName checkDateAndUpdateForUseralerts
 * @apiDescription This method check date of alerts and update user alerts for launch.
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var params = <patientId>
 *   this.http.get('https://health29.org/api/alerts/patient/checkDateForUserAlerts'+params)
 *    .subscribe( (res : any) => {
 *      console.log('Check date of alerts and update user alerts for launch ok');
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
 * @apiParam {String} patientId The unique identifier of a patient.
 * @apiSuccess {Object[]} Result Returns.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *
 */
function checkDateAndUpdateForUseralerts(req,res){
    let patientId=crypt.decrypt(req.params.patientId);

    //Busco todas las alertas del grupo de pacientes
    var listTotalAlertsByGroup = [];
    Patient.findById(patientId,(err,patientfound)=>{
        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        User.findById(patientfound.createdBy,(err,userfound)=>{
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            Group.find({name:userfound.group},async function (err,groupfound){
                if(groupfound.length>0){
                    let groupId=groupfound[0]._id;
                    Alerts.find({groupId:groupId}, async function (err, alertsfound) {
                        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                        if((alertsfound!=undefined)&&(alertsfound!=[])&&(alertsfound!="")){
                            for (var i=0;i<alertsfound.length;i++){
                                listTotalAlertsByGroup.unshift(alertsfound[i]);
                            }
                            // Busco las userAlerts de ese paciente independientemente de si están o no leidas o lanzadas
                            Useralerts.find({patientId:patientId},(err, useralertsfound) =>{
                                if (err) return res.status(500).send({message: `Error making the request: ${err}`})
                                // Para cada userAlert del paciente
                                if(useralertsfound.length>0){
                                    for (var i =0; i<useralertsfound.length;i++){
                                        if((useralertsfound[i]!=[])&&(useralertsfound[i]!=undefined)&&(useralertsfound[i]!="")&&(useralertsfound[i]!=null)){
                                            //Busco a que alerta se corresponde,
                                            var alertId=useralertsfound[i].alertId;
                                            for (var j=0;j<listTotalAlertsByGroup.length;j++){
                                                if(listTotalAlertsByGroup[j]._id==alertId){
                                                    // con los datos de esta alerta (tipo e id),
                                                    //y el showDate de la userAlert veo si tengo que actualizar algo
                                                    var alert=listTotalAlertsByGroup[j];
                                                    var alertForUser=useralertsfound[i];
                                                    var date = new Date(Date.parse(alertForUser.showDate));
                                                    var dateNow= new Date();
                                                    var dateToCompare;
                                                    switch(alert.type){
                                                        case '6months':
                                                            var newMonth= Number(date.getMonth())+Number(6);
                                                            dateToCompare=new Date(date);
                                                            dateToCompare.setMonth(newMonth);

                                                            if ((dateToCompare!=null)&&(dateToCompare!=undefined)&&(dateToCompare!=[])&&(dateToCompare!="")){
                                                                if(Date.parse(dateNow)>=Date.parse(dateToCompare)){
                                                                    // Actualizo la userAlert
                                                                    alertForUser.showDate = dateNow;
                                                                    alertForUser.state = "Not read";
                                                                    alertForUser.launch=false;
                                                                    alertForUser.save((err,useralertsUpdated)=>{
                                                                        if (err){ return res.status(500).send({message: `Error making the request: ${err}`}) }
                                                                    })
                                                                }
                                                            }

                                                            break;
                                                        case '12months':
                                                            var newMonth= Number(date.getMonth())+Number(12);
                                                            dateToCompare=new Date(date);
                                                            dateToCompare.setMonth(newMonth);

                                                            if ((dateToCompare!=null)&&(dateToCompare!=undefined)&&(dateToCompare!=[])&&(dateToCompare!="")){
                                                                if(Date.parse(dateNow)>=Date.parse(dateToCompare)){
                                                                    // Actualizo la userAlert
                                                                    alertForUser.showDate = dateNow;
                                                                    alertForUser.state = "Not read";
                                                                    alertForUser.launch=false;
                                                                    alertForUser.save((err,useralertsUpdated)=>{
                                                                        if (err){ return res.status(500).send({message: `Error making the request: ${err}`}) }
                                                                    })
                                                                }
                                                            }
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            }
                                        }
                                    };
                                    return res.status(200).send()

                                } else if( useralertsfound.length==0){
                                    return res.status(200).send({message:"User Alerts not found"})
                                }
                            });

                        } else if( alertsfound.length==0){
                            return res.status(200).send({message:"Alerts not found"})
                        }
                    });
                }
            });
        });
    });

}

module.exports = {
    getAlertByGroup,
    getAlertByGroupAndCreateUserAlertsForPatient,
    getAlertByGroupAndTypeWithLangFilter,
    deleteAlertByGroup,
    getAlertById,
    deleteAlertById,
    updateAlertTranslations,
    saveAlertAndUpdateUserAlertsForSelectedUsers,
    saveAlertAndUpdateUserAlertsForOrganization,
    saveAlertAndUpdateUserAlertsBroadcast,
    deleteAlertByIdAndUpdateUserAlerts,
    getPatientAlerts,
    getUserAlertsNotReadForPatientIdAndLang,
    getAlertsNotReadAndTranslatedName,
    getAlertsReadAndTranslatedName,
    getPatientAlertsNotReadForBot,
    checkDateAndUpdateForUseralerts
}
