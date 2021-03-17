// functions for each call of the api on Healthbot. Use the bot-qna model
'use strict'

// add the bot-qna model
const Bot = require('../../models/bot')
const User = require('../../models/user')


// add other required models
const Group = require('../../models/group')
const serviceEmail = require('../../services/email')


/**
 * @api {get} https://health29.org/api/bots Get information saved by the bot
 * @apiPrivate
 * @apiName getBotInfo
 * @apiDescription This method request the list of information saved by the bot for a group of patients
 * @apiGroup Bot
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupId = <groupId>
 *   this.http.get('https://health29.org/api/bots/'+groupId)
 *    .subscribe( (res : any) => {
 *      console.log('Get list of information saved by the bot for a group of patients ok');
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
 * @apiParam {Object} groupId The unique identifier of a group of patients
 * @apiSuccess {Object[]} Result Returns list with the information saved by the bot for the specific group of patients with the format:
 *   "createdBy" : <patientId encrypted>
 *   "type" : The type of the request. By now only exists type "qna"
 *   "date" : The date of the request
 *   "data" : The information saved. With a field "answers". For qna type the answers has "answer" and "questions" fields.
 *   For type qna "userQuestion": What question did the user
 *   "lang" : The language of the bot selected by the user
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  [
 * 		"createdBy" : ObjectId("5a734ba8f4213c5a68398aaf"),
 *	    "type" : "qna",
 *	    "date" : {
 *		    "$date" : 1571753621893
 *	    },
 *	    "data" : [
 *		    {
 *		    	"activeLearningEnabled" : false,
 *		    	"debugInfo" : null,
 *		    	"answers" : [
 *		    		{
 *			    		"metadata" : [ ],
 *			    		"source" : null,
 *			    		"id" : -1,
 *			    		"score" : 0,
 *			    		"answer" : "No good match found in KB.",
 *			    		"questions" : [ ]
 *			    	}
 *		    	]
 *		    },
 *		    {
 *		    	"userQuestion" : "asfdfr"
 *		    }
 *	    ],
 *	    "lang" : "nl",
 * 	]
 *
 *
 */
function getBotInfo (req, res){
    let groupId=req.params.groupId;
    Bot.find({createdBy:groupId}, {"createdBy" : false }, function(err, bots) {
        var listBots = [];
        bots.forEach(function(botModel) {
            listBots.unshift(botModel);
        });
        res.status(200).send(listBots)
    });
}

function getBotInfoAll (req, res){
    Bot.find({}, {"createdBy" : false }, function(err, bots) {
        var listBots = [];
        bots.forEach(function(botModel) {
            listBots.unshift(botModel);
        });
        res.status(200).send(listBots)
    });
}

/**
 * @api {delete} https://health29.org/api/bots Delete a question saved
 * @apiPrivate
 * @apiName deleteQuestion
 * @apiDescription This method delete a question save
 * @apiGroup Bot
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var inputId = <inputId>
 *   this.http.delete('https://health29.org/api/bots/'+inputId)
 *    .subscribe( (res : any) => {
 *      console.log('Delete a question saved ok');
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
 * @apiParam {Object} inputId The unique identifier of the input saved in bots
 * @apiSuccess {Object} Result Returns the information of th execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "message":'Question deleted'
 *  }
 *
 *
 */
function deleteQuestion(req,res){
    let id= req.query.id;
    Bot.findById(id,(err, bot) => {
        if (err)  return res.status(500).send({message: `Error making the request: ${err}`})
        if(!bot) return res.status(202).send({message: `The bot does not exist`})
        if (bot){
            bot.remove(err => {
                if(err) return res.status(500).send({message: `Error deleting the question: ${err}`})
                else{
                    res.status(200).send({message:'Question deleted'});
                }
            });
        }
    });
}

/**
 * @api {put} https://health29.org/api/bots Update a question saved and save the curated by field
 * @apiPrivate
 * @apiName updateBotData
 * @apiDescription This method update a question saved and save the curated by field (who has made the changes)
 * @apiGroup Bot
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var inputId = <inputId>
 *   var body = {"curatedBy":<userId>}
 *   this.http.put('https://health29.org/api/bots/'+inputId)
 *    .subscribe( (res : any) => {
 *      console.log('Update a question ok');
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
 * @apiParam {Object} inputId The unique identifier of the input saved in bots
 * @apiSuccess {Object} Result Returns the information of th execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "message":'Updated'
 *  }
 *
 *
 */
