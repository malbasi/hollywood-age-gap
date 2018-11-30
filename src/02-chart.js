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

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

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
    .attr('fill', function (d) {
      // color couples based on the older gender
      if (+d['Actor 1 Age'] > +d['Actor 2 Age'] & d['Actor 1 Gender'] === 'man') {
        return '#3C5A6A'
      } else if (+d['Age Difference'] === 0) {
        return '#D9A746'
      } else {
        return '#BC5E21'
      }
    })
    .attr('opacity', 0.8)
    .on('mouseover', function (d) {
      // set up tooltip text
      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)
      div
        .html(
          d['Actor 1 Name'].bold() +
            '<br/>' + ' ♡ ' + '<br/>' +
            d['Actor 2 Name'].bold() +
            '<br/>' + 'Age difference: ' +
            d['Age Difference'] + '<br/>' +
            'Movie: ' + d['Movie Name']
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('mouseout', function (d) {
      div
        .transition()
        .duration(500)
        .style('opacity', 0)
    })

  // add a line for matching age
  svg
    .append('line')
    .attr('x1', 0)
    .attr('y1', height)
    .attr('x2', width)
    .attr('y2', 0)
    .attr('stroke', '#4B1803')
    .attr('stroke-width', 1.8)
    .attr('opacity', 0.7)
    .lower()

  // add text. This is garbage atm, but i forget how translate rotate works
  svg
    .append('text')
    .text('Actors are the same age')
    .attr('font-weight', 'bold')
    .attr('fill', '#4B1803')
    .attr('x', 350)
    .attr('y', 450)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-45)')

  /* Set up axes */
  var xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .attr('stroke-width', 0.1)
    .attr('stroke', 'gray')
    .lower()

  var yAxis = d3.axisLeft(yPositionScale).tickSize(-width)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    // .attr('stroke-dasharray', '2,4')
    .attr('stroke-width', 0.1)
    .attr('stroke', 'gray')
    .lower()

  // remove bounding box
  svg.selectAll('.domain').remove()

  // START STEPIN

  // reset circles
  d3.select('#intro').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'none')
      .attr('r', 3)
  })

  // highlight same age

  // HGIHLIGHT COUPLES WITH THE SAME AGE HERE

  // # stepin bond (director==='john-glen' OR 'lewis-gilbert')
  d3.select('#bond').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'none')
      .attr('r', 3)

    svg
      .selectAll('#john-glen, #lewis-gilbert')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 10)
  })

  // # stepin muade director === 'hal-ashby'
  d3.select('#maude').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'none')
      .attr('r', 3)

    svg
      .selectAll('#hal-ashby')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 10)
  })
  // # stepin woody (director ==='woody-allen')

  d3.select('#woody').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'none')
      .attr('r', 3)

    svg
      .selectAll('#woody-allen')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 10)
  })

  // setpin coen (director === 'joel-coen')
  d3.select('#coen').on('stepin', () => {
    svg
      .selectAll('.couples')
      .transition()
      .attr('stroke', 'none')
      .attr('r', 3)

    svg
      .selectAll('#joel-coen')
      .transition()
      .attr('stroke', 'black')
      .attr('r', 10)
  })
}
