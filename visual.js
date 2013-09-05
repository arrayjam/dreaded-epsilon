var data = {
  left_w: 0.5,
  left_h: 0.75,
  right_h: 0.15
};

data.right_w = 1 - data.left_w;
console.log(data);

var color = d3.scale.category10();
var scale = d3.scale.linear()
  .domain([0, 1])
  .rangeRound([0, 500]);

var svg = d3.select("body").append("svg")
  .append("g")
  .attr("transform", "translate(" + [10, 10] + ")")
  .datum([data]);

/*  W  M
 * -------
 * |  |  | L
 * -------
 * |  |  | ~L
 * ------
 */
function update() {
  var rect, text, line, circle;
  rect = svg.selectAll(".top.left")
    .data(function(d) { return d; });
  rect.enter().append("rect");
  rect.attr({
      class: "top left",
      x: 0.5,
      y: 0.5,
      width: function(d) { return scale(d.left_w);  },
      height: function(d) { return scale(d.left_h); },
      fill: "none",
      stroke: "black"
    });

//  text = svg.selectAll("text.top.left")
//    .data(function(d) { return d; });
//  text.enter().append("text")
//    .attr({
//      class: "top left",
//      x: function(d) { return scale(d.left_w) / 2; },
//      y: function(d) { return scale(d.left_h) / 2; },
//    })
//    .style("text-anchor", "middle")
//    .text("P(Long Hair | Woman)");

  rect = svg.selectAll(".bottom.left")
    .data(function(d) { return d; });
  rect.enter().append("rect");
  rect.attr({
      class: "bottom left",
      x: 0.5,
      y: function(d) { return scale(d.left_h) + 0.5; },
      width: function(d) { return scale(d.left_w); },
      height: function(d) { return scale(1 - d.left_h); },
      fill: "none",
      stroke: "black"
    });

  rect = svg.selectAll(".top.right")
    .data(function(d) { return d; });
  rect.enter().append("rect");
  rect.attr({
      class: "top right",
      x: function(d) { return scale(d.left_w) + 0.5; },
      y: 0.5,
      width: function(d) { return scale(d.right_w); },
      height: function(d) { return scale(d.right_h); },
      fill: "none",
      stroke: "black"
    });

  rect = svg.selectAll(".bottom.right")
    .data(function(d) { return d; });
  rect.enter().append("rect");
  rect.attr({
      class: "bottom right",
      x: function(d) { return scale(d.left_w) + 0.5; },
      y: function(d) { return scale(d.right_h) + 0.5; },
      width: function(d) { return scale(d.right_w); },
      height: function(d) { return scale(1 - d.right_h); },
      fill: "none",
      stroke: "black"
    });

  line = svg.selectAll(".horizontal.resize")
    .data(function(d) { return d; });
  line.enter().append("line");
  line.attr({
      class: "horizontal resize",
      x1: function(d) { return scale(d.left_w) + 0.5; },
      x2: function(d) { return scale(d.left_w) + 0.5; },
      y1: scale(0),
      y2: scale(1),
      stroke: "red"
    })
    .style("stroke-width", 7)
    .style("opacity", 0)
    .call(d3.behavior.drag()
          .on("drag", function(d) {
            if (d3.event.x <= scale(0) || d3.event.x >= scale(1))
              return;
            d.left_w = scale.invert(d3.event.x);
            d.right_w = 1 - d.left_w;
            svg.datum([data]);
            update();
            console.log(d);
          })
         );

  line = svg.selectAll(".vertical.resize.left")
    .data(function(d) { return d; });
  line.enter().append("line");
  line.attr({
      class: "vertical resize left",
      x1: scale(0) + 0.5,
      x2: function(d) { return scale(d.left_w) + 0.5; },
      y1: function(d) { return scale(d.left_h) + 0.5; },
      y2: function(d) { return scale(d.left_h) + 0.5; },
      stroke: "red"
    })
    .style("stroke-width", 7)
    .style("opacity", 0)
    .call(d3.behavior.drag()
          .on("drag", function(d) {
            if (d3.event.y <= scale(0) || d3.event.y >= scale(1))
              return;
            d.left_h = scale.invert(d3.event.y);
            svg.datum([data]);
            update();
            console.log(d);
          })
         );

  line = svg.selectAll(".vertical.resize.right")
    .data(function(d) { return d; });
  line.enter().append("line");
  line.attr({
      class: "vertical resize right",
      x1: function(d) { return scale(d.left_w) + 0.5; },
      x2: scale(1) + 0.5,
      y1: function(d) { return scale(d.right_h) + 0.5; },
      y2: function(d) { return scale(d.right_h) + 0.5; },
      stroke: "red"
    })
    .style("stroke-width", 7)
    .style("opacity", 0)
    .call(d3.behavior.drag()
          .on("drag", function(d) {
            if (d3.event.y <= scale(0) || d3.event.y >= scale(1))
              return;
            d.right_h = scale.invert(d3.event.y);
            svg.datum([data]);
            update();
            console.log(d);
          })
         );

//  circle = svg.selectAll(".left.mover")
//    .data(function(d) { return d; });
//  line.enter().append("circle");
//  line.attr({
//      class: "left mover",
//      dx:,
//      dy:,
//      r: 5,
//      y2: function(d) { return scale(d.right_h); },
//      stroke: "black",
//      strokeWidth: 4
//    })
//    .call(d3.behavior.drag()
//          .on("drag", function(d) {
//            if (d3.event.y <= scale(0) || d3.event.y >= scale(1))
//              return;
//            d.right_h = scale.invert(d3.event.y);
//            svg.datum([data]);
//            update();
//            console.log(d);
//          })
//         );

   var w = data.left_h * data.left_w;
   var m = data.right_h * data.right_w;

   var r = w / (m + w);
   console.log(r);

}
//line = svg.selectAll(".vertical.resize")
//  .data(function(d) { return d; })
//  .enter().append("line")
//  .attr({
//    class: "vertical resize left",
//    x1: 0,
//    x2: function(d) { return scale(d.left_w); },
//    y1: function(d) { return scale(d.left_h); },
//    y2: function(d) { return scale(d.left_h); },
//    stroke: "black",
//    strokeWidth: 3
//  })
//  .call(d3.behavior.drag()
//        .on("drag", function(d) {
//          d.left_w = d3.event.y;
//
//
//          //var y = d3.event.y;
//          //if (y <= 0 || y >= scale(1)) return;
//          //d3.selectAll(".top.left").attr("height", y);
//          //d3.selectAll(".right").attr("x", x).attr("width", scale(1) - x);
//          //d3.selectAll(".horizontal.resize").attr({
//          //  x1: x,
//          //  x2: x
//          //});
//        })
//       );
update();






