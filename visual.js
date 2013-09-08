var data = {
  prior: 0.5,
  pos_likelihood: 0.75,
  neg_likelihood: 0.15
};

console.log(data);

var area = BayesArea().side(300);
var line = BayesLine().width(300);
var ba = d3.selectAll("ba");
var bl = d3.selectAll("bl");

var update = function() {
  ba.data([data]).call(area);
  bl.data([data]).call(line);
  var w = data.pos_likelihood * data.prior;
  var m = data.neg_likelihood * (1 - data.prior);

  var r = w / (m + w);
  console.log(r);

};
update();

function BayesLine() {
  var width = 500,
    height = 50,
    scale = d3.scale.linear().domain([0, 1]).rangeRound([0, width]),
    left_scale = d3.scale.linear().domain([0, 1]).rangeRound([0, width]),
    right_scale = d3.scale.linear().domain([0, 1]).rangeRound([0, width]),
    far_left, near_left, near_right, far_right;

  var chart = function(selection) {
    scale.range([0, width]);

    selection.each(function(data) {
      left_scale.rangeRound([scale(0), scale(data.prior)]);
      right_scale.rangeRound([scale(0), scale(1 - data.prior)]);
      console.log("here", left_scale.domain(), left_scale.range());
      var div = d3.select(this);

      var g = div.select("svg g");

      if (g.empty()) {
        g = div.append("svg").append("g");

        far_left = g.append("rect")
          .attr({
            class: "outline far left",
            x: left_scale(0) + 0.5,
            y: 0.5,
            height: height
          });

        near_left = g.append("rect")
          .attr({
            class: "outline near left",
            y: 0.5,
            height: height
          });

        near_right = g.append("rect")
          .attr({
            class: "outline near right",
            y: 0.5,
            height: height
          });

        far_right = g.append("rect")
          .attr({
            class: "outline far right",
            y: 0.5,
            height: height
          });

      }

      far_left
        .attr({
          width: function(d) { return left_scale(1 - d.pos_likelihood); }
        });

      near_left
        .attr({
          x: function(d) { return left_scale(1 - d.pos_likelihood) + 0.5; },
          width: function(d) { return left_scale(d.pos_likelihood); }
        });

      near_right
        .attr({
          x: left_scale(1) + right_scale(0) + 0.5,
          width: function(d) { return right_scale(d.neg_likelihood); }
        });

      far_right
        .attr({
          x: function(d) { return left_scale(1) + right_scale(d.neg_likelihood) + 0.5; },
          width: function(d) { return right_scale(1 - d.neg_likelihood); }
        });
    });

  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  return chart;
}

function BayesArea() {
  var side = 300,
    scale = d3.scale.linear().domain([0, 1]).range([0, side]),
    top_left, top_right, bottom_left, bottom_right,
    horizontal, left_vertical, right_vertical,
    left_move, right_move;

  var chart = function(selection) {
    scale.range([0, side]);
    selection.each(function(data) {
      var div = d3.select(this);

      var g = div.select("svg g");

      // Construct the viz
      if (g.empty()) {
        g = div.append("svg").append("g");

        top_left = g.append("rect")
          .attr({
            class: "outline top left",
            x: scale(0) + 0.5,
            y: scale(0) + 0.5
          });

        bottom_left = g.append("rect")
          .attr({
            class: "outline bottom left",
            x: scale(0) + 0.5,
          });

        top_right = g.append("rect")
          .attr({
            class: "outline top right",
            y: scale(0) + 0.5
          });

        bottom_right = g.append("rect")
          .attr({
            class: "outline bottom right"
          });

        var horiz_drag = d3.behavior.drag()
          .on("drag", function(d) {
            var x = scale.invert(d3.event.x);
            if (x <= 0 || x >= 1) return;
            d.prior = x;
            update();
          });

        horizontal = g.append("line")
          .attr({
            class: "horizontal resize",
            y1: scale(0) + 0.5,
            y2: scale(1) + 0.5
          })
          .call(horiz_drag);

        var left_vert_drag = d3.behavior.drag()
          .on("drag", function(d) {
            var y = scale.invert(d3.event.y);
            if (y <= 0 || y >= 1) return;
            d.pos_likelihood = y;
            update();
          });

        left_vertical = g.append("line")
          .attr({
            class: "vertical resize left",
            x1: scale(0) + 0.5,
          })
          .call(left_vert_drag);

        var right_vert_drag = d3.behavior.drag()
          .on("drag", function(d) {
            var y = scale.invert(d3.event.y);
            if (y <= 0 || y >= 1) return;
            d.neg_likelihood = y;
            update();
          });

        right_vertical = g.append("line")
          .attr({
            class: "vertical resize right",
            x2: scale(1) + 0.5,
          })
          .call(right_vert_drag);

        var left_move_drag = d3.behavior.drag()
          .on("drag", function(d) {
            var x = scale.invert(d3.event.x);
            var y = scale.invert(d3.event.y);
            if (x <= 0 || x >= 1 || y <= 0 || y >= 1) return;
            d.prior = x;
            d.pos_likelihood = y;
            update();
          });

        left_move = g.append("circle")
          .attr({
            class: "move left",
            r: 5
          })
          .call(left_move_drag);

        var right_move_drag = d3.behavior.drag()
          .on("drag", function(d) {
            var x = scale.invert(d3.event.x);
            var y = scale.invert(d3.event.y);
            if (x < 0 || x > 1 || y < 0 || y > 1) return;
            d.prior = x;
            d.neg_likelihood = y;
            update();
          });

        right_move = g.append("circle")
          .attr({
            class: "move right",
            r: 5
          })
          .call(right_move_drag);

      }
      top_left
        .attr({
          width: function(d) { return scale(d.prior); },
          height: function(d) { return scale(d.pos_likelihood); }
        });

      bottom_left
        .attr({
          y: function(d) { return scale(d.pos_likelihood) + 0.5; },
          width: function(d) { return scale(d.prior); },
          height: function(d) { return scale(1 - d.pos_likelihood); }
        });

      top_right
        .attr({
          x: function(d) { return scale(d.prior) + 0.5; },
          width: function(d) { return scale(1 - d.prior); },
          height: function(d) { return scale(d.neg_likelihood); }
        });

      bottom_right
        .attr({
          x: function(d) { return scale(d.prior) + 0.5; },
          y: function(d) { return scale(d.neg_likelihood) + 0.5; },
          width: function(d) { return scale(1 - d.prior); },
          height: function(d) { return scale(1 - d.neg_likelihood); }
        });

      horizontal
        .attr({
          x1: function(d) { return scale(d.prior) + 0.5; },
          x2: function(d) { return scale(d.prior) + 0.5; },
        });

      left_vertical
        .attr({
          x2: function(d) { return scale(d.prior) + 0.5; },
          y1: function(d) { return scale(d.pos_likelihood) + 0.5; },
          y2: function(d) { return scale(d.pos_likelihood) + 0.5; },
        });

      right_vertical
        .attr({
          x1: function(d) { return scale(d.prior) + 0.5; },
          y1: function(d) { return scale(d.neg_likelihood) + 0.5; },
          y2: function(d) { return scale(d.neg_likelihood) + 0.5; },
        });

      left_move
        .attr({
          cx: function(d) { return scale(d.prior); },
          cy: function(d) { return scale(d.pos_likelihood); }
        });

      right_move
        .attr({
          cx: function(d) { return scale(d.prior); },
          cy: function(d) { return scale(d.neg_likelihood); }
        });
      console.log("yup", data);
    });
  };

  chart.side = function(_) {
    if (!arguments.length) return side;
    side = _;
    return chart;
  };

  return chart;
}

