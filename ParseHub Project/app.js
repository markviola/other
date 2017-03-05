var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);

    // Get the url
    var url = req.url.split("/proxy/")[1];

    if(url){
		var retData = {};
		var callback = function(){
			res.json(retData);
		}

		// Perform GET request on the url specified
    	if(req.method === 'GET'){
    		var options = {
		    	url: url,
		    	method: 'GET'
		   	};

			var getCallback = function(err, res, body) {
				retData = JSON.parse(body);
				callback();
			};

			request(options, getCallback);
	    	return next();
    	}
    	// Perform POST request on the url specified, using the same form data
    	else if (req.method === 'POST'){
		   	var options = {
		    	url: url,
		    	method: 'POST',
		    	form: req.body
		   	};

		   	var postCallback = function(err, res, body) {
		    	retData = JSON.parse(body);
		    	callback();
		   	}

		   request(options, postCallback);
		   return next();
    	}
    }

    res.json({});
    return next();
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

app.listen(8000);