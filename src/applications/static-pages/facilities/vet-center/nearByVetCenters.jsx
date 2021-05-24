import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { apiRequest } from 'platform/utilities/api';

const NearByVetCenters = props => {
  const [facilities, setFacilities] = useState([]);
  useEffect(
    () => {
      const notPublishedFacilities = props.vetCenters
        .map(
          v => !v.entity.entityPublished && v.entity.fieldFacilityLocatorApiId,
        )
        .join(',');
      apiRequest(`/facilities/va?ids=${notPublishedFacilities}`, {
        apiVersion: 'v1',
      }).then(res => setFacilities(res.data));
    },
    [props.vetCenters],
  );

  if (
    props.vetCenters.some(v => !v.entity.entityPublished) &&
    facilities.length === 0
  ) {
    return <LoadingIndicator message="Loading facilities..." />;
  }

  /* eslint-disable no-unused-vars */
  const renderVetCenter = () => {
    return (
      <div
        className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row facility
      vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5"
      >
        <section className="region-grid vads-u-margin-right--2" />

        <section
          className="region-grid usa-width-one-half vads-u-order--first small-screen:vads-u-order--initial
        vads-u-margin-bottom--2"
        />
      </div>
    );
  };

  return (
    <div>
      <h2
        className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
                  medium-screen:vads-u-margin-bottom--3"
        id="other-near-locations"
      >
        Other nearby Vet Centers
      </h2>
    </div>
  );
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
  mainVetCenterPhone: PropTypes.string,
};

export default NearByVetCenters;
