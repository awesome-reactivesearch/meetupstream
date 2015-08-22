var http = require('http');
var appbase = require("appbase-js")
var elasticsearch = require('elasticsearch')
var meetup_data = [];
var type = {
  index: 'createnewtestapp01',
  type: 'meetup',
  //id: 1,
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
      res.on('data', function(chunk) {

        //Parse json and store in meetup array
        try {
          var data = JSON.parse(chunk);
          meetup_data.push(data);

          //Pause request push data to appbase
          res.pause();
          push_to_appbase(res, meetup_data);

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
  function push_to_appbase(fetch_response, meetup_data) {

    // app and authentication configurations  
    const HOSTNAME = "scalr.api.appbase.io"
    const APPNAME = "createnewtestapp01"
    const USERNAME = "RIvfxo1u1"
    const PASSWORD = "dee8ee52-8b75-4b5b-be4f-9df3c364f59f"

    var meetup_push_array = [];
    for (var data_count = 0; data_count < meetup_data.length; data_count++) {
      //type['id'] = data_count;
      type['body'] = meetup_data[data_count];
      meetup_push_array.push(type);
    }

    // console.log('body json is ready');
    // console.log(meetup_push_array);

    // elasticsearch client. we use it for indexing, mappings, search settings, etc.
    var client = new elasticsearch.Client({
      host: 'https://' + USERNAME + ":" + PASSWORD + "@" + HOSTNAME,
    });

    

    //For single record  
    client.index(meetup_push_array[0]).then(function(response) {
      console.log(response);
      setTimeout(function() {
        if(typeof fetch_response != 'undefined')
          fetch_response.resume();
      }, 5000);
    }, function(error) {
      console.log(error);
    });

//For Bulk data

// client.bulk({
//     index: 'createnewtestapp01',
//     type: 'books',
//     body: [{ index: { _id: '1'}},
//       // document to be indexed
//       jsonObject
//     ]
// }, function(err, resp) {
//     console.log("b_a: ", resp);
// });


    // we will instantiate 'appbase' client when we need streams.
  }

}