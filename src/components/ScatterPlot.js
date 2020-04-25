import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from '../Netflix_Logo_RGB.png';
import '../tailwind.generated.css';

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.createAttributes = this.createAttributes.bind(this);

    const { width } = this.props;
    this.totalH = 450;
    this.margin = {
      top: 35,
      bottom: 5,
      left: 35,
      right: 30,
    };
    this.padding = 50;
    this.chartSize = 175;
    this.data = [];
    this.w = width - this.margin.left - this.margin.right - this.chartSize;
    this.h = this.totalH - this.margin.top - this.margin.bottom;
  }

  componentDidMount() {
    this.createAttributes();
  }

  createAttributes() {
    // Dimensions
    const { totalH, margin, padding } = this;

    // Define the div for the tooltip
    const div = d3
      .select('body')
      .append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);

    // SVG
    const svg = d3
      .select(this.svg)
      .attr('class', 'bar-svg')
      .attr('id', `chart_${this.props.id}`)
      .attr('width', this.props.width)
      .attr('height', totalH + margin.top + margin.bottom + 5)
      .attr('class', 'bar-g')
      .append('g')
      .attr('id', `data_${this.props.id}`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Y Axis
    const yAxis = d3.axisLeft(this.yAxisScale).tickFormat(d3.format('d'));
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `yAxis_${this.props.id}`)
      .attr('transform', `translate(${padding + margin.left}, ${margin.top})`)
      .call(yAxis);

    d3.select(`#yAxis_${this.props.id}`)
      .append('text')
        .attr('font-family', 'Montserrat')
        .attr('x', -100)
        .attr('y', -padding)
        .attr('transform', `rotate(-90)`)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Year of release')

    // X Axis
    const xAxis = d3.axisBottom(this.xAxisScale);
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `xAxis_${this.props.id}`)
      .attr('transform', `translate(${margin.left}, ${totalH - margin.bottom - padding})`)
      .call(xAxis);

    d3.select(`#xAxis_${this.props.id}`)
      .append('text')
        .attr('font-family', 'Montserrat')
        .attr('x', this.w/2 - padding)
        .attr('y', padding)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Rating')

    // Select + Data + Append + Cool stuff
    let parent = this;
    svg
      .selectAll()
      .data(this.props.dataset)
      .join('circle')
        .attr('cx', d => this.xAxisScale(+d.userRatingScore))
        .attr('cy', d => this.yAxisScale(+d.releaseYear))
        .attr('r', 5)
        .style('fill', d => this.myColor(+d.userRatingScore))
      .on('mouseover', function(d, i){
        d3.select(this)
          .transition()
          .attr('cx', parent.xAxisScale(+d.userRatingScore))
          .attr('cy', parent.yAxisScale(+d.releaseYear))
          .attr('r', 10)
          .style('fill', parent.myColor(+d.userRatingScore));

          div
            .transition()		
            .style("opacity", .9);		
          div.html(`${d.title} (${d.releaseYear}, ${d.userRatingScore})`)
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d, i){
        d3.select(this)
          .transition()
          .attr('cx', parent.xAxisScale(+d.userRatingScore))
          .attr('cy', parent.yAxisScale(+d.releaseYear))
          .attr('r', 5)
          .style('fill', parent.myColor(+d.userRatingScore))

        div.transition()
          .style("opacity", 0);
      })
  }

  render() {
    const { dataset } = this.props;

    const ratingMin = d3.min(dataset, d => +d.userRatingScore)
    const yearMin = d3.min(dataset, d => +d.releaseYear)
    const ratingMax = d3.max(dataset, d => +d.userRatingScore)
    const yearMax = d3.max(dataset, d => +d.releaseYear)

    // Scales
    this.myColor = d3
      .scaleLinear()
      .domain([ratingMin, ratingMax])
      .range(['#fdba9a', '#c81912']);

    this.xAxisScale = d3
      .scaleLinear()
      .domain([ratingMin - 1, ratingMax])
      .range([this.padding, this.w - this.chartSize])

    this.yAxisScale = d3
      .scaleLinear()
      .domain([yearMin - 1, yearMax])
      .range([this.h - this.padding, this.margin.bottom])

    return <svg ref={el => (this.svg = el)}>
      <g id="netflix_logo">
        <image href={logo} x={this.w - 40} y="0" height="100px" width="150px"/>
        <text x={this.w - 100} y={120} fill="black" fontSize="14">
          The scatter plot to the left illustrates a
        </text>
        <text x={this.w - 100} y={140} fill="black" fontSize="14">
          sample of 1000 shows, distributed by year
        </text>
        <text x={this.w - 100} y={160} fill="black" fontSize="14">
          of release vs. rating. This visualization
        </text>
        <text x={this.w - 100} y={180} fill="black" fontSize="14">
          reveals that most shows on Netflix were
        </text>
        <text x={this.w - 100} y={200} fill="black" fontSize="14">
          produced in the last decade and that they
        </text>
        <text x={this.w - 100} y={220} fill="black" fontSize="14">
          rate higher than shows produced before
        </text>
        <text x={this.w - 100} y={240} fill="black" fontSize="14">
          the 2000s.
        </text>
        <text x={this.w - 100} y={280} fill="black" fontSize="14" fontWeight={600}>
          Hover over the circles to see what shows
        </text>
        <text x={this.w - 100} y={300} fill="black" fontSize="14" fontWeight={600}>
          are rated higher!
        </text>
        <text x={this.w - 100} y={400} fill="black" fontSize="12">
          [Non-filtered dataset = 1000]
        </text>
      </g>
    </svg>;
  }
}

export default ScatterPlot;
