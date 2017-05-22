  //TODO: style,linechart sa rankigom,dodat logo olimpiskih, pomjerit sve u ljevo da stane barchart sa strane

d3.select(window).on("resize", throttle);

var godina = document.getElementById("textInput");
var linija = document.getElementById("inputLinija");
var play = document.getElementById("playAnimation");
var stop = document.getElementById("stopAnimation");
var igre = document.getElementById("igre");
var poMedaljama = document.getElementById("poMedaljama");
var poRankingu = document.getElementById("poRankingu");
var countries;


//za kartu
var zoom = d3.behavior.zoom()
.scaleExtent([1, 8])
.on("zoom", move);
var width = 1000;
var height = 800;
var projection,path,svg,g;
//BOJA za kartu
var color = d3.scale.linear()
.domain([0,121])
.clamp(true)
.range(["#ccccff","#1a1aff"]);

var color1 = d3.scale.linear()
.domain([0,90])
.clamp(true)
.range(["#ff9933","#ff0000"]);

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

//za bar chart
var medalje = ["Gold", "Silver", "Bronze"];
var bardata = [0];
var height2 = 150,	width2 = 200,	barPadding = 2,	barwidth = width2/7-barPadding,	margin = {top: 50, bottom: 80, left:80, right: 50};
var interval;

var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
//animacija za slider
function animate() {
    linija.value = Number(linija.value) + 4;
    linija.dispatchEvent(new Event("change"));
}
//On load
window.onload = function(){

  poRankingu.addEventListener("click", function() {
    draw();
  });

  poMedaljama.addEventListener("click", function() {
    draw();
  });
  stop.addEventListener("click", function() {
      clearInterval(interval);
  });
  play.addEventListener("click", function() {
    interval = setInterval(animate,3000);
});
  // na promjenu slidera promjeni kartu
  linija.addEventListener("change", function()
  {
    draw();
    console.log(godina.innerHTML);
  });
};

setup(width,height);

function setup(width,height){
  projection = d3.geo.mercator()
  .translate([0, 0])
  .scale(width / 2 / Math.PI);

  path = d3.geo.path()
  .projection(projection);

  svg = d3.select("#container").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .call(zoom);

  g = svg.append("g");
}
// var colorL = d3.scale.linear()
// .domain([0,20,40,60,80,100,120])
// .clamp(true)
// .range(["#ccccff","#1a1aff"]);
function drawLegend() {

  var legendRectSize = 18;
  var legendSpacing = 4;
  // var legendDiv = d3.select("#legend").append("svg").attr("height", 200).attr("width", 100);
  var legend = svg.selectAll('.legend')
    .data([0,20,40,60,80,100,120])
    .enter()
    .append('g')
    .style("z-index", 100)
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      return 'translate(' + (-width/2) + ',' + (height/2-(i+1)*25) + ')';
    });

    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return "> "+ d ; });
}

function drawLegend1() {

  var legendRectSize = 18;
  var legendSpacing = 4;
  // var legendDiv = d3.select("#legend").append("svg").attr("height", 200).attr("width", 100);
  var legend = svg.selectAll('.legend')
    .data([1,10,20,30,40,50,60,70])
    .enter()
    .append('g')
    .style("z-index", 100)
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      return 'translate(' + (-width/2) + ',' + (height/2-(i+1)*25) + ')';
    });

    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color1)
    .style('stroke', color1);

    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d,i) { return  " > " + d  ; });
}

d3.json("data/dataPRAVI.json", function(error, world) {
  countries = topojson.feature(world, world.objects.countries).features;
  draw();
});


