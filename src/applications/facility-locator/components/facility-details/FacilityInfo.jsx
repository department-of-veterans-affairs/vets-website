import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FacilityType } from '../../constants';
import OperationStatus from './OperationStatus';
import LocationAddress from '../search-results-items/common/LocationAddress';
import LocationPhoneLink from '../search-results-items/common/LocationPhoneLink';
import LocationDirectionsLink from '../search-results-items/common/LocationDirectionsLink';

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

    return (
      <div>
        <h1 ref={headerRef} tabIndex={-1}>
          {name}
        </h1>
        <OperationStatus {...{ operatingStatus, website, facilityType }} />
        <div className="p1">
          <LocationAddress location={facility} />
        </div>
        <div>
          <LocationPhoneLink location={facility} from="FacilityDetail" />
        </div>
        {website &&
          website !== 'NULL' && (
            <p className="vads-u-margin--0">
              <va-icon icon="language" size="3" />
              <va-link
                class="vads-u-margin-left--0p5"
                href={website}
                text="Website"
              />
            </p>
          )}
        <div>
          <LocationDirectionsLink location={facility} />
        </div>
        {phone &&
          phone.main &&
          !isVBA && (
            <p className="p1">
              Planning to visit? Please call first as information on this page
              may change.
            </p>
          )}
      </div>
    );
  }
}

FacilityInfo.propTypes = {
  facility: PropTypes.object.isRequired,
  headerRef: PropTypes.object.isRequired,
};

export default FacilityInfo;
