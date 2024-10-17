// Set up the SVG canvas dimensions and position it over the map image
const svg = d3.select("#map svg")
    .attr("width", 960)
    .attr("height", 500);

// Define the width and height for later use
const width = +svg.attr("width");
const height = +svg.attr("height");

// Since we're using a static map image, we need to adjust the projection
// to match the image's scale and position.
// We'll use d3.geoMercator and set the scale and translate accordingly.

const projection = d3.geoMercator()
    .scale(500000)  // Adjust the scale to fit your map image
    .center([30.99, 29.77])  // Center of the map (longitude, latitude)
    .translate([width / 2, height / 2]);  // Center the map in the SVG

// Function to update traffic nodes on the map
function updateTrafficNodes(trafficNodes) {
    // Bind the traffic data to circles
    const circles = svg.selectAll("circle")
        .data(trafficNodes, d => d.id);

    // Update existing circles
    circles
        .transition()
        .duration(1000)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => d.vehicleCount / 50)
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green');

    // Add new circles
    circles.enter()
        .append("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => d.vehicleCount / 50)
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green')
        .attr("opacity", 0.7);

    // Remove old circles
    circles.exit().remove();
}

// Function to fetch mock traffic data and update the map
function fetchTrafficData() {
    d3.json("data/mock-data.json").then(function(data) {
        // Simulate real-time updates by modifying vehicleCount and congestion
        data.forEach(node => {
            node.vehicleCount = Math.floor(Math.random() * 500);
            node.congestion = node.vehicleCount > 300 ? 'high' : 'medium';
        });

        updateTrafficNodes(data);
    }).catch(function(error) {
        console.error("Error loading data:", error);
    });
}

// Initial load of traffic data
fetchTrafficData();

// Simulate real-time updates by refreshing data every 5 seconds
setInterval(fetchTrafficData, 5000);
