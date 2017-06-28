const express = require('express');
const app = express();
const path = require('path');
const GOOGLEAPI_KEY = 'AIzaSyD9SwX4CKr1CIRSVehIMKNsbHi2StHbCkM';
const PORT_NUMBER = 8080;

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/templates/mymap.html'));
});

app.use('/css',express.static('css'));

app.listen(PORT_NUMBER, function(){
	console.log('Example app listening on port '+PORT_NUMBER+'!')
});
