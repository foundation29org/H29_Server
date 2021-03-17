'use strict'

var obj = require("./hpo.json");
const request = require("request")

function getHposInfo (req, res){
	let arrayHpos = req.query.symtomCodes
  var isarray = Array.isArray(arrayHpos)
  var listhposinfo = [];
	if(arrayHpos==undefined){
		return listhposinfo;
	}else{
		if(!isarray){
	    listhposinfo.push(obj[arrayHpos]);
	  }else if(isarray){
			var lengList = arrayHpos.length;
			var counthpos = 0;
	    arrayHpos.forEach(function(hpo) {
				if(obj[hpo]==undefined){
					request({
					url: 'https://scigraph-ontology.monarchinitiative.org/scigraph/dynamic/cliqueLeader/'+hpo+'.json',
					json: true
					}, function(error, response, body) {
						if(error){
							//return res.status(500).send({message: `Error monarch: ${error}`})
							listhposinfo.push({"id": hpo,
					    "name": "",
					    "comment": "",
					    "xref": "",
					    "relatives": {
					      "parents": [],
					      "children": []
					    }});
							counthpos++;
						}else{
							if(body.nodes!=undefined){
								if(body.nodes.length>0){
									listhposinfo.push({"id": hpo,
							    "name": body.nodes[0].lbl,
							    "comment": body.nodes[0].meta.definition[0],
							    "xref": "",
							    "relatives": {
							      "parents": [],
							      "children": []
							    }});
									counthpos++;
									if(counthpos==lengList){
										res.status(200).send(listhposinfo)
									}
								}
							}else{
								listhposinfo.push({"id": hpo,
						    "name": "",
						    "comment": "",
						    "xref": "",
						    "relatives": {
						      "parents": [],
						      "children": []
						    }});
								counthpos++;
							}
						}
						/*else{
							return res.status(500).send({message: `Error monarch: ${error}`})
						}*/

					});
					/*listhposinfo.push({"id": hpo,
			    "name": "",
			    "comment": "",
			    "xref": "",
			    "relatives": {
			      "parents": [],
			      "children": []
			    }});*/
				}else{
					listhposinfo.push(obj[hpo]);
					counthpos++;
				}

	    });
	  }
		if(counthpos==lengList){
			res.status(200).send(listhposinfo)
		}
	}

}

module.exports = {
	getHposInfo
}
