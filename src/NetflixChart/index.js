import React, { Component } from 'react';
import * as d3 from 'd3';
import Bar from './Bar';
import Text from './Text';

class NetflixChart extends Component {
  constructor(props) {
    super(props);
    this.createAttributes = this.createAttributes.bind(this);

    const { width } = this.props;
    this.totalH = 300;
    this.margin = {
      top: 5,
      bottom: 5,
      left: 25,
      right: 30,
    };
    this.data = [];
    this.w = width - this.margin.left - this.margin.right;
    this.h = this.totalH - this.margin.top - this.margin.bottom;
  }

  componentDidMount() {
    this.createAttributes();
  }

  createAttributes() {
    // Dimensions
    const { totalH, margin } = this;

    // DOM
    d3.select(this.svg)
      .attr('class', 'bar-svg')
      .attr('id', `chart_${this.props.id}`)
      .attr('width', '100%')
      .attr('height', totalH)
      .attr('class', 'bar-g');

    const yAxis = d3.axisLeft().scale(this.yScale);
    const axis = d3
      .select(`#chart_${this.props.id}`)
      .append('g')
      .attr(
        'transform',
        `translate(${margin.left}, ${margin.top})`,
      )
      .call(yAxis);

    axis.selectAll('text').attr('fill', d => `rgb(200, 0, ${d * 0.1})`);
  }

  render() {
    // Data
    const { dataset, netflixData } = this.props;

    // Dimensions
    const { w, h } = this;

    const dataRange = d3.range(netflixData.length);
    // Scales
    this.xScale = d3
      .scaleBand()
      .domain(dataRange)
      .rangeRound([0, netflixData.length])
      .paddingInner(0.05);
    this.yScale = d3
      .scaleLinear()
      .domain([d3.min(netflixData, d => +d.releaseYear), d3.max(netflixData, d => +d.releaseYear)])
      .range([h, 0]);

    return (
      <svg ref={el => (this.svg = el)}>
        <g ref={el => (this.g = el)}>
          {netflixData.length > 0 && netflixData.map((d, i) => (
            <Bar
              data={d}
              i={i}
              height={h}
              margin={this.margin}
              xScale={this.xScale}
              yScale={this.yScale}
              key={`${i}-bar`}
            />
          ))}
          {/* {netflixData.map((d, i) => (
            <Text
              data={d}
              i={i}
              margin={this.margin}
              xScale={xScale}
              yScale={this.yScale}
              key={`${i}-text`}
            />
          ))} */}
        </g>
      </svg>
    );
  }
}

export default NetflixChart;
