var url = 'http://stream.meetup.com/2/rsvps';
var meetup = require('./include/meetup_fetch.js').meetup();

//Start fetching
meetup.fetch(url);

//push to appbase in 10 sec. interval
setInterval(function(){
	meetup.push_to_appbase();
},10000);

