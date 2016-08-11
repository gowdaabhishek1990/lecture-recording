// file which fetches json data for the video page.

exports.list = function(req, res) {
   var sparql = require('../sparql/videoqueries');

   var config = require('config');
   var storeConfig = config.get('Store');
   var sparqlendpoint = storeConfig.protocol + storeConfig.Credentials.user + ':' + storeConfig.Credentials.password + "@" + storeConfig.url + ":" + storeConfig.port + "/repositories/" + storeConfig.repository;

   var sparqlquery = sparql.videoquery.getVideos;

   var SparqlClient = require('sparql-client');
   var sparqlclient = new SparqlClient(sparqlendpoint);
   var IRI = "<http://clls.rbg.informatik.tu-darmstadt.de/clls/store/lecture/" + global.gIRI + ">";
   
   //sparqlclient.query(sparqlquery).bind('some',IRI);
   console.log(IRI);
   sparqlclient.query(sparqlquery).bind('some',IRI).execute(function(error, result) { 
     if (result == null) {
         console.log("ERROR: Could not query ratings " + error);
         res.json({
            response: 'error'
         });
      } else if (result) {
         var response = [];
         var bindings = result.results.bindings;
         for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            var lectureobj = {};
            lectureobj.url = binding.lecture.value;
	    lectureobj.thumbnails = binding.thumbnails.value;
	    lectureobj.begin = binding.begin.value;
	    lectureobj.end = binding.end.value;
	    lectureobj.title = binding.title.value;
            response.push(lectureobj);
         }
         res.json(response);
      }
   });
}
