import * as d3 from 'd3'
import * as topojson from 'topojson'
import { debounce } from 'debounce'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 50
}

const width = 700 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom

const svg = d3
  .select('#chart-hall')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3
  .scaleBand()
  .range([100, width])

var forceXCombine = d3
  .forceX(d => {
    return width / 2
  })
  .strength(0.05)

var forceXRace = d3
  .forceX(d => {
    return xPositionScale(d.race)
  })
  .strength(0.05)

var forceYClosed = d3
  .forceY(d => {
    if (d.closed === 'yes') {
      return height / 1.1
    } else {
      return height / 2
    }
  })

var forceYCombine = d3.forceY(d => {
  return height / 2
}).strength(0.05)

let simulation = d3.forceSimulation()
  .force('x', forceXCombine)
  .force('y', forceYCombine)
  .force('collide', d3.forceCollide(6))
  .force('charge', d3.forceManyBody().strength(-2))

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#ef5675',
    '#003f5c',
    '#58508d'
  ])

d3.csv(require('./data/age_gap.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  console.log(datapoints)
  var Director = datapoints.map(d => d.Direct)
  colorScale.domain(race)
  xPositionScale.domain(race)
  console.log(datapoints)

  var circles = svg
    .selectAll('.populations')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'populations')
    .attr('r', 5)
    .attr('fill', '#808080')

  d3.select('#all-pop').on('stepin', () => {
    svg
      .selectAll('.populations')
      .transition()
      .duration(1000)
      .attr('fill', d => {
        return colorScale(d.race)
      })

    simulation
      .force('x', forceXCombine)
      .alphaTarget(0.5)
      .restart()
  })

  d3.select('#pop-race').on('stepin', () => {
    console.log('pop-race stepin')
    simulation
      .force('x', forceXRace)
      .force('y', forceYCombine)
      .alphaTarget(0.5)
      .restart()
  })

  d3.select('#murder-rate').on('stepin', () => {
    console.log('murder rate step in')
    simulation
      .force('y', forceYClosed)
      .alphaTarget(0.2)
      .restart()
  })

  simulation.nodes(datapoints)
    .on('tick', ticked)

  function ticked () {
    circles
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
  }
}
