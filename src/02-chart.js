import * as d3 from 'd3'
// import { debounce } from 'debounce'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 30
}

const width = 700 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom

const svg = d3
  .select('#chart-2')
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

var xPositionScale = d3
  .scaleLinear()
  .range([0, width])
  .domain([15, 80])

var yPositionScale = d3
  .scaleLinear()
  .range([height, 0])
  .domain([15, 80])

d3.csv(require('./data/age_gap.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  // Add dots for each
  svg
    .selectAll('circles')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'couples')
    .attr('id', d => {
      var str = d.Director
      str = str.replace(/\s+/g, '-').toLowerCase()
      return str
    })
    .attr('r', 3)
    .attr('cx', d => xPositionScale(+d['Actor 1 Age']))
    .attr('cy', d => yPositionScale(+d['Actor 2 Age']))
    .attr('fill', d => {
      // TO DO
      // Color should change based on who is older, man or woman
      console.log()
    })

  // add a line for matching age
  svg
    .append('line')
    .attr('x1', 0)
    .attr('y1', height)
    .attr('x2', width)
    .attr('y2', 0)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('opacity', 0.5)
    .lower()

  // add text. This is garbage atm, but i forget how translate rotate works
  svg
    .append('text')
    .text('Actors are the same age')
    .attr('x', 350)
    .attr('y', 450)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-45)')

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

  // START STEPIN 

  // reset circles 
  d3.select('#top2').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 3)
  })

  // # stepin bond (director==='john-glen' OR 'lewis-gilbert')
  d3.select('#bond').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 3)

    svg
      .selectAll('#john-glen, #lewis-gilbert')
      .transition()
      .attr('stroke', 'red')
      .attr('r', 10)
  })

  // # stepin muade director === 'hal-ashby'
  d3.select('#maude').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 3)

    svg
      .selectAll('#hal-ashby')
      .transition()
      .attr('stroke', 'red')
      .attr('r', 10)
  })
  // # stepin woody (director ==='woody-allen')

  d3.select('#woody').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 3)

    svg
      .selectAll('#woody-allen')
      .transition()
      .attr('stroke', 'red')
      .attr('r', 10)
  })

  // setpin coen (director === 'joel-coen')
  d3.select('#coen').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 3)

    svg
      .selectAll('#joel-coen')
      .transition()
      .attr('stroke', 'red')
      .attr('r', 10)
  })
}
