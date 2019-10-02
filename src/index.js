import * as d3 from 'd3';
import './style.css';

const urls = [
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
    "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
];

const dataset = [
    {
        nameDataset: "Kickstarter Dataset",
        title: "Kickstarter Pledges",
        description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
        data: []
    },
    {
        nameDataset: "Movie Dataset",
        title: "Movie Sales",
        description: "Top 100 Highest Grossing Movies Grouped By Genre",
        data: []
    },
    {
        nameDataset: "Video Game Dataset",
        title: "Video Game Pledges",
        description: "op 100 Most Sold Video Games Grouped by Platform",
        data: []
    }
];

const main = d3.select("body")
    .append("div")
    .attr("id", "main");

main.append("span")
    .attr("id", "title")
    .text(dataset[0].nameDataset)
    .append("br");

main.append("span")
    .attr("id", "description")
    .text(dataset[0].description);

main.append("g")
    .attr("class", "button-group");

const tooltip = main.append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

d3.json(urls[0]).then(kickRsp => {
    dataset[0].data = kickRsp;

    d3.json(urls[1]).then(movieRsp => {
        dataset[1].data = movieRsp;

        d3.json(urls[2]).then(videoRsp => {
            dataset[2].data = videoRsp;

            let data = dataset[0].data;
            const width = 1200;
            const height = width / 1.5;

            main.select(".button-group")
                .selectAll("button")
                .data(dataset)
                .enter()
                .append("button")
                .text(d => d.nameDataset)
                .on("click", d => {
                    data = d.data;
                    main.select("#title")
                        .text(d.title);
                    main.select("#description")
                        .text(d.description);
                });

            const svg = d3.select("#main")
                .append("svg")
                .attr("viewBox", [0, 0, width, height])

            let root = d3.hierarchy(data);
            console.log(root)
            let treemap = d3.treemap();
            console.log(treemap)
            let nodes = treemap
                .tile(d3.treemapSquarify)
                .size(width, height)
                .padding(1)
                (root
                .sum(d => d.values)
                .sort((a, b) => b.height - a.height || b.value - a.value));
            console.log(nodes)
        })

    })
});
