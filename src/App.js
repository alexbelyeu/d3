import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

export default class NoDraggingLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    // isDraggable: false,
    isResizable: false,
    items: 3,
    cols: 2,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return Array.from(Array(this.props.items).keys()).map((item, index) => {
      return (
        <div key={index}>
          <span className="text">{index}</span>
        </div>
      )
    })
  }

  generateLayout() {
    return Array.from(Array(this.props.items).keys()).map((item, i) => {
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * 3,
        w: 2,
        h: 3,
        i: i.toString()
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
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}