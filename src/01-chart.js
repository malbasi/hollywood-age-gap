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

var defs = svg.append('defs')

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#BC5E21',
    '#749CA8',
    '#DBA946',
    '#726738',
    '#B38971',
    '#fdb462',
    '#b3de69'
  ])

var xPositionScale = d3.scaleLinear()
  .range([0, width])
  .domain([15, 70])

var yPositionScale = d3
  .scalePoint()
  .range([height, 120])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

d3.csv(require('./data/top_directors_withimg2.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  // set color scale domain
  var directorName = datapoints.map(d => d['Director'])
  colorScale.domain(directorName)

  var nested = d3
    .nest()
    .key(d => d.Director)
    .entries(datapoints)

  // sort nested data
  nested.sort(function (b, a) {
    return a.values.length - b.values.length
  })

  defs.selectAll('.director-pattern')
    .data(datapoints)
    .enter().append('pattern')
    .attr('class', 'director-pattern')
    .attr('id', function (d) {
      return d.Director.toLowerCase().replace(' ', '')
    })
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('patternContentUnits', 'objectBoundingBox')
    .append('image')
    .attr('height', '1')
    .attr('width', '1')
    .attr('preserveAspectRatio', 'none')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('xlink:href', function (d) {
      return d.image_path
    })

  // add label circles
  let labels = svg.append('g').attr('transform', 'translate(10, 0)')

  labels
    .selectAll('.label-circle')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(${i * 120}, 0)`)
    .each(function (d) {
      let g = d3.select(this)
      g.append('circle')
        .attr('r', 40)
        .attr('cx', 20)
        .attr('cy', 20)
        .attr('fill', function (d) {
          return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
        })
        .attr('class', d => {
          return d.key.toLowerCase().replace(' ', '')
        })
        .classed('labels', true)
        .attr('opacity', '0.2')
    })

  labels
    .selectAll('.label-text')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(${i * 110}, 50)`)
    .each(function (d) {
      let g = d3.select(this)
      g.append('text')
        .attr('x', 0)
        .attr('dx', d=> {
          if (d.key === 'Woody Allen') {
            return -15
          } else if (d.key === 'Joel Coen') {
            return 20
          } else if (d.key === 'Lowis Gilbert') {
            return 0
          } else if (d.key === 'Jonathan Lynn') {
            return 20
          } else {
            return 0
          }
        })
        .attr('y', 30)
        .attr('fill', colorScale(d.key))
        .attr('class', d => {
          return 'text' + d.key.toLowerCase().replace(' ', '') 
        })
        .classed('labels-text', true)
        .text(d.key)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('text-alignment','middle')
        .attr('opacity', 0.2)
    })

  // draw the average line and hide it
  // place line for 18 y.o.
  svg
    .append('line')
    .attr('x1', 50)
    .attr('y1', 100)
    .attr('x2', 50)
    .attr('y2', height)
    .attr('stroke-dasharray', ('3,5'))
    .attr('stroke-width', 2)
    .attr('stroke', 'red')
    .attr('class', 'average-line')
    .attr('opacity', 0.5)
    .lower()
    .style('visibility', 'hidden')

    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .transition()
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .style('visibility', 'hidden')

  // filter the datapoints for each director
  let dir1Datapoints = datapoints.filter(d => d.Director === 'Woody Allen')
  let dir2Datapoints = datapoints.filter(d => d.Director === 'John Glen')
  let dir3Datapoints = datapoints.filter(d => d.Director === 'Lewis Gilbert')
  let dir4Datapoints = datapoints.filter(d => d.Director === 'Joel Coen')
  let dir5Datapoints = datapoints.filter(d => d.Director === 'Jonathan Lynn')

  // set yPositionScale domain
  var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
  yPositionScale.domain(dir1MovieName)

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
      .attr('r', 6)
      .attr('fill', d => colorScale(d.Director))
      .style('visibility','hidden')

    svg.selectAll('act2')
      .data(dir1Datapoints)
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
      .attr('r', 6)
      .attr('fill', d => colorScale(d.Director))
      .style('visibility','hidden')

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
      .attr('opacity', 0.5)
      .style('visibility','hidden')

  // Scrollytelling!
  // for each director, update the y-axis and redraw the barbells
  d3.select('#top3').on('stepin', () => {
    var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir1MovieName)
    svg.selectAll('.act1').transition().style('visibility','hidden')
    svg.selectAll('.act2').transition().style('visibility','hidden')
    svg.selectAll('.bar').transition().style('visibility','hidden')
    svg.selectAll('.y-axis').transition().remove()
    svg.selectAll('.average-line').transition().style('visibility', 'hidden')
    svg.selectAll('.x-axis').transition().style('visibility', 'hidden')

    svg.selectAll('.labels').transition().remove()

    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })
    svg.selectAll('.woodyallen')
       .transition()
       .attr('opacity', 0.2)
    
    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textwoodyallen')
       .transition()
       .attr('opacity', 0.2)


    /* Set up axes */
    var xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .transition()
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .style('visibility', 'hidden')


    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .transition()
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .style('visibility', 'hidden')

    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })


  d3.select('#director1').on('stepin', () => {
    var dir1MovieName = dir1Datapoints.map(d => d['Movie Name'])
    yPositionScale.domain(dir1MovieName)
    svg.selectAll('.act1').remove()
    svg.selectAll('.act2').remove()
    svg.selectAll('.bar').remove()
    svg.selectAll('.y-axis').remove()
    svg.selectAll('.x-axis').style('visibility', 'visible')

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
      .attr('r', 6)
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
      .attr('r', 6)
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


    // this is change for label part!
    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })

    svg.selectAll('.woodyallen')
      .transition()
      .attr('opacity', 0.9)

    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textwoodyallen')
       .transition()
       .attr('opacity', 0.9)

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
    svg.selectAll('.x-axis').style('visibility', 'visible')

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
      .attr('r', 6)
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
      .attr('r', 6)
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

    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      // console.log(d.key.toLowerCase().replace(/ /g, ''))
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })
    svg.selectAll('.johnglen')
      .transition()
      .attr('opacity', 0.9)

    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textjohnglen')
       .transition()
       .attr('opacity', 0.9)

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
    svg.selectAll('.x-axis').style('visibility', 'visible')

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
      .attr('r', 6)
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
      .attr('r', 6)
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

    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      // console.log(d.key.toLowerCase().replace(/ /g, ''))
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })
    svg.selectAll('.lewisgilbert')
      .transition()
      .attr('opacity', 0.9)

    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textlewisgilbert')
       .transition()
       .attr('opacity', 0.9)

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
    svg.selectAll('.x-axis').style('visibility', 'visible')

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
      .attr('r', 6)
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
      .attr('r', 6)
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

    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      // console.log(d.key.toLowerCase().replace(/ /g, ''))
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })
    svg.selectAll('.joelcoen')
      .transition()
      .attr('opacity', 0.9)

    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textjoelcoen')
       .transition()
       .attr('opacity', 0.9)

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
    svg.selectAll('.x-axis').style('visibility', 'visible')

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
      .attr('r', 6)
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
      .attr('r', 6)
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

    svg.selectAll('.labels').transition().attr('opacity', 0.2).attr('fill', function (d) {
      // console.log(d.key.toLowerCase().replace(/ /g, ''))
      return 'url(#' + d.key.toLowerCase().replace(/ /g, '') + ')'
    })
    svg.selectAll('.jonathanlynn')
      .transition()
      .attr('opacity', 0.9)

    svg.selectAll('.labels-text').transition().attr('opacity', 0.2).attr('fill', d=> colorScale(d.key))
    svg.selectAll('.textjonathanlynn')
       .transition()
       .attr('opacity', 0.9)

    var yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    svg.selectAll('.y-axis path').attr('stroke', 'none')
  })
}
