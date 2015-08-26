var http = require("http");
var express = require('express');
var url = 'http://stream.meetup.com/2/rsvps';
var meetup = require('./include/meetup_fetch.js').meetup();
var threshold_time = 1000;
//Start fetching
meetup.fetch(url);

//push to appbase in 10 sec. interval
setInterval(function(){
	meetup.push_to_appbase();
},threshold_time);

var app = express();
app.get('/api', function(req, res) {
	meetup.stream_serve(res);
});
app.listen('8080');


