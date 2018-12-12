// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

window.onload = function() {
  var output2013 = "Data/output2013.json";
  var output2014 = "Data/output2014.json";
  var output2015 = "Data/output2015.json";
  var output2016 = "Data/output2016.json";
  var output2017 = "Data/output2017.json";

  var requests = [d3.json(output2013), d3.json(output2014), d3.json(output2015), d3.json(output2016), d3.json(output2017)];

  Promise.all(requests).then(function(response) {
    var dict = {};

    for (i = 0; i < response.length; i++) {
      dict[i + 2013] = response[i];
    }

    var standard_year = 2017


  }).catch(function(e){
      throw(e);
  });

}
