import * as d3 from 'd3'
import fisheye from './fisheye'
import { scaleLinear, scalePow } from 'd3-scale'

let margin = { top: 20, left: 20, right: 20, bottom: 20 }

let height = 300 - margin.top - margin.bottom
let width = 900 - margin.left - margin.right

let svg = d3
  .select('#images2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('opacity', 0)

var xPositionScale = fisheye.scale(d3.scaleLinear)
  .range([0, width])
  .focus(width / 2)
  .distortion(6)

d3.csv(require('./data/df_age30.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  xPositionScale.domain([0, datapoints.length])

  var holders = svg
    .selectAll('.image-holder')
    .data(datapoints)
    .enter()
    .append('g')
    .attr('class', 'image-holder')
    .attr('transform', (d, i) => {
      var xPosition = xPositionScale(i)
      return `translate(${xPosition}, 0)`
    })

  holders.append('image')
    .attr('xlink:href', d => {
      return d.image_url
    })
    .attr('height', height)

  holders.append('rect')
    .attr('stroke', 'none')
    .attr('height', height)
    .attr('width', 150)
    .attr('fill', 'none')

  function clamp (num, min, max) {
    return Math.max(min, Math.min(max, num))
  }

  function redraw () {
    let [mouseX, mouseY] = d3.mouse(this)

    // focus the x axis where the mouse is
    xPositionScale.focus(mouseX)

    svg.selectAll('.image-holder')
      .attr('transform', (d, i) => {
        var xPosition = xPositionScale(i)
        return `translate(${xPosition}, 0)`
      })
  }

  var drag = d3.drag()
    .on('start', redraw)
    .on('drag', redraw)

  svg.on('mousemove', redraw)
    .on('click', redraw)
    .call(drag)
}

// play with distortion and height so images look the righ size
