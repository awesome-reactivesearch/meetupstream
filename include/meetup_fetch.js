var http = require('http');
var meetup_data = [];

exports.meetup = function() {
  return {
    fetch: fetch
  };

  //Implementations

  //Fetch  data here
  function fetch(url) {
    //Get Request starts here
    http.get(url, function(res) {
      res.on('data', function(chunk) {

        //Parse json and store in meetup array
        try {
          var data = JSON.parse(chunk);
          meetup_data.push(data);
          console.log(meetup_data);
        } catch (er) {
          console.log('error: ' + er.message);
        }

      });
      res.on('end', function() {
        // all data has been downloaded
      });
    });
  }
}

