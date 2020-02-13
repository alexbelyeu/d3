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

    // DOM
    const svg = d3
      .select(this.svg)
      .attr('class', 'bar-svg')
      .attr('id', `chart_${this.props.id}`)
      .attr('width', this.props.width)
      .attr('height', totalH + margin.top + margin.bottom + 5)
      .attr('class', 'bar-g')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yAxis = d3.axisLeft(this.yScale).tickValues([...this.yearsBucket, 2017]);
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `yAxis_${this.props.id}`)
      .attr('transform', `translate(${50 + margin.left}, ${margin.top})`)
      .call(yAxis);

    d3.select(`#yAxis_${this.props.id}`)
      .append('text')
        .attr('x', -100)
        .attr('y', -50)
        .attr('transform', `rotate(-90)`)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Year of release')

    const xAxis = d3.axisBottom(this.xScale).tickValues([...this.ratingBuckets, 99]);
    d3.select(`#chart_${this.props.id}`)
      .append('g')
      .attr('id', `xAxis_${this.props.id}`)
      .attr('transform', `translate(${margin.left}, ${totalH - margin.bottom - 50})`)
      .call(xAxis);

    d3.select(`#xAxis_${this.props.id}`)
      .append('text')
        .attr('x', this.w/2 - 50)
        .attr('y', 50)
        .attr('fill', 'black')
        .attr('font-size', 20)
        .text('Rating')

    // const bins = bin().value(d => +d.releaseYear)(this.props.dataset);
    // console.log('CONSOLE.LOG: NetflixChart -> render -> bin(dataset)', bins);

    let parent = this;
    svg
      .selectAll()
      .data(this.props.dataset, d => d.userRatingScore + ':' + d.releaseYear) //55:1940
      .enter()
      .append('rect')
        .attr('x', d => this.xScale(+d.userRatingScore))
        .attr('y', d => this.yScale(+d.releaseYear))
        .attr('width', this.xScale.bandwidth())
        .attr('height', this.yScale.bandwidth())
        .attr('rx', 50)
        .style('fill', d => this.myColor(+d.userRatingScore))
      .on('mouseover', function(d, i){
        d3.select(this)
          .transition()
          .attr('x', parent.xScale(+d.userRatingScore) - parent.xScale.bandwidth()/2)
          .attr('y', parent.yScale(+d.releaseYear) - parent.yScale.bandwidth()/2)
          .attr('width', parent.xScale.bandwidth()*2)
          .attr('height', parent.yScale.bandwidth()*2)
          .attr('rx', 50)
          .style('fill', parent.myColorReverse(+d.userRatingScore));

        svg.append("text")
          .attr('id', `t-${i}`)
          .attr('x', parent.xScale(+d.userRatingScore) - parent.xScale.bandwidth()/2)
          .attr('y', parent.yScale(+d.releaseYear) - parent.yScale.bandwidth()/2)
          .attr('fill', 'black')
          .attr('font-size', 12)
          .text(`${d.title} (${d.releaseYear})`)
      })
      .on('mouseout', function(d, i){
        d3.select(this)
          .transition()
          .attr('x', parent.xScale(+d.userRatingScore))
          .attr('y', parent.yScale(+d.releaseYear))
          .attr('width', parent.xScale.bandwidth())
          .attr('height', parent.yScale.bandwidth())
          .attr('rx', 50)
          .style('fill', parent.myColor(+d.userRatingScore))

        d3.select(`#t-${i}`).remove();
      })
  }

  render() {
    // Data
    const { dataset } = this.props;

    const ascendingYears = d3
      .map(dataset, d => +d.releaseYear)
      .keys()
      .sort(d3.ascending);
    this.yearsBucket = bin()(ascendingYears)
      .map(d => +d.x0)
      .filter(d => [1940, 1990, 2000, 2010, 2017].includes(+d))
      .sort(d3.ascending);
    console.log('CONSOLE.LOG: NetflixChart -> render -> this.yearsBucket', this.yearsBucket);
    const ascendingRatings = d3
      .map(dataset, d => +d.userRatingScore)
      .keys()
      .sort(d3.ascending)
      .filter(d => !isNaN(d));
    this.ratingBuckets = bin()(ascendingRatings)
      .map(d => +d.x0)
      .filter(d => [55, 65, 70, 75, 80, 85, 90, 95].includes(+d))
      .sort(d3.ascending);
    console.log('CONSOLE.LOG: NetflixChart -> render -> ratingBuckets', this.ratingBuckets);

    // Scales
    this.myColor = d3
      .scaleLinear()
      .domain(d3.extent(dataset, d => +d.userRatingScore))
      .range(['white', '#f00']);

    this.myColorReverse = d3
      .scaleLinear()
      .domain(d3.extent(dataset, d => +d.userRatingScore))
      .range(['#f00', 'white']);

    this.xScale = d3
      .scaleBand()
      .domain(ascendingRatings)
      .range([50, this.w - 175])
      .paddingInner(0.05);

    this.xAxisScale = d3
      .scaleBand()
      .domain(this.ratingBuckets)
      .range([50, this.w - 175])
      .paddingInner(0.05);

    this.yScale = d3
      .scaleBand()
      .domain(ascendingYears)
      .range([this.h - 50, 0])
      .paddingInner(0.05);

    this.yAxisScale = d3
      .scaleBand()
      .domain(this.yearsBucket)
      .range([this.h - 50, 0])
      .paddingInner(0.05);

    return <svg ref={el => (this.svg = el)}>
      <g id="netflix_logo">
        <image href={logo} x={this.w - 40} y="0" height="100px" width="150px"/>
        <text x={this.w - 100} y={120} fill="black" fontSize="14">
          The chart to the left illustrates a sample
        </text>
        <text x={this.w - 100} y={140} fill="black" fontSize="14">
          of 1000 shows, distributed by year of release
        </text>
        <text x={this.w - 100} y={160} fill="black" fontSize="14">
          vs. rating. The data reveals that most shows on
        </text>
        <text x={this.w - 100} y={180} fill="black" fontSize="14">
          Netflix were produced in the last decade and
        </text>
        <text x={this.w - 100} y={200} fill="black" fontSize="14">
          that they rate higher than shows produced 
        </text>
        <text x={this.w - 100} y={220} fill="black" fontSize="14">
          before the 2000s.
        </text>
        <text x={this.w - 100} y={260} fill="black" fontSize="14" fontWeight={600}>
          Hover over the circles to see what shows
        </text>
        <text x={this.w - 100} y={280} fill="black" fontSize="14" fontWeight={600}>
          are rated higher!
        </text>
        <text x={this.w - 100} y={400} fill="black" fontSize="12">
          [Dataset = 1000]
        </text>
      </g>
    </svg>;
  }
}

export default NetflixChart;
