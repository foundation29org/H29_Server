'use strict'
const request = require('request')
//'url': config.dx29Gateway+'/api/v1/Diagnosis/calculate?filterConditions=false&filterMatches=true',

function searchSymptoms (req, res){
  //let text = req.params.text
  let text = req.body.text;
  let lang = req.body.lang;
  var options = {
    'method': 'GET',
    'url': encodeURI('http://dx29-api.northeurope.cloudapp.azure.com/api/v4/PhenotypeSearch/terms?text='+text+'&lang='+lang+'&rows=20'),
    'headers': {
      'Content-Type': 'application/json'
    }

  };
  request(options, function (error, response) {
    if (error) {
      res.status(400).send(error)
    }else{
      res.status(200).send(response.body)
    }
  });
}

module.exports = {
  searchSymptoms
}
