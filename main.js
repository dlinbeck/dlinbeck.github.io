
let svg = d3.select("#svg");
let keyframeIndex = 0;

const height = 475;
const width = 750;

let fieldData;

let bubblebox;
let boxWidth;
let boxHeight;

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 3,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 5,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 6,
        activeLines: [1, 2, 3]
    }
]

function drawKeyframe(kfi) {
    // get keyframe at index position
    let kf = keyframes[kfi];

    // reset any active lines
    resetActiveLines();

    // update the active verse
    updateActiveVerse(kf.activeVerse);

    // update any active lines
    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }

    // update the svg
    if(kf.svgUpdate){
        kf.svgUpdate();
    }
}

// write a function to reset any active lines
function resetActiveLines() {
    d3.selectAll(".line").classed("active-line", false);
}

// write a function to update the active verse
function updateActiveVerse(id) {
    d3.selectAll(".verse").classed("active-verse", false);
  
    d3.select("#verse" + id).classed("active-verse", true);
  
    scrollLeftColumnToActiveVerse(id); //call when updating the active verse
}

// write a function to update the active line
function updateActiveLine(vid, lid) {
    let thisVerse = d3.select("#verse" + vid);
    thisVerse.select("#line" + lid).classed("active-line", true);
}

// write a function to scroll the left column to the right place
function scrollLeftColumnToActiveVerse(id){
    // select the div displaying the left column content
    var leftColumn = document.querySelector(".left-column-content");

    // select the verse we want to display
    var activeVerse = document.getElementById("verse" + id);

    // calculate the bounding rectangles of both of these elements
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // calculate the desired scroll position
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    // scroll to the desired position
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth' //not instant scroll
    })
}

async function loadData(){ //title Female share of graduates in tertiary programs by field (%)
    await d3.csv("../simpleGradsGender.csv").then(data => {
        fieldData = data;
    });
}

function drawFields() {
    //updateBubbleBox(fieldData,"Percent of Graduates by Field");
    initializeSVG(fieldData);
}

//d3.slider().axis(true).min(1999).max(2019).step(1)

function initializeSVG(data){
    svg.attr("width", width);
    svg.attr("height", height);

    boxWidth = width;
    boxHeight = height + 13;

    svg.selectAll("*").remove();

    let sizeScale = d3.scaleLinear()
        .domain(data.map(d => d.fieldSize)) //[118, 147]
        .range([1.0, 1.04]); //making the scale any bigger causes issues with the radius in force simulation

    let sequentialScale = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateViridis);

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data, d => d.field)
        .enter()
        .append("circle")
            .attr("r", d => 45 * sizeScale(d.fieldSize))
            .attr("cx", boxWidth / 2)
            .attr("cy", boxHeight / 2)
            .style("fill", d => sequentialScale(d.female))
            .style("fill-opacity", 0.5)
            .attr("stroke", d => sequentialScale(d.female))
            .style("stroke-width", 2)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(boxWidth / 2).y(boxHeight / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(50).iterations(1)) // Force that avoids circle overlapping

    // Makes the circles draggable - will have working for interactable deadline
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
        });

    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "#393842;")
        .text("Graduates in Tertiary Programs by Field");
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
}

async function initialize() { //made asynch
    
    await loadData(); //load the data

    drawFields(); //initalise the SVG

    drawKeyframe(0); //temporary

}


initialize();