import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from '../Netflix_Logo_RGB.png';
import { bin } from 'd3-array';

class NetflixChart extends Component {
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
    this.data = [];
    this.w = width - this.margin.left - this.margin.right - 175;
    this.h = this.totalH - this.margin.top - this.margin.bottom;
  }

  componentDidMount() {
    this.createAttributes();
  }

  createAttributes() {
    // Dimensions
    const { totalH, margin } = this;

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
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Y Axis
    const yAxis = d3.axisLeft(this.yAxisScale).tickFormat(d3.format('d'));
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `yAxis_${this.props.id}`)
      .attr('transform', `translate(${50 + margin.left}, ${margin.top})`)
      .call(yAxis);

    d3.select(`#yAxis_${this.props.id}`)
      .append('text')
        .attr('font-family', 'Montserrat')
        .attr('x', -100)
        .attr('y', -50)
        .attr('transform', `rotate(-90)`)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Year of release')

    // X Axis
    const xAxis = d3.axisBottom(this.xAxisScale);
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `xAxis_${this.props.id}`)
      .attr('transform', `translate(${margin.left}, ${totalH - margin.bottom - 50})`)
      .call(xAxis);

    d3.select(`#xAxis_${this.props.id}`)
      .append('text')
        .attr('font-family', 'Montserrat')
        .attr('x', this.w/2 - 50)
        .attr('y', 50)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Rating')

    // Select + Data + Append + Cool stuff
    let parent = this;
    svg
      .selectAll()
      .data(this.props.dataset, d => d.userRatingScore + ':' + d.releaseYear) //55:1940
      .enter()
      .append('rect')
        .attr('x', d => this.xAxisScale(+d.userRatingScore) + 5)
        .attr('y', d => this.yAxisScale(+d.releaseYear) - 5)
        .attr('width', 10)
        .attr('height', 10)
        .attr('rx', 50)
        .style('fill', d => this.myColor(+d.userRatingScore))
      .on('mouseover', function(d, i){
        d3.select(this)
          .transition()
          .attr('x', parent.xAxisScale(+d.userRatingScore))
          .attr('y', parent.yAxisScale(+d.releaseYear) - 10)
          .attr('width', 20)
          .attr('height', 20)
          .attr('rx', 50)
          .style('fill', parent.myColor(+d.userRatingScore));

          div
            .transition()		
            .duration(200)	
            .style("opacity", .9);		
          div.html(`${d.title} (${d.releaseYear}, ${d.userRatingScore})`)
            .style('width', console.log(d.title.width))
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function(d, i){
        d3.select(this)
          .transition()
          .attr('x', parent.xAxisScale(+d.userRatingScore) + 5)
          .attr('y', parent.yAxisScale(+d.releaseYear) - 5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('rx', 50)
          .style('fill', parent.myColor(+d.userRatingScore))

        div.transition()
          .duration(500)
          .style("opacity", 0);

        d3.select(`#t-${i}`).remove();
      })
  }

  render() {
    const { dataset } = this.props;

    // Data for scales
    const ascendingYears = d3
      .map(dataset, d => +d.releaseYear)
      .keys()
      .sort(d3.ascending);
    this.yearsBucket = bin()(ascendingYears)
      .map(d => +d.x0)
      .filter(d => [1940, 1990, 2000, 2010, 2017].includes(+d))
      .sort(d3.ascending);
    const ascendingRatings = d3
      .map(dataset, d => +d.userRatingScore)
      .keys()
      .sort(d3.ascending)
      .filter(d => !isNaN(d));
    this.ratingBuckets = bin()(ascendingRatings)
      .map(d => +d.x0)
      .filter(d => [55, 65, 70, 75, 80, 85, 90, 95].includes(+d))
      .sort(d3.ascending);

    // Scales
    this.myColor = d3
      .scaleLinear()
      .domain(d3.extent(dataset, d => +d.userRatingScore))
      .range(['#fdba9a', '#c81912']);

    this.xAxisScale = d3
      .scaleLinear()
      .domain([55, 99])
      .range([50, this.w - 175])

    this.yAxisScale = d3
      .scaleLinear()
      .domain([1940, 2017])
      .range([this.h - 50, this.margin.bottom])

    return <svg ref={el => (this.svg = el)}>
      <g id="netflix_logo">
        <image href={logo} x={this.w - 40} y="0" height="100px" width="150px"/>
        <text fontFamily="Montserrat" x={this.w - 100} y={120} fill="black" fontSize="14">
          The chart to the left illustrates a sample
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={140} fill="black" fontSize="14">
          of 1000 shows, distributed by year of release
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={160} fill="black" fontSize="14">
          vs. rating. The data reveals that most shows
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={180} fill="black" fontSize="14">
          on Netflix were produced in the last decade
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={200} fill="black" fontSize="14">
          and that they rate higher than shows
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={220} fill="black" fontSize="14">
          produced before the 2000s.
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={260} fill="black" fontSize="14" fontWeight={600}>
          Hover over the circles to see what shows
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={280} fill="black" fontSize="14" fontWeight={600}>
          are rated higher!
        </text>
        <text fontFamily="Montserrat" x={this.w - 100} y={400} fill="black" fontSize="12">
          [Dataset = 1000]
        </text>
      </g>
    </svg>;
  }
}

export default NetflixChart;
