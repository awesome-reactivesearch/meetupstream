var url = 'http://stream.meetup.com/2/rsvps';
var meetup = require('./include/meetup_fetch.js').meetup();
meetup.fetch(url);

