import React from 'react';
import PropTypes from 'prop-types';
import { getRealFacilityId } from '../utils/appointment';
import FacilityAddress from './FacilityAddress';
import NewTabAnchor from './NewTabAnchor';

export default function VAFacilityLocation({
  clinicName,
  facility,
  facilityName,
  facilityId,
  clinicFriendlyName,
  showCovidPhone,
  isPhone,
}) {
  let content = null;

  if (!facility && !facilityId) {
    content = (
      <NewTabAnchor href="/find-locations">
        Find facility information
      </NewTabAnchor>
    );
  } else if (!facility) {
    content = (
      <NewTabAnchor
        href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
      >
        View facility information
      </NewTabAnchor>
    );
  } else if (facility) {
    content = (
      <>
        {!!clinicName && (
          <>
            {facility.name}
            <br />
          </>
        )}
        <FacilityAddress
          facility={facility}
          showDirectionsLink
          clinicName={clinicFriendlyName}
          level={2}
          showCovidPhone={showCovidPhone}
        />
      </>
    );
  }

  const name = clinicName || facilityName || facility?.name;

  if (isPhone) {
    return (
      <>
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          {name}
        </h2>
        <div>{content}</div>
      </>
    );
  }

  return (
    <>
      {name}
      <div>{content}</div>
    </>
  );
}

VAFacilityLocation.propTypes = {
  clinicFriendlyName: PropTypes.string,
  clinicName: PropTypes.string,
  facility: PropTypes.object,
  facilityId: PropTypes.number,
  facilityName: PropTypes.string,
  isPhone: PropTypes.bool,
  showCovidPhone: PropTypes.bool,
};
