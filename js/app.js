// Create a scatter plot between two of the data variables : Healthcare vs. Poverty
// Heavily referenced class activity 16.3 #8/9 with use of arrow functions

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG Wrapper to append an SVG group that will hold the chart and 
// shift the latter by left and top margins

// Create wrapper
var svg = d3.select(".chart")
    .append(svg)
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    

    // Append group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
   // Import the Data
   d3.csv("data/data.csv").then(function(healthData) {
        
        // Parse Data/Cast as numbers
        healthData.forEach(function(data){
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });

        // Create scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(healthData, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([3, d3.max(healthData, d => d.healthcare)])
            .range([height, 0]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axis to chart
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
        chartGroup.append("g")
        .call(leftAxis);

        // Create circles that represent each state using abbr.
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "green")
            .attr("opacity", ".5")
            .join("text")
            .text(d => d.abbr)

            // Initialize toolTip
            // Referenced class activities 16.3 #6/7 for adding toolTips for following
            // lines of code
            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([70, 70])
                .html(function(d) {
                    return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.health}`);
                });

            // Create toolTip in chart
            chartGroup.call(toolTip);

            // Create event listers to display and hide the tooltip
            circlesGroup.on("click", function(data) {
                toolTip.hide(data, this);
            })
                // On mouseout event 
                .on("onmouseout", function(data, index) {
                    toolTip.hide(data);
            });

            // Create axes labels oriented to the left and the bottom of the chart
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Healthcare");

             chartGroup.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
                .attr("class", "axisText")
                .text("Poverty");
            }).catch(function(error) {
            console.log(error);
            });


     