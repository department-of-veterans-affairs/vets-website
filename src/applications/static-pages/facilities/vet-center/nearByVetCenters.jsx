import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { apiRequest } from 'platform/utilities/api';
import VetCenterInfoSection from './components/VetCenterInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import { connect, useDispatch } from 'react-redux';
import { facilitiesVetCenterAutomateNearby } from '../../../facility-locator/utils/featureFlagSelectors';
import { fetchFacilityStarted, fetchFacilitySuccess } from '../actions';

const NearByVetCenters = props => {
  const [fetchedVetCenters, setFetchedVetCenters] = useState([]);
  const [fetchedNearbyVetCenters, setFetchedNearbyVetCenters] = useState([]);
  const dispatch = useDispatch();

  const fetchUnpublishedVetCenters = () => {
    const notPublishedFacilities = props.vetCenters
      .map(
        v => !v.entity?.entityPublished && v.entity?.fieldFacilityLocatorApiId,
      )
      .join(',');
    dispatch(fetchFacilityStarted());
    apiRequest(`/facilities/va?ids=${notPublishedFacilities}`, {
      apiVersion: 'v1',
    }).then(res => {
      dispatch(fetchFacilitySuccess());
      setFetchedVetCenters(res.data);
    });
  };

  const fetchNearbyVetCenters = () => {
    // TODO: get bounding box of 80 mile radius from main vc
    dispatch(fetchFacilityStarted());
    apiRequest(`/facilities/va/`, {
      apiVersion: 'v1',
    }).then(res => {
      dispatch(fetchFacilitySuccess());
      setFetchedNearbyVetCenters(res.data);
    });
  };

  useEffect(() => {
    if (props.automateNearbyVetCenters) {
      fetchNearbyVetCenters();
    } else {
      fetchUnpublishedVetCenters();
    }
  }, []);

  if (props.loading) {
    return <LoadingIndicator message="Loading facilities..." />;
  }

  // TODO: consider separate component
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

  const getPublishedVetCenters = () => {
    return props.vetCenters
      .filter(v => v.entity?.entityPublished)
      .map(v => v.entity);
  };

  const normalizeUnPublishedVetCenters = () => {
    return fetchedVetCenters.map(vc => ({
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
  };

  const renderNearbyVetCenterContainer = sortedVetCenters => (
    <div>
      <h2
        className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
                  medium-screen:vads-u-margin-bottom--3"
        id="other-near-locations"
      >
        Other nearby Vet Centers
      </h2>
      {sortedVetCenters.map(vc =>
        renderVetCenter(vc, props.mainVetCenterPhone),
      )}
    </div>
  );

  if (props.automateNearbyVetCenters) {
    return renderNearbyVetCenterContainer(fetchedNearbyVetCenters);
  }

  const publishedVetCenters = getPublishedVetCenters();
  const unPublishedVetCenters = normalizeUnPublishedVetCenters();
  return renderNearbyVetCenterContainer([
    ...publishedVetCenters,
    ...unPublishedVetCenters,
  ]);
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
  mainVetCenterPhone: PropTypes.string,
};

const mapStateToProps = store => ({
  automateNearbyVetCenters: facilitiesVetCenterAutomateNearby(store),
  loading: store.facility?.loading,
});

export default connect(mapStateToProps)(NearByVetCenters);
