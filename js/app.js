function add_plot(id, date_period, type_parse, url) {

    var svg = d3.select(id);

    var margin = {
        top: 20,
        right: 100,
        bottom: 110,
        left: 40
    };

    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(url, type_parse, function(error, data) {

        if (error) throw error;

        x.domain(d3.extent(data, function(d) {
            return d[date_period];
        }));
        y.domain([0, 60]);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        // text label for the y axis
        focus.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("CPU load percentage");

        var columns = Object.keys(data[0]).slice(1);
        var colors = ["green", "red", "steelblue", "orange", "blue", "black", "gray", "brown", "crimson", "pink"];

        for (var i = 0; i < columns.length; i++) {
            let column = columns[i];
            let color = colors[i];
            let _line = d3.line()
                .curve(d3.curveMonotoneX)
                .x(function(d) {
                    return x(d[date_period]);
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
}


function date_parse(d) {
    let _parse = d3.timeParse("%Y-%m-%d");
    d.date = _parse(d.date);
    return d;
}

add_plot("#stallo-daily", "date", date_parse, "https://raw.githubusercontent.com/nordichpc/sonar-web/ea1e2d69b74cde4a843771226b248ce40e8641ef/example-data/stallo-daily.csv");


function week_parse(d) {
    let _parse = d3.timeParse("%Y-%V");
    d.week = _parse(d.week);
    return d;
}

add_plot("#stallo-weekly", "week", week_parse, "https://raw.githubusercontent.com/nordichpc/sonar-web/ea1e2d69b74cde4a843771226b248ce40e8641ef/example-data/stallo-weekly.csv");


function month_parse(d) {
    let _parse = d3.timeParse("%Y-%m");
    d.month = _parse(d.month);
    return d;
}

add_plot("#stallo-monthly", "month", month_parse, "https://raw.githubusercontent.com/nordichpc/sonar-web/ea1e2d69b74cde4a843771226b248ce40e8641ef/example-data/stallo-monthly.csv");