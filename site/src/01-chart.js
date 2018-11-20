import * as d3 from 'd3'
// import { debounce } from 'debounce'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 125
}

const width = 700 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

var xPositionScale = d3.scaleLinear()
  .range([0, width])
  .domain([15, 70])

var yPositionScale = d3
  .scaleBand()
  .range([height, 0])

d3.csv(require('./data/top_directors.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  // set ypositionscale domain
  var movieName = datapoints.map(d => d['Actor 2 Name'])
  yPositionScale.domain(movieName)

  // set color scale domain
  var directorName = datapoints.map(d => d['Director'])
  colorScale.domain(directorName)

  // var nested = d3
  //   .nest()
  //   .key(d => d.Director)
  //   .entries(datapoints)
  // console.log(nested)

  // console.log(datapoints)

  // place dot for actor 1 age
  svg
    .selectAll('act1')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'act1')
    .attr('cx', d => {
      var age = +d['Actor 1 Age']
      return xPositionScale(age)
    })
    .attr('cy', d => {
      return yPositionScale(d['Actor 2 Name'])
    })
    .attr('r', 5)
    .attr('fill', d => colorScale(d.Director))

  // place dot for actor 2 age
  svg
    .selectAll('act2')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'act2')
    .attr('cx', d => {
      var age = +d['Actor 2 Age']
      return xPositionScale(age)
    })
    .attr('cy', d => {
      return yPositionScale(d['Actor 2 Name'])
    })
    .attr('r', 5)
    .attr('fill', d => colorScale(d.Director))

  // place line between actors
  svg
    .selectAll('bar')
    .data(datapoints)
    .enter()
    .append('line')
    .attr('class', 'bar')
    .attr('x1', d => {
      return xPositionScale(+d['Actor 1 Age'])
    })
    .attr('y1', d => yPositionScale(d['Actor 2 Name']))
    .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
    .attr('y2', d => yPositionScale(d['Actor 2 Name']))
    .attr('stroke-width', 1)
    .attr('stroke', d => colorScale(d.Director))
    .attr('opacity', 0.5)

  // place line for 18 y.o.
  svg
    .append('line')
    .attr('x1', 50)
    .attr('y1', 0)
    .attr('x2', 50)
    .attr('y2', height)
    .attr('stroke-dasharray', ('3,5'))
    .attr('stroke-width', 2)
    .attr('stroke', 'red')
    .attr('opacity', 0.5)
    .lower()

  /* Set up axes */
  var xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
