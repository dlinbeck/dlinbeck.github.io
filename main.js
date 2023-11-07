/* THIS CODE IS MY OWN WORK, IT WAS WRITTEN WITHOUT CONSULTING CODE
 WRITTEN BY OTHER STUDENTS OR LARGE LANGUAGE MODELS LIKE CHATGPT. 
 - Danielle Linbeck */
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawFreqSev
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3],
    },
    {
        activeVerse: 3,
        activeLines: [1, 2],
        svgUpdate: drawMentalSkew
        
    },
    {
        activeVerse: 3,
        activeLines: [3],
        svgUpdate: drawMentalTrue
        
    },
    {
        activeVerse: 4,
        activeLines: [1, 2],
        svgUpdate: drawWeaponSkew
    },
    {
        activeVerse: 4,
        activeLines: [3],
        svgUpdate: drawWeaponTrue
    },
    {
        activeVerse: 5,
        activeLines: [1],
        svgUpdate: drawFreqShort
    },
    {
        activeVerse: 5,
        activeLines: [2, 3],
        svgUpdate: drawAR
    },
    {
        activeVerse: 6,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawFreqSev
    }
]

// define global variables
let svg = d3.select("#svg");
let keyframeIndex = 0;

const height = 400;
const width = 750;

let freqSevData;
let mentalSkewData;
let mentalTrueData;
let weaponSkewData;
let weaponTrueData;
let freqARData;
let freqShortData;

let chart;
let chartWidth;
let chartHeight;

let xScale;
let yScale;

let tooltip;

// add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

// write an asynchronous loadData function
async function loadData(){
    await d3.csv("MS_FreqSevbyYear.csv").then(data => {
        freqSevData = data;
    });

    await d3.csv("MS_mentalHealthSkew.csv").then(data => {
        mentalSkewData = data;
    });

    await d3.csv("MS_mentalHealthTrue.csv").then(data => {
        mentalTrueData = data;
    });

    await d3.csv("MS_weaponObtainedSkew.csv").then(data => {
        weaponSkewData = data;
    });

    await d3.csv("MS_weaponObtainedTrue.csv").then(data => {
        weaponTrueData = data;
    });

    await d3.csv("MS_Race.csv").then(data => {
        raceFreqData = data;
    });

    await d3.csv("MS_outcomeByRacePercent.csv").then(data => {
        outcomeRaceData = data;
    });

    await d3.csv("MS_AR15.csv").then(data => {
        freqARData = data;
    });

    await d3.csv("MS_FreqSevbyYearShort.csv").then(data => {
        freqShortData = data;
    });
}

function drawFreqSev() {
    makeFreqSevChart(freqSevData,"Number of US Mass Shootings by Year");
}

function drawFreqShort() {
    makeFreqSevChart(freqShortData,"Number of US Mass Shootings by Year");
}

function drawMentalSkew() {
    makeMentalChart(mentalSkewData,"Where there Prior Signs of Mental Health Issues?");
}

function drawMentalTrue() {
    makeMentalChart(mentalTrueData,"Where there Prior Signs of Mental Health Issues?");
}

function drawWeaponSkew() {
    makeWeaponChart(weaponSkewData,"Were the Weapons Obtained Legally?");
}

function drawWeaponTrue() {
    makeWeaponChart(weaponTrueData,"Were the Weapons Obtained Legally?");
}

function drawAR() {
    makeARChart(freqARData,"Percent of Mass Shootings Involving an AR-15 by Year");
}


function makeFreqSevChart(data, title = "") {
    tool = d3.select(".tooltip");
    //Update our scales so that they match the new data
    xScale.domain(data.map(d => d.year));
    yScale.domain([0, 12]).nice();
    
    var colorScale = d3.scaleSequential().domain([0,28])
        .interpolator(d3.interpolateViridis);

    // select all the existing bars
    const bars = chart.selectAll(".bar")
        .data(data, d => d.year);

    // remove any bars no longer in the dataset
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", chartHeight)
        .attr("height", 0)
        .remove();

    // move any bars that already existed to their correct spot
    bars.transition()
        .duration(700)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

   // Add any new bars
    bars.enter().append("rect")
        .attr("class", "bar") //if new bar
        .attr("x", d => xScale(d.year))
        .attr("y", chartHeight) //off screen, come in from bottom
        .attr("height", 0)
        .attr("width", xScale.bandwidth()) //if new bar
        .attr("fill", d => colorScale(d.averageTotalVictims))
        .transition()
        .duration(1000) //1 second
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

    // update the x and y axis
    chart.select(".x-axis")
        .transition()
        .duration(700)
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .transition()
        .duration(700)
        .call(d3.axisLeft(yScale));

    /// update the title
    if (title.length > 0) {
        svg.select("#chart-title")
            .transition()
            .duration(700)
            .text(title);
    }
}

