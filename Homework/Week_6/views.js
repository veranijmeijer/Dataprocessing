// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

window.onload = function() {
  var world = "world_countries.json";
  var life_index = "life_index.tsv";

  var requests = [d3.json(world), d3.tsv(life_index)]

  Promise.all(requests).then(function(response) {
    var country = "Netherlands";
    create_title("map");
    var map = add_svg("map");
    var svg_map = map[0];
    var margin_map = map[1];
    var width = map[2];
    var height = map[3];

    create_title("bar", country);
    var barchart = add_svg("barchart");
    var svg_bar = barchart[0];
    var margin_bar = barchart[1];
    var width = barchart[2];
    
    var height = barchart[3];
    updated_barchart = create_barchart(svg_bar, margin_bar, width, height, country, response);
    svg_bar = updated_barchart[0];
    xScale = updated_barchart[1];
    yScale = updated_barchart[2];
    create_world_map(svg_map, margin_map, width, height, response, svg_bar, margin_bar, xScale, yScale);

  }).catch(function(e){
      throw(e);
  });

}

function add_svg(sort) {
  // var format = d3.format(",");
  if (sort == "map") {
    var margin = {top: 0, right: 0, bottom: 0, left: 0};
  } else {
    var margin = {top: 30, right: 10, bottom: 150, left: 50};
  }

  var width = 960;
  var height = 600;

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', sort);

  return [svg, margin, width, height];

}

function create_world_map(svg, nargin, width, height, response, svg_bar, margin_bar, xScale_bar, yScale_bar) {
  var format = d3.format(",");

  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                if (d.quality_index != 0) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Quality of Life Index: </strong><span class='details'>" + format(d.quality_index) +"</span>";
                } else {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Quality of Life Index: </strong><span class='details'> Unknown </span>";
                }
              })

  // source colorscheme: http://colorbrewer2.org/?type=sequential&scheme=Greens&n=9
  var color = d3.scaleLinear()
      .domain([0, 80, 100, 120, 140, 160, 180, 200])
      .range(['rgb(169,169,169)', 'rgb(237,248,251)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,88,36)']);
  var path = d3.geoPath();

  var projection = d3.geoMercator()
                     .scale(130)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  var world = response[0];
  var quality_index = response[1];

  var quality_indexByName = {}

  quality_index.forEach(function(element) {
    quality_indexByName[element["Country"]] = element["Quality of Life Index"];
  })

  world.features.forEach(function(d) {
    if (quality_indexByName[d.properties.name]) {
        d.quality_index = quality_indexByName[d.properties.name];
    } else {
      quality_indexByName[d.properties.name] = 0;
      d.quality_index = 0;
    }
  });

  svg.append("g")
     .attr("class", "countries")
    .selectAll("path")
      .data(world.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(quality_indexByName[d.properties.name]); })
      .style("stroke", "white")
      .style("stroke-width", 1.5)
      .style("opacity", 0.8)
        // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d) {
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d) {
        tip.hide(d);

        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      })
      .on('click', function(d) {
        // console.log(d.properties.name, "joehoe");
        country = d.properties.name;
        change_title("bar", country);
        svg_bar = update_barchart(svg_bar, margin_bar, width, height, country, response, xScale_bar, yScale_bar);
      });

  svg.append("path")
     .datum(topojson.mesh(world.features, function(a, b) { return a.id !== b.id; }))
      // .datum(topojson.mesh(world.features, function(a, b) { return a !== b; }))
     .attr("class", "names")
     .attr("d", path);
}

function create_title(sort, country="") {
  if (sort == "map") {
    d3.select("body").append("h2").attr("class", "title_map").text("World Map Quality of Life Index 2018");
  } else {
    d3.select("body").append("h2").attr("class", "title_bar").text("Bar Chart " + country);
  }
}

function change_title(sort, country="") {
  if (sort == "bar") {
    d3.selectAll(".title_bar").each(function(d, i) {
      d3.select(this).text("Bar Chart " + country);
    })
  }
}

