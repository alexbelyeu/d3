// React Grid Layout: https://github.com/STRML/react-grid-layout
// Recharts: https://github.com/recharts/recharts http://recharts.org/en-US/api
import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import D3Chart from './D3Chart';

const ReactGridLayout = WidthProvider(RGL);

export default class NoDraggingLayout extends React.PureComponent {
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
    this.state = { layout };
  }

  generateDOM() {
    return [
      <div key={0}>
        <D3Chart id={1} width={this.width} dataset={this.rangeOfItems(5)} />
      </div>,
      <div key={1}>
        <D3Chart id={2} width={this.width} dataset={this.rangeOfItems(11)} />
      </div>,
      <div key={2}>
        <D3Chart id={3} width={this.width} dataset={this.rangeOfItems(9)} />
      </div>,
    ];
  }

  generateLayout() {
    return [1, 2, 3].map((item, i) => {
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * 3,
        w: 4,
        h: 8,
        i: i.toString(),
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
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
