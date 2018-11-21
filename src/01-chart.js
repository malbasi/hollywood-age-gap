import * as d3 from 'd3'
// import { debounce } from 'debounce'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 150
}

const width = 700 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

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
  .scalePoint()
  .range([height - 20, 0])

d3.csv(require('./data/top_directors.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  // set color scale domain
  var directorName = datapoints.map(d => d['Director'])
  colorScale.domain(directorName)

  // var nested = d3
  //   .nest()
  //   .key(d => d.Director)
  //   .entries(datapoints)
  // console.log(nested)

  // console.log(datapoints)

  // filter the datapoints for each director
  let dir1Datapoints = datapoints.filter(d => d.Director === 'Woody Allen')
  let dir2Datapoints = datapoints.filter(d => d.Director === 'John Glen')
  let dir3Datapoints = datapoints.filter(d => d.Director === 'Jonathan Lynn')
  let dir4Datapoints = datapoints.filter(d => d.Director === 'Joel Coen')
  let dir5Datapoints = datapoints.filter(d => d.Director === 'Lewis Gilbert')

  // set yPositionScale domain
  var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
  yPositionScale.domain(dir1MovieName)

  // Scrollytelling!
  // for each director, update the y-axis and redraw the barbells
  d3.select('#top3').on('stepin', () => {
    var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir1MovieName)
    svg.selectAll('.act1').transition().remove()
    svg.selectAll('.act2').transition().remove()
    svg.selectAll('.bar').transition().remove()
    svg.selectAll('.y-axis').transition().remove()
    svg.selectAll('.line').transition().remove()

    // place line for 18 y.o.
    svg
      .append('line')
      .transition()
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
      .transition()
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .transition()
      .attr('class', 'axis y-axis')
      .call(yAxis)

    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })

  d3.select('#director1').on('stepin', () => {
    var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir1MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()

    svg
      .selectAll('act1')
      .data(dir1Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act1')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 1 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('act2')
      .data(dir1Datapoints)
      .enter()
      .append('circle')
      .transition()
      .attr('class', 'act2')
      .attr('cx', d => {
        var age = +d['Actor 2 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('bar')
      .data(dir1Datapoints)
      .enter()
      .append('line')
      .transition()
      .attr('class', 'bar')
      .attr('x1', d => {
        return xPositionScale(+d['Actor 1 Age'])
      })
      .attr('y1', d => yPositionScale(d['Movie Name']))
      .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
      .attr('y2', d => yPositionScale(d['Movie Name']))
      .attr('stroke-width', 1)
      .attr('stroke', d => colorScale(d.Director))
      // .attr('opacity', 0.5)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .transition()
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })

  d3.select('#director2').on('stepin', () => {
    var dir2MovieName = dir2Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir2MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()

    svg
      .selectAll('act1')
      .data(dir2Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act1')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 1 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('act2')
      .data(dir2Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act2')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 2 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('bar')
      .data(dir2Datapoints)
      .enter()
      .append('line')
      .transition()
      .attr('class', 'bar')
      .attr('x1', d => {
        return xPositionScale(+d['Actor 1 Age'])
      })
      .attr('y1', d => yPositionScale(d['Movie Name']))
      .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
      .attr('y2', d => yPositionScale(d['Movie Name']))
      .attr('stroke-width', 1)
      .attr('stroke', d => colorScale(d.Director))
      .attr('opacity', 0.5)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })

  d3.select('#director3').on('stepin', () => {
    var dir3MovieName = dir3Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir3MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()

    svg
      .selectAll('act1')
      .data(dir3Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act1')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 1 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('act2')
      .data(dir3Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act2')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 2 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('bar')
      .data(dir3Datapoints)
      .enter()
      .append('line')
      .attr('class', 'bar')
      .transition()
      .attr('x1', d => {
        return xPositionScale(+d['Actor 1 Age'])
      })
      .attr('y1', d => yPositionScale(d['Movie Name']))
      .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
      .attr('y2', d => yPositionScale(d['Movie Name']))
      .attr('stroke-width', 1)
      .attr('stroke', d => colorScale(d.Director))
      .attr('opacity', 0.5)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })

  d3.select('#director4').on('stepin', () => {
    var dir4MovieName = dir4Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir4MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()

    svg
      .selectAll('act1')
      .data(dir4Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act1')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 1 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('act2')
      .data(dir4Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act2')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 2 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('bar')
      .data(dir4Datapoints)
      .enter()
      .append('line')
      .attr('class', 'bar')
      .transition()
      .attr('x1', d => {
        return xPositionScale(+d['Actor 1 Age'])
      })
      .attr('y1', d => yPositionScale(d['Movie Name']))
      .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
      .attr('y2', d => yPositionScale(d['Movie Name']))
      .attr('stroke-width', 1)
      .attr('stroke', d => colorScale(d.Director))
      .attr('opacity', 0.5)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })

  d3.select('#director5').on('stepin', () => {
    var dir5MovieName = dir5Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir5MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()

    svg
      .selectAll('act1')
      .data(dir5Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act1')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 1 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('act2')
      .data(dir5Datapoints)
      .enter()
      .append('circle')
      .attr('class', 'act2')
      .transition()
      .attr('cx', d => {
        var age = +d['Actor 2 Age']
        return xPositionScale(age)
      })
      .attr('cy', d => {
        return yPositionScale(d['Movie Name'])
      })
      .attr('r', 5)
      .attr('fill', d => colorScale(d.Director))

    svg.selectAll('bar')
      .data(dir5Datapoints)
      .enter()
      .append('line')
      .attr('class', 'bar')
      .transition()
      .attr('x1', d => {
        return xPositionScale(+d['Actor 1 Age'])
      })
      .attr('y1', d => yPositionScale(d['Movie Name']))
      .attr('x2', d => xPositionScale(+d['Actor 2 Age']))
      .attr('y2', d => yPositionScale(d['Movie Name']))
      .attr('stroke-width', 1)
      .attr('stroke', d => colorScale(d.Director))
      .attr('opacity', 0.5)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })
}
