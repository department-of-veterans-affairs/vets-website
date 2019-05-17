import React from 'react';

export default class FacilityTitle extends React.Component {
  render() {
    return (
      <h3 className="vads-u-margin-bottom--2p5">
        <a href={this.props.regionPath}>
          {this.props.facility.attributes.name}
        </a>
      </h3>
    );
  }
}
