var http = require('http');
var appbase = require("appbase-js")
var elasticsearch = require('elasticsearch')
var meetup_data = [];
var fetch_response;
// app and authentication configurations  
var HOSTNAME = "scalr.api.appbase.io"
var APPNAME = "meetup2"
var USERNAME = "qz4ZD8xq1"
var PASSWORD = "a0edfc7f-5611-46f6-8fe1-d4db234631f3"
var FLAG_FREE = true;

var db = {
  index: APPNAME,
  type: 'meetup',
  body: {}
};
exports.meetup = function() {
  return {
    fetch: fetch,
    push_to_appbase: push_to_appbase,
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
          console.log('data : ',meetup_data.length);
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
    if (FLAG_FREE && meetup_data.length) {
      FLAG_FREE = false
      var client = new elasticsearch.Client({
        host: 'https://' + USERNAME + ":" + PASSWORD + "@" + HOSTNAME,
      });

      //Pause streaming
      fetch_response.pause();
      var data_count = 0; 
      var meetup_length = meetup_data.length;
      single_insert();

      //Single Insertion
      function single_insert(){
        var meetup_record = meetup_data[data_count];
         client.index({
          index: db['index'],
          type: db['type'],
          body: meetup_record
        }, function(err, res) {
          
          //Resume response on last data
          if(data_count == meetup_length){
            console.log("res: ", data_count);
            meetup_data = [];
            FLAG_FREE = true;
            fetch_response.resume();          
          }
          //Else recursive
          else{
            data_count++;
            single_insert();
          }
        })
      }
    }
  }
}