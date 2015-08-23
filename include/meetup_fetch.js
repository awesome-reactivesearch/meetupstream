var http = require('http');
var appbase = require("appbase-js")
var elasticsearch = require('elasticsearch')
var meetup_data = [];
var fetch_response;
// app and authentication configurations  
var HOSTNAME = "scalr.api.appbase.io"
var APPNAME = "meetuprsvp"
var USERNAME = "61ONSqYR2"
var PASSWORD = "8820fb93-72e7-4dbf-a2a9-4b378f0197c9"

var db = {
  index: APPNAME,
  type: 'meetup',
  body: {}
};
exports.meetup = function() {
  return {
    fetch: fetch,
    push_to_appbase: push_to_appbase
  };

  //Fetch  data here
  function fetch(url) {
    http.get(url, function(res) {
      fetch_response = res;
      res.on('data', function(chunk) {

        //Parse json and store in meetup array
        try {
          var data = JSON.parse(chunk);
          meetup_data.push(data);
        } catch (er) {
          //console.log('error: ' + er.message);
        }

      });
      res.on('end', function() {
        // all data has been downloaded
      });
    });
  }

  //Push to appbase
  function push_to_appbase() {   
    var client = new elasticsearch.Client({
      host: 'https://' + USERNAME + ":" + PASSWORD + "@" + HOSTNAME,
    });

    //Pause streaming
    fetch_response.pause();

    //Get all data and reformat it for elastic search.
    var meetup_push_array = [];
    for (var data_count = 0; data_count < meetup_data.length; data_count++) {
      var type1 = meetup_data[data_count];
      meetup_push_array.push({
        index: {}
      });
      meetup_push_array.push(type1);
    }

    //For Bulk data
    client.bulk({
      index: db['index'],
      type: db['type'],
      body: meetup_push_array
    }, function(err, resp) {
      console.log("b_a: ", resp.items);
      meetup_data = [];
      fetch_response.resume();
    });
  }

}