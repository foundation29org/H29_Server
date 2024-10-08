'use strict'

const { TRANSPORTER_OPTIONS, client_server, blobAccessToken } = require('../config')
const nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars')
const DUCHENNENETHERLANDS = 'Duchenne Parent Project Netherlands'
const DUCHENNEINTERNATIONAL = 'Duchenne Parent Project International'

var options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template',
         partialsDir : 'views/email/partials/'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };

 var transporter = nodemailer.createTransport(TRANSPORTER_OPTIONS);
 transporter.use('compile', hbs(options));

function sendMailVerifyEmail (email, randomstring, lang, group){
  if(lang=='es'){
    var subjectlang='Activa la cuenta';
  }else if(lang=='pt'){
    var subjectlang='Ative a conta';
  }else if(lang=='de'){
    var subjectlang='Aktivieren Sie das Konto';
  }else if(lang=='nl'){
    var subjectlang='Activeer het account';
  }else{
    var subjectlang='Activate the account';
  }
  const decoded = new Promise((resolve, reject) => {

    var maillistbcc = [
      'support@foundation29.org'
    ];

    var mailOptions = {
      to: email,
      bcc: maillistbcc,
      from:'support@foundation29.org',
      subject: subjectlang,
      template: 'verify_email/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg: urlImg
      }
    };

    var urlImg = client_server+'/assets/img/Health29.png';
    if(group == DUCHENNENETHERLANDS || group == DUCHENNEINTERNATIONAL){
      urlImg = client_server+'/assets/img/duchenne-medium.png';

      var maillistbcc = [
        'support@foundation29.org',
        'info@duchenne.nl',
        'fknuistinghneven@gmail.com',
      ];

      mailOptions = {
        to: email,
        bcc: maillistbcc,
        from:'support@foundation29.org',
        subject: subjectlang,
        template: 'verify_email/_'+lang,
        context: {
          client_server : client_server,
          email : email,
          key : randomstring,
          urlImg: urlImg
        }
      };
    }


    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendMailRecoverPass (email, randomstring, lang, group){
  if(lang=='es'){
    var subjectlang='Recuperación de la cuenta';
  }else if(lang=='pt'){
    var subjectlang='Recuperação de conta';
  }else if(lang=='de'){
    var subjectlang='Kontowiederherstellung';
  }else if(lang=='nl'){
    var subjectlang='Accountherstel';
  }else{
    var subjectlang='Account Recovery';
  }
  const decoded = new Promise((resolve, reject) => {
    var urlImg = client_server+'/assets/img/Health29.png';
    if(group == DUCHENNENETHERLANDS || group == DUCHENNEINTERNATIONAL){
      urlImg = client_server+'/assets/img/duchenne-medium.png';
    }

    var maillistbcc = [
      'support@foundation29.org',
    ];

    var mailOptions = {
      to: email,
      bcc: maillistbcc,
      from:'support@foundation29.org',
      subject: subjectlang,
      template: 'recover_pass/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg: urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}
function sendMailRequestNewLanguage (user, name, code){


  const decoded = new Promise((resolve, reject) => {
    var mailOptions = {
      to: 'support@foundation29.org',
      subject: 'Request for new language',
      template: 'request_new_lang/_en',
      context: {
        user : user,
        name : name,
        code : code
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}
function sendMailRequestNewTranslation (user, lang, jsonData){

  const decoded = new Promise((resolve, reject) => {
    var mailOptions = {
      to: 'support@foundation29.org',
      subject: 'Request for new translation',
      template: 'request_new_translation/_en',
      context: {
        user : user,
        lang : lang,
        jsonData : jsonData
      },
      attachments: [
      {   // utf-8 string as an attachment
          filename: lang+'.json',
          content: jsonData
      }]
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}
function sendMailSupport (email, lang, supportStored, emailTo){
  const decoded = new Promise((resolve, reject) => {
    var urlImg = client_server+'/assets/img/Health29.png';

    var emailToFinal = 'support@foundation29.org'
    if(emailTo!=null){
      emailToFinal = emailTo;
    }

    var mailOptions = {
      to: emailToFinal,
      from:'support@foundation29.org',
      subject: 'Message for support. Id: '+ supportStored._id,
      template: 'mail_support/_en',
      context: {
        email : email,
        lang : lang,
        info: supportStored
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}
function sendMailrequestNewFAQ (user,userEmail,group, lang, jsonData){
  let answer = jsonData.answer;
  let userQuestion = jsonData.userQuestion;
  let groupMail = group.mail;
  let userName=user;
  let userMail=userEmail;


  const decoded = new Promise((resolve, reject) => {

    var language="";
    switch(lang){
      case "en":
        language="English";
        break;
      case "es":
        language = "Español";
        break;
      case "nl":
        language="Neederlands";
        break;
    }

    var maillistbcc = [];
    if(group.name == DUCHENNENETHERLANDS || group.name == DUCHENNEINTERNATIONAL){
      //urlImg = 'https://health29-dev.azurewebsites.net/assets/img/duchenne-medium.png';

      maillistbcc = [
        'support@foundation29.org',
        'info@duchenne.nl',
        'fknuistinghneven@gmail.com'
      ];
    }
    var mailOptions = {
      to:groupMail,
      //bcc: 'yolanda.ludena@foundation29.org',
      //bcc: 'marta.herranz@foundation29.org',
      bcc:maillistbcc,
      from:'support@foundation29.org',
      subject: 'Request for new FAQ',
      template: 'request_new_FAQ/_en',
      context: {
        user : {"name":userName,"mail":userMail},
        lang : language,
        userQuestion: userQuestion,
        answer : answer,
      }
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log("Error: "+error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendEmailLogin (email, randomstring, group, lang){
  var subject='Your verification code is';
  if(lang=='es'){
    subject='Tu código de verificación es';
  }else if(lang=='nl'){
    subject='Uw verificatiecode is';
  }
  subject = subject + ' ' + randomstring;
  const decoded = new Promise((resolve, reject) => {

    var maillistbcc = [
      'support@foundation29.org',
    ];
    console.log(group)
    var urlImg = client_server+'/assets/img/health29-medium.png';
    //urlImg = 'https://health29-dev.azurewebsites.net/assets/img/health29-medium.png';
    if(group == DUCHENNENETHERLANDS || group == DUCHENNEINTERNATIONAL){
      urlImg = client_server+'/assets/img/logo1.png';
      //urlImg = 'https://health29-dev.azurewebsites.net/assets/img/logo1.png';
    }
    var mailOptions = {
      to: email,
      from:'support@foundation29.org',
      subject: subject,
      template: 'login_pass/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg : urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}

function sendEmailDelete (email, randomstring, group, lang){
  var subject = 'Your account deletion code is';
  if(lang == 'es') {
      subject = 'Tu código para eliminar la cuenta es';
  } else if(lang == 'nl') {
      subject = 'Uw code voor accountverwijdering is';
  }
  subject = subject + ' ' + randomstring;
  const decoded = new Promise((resolve, reject) => {

    var maillistbcc = [
      'support@foundation29.org',
    ];
    console.log(group)
    var urlImg = client_server+'/assets/img/health29-medium.png';
    urlImg = 'https://health29-dev.azurewebsites.net/assets/img/health29-medium.png';
    if(group == DUCHENNENETHERLANDS || group == DUCHENNEINTERNATIONAL){
      //urlImg = client_server+'/assets/img/logo1.png';
      urlImg = 'https://health29-dev.azurewebsites.net/assets/img/logo1.png';
    }
    var mailOptions = {
      to: email,
      from:'support@foundation29.org',
      subject: subject,
      template: 'delete_pass/_'+lang,
      context: {
        client_server : client_server,
        email : email,
        key : randomstring,
        urlImg : urlImg
      }
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject({
          status: 401,
          message: 'Fail sending email'
        })
      } else {
        console.log('Email sent: ' + info.response);
        resolve("ok")
      }
    });

  });
  return decoded
}


module.exports = {
  sendMailVerifyEmail,
  sendMailRecoverPass,
  sendMailRequestNewLanguage,
  sendMailRequestNewTranslation,
  sendMailSupport,
  sendMailrequestNewFAQ,
  sendEmailLogin,
  sendEmailDelete
}
