import React from 'react';

const facilityLocationPath = require('../../../site/stages/build/drupal/utilities-drupal');

export default class FacilityTitle extends React.Component {
  render() {
    return (
      <h3 className="vads-u-margin-bottom--2p5">
        <a
          href={facilityLocationPath(
            this.props.regionPath,
            this.props.facility.id,
            this.props.nickname,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.props.facility.attributes.name}
        </a>
      </h3>
    );
  }
}
