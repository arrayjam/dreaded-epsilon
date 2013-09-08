var data = {
  prior: 0.5,
  pos_likelihood: 0.75,
  neg_likelihood: 0.15
};

console.log(data);

var viz = BayesVisual().width(10).height(10);
d3.selectAll("bv")
  .data([data])
  .call(viz);

function BayesVisual() {
  var top = 0,
    left = 0,
    width,
    height,
    scale = d3.scale.linear().domain([0, 1]).range([0, 300]),
    top_left, top_right, bottom_left, bottom_right,
    horizontal, left_vertical, right_vertical,
    left_move, right_move;

  var chart = function(selection) {
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
      console.log("yup", data);
    });
  };

  chart.top = function(_) {
    if (!arguments.length) return top;
    top = _;
    return chart;
  };

  chart.left = function(_) {
    if (!arguments.length) return left;
    left = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  return chart;
}

