// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

window.onload = function() {
  var world = "world_countries.json"
  var life_satisfaction = "Data/output.json"

  var requests = [d3.json(world), d3.json(life_satisfaction)];

  Promise.all(requests).then(function(response) {
    var year = "2017"
    var country = "AUS"
    create_title("map", year);
    create_world_map(response, year);
    var other = "Assault rate"
    create_title("scatter", year, other);
    var plot = create_scatter();
    svg = plot[0];
    xScale = plot[1];
    yScale = plot[2];

    fill_scatter(svg, xScale, yScale, response, country, other, update=false)

    // var plot = create_scatter(data, year, colors, countries);
    // var svg = plot[0];
    // var xScale = plot[1];
    // var yScale = plot[2];
    // var update = false;
  }).catch(function(e){
      throw(e);
  });

}

function create_world_map(response, year) {
  var format = d3.format(",");

  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                if (d.life_satisfaction != 0) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Life satisfaction: </strong><span class='details'>" + format(d.life_satisfaction) +"</span>";
                } else {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Life satisfaction: </strong><span class='details'> Unknown </span>";
                }
              })

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

  // source colorscheme: http://colorbrewer2.org/?type=sequential&scheme=Greens&n=9
  var color = d3.scaleLinear()
      .domain([0, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0])
      .range(["rgb(169,169,169)", "rgb(247,252,245)", "rgb(229,245,224)", "rgb(199,233,192)", "rgb(161,217,155)", "rgb(116,196,118)", "rgb(65,171,93)", "rgb(35,139,69)", "rgb(0,109,44)", "rgb(0,68,27)" ]);

  var path = d3.geoPath();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(130)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  var world = response[0];
  var life_satisfaction = response[1];

  var life_satisfactionById = {}

  for (var key in life_satisfaction[year]) {
    life_satisfactionById[key] = life_satisfaction[year][key]["Life satisfaction"]["Total"]
  }

  world.features.forEach(function(d) {
    if (life_satisfactionById[d.id]) {
        d.life_satisfaction = life_satisfactionById[d.id];
    } else {
      life_satisfactionById[d.id] = 0;
      d.life_satisfaction = 0
    }
  });

  svg.append("g")
     .attr("class", "countries")
    .selectAll("path")
      .data(world.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(life_satisfactionById[d.id]); })
      .style("stroke", "white")
      .style("stroke-width", 1.5)
      .style("opacity", 0.8)
        // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d){
        tip.hide(d);

        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      });

  svg.append("path")
     .datum(topojson.mesh(world.features, function(a, b) { return a.id !== b.id; }))
      // .datum(topojson.mesh(world.features, function(a, b) { return a !== b; }))
     .attr("class", "names")
     .attr("d", path);
}

function create_title(sort, year, other="") {
  if (sort == "map") {
    d3.select("body").append("h2").attr("class", "title_map").text("World Map Life satisfaction " + year);
  } else {
    d3.select("body").append("h2").attr("class", "title_map").text("Scatterplot Life satisfaction and " + other + " " + year);
  }
}

function change_title(sort, year, other="") {
  d3.selectAll(".title_map").each(function(d, i) {
    if (sort == "map") {
      d3.select(this).text("World Map Life satisfaction " + year);
    } else {
      d3.select(this).text("Scatterplot Life satisfaction and " + other + " " + year);
    }
  })
}

function create_scatter() {

  // define size of svg
  var w = 700;
  var h = 500;
  var margin = ({top: 10, right: 250, bottom: 50, left: 50})

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
     .attr("height", 440)
     .style("fill", "white");

  // // add background legend
  // svg.append("rect")
  //    .attr("x", w - margin.right + 8)
  //    .attr("y", 300)
  //    .attr("width", 140)
  //    .attr("height", 140)
  //    .attr("class", "legend");
  //
  // // add title legend
  // svg.append("text")
  //    .attr("x", 528)
  //    .attr("y", 315)
  //    .attr("class", "titles")
  //    .style("text-anchor", "middle")
  //    .text("Legend");
  //
  // // add rectangles for legend
  // svg.selectAll("rect_leg")
  //    .data(colors)
  //    .enter().append("rect")
  //    .attr("x", 460)
  //    .attr("y", function(d, i) {
  //      return 320 + i * 20;
  //    })
  //    .attr("width", 18)
  //    .attr("height", 18)
  //    .style("fill", function(d) {
  //      return d;
  //    });
  //
  // // add text for legend
  // svg.selectAll("leg_text")
  //    .data(countries)
  //    .enter().append("text")
  //    .attr("x", 480)
  //    .attr("y", function(d, i) {
  //      return 333 + i * 20;
  //    })
  //    .attr("class", "leg_text")
  //    .text(function(d) {
  //      return d;
  //    });

  // define x and y scale
  var xScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([margin.left, w - margin.right]);

  var yScale = d3.scaleLinear()
                 .domain([0,10])
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
     .text("Other variable");

  // add y-axis
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(50, 0)")
     .call(d3.axisLeft(yScale));

  // add label y-axis
  svg.append("text")
     .attr("transform", "translate(15, 250) rotate(-90)")
     .attr("class", "axis_text")
     .text("Life Satisfaction");

  return [svg, xScale, yScale];
}

function fill_scatter(svg, xScale, yScale, response, country, other, update=false) {
  var life_satisfaction = response[1];

  var data = []

  for (var key in life_satisfaction) {
    var dwelling = life_satisfaction[key][country]["Life expectancy"]["Total"];
    var life = life_satisfaction[key][country]["Life satisfaction"]["Total"];
    data.push([dwelling, life, key]);
    // console.log(dwelling);
    // console.log(life);
  }

  console.log(data);

  if (update == true) {
      // remove old dots
      svg.selectAll(".dots_scat").remove();
    }

  var color = d3.scaleOrdinal()
      .domain(["2013", "2014", "2015", "2016", "2017"])
      .range(["rgb(161,217,155)", "rgb(116,196,118)", "rgb(65,171,93)", "rgb(35,139,69)", "rgb(0,109,44)"]);


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
        return color(d[2]);
      });
}
