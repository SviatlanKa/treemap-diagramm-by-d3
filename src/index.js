import * as d3 from 'd3';
import './style.css';

const KICKSTARTER_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const MOVIES_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const VIDEOGAMES_URL = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";


const tooltip = d3.select("#bar-chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);