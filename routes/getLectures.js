exports.list = function(req, res) {
   var sparql = require('../sparql/queries');

   var config = require('config');
   var storeConfig = config.get('Store');
   var sparqlendpoint = storeConfig.protocol + storeConfig.Credentials.user + ':' + storeConfig.Credentials.password + "@" + storeConfig.url + ":" + storeConfig.port + "/repositories/" + storeConfig.repository;

   var sparqlquery = sparql.query.getLectures;

   var SparqlClient = require('sparql-client');
   var sparqlclient = new SparqlClient(sparqlendpoint);

   sparqlclient.query(sparqlquery).execute(function(error, result) {
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
            lectureobj.title =  binding.title.value;
            lectureobj.moduletitle = binding.moduletitle.value;
            lectureobj.semestertitle = binding.semestertitle.value;
            lectureobj.date = binding.date.value;
            response.push(lectureobj);
         }
         res.json(response);
      }
   });
}
