import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FacilityType } from '../../constants';
import OperationStatus from './OperationStatus';
import LocationAddress from '../search-results-items/common/LocationAddress';
import LocationPhoneLink from '../search-results-items/common/LocationPhoneLink';
import LocationDirectionsLink from '../search-results-items/common/LocationDirectionsLink';
import BurialStatus from './BurialStatus';

class FacilityInfo extends Component {
  render() {
    const { facility, headerRef } = this.props;
    const {
      name,
      website,
      phone,
      operatingStatus,
      facilityType,
    } = facility.attributes;

    const isVBA = facilityType === FacilityType.VA_BENEFITS_FACILITY;
    const isCemetery = facilityType === FacilityType.VA_CEMETERY;

    return (
      <div>
        <h1 ref={headerRef} tabIndex={-1}>
          {name}
        </h1>
        <OperationStatus {...{ operatingStatus, website, facilityType }} />
        <div className="p1">
          <LocationAddress location={facility} />
          <LocationDirectionsLink location={facility} />
        </div>
        <div>
          <LocationPhoneLink location={facility} />
        </div>
        {website &&
          website !== 'NULL' && (
            <p className="vads-u-margin--0">
              <va-link href={website} text="Visit our website" />
            </p>
          )}
        {phone &&
          phone.main &&
          !isVBA && (
            <p>
              Planning to visit? Please call first as information on this page
              may change.
            </p>
          )}
        {isCemetery && <BurialStatus facility={facility} />}
      </div>
    );
  }
}

FacilityInfo.propTypes = {
  facility: PropTypes.object.isRequired,
  headerRef: PropTypes.object.isRequired,
};

export default FacilityInfo;
