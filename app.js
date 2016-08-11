//process.env.NODE_ENV = "production";          // [development, production]
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var bodyParser = require('body-parser');
var express = require('express');
var app = express();


//function start(){
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
   extended: true 
}));
app.use('/', express.static(__dirname + '/public')); 

var getLectures = require('./routes/getLectures')
var getVideos = require('./routes/getVideos')
//app.get('/lectures', getLectures.list);

app.get('/lectures', function(req, res) {
      res.format({
         json: getLectures.list,
         html: function() {
            var fileName = 'lectures.html';
            res.sendFile(fileName, {root: __dirname + '/public/'}, function(err) {
                  if (err) {
                     console.log(err);
                     res.status(err.status).end();
                  }
               });
            }
      });
   });
app.post('/lectures',function(req,res){ 
	console.log('Got a post ');
	var data = req.body;
	console.log(data[0].url);
	global.gIRI = data[0].url;
	//IRI.getIRI(data[0].url);
	console.log(global.gIRI);
});

app.get('/lectures/:lectureid', function(req, res){ //modified here/lectures/iptk -> /lectures/:lectureid
	global.gIRI = req.param("lectureid");	
	//var IRI = require('./sparql/videoqueries');
	res.format({
		json: getVideos.list,
		html: function() {
			var fileName = 'IPTK3.html';
			res.sendFile(fileName, {root: __dirname + '/public/'}, function(err){
				if(err){
					console.log(err);
					res.status(err.status).end();
				}
               });
            }
      });
   });

var server = app.listen(3000, function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log('Example app listening at http://%s:%s', host, port);
});
//}

//exports.start = start;
