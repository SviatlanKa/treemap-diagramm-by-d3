import * as d3 from 'd3';
import './style.css';

const urls = [
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
];

const main = d3.select("body")
    .append("div")
    .attr("id", "main")
    .append("span")
    .attr("id", "title")
    .text("United States Educational Attainment")
    .append("br");

main.append("span")
    .attr("id", "description")
    .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

main.append("g")
    .attr("class", "a-group")
    .append("a")
    .attr("href", urls[0])
    .text("Kickstarter Dataset");
main.append("a")
    .attr("href", urls[1])
    .text("Movies Dataset");
main.append("a")
    .attr("href", urls[2])
    .text("Video Games Dataset");

const tooltip = main.append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
