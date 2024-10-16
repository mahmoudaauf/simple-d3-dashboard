// Set up the map projection and path
const svg = d3.select("#map");
const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoMercator()
    .scale(100000)
    .center([30.99, 29.77]); // Centered on Marassi

const path = d3.geoPath().projection(projection);

// Function to update traffic nodes on the map
function updateTrafficNodes(trafficNodes) {
    const circles = svg.selectAll("circle")
        .data(trafficNodes, d => d.id); // Use 'id' as the key for binding

    // Update existing circles
    circles
        .transition()
        .duration(1000)
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", d => d.vehicleCount / 50) // Scale based on vehicle count
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green');

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

// Function to fetch and update mock data
function fetchMockData() {
    d3.json("../data/mock-data.json").then(function(data) {
        // Simulate real-time updates by modifying vehicleCount
        data.forEach(node => {
            node.vehicleCount = Math.floor(Math.random() * 500); // Random vehicle count
            node.congestion = node.vehicleCount > 300 ? 'high' : 'medium'; // Set congestion based on count
        });

        // Update the traffic nodes on the map
        updateTrafficNodes(data);
    });
}

// Initial load
fetchMockData();

// Simulate real-time data updates every 5 seconds
setInterval(fetchMockData, 5000);
