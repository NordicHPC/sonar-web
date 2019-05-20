var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 100,
        bottom: 110,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;


var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/bast/sonar-web/gh-pages/example-data/stallo.csv", type, function(error, data) {

    if (error) throw error;

    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([0, 50]);

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    var columns = Object.keys(data[0]).slice(1);
    var colors = ["green", "red", "steelblue", "orange", "blue", "black", "gray", "brown", "crimson", "pink"];

    for (var i = 0; i < columns.length; i++) {
        let column = columns[i];
        let color = colors[i];
        let _line = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d[column]);
            });
        focus.append("path")
            .datum(data)
            .style("stroke", color)
            .style("stroke-width", 1.5)
            .style("fill", "none")
            .attr("d", _line);

        focus.append("text")
            .attr("x", width + 3.0)
            .attr("y", y(data[data.length - 1][column]) + 3.0)
            .attr("text-anchor", "start")
            .style("fill", color)
            .text(column);
    }
});

function type(d) {
    let _parse_date = d3.timeParse("%Y-%m-%d");
    d.date = _parse_date(d.date);
    return d;
}
