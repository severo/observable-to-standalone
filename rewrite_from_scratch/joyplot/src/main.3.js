import * as d3 from 'd3';

// Cells definitions
function _chart(d3, DOM, width, height, data, y, area, line, xAxis) {
  const svg = d3.select(DOM.svg(width, height));

  const serie = svg
    .append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', (d, i) => `translate(0,${y(i) + 1})`);

  serie
    .append('path')
    .attr('fill', '#fff')
    .attr('d', area);

  serie
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', line);

  svg.append('g').call(xAxis);

  return svg.node();
}
const _overlap = () => 16;
const _height = () => 720;
const _margin = () => ({top: 60, right: 10, bottom: 20, left: 10});
// no need for async here
function _x(d3, data, margin, width) {
  return d3
    .scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right]);
}
function _y(d3, data, margin, height) {
  return d3
    .scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom]);
}
function _z(d3, data, overlap, y) {
  return d3
    .scaleLinear()
    .domain([d3.min(data, d => d3.min(d)), d3.max(data, d => d3.max(d))])
    .range([0, -overlap * y.step()]);
}
function _xAxis(height, margin, d3, x, width) {
  return g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x.copy().domain([0, 92])).ticks(width / 80))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .select('.tick:first-of-type text')
          .append('tspan')
          .attr('x', 10)
          .text(' ms')
      );
}
function _area(d3, x, z) {
  return d3
    .area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z);
}
function _line(area) {
  return area.lineY1();
}
// data must be wrapped into an async function, and it returns a Promise
async function _data(d3) {
  return d3
    .text(
      'https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv'
    )
    .then(data => d3.csvParseRows(data, row => row.map(Number)));
}

// Data flow
async function main(d3, DOM, width) {
  const height = _height();
  const margin = _margin();
  const overlap = _overlap();
  const data = await _data(d3);
  const x = _x(d3, data, margin, width);
  const y = _y(d3, data, margin, height);
  const z = _z(d3, data, overlap, y);
  const xAxis = _xAxis(height, margin, d3, x, width);
  const area = _area(d3, x, z);
  const line = _line(area);
  const chart = _chart(d3, DOM, width, height, data, y, area, line, xAxis);
}
