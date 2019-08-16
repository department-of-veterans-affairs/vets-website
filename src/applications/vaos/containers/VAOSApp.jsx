import React, { Component } from 'react';

export default class VAOSApp extends Component {
  render() {
    return (
      <div className="row">
        <div className="vads-u-padding-y--5">{this.props.children}</div>
      </div>
    );
  }
}
