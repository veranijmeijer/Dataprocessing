// Vera Nijmeijer
// 10753567
// Assignment minor Programmeren UvA

window.onload = function() {

  var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
  var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";

  var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {
      var transformedWomen = transformResponse(response[0]);
      var transformedConf = transformResponse(response[1]);

      var datapoints = parse_data(transformedWomen, transformedConf);
      var data = datapoints[0];
      var colors = datapoints[1];
      var countries = datapoints[2];
      var years = datapoints[3];
      var year = "2007";

      var plot = create_scatter(data, year, colors, countries);
      var svg = plot[0];
      var xScale = plot[1];
      var yScale = plot[2];
      var update = false;

      fill_scatter(svg, xScale, yScale, data, year, update);
      add_dropdown(svg, xScale, yScale, data, years);
    }).catch(function(e){
        throw(e);
    });
};

// source: https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/scripts/transformResponseV1.js
function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}

function parse_data(data1, data2) {

  var countries = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"]
  // source color scheme: http://colorbrewer2.org/?type=qualitative&scheme=Dark2&n=6
  var colors = ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02'];
  var datapoints = [];
  var years = [];
  var index_country = -1;

  for (i = 0; i < data1.length; i++) {
    // if year is 2007, this means it's a new country
    if (data1[i].time == "2007") {
      index_country += 1;
    };
    // search for matching datapoint in dataset2
    for (j = 0; j < data2.length; j++) {

      if (data2[j].time == data1[i].time && data2[j].Country == countries[index_country]) {
        if (years.includes(data1[i].time) == false) {
          // creates list of years
          years.push(data1[i].time);
        }
        // datapoint information is added to list
        datapoints.push([data1[i].datapoint, data2[j].datapoint, data1[i].time, countries[index_country], colors[index_country]]);
      };
    };
  };
  return [datapoints, colors, countries, years];

};

function add_dropdown(svg, xScale, yScale, datapoints, years) {

  d3.select("body").append("br");
  d3.select("body").append("text").text("Choose year to show scatterplot: ").attr("class", "titles");

  // source: http://bl.ocks.org/jfreels/6734823
  var select = d3.select('body')
                 .append('select')
                 .on('change', onchange);

  var options = select.selectAll("option")
                      .data(years).enter()
                      .append("option")
                      .text(function(d) {
                        return d;
                      });

  function onchange() {
    // if dropdown changes, refill scatter with update-value = true and year = value from dropdown
    selectValue = d3.select("select").property("value");
    fill_scatter(svg, xScale, yScale, datapoints, selectValue, true);
  }
}

function create_scatter(datapoints, year, colors, countries) {

  // define size of svg
  var w = 700;
  var h = 500;
  var margin = ({top: 50, right: 250, bottom: 50, left: 50})

  // create svg
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  // add background scatterplot
  svg.append("rect")
     .attr("x", margin.left)
     .attr("y", margin.top)
     .attr("width", 400)
     .attr("height", 400)
     .style("fill", "white");

  // add background legend
  svg.append("rect")
     .attr("x", w - margin.right + 8)
     .attr("y", 300)
     .attr("width", 140)
     .attr("height", 140)
     .attr("class", "legend");

  // add title legend
  svg.append("text")
     .attr("x", 528)
     .attr("y", 315)
     .attr("class", "titles")
     .style("text-anchor", "middle")
     .text("Legend");

  // add rectangles for legend
  svg.selectAll("rect_leg")
     .data(colors)
     .enter().append("rect")
     .attr("x", 460)
     .attr("y", function(d, i) {
       return 320 + i * 20;
     })
     .attr("width", 18)
     .attr("height", 18)
     .style("fill", function(d) {
       return d;
     });

  // add text for legend
  svg.selectAll("leg_text")
     .data(countries)
     .enter().append("text")
     .attr("x", 480)
     .attr("y", function(d, i) {
       return 333 + i * 20;
     })
     .attr("class", "leg_text")
     .text(function(d) {
       return d;
     });

  // define x and y scale
  var xScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([margin.left, w - margin.right]);

  var yScale = d3.scaleLinear()
                 .domain([95,105])
                 .range([h - margin.bottom, margin.top]);

  // add x-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0, 450)")
     .call(d3.axisBottom(xScale));

  // add label x-axis
  svg.append("text")
     .attr("transform", "translate(275, 485)")
     .attr("class", "axis_text")
     .text("Female researchers (%)");

  // add y-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(50, 0)")
     .call(d3.axisLeft(yScale));

  // add label y-axis
  svg.append("text")
     .attr("transform", "translate(15, 250) rotate(-90)")
     .attr("class", "axis_text")
     .text("Consumer confidence");

  return [svg, xScale, yScale];
}

function fill_scatter(svg, xScale, yScale, datapoints, year, update) {
  // isolate data of correct year
  var data = []
  datapoints.forEach(function(element) {
    if (element[2] == year) {
      data.push(element);
    }
  });

  if (update == false) {
    // add title
    svg.append("text")
       .attr("class", "title_scat")
       .attr("transform", "translate(10, 25)")
       .text("Scatterplot female researchers and consumer confidence " + year);
    } else {
      // update title
      d3.selectAll(".title_scat").each(function(d, i) {
        d3.select(this).text("Scatterplot female researchers and consumer confidence " + year);
      });

      // remove old dots
      svg.selectAll(".dots_scat").remove();
    }

  // add dots
  svg.selectAll("circle")
     .data(data)
     .enter().append("circle")
      .attr("class", "dots_scat")
      .attr("r", 3.5)
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .style("fill", function(d) {
        return d[4];
      });

}
