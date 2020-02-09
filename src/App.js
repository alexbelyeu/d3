// React Grid Layout: https://github.com/STRML/react-grid-layout
// Recharts: https://github.com/recharts/recharts http://recharts.org/en-US/api
import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as d3 from 'd3';
import D3Chart from './D3Chart';
import HybridChart from './HybridChart/index';
import NetflixChart from './NetflixChart/index';
import netflixData from './netflix_shows.csv';

const ReactGridLayout = WidthProvider(RGL);

export default class NoDraggingLayout extends React.Component {
  static defaultProps = {
    className: 'layout',
    isDraggable: true,
    isResizable: false,
    items: 12,
    cols: 2,
    rowHeight: 30,
    onLayoutChange: function() {},
  };

  constructor(props) {
    super(props);

    this.rangeOfItems = i => Array.from(Array(i).keys()).map(x => ++x); // Array 1 .. props.items
    this.width = 600;
    const layout = this.generateLayout();
    this.state = { layout, data: [] };
  }

  generateDOM() {
    return [
      <div key={0}>
        <NetflixChart id={0} width={this.width} netflixData={this.state.data} dataset={this.rangeOfItems(11)} />
      </div>,
      <div key={1}>
        <HybridChart id={1} width={this.width} dataset={this.rangeOfItems(11)} />
      </div>,
      <div key={2}>
        <D3Chart id={2} width={this.width} dataset={this.rangeOfItems(9)} />
      </div>,
    ];
  }

  generateLayout() {
    return [1, 2, 3].map((item, i) => {
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * 3,
        w: 2,
        h: i === 0 ? 24 : 8,
        i: i.toString(),
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  componentDidMount() {
    d3.csv(netflixData).then(data => {
      this.setState({ data });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.data.length > 0) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        style={{ width: this.width }}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}
