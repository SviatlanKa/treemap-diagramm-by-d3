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

const myColor = [
    '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c',
    '#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928',
    '#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462',
    '#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'
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

            let root = d3.hierarchy(data)
                .sum(d => d.values)
                .sort((a, b) => b.height - a.height || b.value - a.value);
console.log(root.leaves())
            const colorScale = d3.scaleOrdinal()
                .domain([1, root.children.length])
                .range(myColor);

            let treemap = d3.treemap();

            let nodes = treemap
                .tile(d3.treemapSquarify)
                .size([width, height])
                .padding(1)
                .round(true)
                (root);

            // svg.selectAll("rect")
            //     .data(root.leaves())
            //     .enter()
            //     .append("rect")
            //     .attr("x", d => d.x0)
            //     .attr("y", d => d.y0)
            //     .attr("width", d => d.x1 - d.x0)
            //     .attr("height", d=> d.y1 - d.y0)
            //     .attr("stroke", 1 + "px")
            //     // .style("fill", d=> colorScale(d.parent.data.name))
            // console.log(nodes)
            const node = svg.datum(root).selectAll(".node")
                .data(root.leaves())
                .enter().append("rect")
                .attr("class", "node")
                .style("left", (d) => d.x0 + "px")
                .style("top", (d) => d.y0 + "px")
                .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
                .style("background", (d) => colorScale(d.parent.data.name))
                .text((d) => d.data.name);

            d3.selectAll("input").on("change", function change() {
                const value = this.value === "count"
                    ? (d) => { return d.size ? 1 : 0;}
                    : (d) => { return d.size; };

                const newRoot = d3.hierarchy(data, (d) => d.children)
                    .sum(value);

                node.data(treemap(newRoot).leaves())
                    .transition()
                    .duration(1500)
                    .style("left", (d) => d.x0 + "px")
                    .style("top", (d) => d.y0 + "px")
                    .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
                    .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
            });
        })

    })
});
