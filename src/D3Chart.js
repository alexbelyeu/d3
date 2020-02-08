import React, { Component } from "react"
import * as d3 from "d3"

class D3Chart extends Component {
  constructor() {
    super()
    this.drawChart = this.drawChart.bind(this)
  }

  componentDidMount() {
    this.drawChart()
  }

  drawChart() {
    // Data
    const { dataset, width, id } = this.props

    // Dimensions
    const totalW = width - 30;
    const totalH = 300
    const margin = {
      top: 5,
      bottom: 5,
      left: 25,
      right: 5
    }
    const w = totalW - margin.left - margin.right
    const h = totalH - margin.top - margin.bottom

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([5, w])
      .paddingInner(0.05)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([h, 0])
    const yAxis = d3.axisLeft()
      .scale(yScale);

     // DOM
     const svg = d3
       .select(this.svg)
       .attr("class", "bar-svg")
       .attr("id", `chart_${id}`)
       .attr("width", totalW)
       .attr("height", totalH)

     const g = svg
       .append("g")
       .attr("transform", `translate(${margin.left}, ${margin.top})`)
       .attr("class", "bar-g")

     // Data Bars
     g.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", (d, i) => xScale(i))
       .attr("y", d => yScale(d))
       .attr("width", xScale.bandwidth())
       .attr("height", d => h - yScale(d))
       .attr("fill", d => `rgb(200, 0, ${d * 20})`)
       .attr("rx", 10)

     const axis = d3.select(`#chart_${id}`)
      .append('g')
      .attr('transform', `translate(${margin.left + 2}, ${margin.top})`)
      .call(yAxis)

      axis.selectAll('text')
        .attr("fill", d => `rgb(200, 0, ${d * 20})`)
  }

  render() {
    return <svg ref={el => this.svg = el} />
  }
}

export default D3Chart