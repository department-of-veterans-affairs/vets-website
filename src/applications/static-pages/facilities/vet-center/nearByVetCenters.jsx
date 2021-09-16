import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { apiRequest } from 'platform/utilities/api';
import VetCenterInfoSection from './components/VetCenterInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import { connect, useDispatch } from 'react-redux';
import { facilitiesVetCenterAutomateNearby } from '../../../facility-locator/utils/featureFlagSelectors';
import { fetchFacilityStarted, fetchFacilitySuccess } from '../actions';
import { calculateBoundingBox } from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/actions';

const NEARBY_VET_CENTER_RADIUS_MILES = 80;

const NearByVetCenters = props => {
  const [fetchedVetCenters, setFetchedVetCenters] = useState([]);
  const dispatch = useDispatch();

  const fetchVetCenters = query => {
    dispatch(fetchFacilityStarted());
    apiRequest(query, {
      apiVersion: 'v1',
    }).then(res => {
      dispatch(fetchFacilitySuccess());
      setFetchedVetCenters(res.data);
    });
  };

  const fetchUnpublishedVetCenters = () => {
    const notPublishedFacilities = props.vetCenters
      .map(
        v => !v.entity?.entityPublished && v.entity?.fieldFacilityLocatorApiId,
      )
      .join(',');
    fetchVetCenters(`/facilities/va?ids=${notPublishedFacilities}`);
  };

  const fetchNearbyVetCenters = () => {
    const mainAddress = props.mainVetCenterAddress;
    const query = `${mainAddress.addressLine1}, ${mainAddress.locality} ${
      mainAddress.administrativeArea
    } ${mainAddress.postalCode}`;
    getFeaturesFromAddress(query, ({ body: { features } }) => {
      const coordinates = features[0].center; // [longitude,latitude]
      const boundingBox = calculateBoundingBox(
        coordinates[1],
        coordinates[0],
        NEARBY_VET_CENTER_RADIUS_MILES,
      );
      const params = [
        'type=vet_center',
        'page=1',
        'per_page=5',
        'mobile=false',
        `radius=${NEARBY_VET_CENTER_RADIUS_MILES}`,
        `latitude=${coordinates[1]}`,
        `longitude=${coordinates[0]}`,
        ...boundingBox.map(c => `bbox[]=${c}`),
      ].join('&');
      fetchVetCenters(`/facilities/va/?${params}`);
    });
  };

  useEffect(
    () => {
      if (!props.togglesLoading) {
        if (props.automateNearbyVetCenters) {
          // eslint-disable-next-line no-console
          console.log('fetching nearby vet centers');
          fetchNearbyVetCenters();
        } else {
          // eslint-disable-next-line no-console
          console.log('fetching unpublished vet centers');
          fetchUnpublishedVetCenters();
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('toggles are loading...');
      }
    },
    [props.togglesLoading],
  );

  if (props.facilitiesLoading) {
    return <LoadingIndicator message="Loading facilities..." />;
  }

  // TODO: consider moving to a separate component
  const renderVetCenter = (vetCenter, mainVetCenterPhone) => {
    // TODO - fix unique key warning
    // Tried adding this to the div but it causes rendering to fail for some reason:
    // key={vetCenter.id}
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

  const normalizeFetchedVetCenters = vcs => {
    return vcs.map(vc => ({
      id: vc.id,
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
    const filteredVetCenters = fetchedVetCenters.filter(
      vc =>
        vc.id !== props.mainVetCenterId &&
        !props.satteliteVetCenters.includes(vc.id),
    );
    if (filteredVetCenters.length > 0) {
      return renderNearbyVetCenterContainer(
        normalizeFetchedVetCenters(filteredVetCenters),
      );
    } else {
      // eslint-disable-next-line no-console
      console.log('No filtered vet centers found');
      return null;
    }
  }

  const publishedVetCenters = getPublishedVetCenters();
  const unPublishedVetCenters = normalizeFetchedVetCenters(fetchedVetCenters);
  return renderNearbyVetCenterContainer([
    ...publishedVetCenters,
    ...unPublishedVetCenters,
  ]);
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
  mainVetCenterPhone: PropTypes.string,
  mainVetCenterAddress: PropTypes.object,
  mainVetCenterId: PropTypes.string,
  satteliteVetCenters: PropTypes.array,
};

const mapStateToProps = store => ({
  automateNearbyVetCenters: facilitiesVetCenterAutomateNearby(store),
  facilitiesLoading: store.facility?.loading,
  togglesLoading: store.featureToggles?.loading,
});

export default connect(mapStateToProps)(NearByVetCenters);
