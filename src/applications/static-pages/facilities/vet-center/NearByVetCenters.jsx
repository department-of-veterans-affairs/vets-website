import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect, useDispatch } from 'react-redux';
import VetCenterInfoSection from './components/VetCenterInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import { fetchFacilityStarted, fetchFacilitySuccess } from '../actions';
import {
  calculateBoundingBox,
  convertMetersToMiles,
  distancesToNearbyVetCenters,
} from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/utils/mapbox';
import buildFacility from './buildFacility';

const NEARBY_VET_CENTER_RADIUS_MILES = 120;

const NearByVetCenters = props => {
  const [originalCoordinates, setOriginalCoordinates] = useState([]);
  const [fetchedVetCenters, setFetchedVetCenters] = useState([]);
  const [nearbyVetCenterDistances, setNearbyVetCenterDistances] = useState(
    false,
  );
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

  const fetchNearbyVetCenters = async () => {
    const mainAddress = props.mainVetCenterAddress;
    if (!mainAddress) {
      return;
    }
    const query = `${mainAddress.addressLine1}, ${mainAddress.locality} ${
      mainAddress.administrativeArea
    } ${mainAddress.postalCode}`;
    const mapboxResponse = await getFeaturesFromAddress(query);
    const coordinates = mapboxResponse?.body.features[0].center; // [longitude,latitude]

    if (coordinates) {
      setOriginalCoordinates(coordinates);
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
    }
  };

  useEffect(
    () => {
      if (!props.togglesLoading) {
        fetchNearbyVetCenters();
      }
    },
    [props.togglesLoading],
  );

  useEffect(
    () => {
      const noDistancesToMeasure =
        originalCoordinates.length === 0 || fetchedVetCenters.length === 0;

      if (nearbyVetCenterDistances || noDistancesToMeasure) {
        return false;
      }

      const vetCentersCoordinates = fetchedVetCenters
        .filter(center => center.id !== props.mainVetCenterId)
        .map(center => {
          return {
            id: center.id,
            coordinates: [center.attributes.long, center.attributes.lat],
          };
        });

      const fetchDrivingData = async () => {
        const response = await fetch(
          distancesToNearbyVetCenters(
            originalCoordinates,
            vetCentersCoordinates.map(center => center.coordinates),
          ),
        );
        const data = await response.json();
        const nearbyDistances = data.distances.map(distance =>
          convertMetersToMiles(distance[0]),
        );

        const vetCentersCoordinatesWithDistances = [
          ...vetCentersCoordinates,
        ].map((center, index) => {
          return {
            ...center,
            distance: nearbyDistances[index],
          };
        });

        setNearbyVetCenterDistances(vetCentersCoordinatesWithDistances);
      };

      fetchDrivingData();
      return false;
    },
    [
      props.mainVetCenterId,
      originalCoordinates,
      fetchedVetCenters,
      nearbyVetCenterDistances,
    ],
  );

  if (props.facilitiesLoading) {
    return <va-loading-indicator message="Loading facilities..." />;
  }

  // TODO: consider moving to a separate component
  const renderVetCenter = (vetCenter, mainVetCenterPhone) => {
    return (
      <div
        className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row facility
      vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5"
        key={vetCenter.id || vetCenter.fieldFacilityLocatorApiId}
      >
        <section className="region-grid vads-u-margin-right--2">
          <VetCenterInfoSection
            vetCenter={vetCenter}
            mainVetCenterPhone={mainVetCenterPhone}
          />
        </section>

        {vetCenter.fieldMedia && (
          <section
            className="region-grid usa-width-one-half vads-u-order--first small-screen:vads-u-order--initial
        vads-u-margin-bottom--2"
          >
            <VetCenterImageSection vetCenter={vetCenter} />
          </section>
        )}
      </div>
    );
  };

  const normalizeFetchedVetCenterProperties = vc => {
    let centerDistance = false;

    if (nearbyVetCenterDistances) {
      const vetCenterDistance = nearbyVetCenterDistances.find(
        distance => distance.id === vc.id,
      );

      centerDistance = vetCenterDistance.distance;
    }

    return buildFacility(vc, centerDistance);
  };

  const normalizeFetchedVetCenters = vcs => {
    return vcs
      .map(vc => normalizeFetchedVetCenterProperties(vc))
      .sort((a, b) => a.distance - b.distance);
  };

  const renderNearbyVetCenterContainer = sortedVetCenters => {
    // Filter here so we can choose to use the sorted list if there are no Vet centers within the birds-eye radius
    const filteredByDistance = sortedVetCenters.filter(
      vc => vc.distance < NEARBY_VET_CENTER_RADIUS_MILES,
    );

    // Distance is calculated using the driving distance not birds-eye distance so all results may be outside the radius
    const useSorted = filteredByDistance.length === 0;

    return (
      <div>
        <h2
          className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
                  medium-screen:vads-u-margin-bottom--3"
          id="other-near-locations"
        >
          Other nearby Vet Centers
        </h2>

        {(useSorted ? sortedVetCenters : filteredByDistance).map(vc => {
          return renderVetCenter(vc, props.mainVetCenterPhone);
        })}
      </div>
    );
  };

  const filteredVetCenters = fetchedVetCenters.filter(
    vc =>
      vc.id !== props.mainVetCenterId &&
      !(props.satteliteVetCenters || []).includes(vc.id),
  );
  if (filteredVetCenters.length > 0) {
    // only render the section if there are some facilities within the birds-eye radius
    const normalizedFetchedVetCenters = normalizeFetchedVetCenters(
      filteredVetCenters,
    );
    return renderNearbyVetCenterContainer(normalizedFetchedVetCenters);
  }
  return null;
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
  mainVetCenterPhone: PropTypes.string,
  mainVetCenterAddress: PropTypes.object,
  mainVetCenterId: PropTypes.string,
  satteliteVetCenters: PropTypes.array,
};

const mapStateToProps = store => ({
  facilitiesLoading: store.facility?.loading,
  togglesLoading: store.featureToggles?.loading,
});

export default connect(mapStateToProps)(NearByVetCenters);
