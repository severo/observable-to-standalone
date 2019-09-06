// https://observablehq.com/@mbostock/psr-b1919-21@100
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# PSR B1919+21

Data: [Borgar Þorsteinsson](https://bl.ocks.org/borgar/31c1e476b8e92a11d7e9), [Michael Zöllner](http://i.document.m05.de/2013/05/23/joy-divisions-unknown-pleasures-printed-in-3d/)`
)});
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height","data","y","area","line","xAxis"], function(d3,DOM,width,height,data,y,area,line,xAxis)
{
  const svg = d3.select(DOM.svg(width, height));

  const serie = svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i) + 1})`);
  
  serie.append("path")
      .attr("fill", "#fff")
      .attr("d", area);
  
  serie.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", line);

  svg.append("g")
      .call(xAxis);
  
  return svg.node();
}
);
  main.variable(observer("overlap")).define("overlap", function(){return(
16
)});
  main.variable(observer("height")).define("height", function(){return(
720
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 60, right: 10, bottom: 20, left: 10}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom])
)});
  main.variable(observer("z")).define("z", ["d3","data","overlap","y"], function(d3,data,overlap,y){return(
d3.scaleLinear()
    .domain([
      d3.min(data, d => d3.min(d)),
      d3.max(data, d => d3.max(d))
    ])
    .range([0, -overlap * y.step()])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x.copy().domain([0, 92])).ticks(width / 80))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").append("tspan").attr("x", 10).text(" ms"))
)});
  main.variable(observer("area")).define("area", ["d3","x","z"], function(d3,x,z){return(
d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z)
)});
  main.variable(observer("line")).define("line", ["area"], function(area){return(
area.lineY1()
)});
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.text("https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv").then(data => d3.csvParseRows(data, row => row.map(Number)))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