function create_barchart(svg, margin, width, height, country, response) {
  var quality_index = response[1];
  var xScale, yScale;

  quality_index.forEach(function(element) {
    if (element["Country"] == country) {

      var format = d3.format(",");

      // Set tooltips
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong>Index: </strong><span class='details'>" + format(d[1]) +"</span>";
                  })

      svg.call(tip);

      var datasets = [];
      var keys = [];
      var range_keys = [margin.left];
      var max_value = 0

      for (var key in element) {
        if (key != "Rank" && key != "Country" && key != "Quality of Life Index") {
          var dataset = []
          dataset.push(key, +element[key]);
          if (+element[key] > max_value) {
            max_value = +element[key];
          }
          datasets.push(dataset);
          keys.push(key);
          range_keys.push(range_keys[range_keys.length - 1] + 112.5);
        }
      }
      // console.log(datasets)
      max_value = Math.ceil(max_value / 10) * 10;

      // define x and y scale
      xScale = d3.scaleOrdinal()
                     .domain(keys)
                     .range(range_keys);

      yScale = d3.scaleLinear()
                     .domain([0, max_value])
                     .range([height - margin.bottom, margin.top]);

       // add y-axis
       svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(50, 0)")
          .call(d3.axisLeft(yScale));

       // add label y-axis
       svg.append("text")
          .attr("transform", "translate(15, 100) rotate(-90)")
          .attr("class", "y-axis-text")
          .text("Index");

     // add x-axis
     svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, 450)")
        .attr("tickSize", "0")
        .call(d3.axisBottom(xScale))
      .selectAll("text")
        .attr("y", 55)
        .attr("x", -5)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");

      var padding = 5;

      svg.selectAll("rect")
         .data(datasets)
         .enter()
         .append("rect")
         .attr("class", "bars")
         .attr("x", function(d) {
           return xScale(d[0]) + padding / 2;
         })
         .attr("y", function(d) {
           return yScale(d[1]);
         })
         .attr("width", (width - margin.left) / datasets.length - padding)
         .attr("height", function(d) {
           return yScale(0) - yScale(d[1]);
         })
         .style("fill", "rgb(0,88,36)")
         .on('mouseover',function(d){
           tip.show(d);

           d3.select(this)
             .style("fill", 'rgb(102,194,164)');
       })
       .on('mouseout', function(d){
         tip.hide(d)
         d3.select(this)
           .style("fill", 'rgb(0,88,36)');
       });
    }

  })
  return [svg, xScale, yScale];

}



function update_barchart(svg, margin, width, height, country, response, xScale, yScale) {
  // console.log(svg);
  var quality_index = response[1];
  var data_found = false;

  quality_index.forEach(function(element) {
    if (element["Country"] == country) {
      data_found = true;

      var format = d3.format(",");

      // Set tooltips
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong>Index: </strong><span class='details'>" + format(d[1]) +"</span>";
                  })

      svg.call(tip);

      var datasets = [];
      var keys = [];
      var range_keys = [margin.left];
      var max_value = 0

      for (var key in element) {
        if (key != "Rank" && key != "Country" && key != "Quality of Life Index") {
          var dataset = []
          dataset.push(key, +element[key]);
          if (+element[key] > max_value) {
            max_value = +element[key];
          }
          datasets.push(dataset);
          keys.push(key);
          range_keys.push(range_keys[range_keys.length - 1] + 112.5);
        }
      }
      // console.log(datasets)
      max_value = Math.ceil(max_value / 10) * 10;
      // console.log(Math.ceil(max_value / 10) * 10);

      console.log(yScale);
      yScale.domain([0, max_value]);
      console.log(yScale);

     // add y-axis
     svg.select(".y-axis")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScale));


      if (svg.selectAll("#no-data").empty() == true) {
        // console.log(svg.selectAll(".bars"));
        svg.selectAll(".bars")
           .data(datasets)
           .attr("y", function(d) {
             return yScale(d[1]);
           })
           .attr("height", function(d) {
             return yScale(0) - yScale(d[1]);
           });
        // update bars
      } else {
        svg.select("#no-data").remove();
        // add y-axis
        svg.append("g")
           .attr("class", "y-axis")
           .attr("transform", "translate(50, 0)")
           .call(d3.axisLeft(yScale));

        // add label y-axis
        svg.append("text")
           .attr("transform", "translate(15, 100) rotate(-90)")
           .attr("class", "y-axis-text")
           .text("Index");

      // add x-axis
      svg.append("g")
         .attr("class", "x-axis")
         .attr("transform", "translate(0, 450)")
         .attr("tickSize", "0")
         .call(d3.axisBottom(xScale))
       .selectAll("text")
         .attr("y", 55)
         .attr("x", -5)
         .attr("transform", "rotate(-90)")
         .style("text-anchor", "end");
        // console.log("halloe")
        // console.log(svg.select("#no-data"));
        var padding = 5;


        svg.selectAll("rect")
           .data(datasets)
           .enter()
           .append("rect")
           .attr("class", "bars")
           .attr("x", function(d) {
             return xScale(d[0]) + padding / 2;
           })
           .attr("y", function(d) {
             return yScale(d[1]);
           })
           .attr("width", (width - margin.left) / datasets.length - padding)
           .attr("height", function(d) {
             return yScale(0) - yScale(d[1]);
           })
           .style("fill", "rgb(0,88,36)")
           .on('mouseover',function(d){
             tip.show(d);

             d3.select(this)
               .style("fill", 'rgb(102,194,164)');
         })
         .on('mouseout', function(d){
           tip.hide(d)
           d3.select(this)
             .style("fill", 'rgb(0,88,36)');
         });

        // console.log("pech")
        // add bars
      }
    }
  })

  if (data_found == false) {
    if (svg.selectAll("#no-data").empty() == true) {
      svg.selectAll(".x-axis").remove();
      svg.selectAll(".y-axis").remove();
      svg.selectAll(".y-axis-text").remove();
      svg.selectAll(".bars").remove();
      svg.append("text")
         .attr("id", "no-data")
         .attr("x", 0)
         .attr("y", 10)
         .text("No data available for " + country + ". Select another country.");
    } else {
    svg.selectAll("#no-data").each(function(d, i) {
      d3.select(this).text("No data available for " + country + ". Select another country.")
    });
    }
    // console.log("hallo")

  }
  return svg;
}
