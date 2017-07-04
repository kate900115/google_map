const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const GOOGLEAPI_KEY = 'AIzaSyD9SwX4CKr1CIRSVehIMKNsbHi2StHbCkM';
const PORT_NUMBER = 8080;

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/templates/mymap.html'));
});

app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/static', express.static('static'));

app.get('/nearby_search', function(req, api_res){
	var parameter = {
		'key' : GOOGLEAPI_KEY,
		'location' : req.query.location,
		'radius' : req.query.radius
	};
	request({url:NEARBY_SEARCH_URL, qs:parameter}, function(eer, res, body){
		if (res.statusCode==200){
			api_res.json(body);
			console.log(body);
		}
		else{
			console.log('error!');
		}
	});
});

app.listen(PORT_NUMBER, function(){
	console.log('Example app listening on port '+PORT_NUMBER+'!');
});
