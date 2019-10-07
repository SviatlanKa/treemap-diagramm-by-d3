import _ from 'lodash';
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
        description: "Top 100 Most Sold Video Games Grouped by Platform",
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

const valueParse = (data) => {
    let array = _.cloneDeep(data);
    array.children.forEach(elem => {
        elem.children.forEach(item => item.value = parseInt(item.value))
    });
    return array;
}


d3.json(urls[0]).then(kickRsp => {
    dataset[0].data = valueParse(kickRsp);

    d3.json(urls[1]).then(movieRsp => {
        dataset[1].data = valueParse(movieRsp);

        d3.json(urls[2]).then(videoRsp => {
            dataset[2].data = valueParse(videoRsp);

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
                .attr("width", width)
                .attr("height", height)

            let root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

            const colorScale = d3.scaleOrdinal(myColor);

            let treemap = d3.treemap()
                .size([width, height - 10])
                .padding(1)
                .round(true)
                (root);

            console.log(treemap.leaves())

            svg.selectAll("rect")
                .data(treemap.leaves())
                .enter()
                .append("rect")
                .attr("class", "tile")
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.data.category)
                .attr("data-value", d => d.data.value)
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d=> d.y1 - d.y0)
                .style("fill", d=> colorScale(d.parent.data.name));
     let text = svg.selectAll("text")
                .data(treemap.leaves())
                .enter()
                .append("text")
                .attr("class", "tile-text")
                .attr("x", d => d.x0 + 1)
                .attr("y", d => d.y0 + 1)
                .attr("font-size", 10);
     text.selectAll("tspan")
         .data(d => {
             let arr = [];
             const x = d3.select()
             const stringArr = d.data.name.split(' ');
             stringArr.forEach(item => arr.push([item, d.x0 + 1]));
             return arr;
         })
         .enter()
         .append("tspan")
         .attr("dy", 10)
         .attr("x", d => d[1])
         .text(d => d[0])
         .each(wrap);
        })

    })
});
