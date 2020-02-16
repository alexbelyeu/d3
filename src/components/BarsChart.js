import React, { Component } from 'react';
import * as d3 from 'd3';
import { groups } from 'd3-array';
import logo from '../Netflix_Logo_RGB.png';

class BarsChart extends Component {
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
        .text('Number of movies')

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
      .data(this.ratingsHistogram)
      .join('rect')
        .attr('x', d => this.xAxisScale(+d.x0))
        .attr('y', d => this.yAxisScale(this.moviesInBucket(d)))
        .attr('width', d => this.xAxisScale(+d.x1) - this.xAxisScale(+d.x0))
        .attr('height', d => this.h - padding - this.yAxisScale(this.moviesInBucket(d)))
        .style('fill', d => this.myColor(this.moviesInBucket(d)))
      .on('mouseover', function(d, i){
        div
          .transition()		
          .style("opacity", .9);		
          div.html(`${parent.moviesInBucket(d)} movies were rated between ${d.x0} and ${d.x1}`)
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on('mouseout', function(d, i){
        div.transition()
          .style("opacity", 0);
      })
  }

  render() {
    const { dataset } = this.props;

    const ratingMin = d3.min(dataset, d => +d.userRatingScore)
    const ratingMax = d3.max(dataset, d => +d.userRatingScore)
    this.moviesInBucket = (d) => d3.sum(d, el => el.value);
    
    const groupsRatings = groups(dataset, d => +d.userRatingScore)
    .sort((a, b) => a[0] - b[0])
    .map(([key, value]) => ({key, value: value.length}))
    
    const histogram = d3.histogram().value(d => +d.key);
    this.ratingsHistogram = histogram(groupsRatings);
    const maxMoviesInBucket = d3.max(this.ratingsHistogram, d => this.moviesInBucket(d));

    // Scales
    this.xAxisScale = d3
      .scaleLinear()
      .domain([ratingMin, ratingMax])
      .range([this.padding, this.w - this.chartSize]);

    this.myColor = d3
      .scaleLinear()
      .domain([0, maxMoviesInBucket])
      .range(['#fdba9a', '#c81912']);

    this.yAxisScale = d3
      .scaleLinear()
      .domain([0, maxMoviesInBucket])
      .range([this.h - this.padding, this.margin.bottom]);

    return <svg ref={el => (this.svg = el)}>
      <g id="netflix_logo">
        <image href={logo} x={this.w - 40} y="0" height="100px" width="150px"/>
        <text x={this.w - 100} y={120} fill="black" fontSize="14">
          The chart to the left illustrates a sample of
        </text>
        <text x={this.w - 100} y={140} fill="black" fontSize="14">
          1000 shows, bucketed by rating.
        </text>
        <text x={this.w - 100} y={160} fill="black" fontSize="14">
          This chart reveals how Netflix users have a
        </text>
        <text x={this.w - 100} y={180} fill="black" fontSize="14">
          general positive perception of the shows
        </text>
        <text x={this.w - 100} y={200} fill="black" fontSize="14">
          they watch on the platform.
        </text>
        <text x={this.w - 100} y={240} fill="black" fontSize="14" fontWeight={600}>
          Hover over the bars to see how many shows
        </text>
        <text x={this.w - 100} y={260} fill="black" fontSize="14" fontWeight={600}>
          are rated within each bucket!
        </text>
        <text x={this.w - 100} y={400} fill="black" fontSize="12">
          [Non-filtered dataset = 1000]
        </text>
      </g>
    </svg>;
  }
}

export default BarsChart;
