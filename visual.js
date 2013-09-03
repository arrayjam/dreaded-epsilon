var data = {
  W: 0.5,
  LW: 0.75,
  LM: 0.15
};

var w = data.LW * data.W;
var m = data.LM * (1 - data.W);

var r = w / (m + w);
console.log(r);

var widths = [];
[1, 2].map(function() {
  widths.push(~~(Math.random() * 500));
});

var svg = d3.select("body").append("svg");
var colors = d3.scale.category10();
var offset = 0;

var rect = svg.selectAll("rect")
    .data(widths)
  .enter().append("rect")
    .attr({
      x: function(d) { var x = offset; offset += d; return x; },
      y: 0,
      width: function(d) { return d; },
      height: 50,
      fill: function(d, i) { return colors(i); },
      class: function(d, i) { return "rect-" + i; }
    });

var width = d3.sum(widths);
console.log(width);

var drag = d3.behavior.drag()
  .on("drag", function() {
    var x = d3.event.x;
    if (x <= 0 || x >= width) return;
    d3.select(".rect-0").attr("width", x);
    d3.select(".rect-1").attr("x", x).attr("width", width - x);
    line.attr("x1", x).attr("x2", x);
    svg.style("cursor", "ew-resize");
    //svg.selectAll
    })
  .on("dragend", function() {
    svg.style("cursor", "auto");
  });

var line = svg.append("line")
  .attr({
    x1: widths[0],
    x2: widths[0],
    y1: 0,
    y2: 50
  })
  .style({
    stroke: "green",
    "stroke-width": 10
  })
  .call(drag);