function makeMentalChart(data, title = "") {
    //Update our scales so that they match the new data
    xScale.domain(data.map(d => d.priorSigns));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();

    var colorScale = d3.scaleOrdinal().domain(data.map(d => d.priorSigns))
        .range(["#443983", "#21918c", "#90d743"])

    // select all the existing bars
    const bars = chart.selectAll(".bar")
        .data(data, d => d.priorSigns);

    // remove any bars no longer in the dataset
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", chartHeight)
        .attr("height", 0)
        .remove();

    // move any bars that already existed to their correct spot
    bars.transition()
        .duration(700)
        .attr("x", d => xScale(d.priorSigns))
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

   // Add any new bars
    bars.enter().append("rect")
        .attr("class", "bar") //if new bar
        .attr("x", d => xScale(d.priorSigns))
        .attr("y", chartHeight) //off screen, come in from bottom
        .attr("height", 0)
        .attr("width", xScale.bandwidth()) //if new bar
        .attr("fill", d => colorScale(d.priorSigns))
        .transition()
        .duration(1000) //1 second
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

    // update the x and y axis
    chart.select(".x-axis")
        .transition()
        .duration(700)
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .transition()
        .duration(700)
        .call(d3.axisLeft(yScale));

    /// update the title
    if (title.length > 0) {
        svg.select("#chart-title")
            .transition()
            .duration(700)
            .text(title);
    }
}

function makeWeaponChart(data, title = "") {
    //Update our scales so that they match the new data
    xScale.domain(data.map(d => d.legal));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();

    var colorScale = d3.scaleOrdinal().domain(data.map(d => d.legal))
        .range(["#443983", "#21918c", "#90d743"])

    // select all the existing bars
    const bars = chart.selectAll(".bar")
        .data(data, d => d.legal);

    // remove any bars no longer in the dataset
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", chartHeight)
        .attr("height", 0)
        .remove();

    // move any bars that already existed to their correct spot
    bars.transition()
        .duration(700)
        .attr("x", d => xScale(d.legal))
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

   // Add any new bars
    bars.enter().append("rect")
        .attr("class", "bar") //if new bar
        .attr("x", d => xScale(d.legal))
        .attr("y", chartHeight) //off screen, come in from bottom
        .attr("height", 0)
        .attr("width", xScale.bandwidth()) //if new bar
        .attr("fill", d => colorScale(d.legal))
        .transition()
        .duration(1000) //1 second
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count));

    // update the x and y axis
    chart.select(".x-axis")
        .transition()
        .duration(700)
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .transition()
        .duration(700)
        .call(d3.axisLeft(yScale));

    /// update the title
    if (title.length > 0) {
        svg.select("#chart-title")
            .transition()
            .duration(700)
            .text(title)
    }
}

function makeARChart(data, title = "") {
    //Update our scales so that they match the new data
    xScale.domain(data.map(d => d.year));
    yScale.domain([0, 60]).nice();

    var colorScale = d3.scaleSequential().domain([10,75])
        .interpolator(d3.interpolateViridis);

    // select all the existing bars
    const bars = chart.selectAll(".bar")
        .data(data, d => d.year);

    // remove any bars no longer in the dataset
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", chartHeight)
        .attr("height", 0)
        .remove();

    // move any bars that already existed to their correct spot
    bars.transition()
        .duration(700)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.percent))
        .attr("height", d => chartHeight - yScale(d.percent));

   // Add any new bars
    bars.enter().append("rect")
        .attr("class", "bar") //if new bar
        .attr("x", d => xScale(d.year))
        .attr("y", chartHeight) //off screen, come in from bottom
        .attr("height", 0)
        .attr("width", xScale.bandwidth()) //if new bar
        .attr("fill", d => colorScale(d.percent))
        .transition()
        .duration(1000) //1 second
        .attr("y", d => yScale(d.percent))
        .attr("height", d => chartHeight - yScale(d.percent));

    // update the x and y axis
    chart.select(".x-axis")
        .transition()
        .duration(700)
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .transition()
        .duration(700)
        .call(d3.axisLeft(yScale));

    /// update the title
    if (title.length > 0) {
        svg.select("#chart-title")
            .transition()
            .duration(700)
            .text(title);
    }
}

function forwardClicked() {
    if (keyframeIndex < keyframes.length - 1) {
        keyframeIndex++;
        drawKeyframe(keyframeIndex);
    }}

function backwardClicked() {
    if (keyframeIndex > 0) {
        keyframeIndex--;
        drawKeyframe(keyframeIndex);
      }}

function drawKeyframe(kfi) {
    // get keyframe at index position
    let kf = keyframes[kfi];

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


// write a function to initialise the svg properly
function initialiseSVG(){
    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-family", "helvetica, arial, verdana, sans-serif")
        .style("fill", "#362E31")
        .text("");
    
    var tooltip = d3.select(".right-column")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("font-family", "helvetica, arial, verdana, sans-serif")
        .style("padding", "10px")
        .style("color", "black");
    
}

function makeHoverTooltip(){
    const bars = chart.selectAll(".bar")
    tool = d3.select(".tooltip")
    
    bars.on("mouseover", () => {
            tool.style("opacity", 1)
                .html("Average Victims: Troubleshooting");
        })
        .on("mouseout", () => {
            tool.style("opacity", 0);
        });
}

async function initialise() { //made asynch
    
    await loadData(); //load the data

    initialiseSVG(); //initalise the SVG

    drawKeyframe(keyframeIndex); //draw the first keyframe
    
    //makeHoverTooltip(); troubleshooting

}


initialise();