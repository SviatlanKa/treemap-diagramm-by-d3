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

            let root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

            const colorScale = d3.scaleOrdinal(myColor);

            const width = 1200;
            const heightTreeMap = width / 1.2;
            const margin = {
                top: 10,
                right: 15,
                bottom: 10,
                left: 10
            };
            const font = "20px Roboto, sans serif";

            const longestText = (array) => { //find longest text for creating legend
                let longest = '';
                let maxLength = 0;
                array.forEach(item => {
                    if (item.name.length > maxLength) {
                        maxLength = item.name.length;
                        longest = item.name;
                    }
                });
                return longest;
            };
            const getTextWidth = (text, font) => { //for creating legend
                const canvas = document.createElement('canvas');
                const context = canvas.getContext("2d");
                context.font = font;
                const widthText = Math.ceil(context.measureText(text).width);
                return widthText;
            };

            let treemap = d3.treemap()
                .size([width, heightTreeMap])
                .paddingInner(1)
                .round(true)
                (root);

            const children = treemap.data.children;
            const leaves = treemap.leaves();

            const rows = Math.round(width / 1.5 / (20 + margin.left + getTextWidth(longestText(children), font) + margin.right));
            const columns = Math.ceil(children.length / rows);
            const heightLegend = margin.top * 2 + columns * (20 + margin.bottom);
            const height = heightTreeMap + heightLegend;

            const widthLegendRows = (array) => {
                let itemsColWidths = [];
                for (let i = 0; i < rows; i++) {
                    let column = [];
                    for (let j = i; j < array.length;) {
                       column.push(array[j]);
                       j += rows;
                    }
                    let longestTextCol = longestText(column);
                    itemsColWidths.push(getTextWidth(longestTextCol, font));
                }
                console.log(itemsColWidths);
                return itemsColWidths;
            };

            widthLegendRows(children) //continue here

            const svg = d3.select("#main")
                .append("svg")
                .attr("viewBox", `0 0 ${width} ${height}`);

            const tile = svg.selectAll("g")
                .data(leaves)
                .enter()
                .append("g")
                .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

            tile.append("rect")
                .attr("class", "tile")
                .attr("data-name", d => d.data.name)
                .attr("data-category", d => d.data.category)
                .attr("data-value", d => d.data.value)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d=> d.y1 - d.y0)
                .style("fill", d => colorScale(d.parent.data.name));

            let text = tile.append("text")
                .attr("class", "tile-text")
                .attr("x", d => d.x0 + 1)
                .attr("y", d => d.y0 + 1)
                .attr("font-size", 10);

            text.selectAll("tspan")
                .data(d => d.data.name.split(/(:|,|-)\s/)[0].split(' '))
                .enter()
                .append("tspan")
                .attr("x", 4)
                .attr("y", (d,i) => i * 10)
                .attr("dy", 10)
                .text(d => d);

            const translate = {
                x: width * (1 - 2/3) / 2,
                y: heightTreeMap + margin.top * 2
            };

            const legend = svg.append("g")
                .attr("id", "legend")
                .attr("transform", `translate(${translate.x},${translate.y})`);
            children.forEach(item => {
                let i = 0;

            })

                legend.append('rect')
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 20)
                .attr("width", 20)
                .attr("fill", "green")
                    legend.append("text")
                        .attr("x", 20 + margin.left)
                        .attr("y", 15)
                        .text("text")
                        .style("font-size", 20)
                legend.append("rect")
                .attr("x", 20 + 10 + 4*10 + 10)
                .attr("y", 0)
                .attr("height", 20)
                .attr("width", 20)
                .attr("fill", "blue");

            const legendItem = legend.selectAll("g")
                .data(children)
                .enter()
                .append("g")

        })

    })
});
