import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { multiTypeQuery } from '../actions';
import {
  calculateBoundingBox,
  convertMetersToMiles,
  distancesToNearbyVetCenters,
} from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/utils/mapbox';
import buildFacility from './buildFacility';
import {
  hasAnyMultiData,
  isFinishedLoading,
  isStartedLoading,
  joinMultiData,
} from './multiLoadingDataHelpers';
import VAFacility from './components/VAFAcility';

const NEARBY_VA_LOCATIONS_RADIUS_MILES = 120;

const genQuery = (boundingBox, coordinates, type, mobileFalse) => {
  const query = '/facilities/va/?';
  const params = [
    'page=1',
    'per_page=2',
    `type=${type}`,
    `radius=${NEARBY_VA_LOCATIONS_RADIUS_MILES}`,
    `latitude=${coordinates[1]}`,
    `longitude=${coordinates[0]}`,
    ...boundingBox.map(c => `bbox[]=${c}`),
  ];
  if (mobileFalse) {
    params.push('mobile=false');
  }
  return query + params.join('&');
};
const NearbyLocations = props => {
  const [originalCoordinates, setOriginalCoordinates] = useState([]);
  const [nearbyVADistances, setNearbyVADistances] = useState(false);
  const dispatch = useDispatch();

  const fetchNearbyVALocations = useCallback(
    async () => {
      if (hasAnyMultiData(props)) {
        return;
      }
      const { mainAddress } = props;
      if (!mainAddress) {
        return;
      }
      const addressQuery = `${mainAddress.addressLine1}, ${
        mainAddress.locality
      } ${mainAddress.administrativeArea} ${mainAddress.postalCode}`;
      const mapboxResponse = await getFeaturesFromAddress(addressQuery);
      const coordinates = mapboxResponse?.body.features[0].center; // [longitude,latitude]

      if (!coordinates) {
        return;
      }
      setOriginalCoordinates(coordinates);
      const boundingBox = calculateBoundingBox(
        coordinates[1],
        coordinates[0],
        NEARBY_VA_LOCATIONS_RADIUS_MILES,
      );
      dispatch(
        multiTypeQuery(
          'Health',
          genQuery(boundingBox, coordinates, 'health', true),
        ),
      );
      dispatch(
        multiTypeQuery(
          'Cemetery',
          genQuery(boundingBox, coordinates, 'cemetery', false),
        ),
      );
      dispatch(
        multiTypeQuery(
          'VetCenter',
          genQuery(boundingBox, coordinates, 'vet_center', true),
        ),
      );
    },
    [props, dispatch],
  );

  useEffect(
    () => {
      if (!props.togglesLoading && !isStartedLoading(props.multiLoading)) {
        fetchNearbyVALocations();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.togglesLoading, props.multiLoading],
  );

  useEffect(
    () => {
      const noDistancesToMeasure =
        originalCoordinates.length === 0 || !isFinishedLoading(props);

      if (nearbyVADistances || noDistancesToMeasure) {
        return false;
      }

      const facilityCoordinates = joinMultiData(props)
        .filter(center => center.id !== props.mainFacilityApiId)
        .map(center => ({
          id: center.id,
          coordinates: [center.attributes.long, center.attributes.lat],
        }));

      const fetchDrivingData = async () => {
        if (nearbyVADistances) {
          return;
        }
        const response = await fetch(
          distancesToNearbyVetCenters(
            originalCoordinates,
            facilityCoordinates.map(center => center.coordinates),
          ),
        );
        const data = await response.json();
        const nearbyDistances = data.distances.map(distance =>
          convertMetersToMiles(distance[0]),
        );

        const facilityCoordinatesWithDistances = facilityCoordinates.map(
          (center, index) => ({
            ...center,
            distance: nearbyDistances[index],
          }),
        );

        setNearbyVADistances(facilityCoordinatesWithDistances);
      };

      fetchDrivingData();
      return false;
    },
    [props, originalCoordinates, nearbyVADistances],
  );
  const normalizeFetchedFacilityProperties = useCallback(
    vc => {
      let centerDistance = false;

      if (isFinishedLoading(props) && nearbyVADistances.length) {
        const facilityDistance = nearbyVADistances.find(
          distance => distance.id === vc.id,
        );
        centerDistance = facilityDistance.distance;
      }
      return buildFacility(vc, centerDistance);
    },
    [nearbyVADistances, props],
  );

  const normalizeFetchedFacilities = vcs => {
    return (
      vcs
        .map(vc => normalizeFetchedFacilityProperties(vc))
        .sort((a, b) => a.distance - b.distance)
        // pulls out one of each Health, VetCenter, and Cemetery facilityType from the multidata that has been
        // joined together in order to process distances in one array.
        .reduce(
          (acc, vaf) => {
            if (vaf.source === 'Health' && acc[0] === null) {
              acc[0] = vaf;
            } else if (vaf.source === 'VetCenter' && acc[1] === null) {
              acc[1] = vaf;
            } else if (vaf.source === 'Cemetery' && acc[2] === null) {
              acc[2] = vaf;
            }
            return acc;
          },
          [null, null, null],
        )
        // Since it may be that one of the requests to the API returned data with an empty list (i.e. no Cemetery within 120 miles)
        // the above array of 3 elements may have a null since the array uses index for the type of facility and the order matters.
        .filter(v => v)
    );
  };

  const renderNearbyFacilitiesContainer = sortedVaLocations => {
    // Filter here so we can choose to use the sorted list if there are no Vet centers within the birds-eye radius
    const filteredByDistance = sortedVaLocations.filter(
      vc => vc.distance < NEARBY_VA_LOCATIONS_RADIUS_MILES,
    );

    // Distance is calculated using the driving distance not birds-eye distance so all results may be outside the radius
    const useSorted = filteredByDistance.length === 0;

    return (
      <>
        <h2 className="vads-u-line-height--1 vads-u-margin-bottom--3">
          Other nearby VA locations
        </h2>
        <div>
          {(useSorted ? sortedVaLocations : filteredByDistance).map(vf => (
            <VAFacility
              key={vf.id}
              vaFacility={vf}
              mainPhone={props.mainPhone}
            />
          ))}
        </div>
      </>
    );
  };

  // Possible returns with the components
  if (isStartedLoading(props.multiLoading)) {
    return <va-loading-indicator message="Loading facilities..." />;
  }
  const joined = joinMultiData(props);
  if (joined.length > 0) {
    // only render the section if there are some facilities within the birds-eye radius
    const normalizedFetchedFacilities = normalizeFetchedFacilities(joined);
    return renderNearbyFacilitiesContainer(normalizedFetchedFacilities);
  }
  return null;
};

NearbyLocations.propTypes = {
  mainAddress: PropTypes.object,
  mainFacilityApiId: PropTypes.string,
  mainPhone: PropTypes.string,
  multiLoading: PropTypes.objectOf(PropTypes.bool),
  multidata: PropTypes.objectOf(PropTypes.object),
  nearbyLocations: PropTypes.array,
  togglesLoading: PropTypes.bool,
};

const mapStateToProps = store => ({
  multiLoading: store.facility?.multiLoading,
  multidata: store.facility?.multidata,
  togglesLoading: store.featureToggles?.loading,
});

export default connect(mapStateToProps)(NearbyLocations);
