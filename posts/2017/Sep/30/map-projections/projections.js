var projectionOptions = [
    {name: "Mercator ", projection: d3.geoMercator () },
    {name: "Azimuthal Equal Area", projection: d3.geoAzimuthalEqualArea() },
    {name: "Azimuthal Equal Distance", projection: d3.geoAzimuthalEquidistant() },
    {name: "Conic Conformal", projection: d3.geoConicConformal() },
    {name: "Conic Equal Area", projection: d3.geoConicEqualArea () },
    {name: "Conic Equal Distance", projection: d3.geoConicEquidistant () },
    {name: "Equirectangular ", projection: d3.geoEquirectangular () },
    {name: "Gnomonic ", projection: d3.geoGnomonic () },
    {name: "Othographic ", projection: d3.geoOrthographic () },
    {name: "Stereographic ", projection: d3.geoStereographic () },
    {name: "Transverse Mercator", projection: d3.geoTransverseMercator() }
];


var width = 960,
    height = 500;


var svg = d3.select("#app").append("svg")
    .attr("width", width)
    .attr("height", height);
    
var options = d3.select("#app").append("div")
    
var menu = options
    .append("select")
    .attr("id", "menu")
    .on("change", changeProjection);

menu.selectAll("option")
    .data(projectionOptions)
    .enter().append("option")
    .text(function(d) { return d.name; });
    
var roamingState = false,
    roamText = {false:"Start Roaming", true:"Stop Roaming"};

var roamButtom = options.append("button")
    .text(roamText[roamingState])
    .on("click", function() {
        roamingState = !roamingState;
        d3.select(this).text(roamText[roamingState]);
        if (roamingState) {beginRoam()};
    });
    
    
var projection = projectionOptions[d3.select("#menu").node().selectedIndex].projection,
    graticule = d3.geoGraticule();
    path = d3.geoPath(projection);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
    
    
var zeroMarker = svg.append("circle")
    .attr("cx", projection([0,0])[0])
    .attr("cy", projection([0,0])[1])
    .attr("r", 3)
    .style("fill", "green");
    
var targetMarker = svg.append("circle")
    .attr("cx", projection([0,0])[0])
    .attr("cy", projection([0,0])[1])
    .attr("r", 3)
    .style("fill", "red");
    
    
d3.json("resources/110m.json", function(error, w) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(w, w.objects.countries))
      .attr("class", "land")
      .attr("d", path);
});

svg.on("click", mouseClick);

function mouseClick(){
    var point = d3.mouse(this),
        mapPoint = projection.invert(point);    
    rotateTo(mapPoint);
}

function rotateTween(newPoint){
    return function(d){
        var p = d3.select(this);
        var currentPoint = projection.rotate();
        var r = d3.geoInterpolate(currentPoint, coordToRotation(newPoint));

      return function(t) {
          // update projection
          projection.rotate(r(t));
          
          // update path
          var newPath = d3.geoPath().projection(projection);
          p.attr("d", newPath(d));
          
          //update markers
          targetMarker
            .attr("cx", projection(newPoint)[0])
            .attr("cy", projection(newPoint)[1]);
          
      };

    }
}

function changeProjectionTween(newProjection){
    return function(d){
        var p = d3.select(this);
        var currentPoint = projection.rotate();
        var r = d3.geoInterpolate(currentPoint, coordToRotation(newPoint));

      return function(t) {
          // update projection
          projection.rotate(r(t));
          
          // update path
          var newPath = d3.geoPath().projection(projection);
          p.attr("d", newPath(d));
          
          //update markers
          targetMarker
            .attr("cx", projection(newPoint)[0])
            .attr("cy", projection(newPoint)[1]);
          
      };

    }
}

function rotateTo(newPoint){
    targetMarker
        .attr("cx", projection(newPoint)[0])
        .attr("cy", projection(newPoint)[1]);
    
    svg.selectAll("path")
        .transition()
        .duration(1000)
        .tween("rotate", rotateTween(newPoint))
        .on("end", function() { 
            if(roamingState){beginRoam();}
         });
}

function coordToRotation([long, lat]){
    return [-long, -lat, 0];
}

function changeProjection(){
    var currentRotation = projection.rotate();
    projection = projectionOptions[this.selectedIndex]
        .projection;
    
    projection.rotate([0,0,0]);
    var displayZero =  projection([0,0]);
    projection.rotate(currentRotation);
    
    zeroMarker
        .attr("cx", displayZero[0])
        .attr("cy", displayZero[1]);

    var newPath = d3.geoPath().projection(projection);
    
    svg.selectAll("path")
        .attr("d", newPath);
}

function beginRoam(){
    newPoint = [
        d3.randomUniform(-180,180)(),
        (d3.randomNormal(0,1)() * 45) % 90
    ];
    
    rotateTo(newPoint);
}