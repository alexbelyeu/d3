// React Grid Layout: https://github.com/STRML/react-grid-layout
// Recharts: https://github.com/recharts/recharts http://recharts.org/en-US/api
import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as d3 from 'd3';
import ScatterPlot from './components/ScatterPlot';
import Histogram from './components/Histogram';
import netflixData from './data/netflix_shows.csv';

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
    this.width = 1000;
    const layout = this.generateLayout();
    this.state = { layout, data: [] };
  }

  generateDOM() {
    return [
      <div key={0}>
        {this.state.data.length > 0 && <ScatterPlot id={0} width={this.width} dataset={this.state.data} />}
      </div>,
      <div key={1}>
        {this.state.data.length > 0 && <Histogram id={1} width={this.width} dataset={this.state.data} />}
      </div>,
    ];
  }

  generateLayout() {
    return [1, 2, 3].map((item, i) => {
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * 3,
        w: 2,
        h: 12,
        i: i.toString(),
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  componentDidMount() {
    d3.csv(netflixData).then(data => {
      const filteredData = data.filter(d => !isNaN(d.userRatingScore));

      this.setState({ data: filteredData });
    });
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
