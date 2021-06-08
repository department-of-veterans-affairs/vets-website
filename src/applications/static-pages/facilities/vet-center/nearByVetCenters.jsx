import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { apiRequest } from 'platform/utilities/api';
import VetCenterInfoSection from './components/VetCenterInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';

const NearByVetCenters = props => {
  const [vetCenterFacilities, setVetCenterFacilities] = useState([]);

  useEffect(
    () => {
      const notPublishedFacilities = props.vetCenters
        .map(
          v => !v.entity.entityPublished && v.entity.fieldFacilityLocatorApiId,
        )
        .join(',');
      apiRequest(`/facilities/va?ids=${notPublishedFacilities}`, {
        apiVersion: 'v1',
      }).then(res => setVetCenterFacilities(res.data));
    },
    [props.vetCenters],
  );

  if (
    props.vetCenters.some(v => !v.entity.entityPublished) &&
    vetCenterFacilities.length === 0
  ) {
    return <LoadingIndicator message="Loading facilities..." />;
  }

  const renderVetCenter = (vetCenter, mainVetCenterPhone) => {
    return (
      <div
        className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row facility
      vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5"
      >
        <section className="region-grid vads-u-margin-right--2">
          <VetCenterInfoSection
            vetCenter={vetCenter}
            mainVetCenterPhone={mainVetCenterPhone}
          />
        </section>

        <section
          className="region-grid usa-width-one-half vads-u-order--first small-screen:vads-u-order--initial
        vads-u-margin-bottom--2"
        >
          <VetCenterImageSection vetCenter={vetCenter} />
        </section>
      </div>
    );
  };

  const renderNearByVetCenters = (
    vetCenters,
    facilitiesVetCenters,
    mainVetCenterPhone,
  ) => {
    const publishedVetCenters = vetCenters
      .filter(v => v.entity.entityPublished)
      .map(v => v.entity);
    const unPublishedVetCenters = facilitiesVetCenters.map(vc => ({
      entityBundle: vc.attributes.facilityType,
      fieldPhoneNumber: vc.attributes.phone.main,
      title: vc.attributes.name,
      fieldAddress: {
        addressLine1: vc.attributes.address.physical.address1,
        administrativeArea: vc.attributes.address.physical.state,
        locality: vc.attributes.address.physical.city,
        postalCode: vc.attributes.address.physical.zip,
      },
      fieldOperatingStatusFacility: vc.attributes.operatingStatus?.code.toLowerCase(),
      fieldOperatingStatusMoreInfo:
        vc.attributes.operatingStatus?.additionalInfo,
    }));
    return (
      <div>
        <h2
          className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
                  medium-screen:vads-u-margin-bottom--3"
          id="other-near-locations"
        >
          Other nearby Vet Centers
        </h2>
        {[...publishedVetCenters, ...unPublishedVetCenters].map(vc =>
          renderVetCenter(vc, mainVetCenterPhone),
        )}
      </div>
    );
  };

  return renderNearByVetCenters(
    props.vetCenters,
    vetCenterFacilities,
    props.mainVetCenterPhone,
  );
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
  mainVetCenterPhone: PropTypes.string,
};

export default NearByVetCenters;