function updateBotData(req,res){
    let botId = req.params.botId;

    Bot.findByIdAndUpdate(botId, { curatedBy: req.body.curatedBy }, {select: '-createdBy', new: true}, (err,qnaUpdated) => {
		if (err) return res.status(500).send({message: `Error making the request: ${err}`})

			res.status(200).send({message: 'Updated', qna: qnaUpdated})

	})
}

/**
 * @api {put} https://health29.org/api/bot Save a question and send feedback
 * @apiPrivate
 * @apiName sendAndSaveFeedback
 * @apiDescription This method save a question and send an email to the group administators.
 *  The quetion has the format:
 *  {
 *	    "type" : "qna",
 *	    "date" : {
 *		    "$date" : 1571753621893
 *	    },
 *	    "data" : [
 *		    {
 *		    	"answers" : [
 *		    		{
 *			    		"id" : -1,
 *			    		"score" : 0,
 *			    		"answer" : "No good match found in KB.",
 *			    		"questions" : [ ]
 *			    	}
 *		    	]
 *		    },
 *		    {
 *		    	"userQuestion" : "asfdfr"
 *		    }
 *	    ],
 *	    "lang" : "nl",
 *  }
 * @apiGroup Bot
 * @apiVersion 1.0.0
 * @apiExample {js} Example usage:
 *   var groupId = <groupId>
 *   var body = {"lang":<code_lang>,"user":<userId>,"data":<data to save>}
 *   this.http.put('https://health29.org/api/bot/'+inputId)
 *    .subscribe( (res : any) => {
 *      console.log('Update a question ok');
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
 * @apiParam {Object} groupId The unique identifier of the patient group
 * @apiSuccess {Object} Result Returns the information of th execution
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *      "message":'Qna created'
 *  }
 *
 *
 */
async function sendAndSaveFeedback (req, res){
    await saveFeedback(req, res);
    sendFeedback(req, res);

}
function sendFeedback (req, res){
    //Obtain the params
    let groupId= req.params.groupId; // Para buscar el mail del admin
    let lang = req.body.lang; // Para enviar el mail
    let data = req.body.data; //Informacion en formato JSON
    let user = req.body.user;
    let userEmail ="";
    User.findOne({ userName: user }, function(err, userFound) {
        if(userFound){
            userEmail = userFound.email;
        }
        // Descifrar el JSON
        let score = data[0].answers[0].score;
        let question = data[0].answers[0].questions;
        let answer = data[0].answers[0].answer;
        let userQuestion = data[1].userQuestion;
        Group.findById(groupId,{"_id" : false },function(err, group) {
            if (err) return res.status(500).send({message: `Error making the request: ${err}`})
            if(!group) return res.status(202).send({message: `The group does not exist`})
            if (group){
                // send an email to the admins
                return serviceEmail.sendMailrequestNewFAQ(user,userEmail,group, lang, data);
            }
        })
    });


}

async function saveFeedback(req, res){
    //Obtain the params
    let groupId= req.params.groupId; // Para buscar el mail del admin
    let lang = req.body.lang; // Para enviar el mail
    let data = req.body.data; //Informacion en formato JSON

    // Descifrar el JSON
    let score = data[0].answers[0].score;
    let question = data[0].answers[0].questions;
    let answer = data[0].answers[0].answer;
    let userQuestion = data[1].userQuestion;

    let doSave = false;
    let existBot=false;


    await Group.findById(groupId,{"_id" : false },async function(err, group) {

        if (err) return res.status(500).send({message: `Error making the request: ${err}`})
        else if(!group) return res.status(202).send({message: `The group does not exist`})
        else if (group){
            // send score - question - answer to the colection
            let bot = new Bot()
            bot.data = req.body.data
            bot.type = "qna"
            bot.createdBy = groupId
            bot.lang = req.body.lang;
            bot.curatedBy = req.body.curatedBy;

            bot.save((err,qnaStored) => {
                if (err) res.status(500).send({message: `Failed to save in the database: ${err} `})
                var copyqnaStored = JSON.parse(JSON.stringify(qnaStored));
		            delete copyqnaStored.createdBy;
                return res.status(200).send({message: 'Qna created', bot: copyqnaStored})
                //return res.status(200).send({message: 'Qna created'})
            });
        }
    })
}




module.exports = {
    sendAndSaveFeedback,
    getBotInfo,
    deleteQuestion,
    updateBotData,
    getBotInfoAll
}