function draw() {
    d3.select("#container svg").remove();
    setup(width,height);

    if(document.getElementById("poMedaljama").checked) {
    drawLegend();
  } else {
    drawLegend1();
  }
  var country = g.selectAll(".country").data(countries);

  country.enter().insert("path")
  .attr("class", "country")
  .attr("d", path)
  .attr("stroke", "black")
  .attr("stroke-width", 0.1)
  .attr("id", function(d,i) { return d.id; })
  .attr("title", function(d,i) { return d.properties.name; })
  .attr("fill", function(d) {
    if(document.getElementById("poMedaljama").checked) {
      switch (godina.innerHTML) {
      case "1992":
      return d.properties.g1992.Total > 0 ? color(d.properties.g1992.Total)  : "#ffffff";
        break;
      case "1996":
      return d.properties.g1996.Total > 0 ? color(d.properties.g1996.Total) : "#ffffff";
        break;
      case "2000":
      return d.properties.g2000.Total > 0 ? color(d.properties.g2000.Total) : "#ffffff";
        break;
      case "2004":
      return d.properties.g2004.Total > 0 ? color(d.properties.g2004.Total) : "#ffffff";
        break;
      case "2008":
      return d.properties.g2008.Total > 0 ? color(d.properties.g2008.Total) : "#ffffff";
        break;
      case "2012":
      return d.properties.g2012.Total > 0 ? color(d.properties.g2012.Total) : "#ffffff";
        break;
      case "2016":
      return d.properties.g2016.Total > 0 ? color(d.properties.g2016.Total) : "#ffffff";
        break;
    }
    } else {
      switch (godina.innerHTML) {
      case "1992":
      return d.properties.g1992.Olympic_Ranking > 0 ? color1(d.properties.g1992.Olympic_Ranking)  : "#ffffff";
        break;
      case "1996":
      return d.properties.g1996.Olympic_Ranking > 0 ? color1(d.properties.g1996.Olympic_Ranking) : "#ffffff";
        break;
      case "2000":
      return d.properties.g2000.Olympic_Ranking > 0 ? color1(d.properties.g2000.Olympic_Ranking) : "#ffffff";
        break;
      case "2004":
      return d.properties.g2004.Olympic_Ranking > 0 ? color1(d.properties.g2004.Olympic_Ranking) : "#ffffff";
        break;
      case "2008":
      return d.properties.g2008.Olympic_Ranking > 0 ? color1(d.properties.g2008.Olympic_Ranking) : "#ffffff";
        break;
      case "2012":
      return d.properties.g2012.Olympic_Ranking > 0 ? color1(d.properties.g2012.Olympic_Ranking) : "#ffffff";
        break;
      case "2016":
      return d.properties.g2016.Olympic_Ranking > 0 ? color1(d.properties.g2016.Olympic_Ranking) : "#ffffff";
        break;

    }
    }
    });



  //ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
  var offsetL = document.getElementById('container').offsetLeft+(width/2)+40;
  var offsetT =document.getElementById('container').offsetTop+(height/2)+20;

  //tooltips
  country
  .on("mouseover", function(d,i) {
    var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
    tooltip
    .classed("hidden", false)
    .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
    .html(function() {
      if(document.getElementById("poMedaljama").checked) {
          switch (godina.innerHTML) {
        case "1992":
        return d.properties.name + "<br>Total medals won: " + d.properties.g1992.Total;
          break;
        case "1996":
        return d.properties.name + "<br>Total medals won: " + d.properties.g1996.Total;
          break;
        case "2000":
        return d.properties.name + "<br>Total medals won: " + d.properties.g2000.Total;
          break;
        case "2004":
        return d.properties.name + "<br>Total medals won: " + d.properties.g2004.Total;
          break;
        case "2008":
        return d.properties.name + "<br>Total medals won: " + d.properties.g2008.Total;
          break;
        case "2012":
        return d.properties.name + "<br>Total medals won: " +  d.properties.g2012.Total;
          break;
        case "2016":
        return d.properties.name + "<br>Total medals won: " + d.properties.g2016.Total;
          break;
      }
      } else {
        switch (godina.innerHTML) {
        case "1992":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g1992.Olympic_Ranking;
          break;
        case "1996":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g1996.Olympic_Ranking;
          break;
        case "2000":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g2000.Olympic_Ranking;
          break;
        case "2004":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g2004.Olympic_Ranking;
          break;
        case "2008":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g2008.Olympic_Ranking;
          break;
        case "2012":
        return d.properties.name + "<br>Olympic Ranking: " +  d.properties.g2012.Olympic_Ranking;
          break;
        case "2016":
        return d.properties.name + "<br>Olympic Ranking: " + d.properties.g2016.Olympic_Ranking;
          break;
      }
      }
        });
  })
  .on("mouseout",  function(d,i) {
    tooltip.classed("hidden", true)
  })
  .on("click", function(d,i) {
    if(!document.getElementById("checkBox").checked) {
        d3.selectAll("#barchart svg").remove();
    }
    var ime_zemlje = d.properties.name;
    var godinaBarchart = godina.innerHTML;
    switch (godina.innerHTML) {
        case "2016":
        bardata[0] = d.properties.g2016.Gold;
        bardata[1] = d.properties.g2016.Silver;
        bardata[2] = d.properties.g2016.Bronze;
        break;
        case "1992":
        bardata[0] = d.properties.g1992.Gold;
        bardata[1] = d.properties.g1992.Silver;
        bardata[2] = d.properties.g1992.Bronze;
        break;
        case "1996":
        bardata[0] = d.properties.g1996.Gold;
        bardata[1] = d.properties.g1996.Silver;
        bardata[2] = d.properties.g1996.Bronze;
        break;
        case "2000":
        bardata[0] = d.properties.g2000.Gold;
        bardata[1] = d.properties.g2000.Silver;
        bardata[2] = d.properties.g2000.Bronze;
        break;
        case "2004":
        bardata[0] = d.properties.g2004.Gold;
        bardata[1] = d.properties.g2004.Silver;
        bardata[2] = d.properties.g2004.Bronze;
        break;
        case "2008":
        bardata[0] = d.properties.g2008.Gold;
        bardata[1] = d.properties.g2008.Silver;
        bardata[2] = d.properties.g2008.Bronze;
        break;
        case "2012":
        bardata[0] = d.properties.g2012.Gold;
        bardata[1] = d.properties.g2012.Silver;
        bardata[2] = d.properties.g2012.Bronze;
        break;
        case "2016":
        bardata[0] = d.properties.g2016.Gold;
        bardata[1] = d.properties.g2016.Silver;
        bardata[2] = d.properties.g2016.Bronze;
        break;
    }
    crtaj_graf(ime_zemlje,godinaBarchart);
  });

}
function crtaj_graf(naslov,godinag){
    //skale
    var xScale = d3.scale.ordinal()
    .domain(d3.range(bardata.length))
    .rangeBands([0, width2]);

    var yScale = d3.scale.linear()
    .domain([0, d3.max(bardata, function(d) {return d ;})])
    .rangeRound([height2,0]);

    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function(d, i) { return medalje[i] });

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

    var svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.bottom + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle");

    svg.append("text")
    .attr("x", (width2 / 2))
    .attr("y", (height2 + (margin.bottom / 2)))
    .attr("dy", ".5em")
    .style("text-anchor", "middle")
    .html("Medals")
    .style("font-size", "20px");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",0 - (height2 / 2))
    .attr("y",15 - margin.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of medals")
    .style("font-size", "20px");

    svg.append("text")
    .attr("x", (width2 / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    //.attr("dy", "0.3em")
    .style("font-size", "23px")
    .style("font-weight", "bold")
    .text(naslov + " - " + godinag);

    var barchart = svg.selectAll("rect")
    .data(bardata)
    .enter()
    .append("rect")
    .attr('x', function (d,i){
    	return xScale(i) +20;
    })
    .attr('y', height2)
    .attr("height", 0)
    .attr('width', barwidth)
    .attr("id", function(d,i){
    	return i;
    })
    .style("display", "inline-block")
    .attr("fill", function(d,i) {
      if(i == 0) {
        return "#D9A441";
      } else if(i == 1) {
        return "#CCC2C2";
      } else {
        return "#965A38";
      }
    })
    .on('mouseover', function(d){
    	barchart.style("cursor", "pointer");
    });

    barchart.on("mouseover", function(d,i) {
            tip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tip	.html("Medals: " + d)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    barchart.transition()
    .attr('height', function(d){
    	return yScale(0) - yScale(d);
    })
    .attr('y', function (d){
    	return yScale(d);
    })
    .delay(function(d,i){
    	return i * 15;
    })
    .duration(1000)
    .ease('elastic')
}
//crtaj_graf() - CLOSE


function redraw() {
  width = document.getElementById('container').offsetWidth-60;
  height = width / 2;
  d3.select('svg').remove();
  setup(width,height);
  draw();
}

function move() {

  var t = d3.event.translate;
  var s = d3.event.scale;
  var h = height / 3;

  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
  t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

  zoom.translate(t);
  g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
  throttleTimer = window.setTimeout(function() {
    redraw();
  }, 200);
}
//slider
function updateTextInput(val) {
          document.getElementById('textInput').innerHTML=val;
        switch (val) {
        case "1992":
        return igre.innerHTML="Spain, Barcelona";
          break;
        case "1996":
        return igre.innerHTML="United States, Atlanta";
          break;
        case "2000":
        return igre.innerHTML="Australia, Sydney";
          break;
        case "2004":
        return igre.innerHTML="Greece, Athens";
          break;
        case "2008":
        return igre.innerHTML="China, Beijing";
          break;
        case "2012":
        return igre.innerHTML="United Kingdom, London";
          break;
        case "2016":
        return igre.innerHTML="Brazil, Rio de Janeiro";
          break;
}


//


//Legend

}
