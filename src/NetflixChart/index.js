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

    axis.selectAll('text').attr('fill', d => `rgb(200, 0, ${d * 20})`);
  }

  render() {
    // Data
    const { dataset, netflixData } = this.props;
    console.log('CONSOLE.LOG: NetflixChart -> render -> netflixData', netflixData);
    console.log('CONSOLE.LOG: NetflixChart -> render -> netflixData.length', netflixData.length);
    console.log('CONSOLE.LOG: NetflixChart -> render -> d3.max(netflixData)', d3.max(netflixData));

    // Dimensions
    const { w, h } = this;

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([5, w])
      .paddingInner(0.05);
    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([h, 0]);

    return (
      <svg ref={el => (this.svg = el)}>
        <g ref={el => (this.g = el)}>
          {dataset.map((d, i) => (
            <Bar
              data={d}
              i={i}
              height={h}
              margin={this.margin}
              xScale={xScale}
              yScale={this.yScale}
              key={`${i}-bar`}
            />
          ))}
          {dataset.map((d, i) => (
            <Text
              data={d}
              i={i}
              margin={this.margin}
              xScale={xScale}
              yScale={this.yScale}
              key={`${i}-text`}
            />
          ))}
        </g>
      </svg>
    );
  }
}

export default NetflixChart;
