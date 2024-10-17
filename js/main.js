// Mapbox access token (replace with your own Mapbox token)
mapboxgl.accessToken = 'pk.eyJ1IjoibWFobW91ZGF1ZiIsImEiOiJjbTJjdnh3aW8wZHBiMmpzN2pxbjA2amZnIn0.-ODDd6wzvKwIg6EIbp3SSw';

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: 'map',  // ID of the container element
    style: 'mapbox://styles/mapbox/streets-v11',  // Map style
    center: [30.99, 29.77],  // Longitude, Latitude of the center (e.g., Marassi)
    zoom: 12  // Initial zoom level
});

// Add an SVG overlay for the traffic nodes on top of the Mapbox map
const svg = d3.select("svg")
    .attr("width", 960)
    .attr("height", 500);

// Function to convert geo-coordinates (longitude, latitude) to screen coordinates (x, y)
function project([lon, lat]) {
    const point = map.project(new mapboxgl.LngLat(lon, lat));
    return {x: point.x, y: point.y};
}

// Function to update traffic nodes
function updateTrafficNodes(trafficNodes) {
    const circles = svg.selectAll("circle")
        .data(trafficNodes, d => d.id);  // Bind data to circles using 'id' as the key

    // Update existing circles
    circles
        .transition()
        .duration(1000)
        .attr("cx", d => project([d.longitude, d.latitude]).x)  // Longitude to x
        .attr("cy", d => project([d.longitude, d.latitude]).y)  // Latitude to y
        .attr("r", d => d.vehicleCount / 50)  // Scale radius based on vehicle count
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green');  // Color based on congestion

    // Add new circles if they don't exist
    circles.enter()
        .append("circle")
        .attr("cx", d => project([d.longitude, d.latitude]).x)
        .attr("cy", d => project([d.longitude, d.latitude]).y)
        .attr("r", d => d.vehicleCount / 50)
        .attr("fill", d => d.congestion === 'high' ? 'red' : 'green')
        .attr("opacity", 0.7);

    // Remove circles that no longer have corresponding data
    circles.exit().remove();
}

// Fetch traffic data from the mock JSON file
function fetchTrafficData() {
    d3.json("data/mock-data.json").then(function(data) {
        updateTrafficNodes(data);  // Pass the fetched data to update the nodes
    }).catch(function(error) {
        console.error("Error loading data:", error);  // Log if there's an error
    });
}

// Initial load of traffic data
fetchTrafficData();

// Simulate real-time updates by refreshing data every 5 seconds
setInterval(fetchTrafficData, 5000);

// Re-render the traffic nodes whenever the map is zoomed or moved
map.on("viewreset", () => fetchTrafficData());
map.on("move", () => fetchTrafficData());
