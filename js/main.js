// Set up the SVG canvas dimensions
const svg = d3.select("#map")
    .attr("width", 960)
    .attr("height", 500);

// Set up the map projection
const projection = d3.geoMercator()
    .scale(100000)
    .center([30.99, 29.77]); // Centered on a specific location (e.g., Marassi)

// Set up a path generator
const path = d3.geoPath().projection(projection);

// Function to update traffic nodes
function updateTrafficNodes(trafficNodes) {
    const circles = svg.selectAll("circle")
        .data(trafficNodes, d => d.id);  // Bind traffic data to circles, use 'id' as the key

    // Update existing circles
    circles
        .transition()
        .duration(1000)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])  // Set x position based on longitude
        .attr("cy", d => projection([d.longitude, d.latitude])[1])  // Set y position based on latitude
        .attr("r", d => d.vehicleCount / 50)  // Set radius based on vehicle count
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green')  // Color based on congestion

    // Add new circles if they don't exist
    circles.enter()
        .append("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => d.vehicleCount / 50)
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green')
        .attr("opacity", 0.7);

    // Remove circles that no longer have corresponding data
    circles.exit().remove();
}

// Function to fetch mock traffic data and update the map
function fetchTrafficData() {
    d3.json("../data/mock-data.json").then(function(data) {
        updateTrafficNodes(data);
    });
}

// Initial load of traffic data
fetchTrafficData();

// Simulate real-time updates by refreshing data every 5 seconds
setInterval(fetchTrafficData, 5000);
