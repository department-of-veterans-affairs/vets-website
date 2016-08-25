import React, { Component, PropTypes } from 'react';
import FacilityDetailsInfo from './FacilityDetailsInfo'

class FacilityDetailsList extends Component {
  render() {
    return (
      <div>
        <ul>
          <FacilityDetailsInfo key={this.props.facility.id} address={this.props.facility.address} phone={this.props.facility.phone} />
        </ul>
      </div>
    );
  }
}

FacilityDetailsList.propTypes = {
  facility: PropTypes.object.isRequired
};

export default FacilityDetailsList;
