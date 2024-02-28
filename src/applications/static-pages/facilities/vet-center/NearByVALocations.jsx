import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import VAFacilityInfoSection from './components/VAFacilityInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import { multiTypeQuery } from '../actions';
import {
  calculateBoundingBox,
  convertMetersToMiles,
  distancesToNearbyVetCenters,
} from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/utils/mapbox';
import buildFacility from './buildFacility';

const NEARBY_VA_LOCATIONS_RADIUS_MILES = 120;
const isStartedLoading = multiLoading => {
  return multiLoading.Health || multiLoading.VetCenter || multiLoading.Cemetery;
};
const isFinishedLoading = (multiLoading, multidata) => {
  return (
    !multiLoading.Health &&
    !multiLoading.VetCenter &&
    !multiLoading.Cemetery &&
    multidata?.Health?.data &&
    multidata?.VetCenter?.data &&
    multidata?.Cemetery?.data
  );
};

const joinData = multidata => {
  return [
    ...(multidata?.Health?.data || []),
    ...(multidata?.VetCenter?.data || []),
    ...(multidata?.Cemetery?.data || []),
  ];
};

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
const NearByVALocations = props => {
  const [originalCoordinates, setOriginalCoordinates] = useState([]);
  const [nearbyVADistances, setNearbyVADistances] = useState(false);
  const dispatch = useDispatch();

  const fetchNearbyVALocations = useCallback(
    async () => {
      if (
        props.multidata.Cemetery ||
        props.multidata.Health ||
        props.multidata.VetCenter
      ) {
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

      if (coordinates) {
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
      }
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
        originalCoordinates.length === 0 ||
        !isFinishedLoading(props.multiLoading, props.multidata);
      if (nearbyVADistances || noDistancesToMeasure) {
        return false;
      }
      const facilityCoordinates = joinData(props.multidata)
        .filter(center => center.id !== props.mainFacilityApiId)
        .map(center => {
          return {
            id: center.id,
            coordinates: [center.attributes.long, center.attributes.lat],
          };
        });

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

        const facilityCoordinatesWithDistances = [...facilityCoordinates].map(
          (center, index) => {
            return {
              ...center,
              distance: nearbyDistances[index],
            };
          },
        );

        setNearbyVADistances(facilityCoordinatesWithDistances);
      };

      fetchDrivingData();
      return false;
    },
    [
      props.mainFacilityApiId,
      props.multiLoading,
      props.multidata,
      originalCoordinates,
      nearbyVADistances,
    ],
  );
  const normalizeFetchedFacilityProperties = useCallback(
    vc => {
      let centerDistance = false;

      if (
        isFinishedLoading(props.multiLoading, props.multidata) &&
        nearbyVADistances.length
      ) {
        const facilityDistance = nearbyVADistances.find(
          distance => distance.id === vc.id,
        );
        centerDistance = facilityDistance.distance;
      }
      return buildFacility(vc, centerDistance);
    },
    [nearbyVADistances, props.multidata, props.multiLoading],
  );

  // TODO: consider moving to a separate component
  const renderFacility = (vaFacility, mainVetCenterPhone) => {
    return (
      <div
        className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row facility
      vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5"
        key={vaFacility.id || vaFacility.fieldFacilityLocatorApiId}
      >
        <section className="region-grid vads-u-margin-right--2">
          <VAFacilityInfoSection
            vaFacility={vaFacility}
            mainPhone={mainVetCenterPhone}
          />
        </section>

        {vaFacility.fieldMedia && (
          <section
            className="region-grid usa-width-one-half vads-u-order--first small-screen:vads-u-order--initial
        vads-u-margin-bottom--2"
          >
            <VetCenterImageSection vetCenter={vaFacility} />
          </section>
        )}
      </div>
    );
  };

  const normalizeFetchedFacilities = vcs => {
    return vcs
      .map(vc => normalizeFetchedFacilityProperties(vc))
      .sort((a, b) => a.distance - b.distance)
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
      .filter(v => v);
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
          {(useSorted ? sortedVaLocations : filteredByDistance).map(vc => {
            return renderFacility(vc, props.mainPhone);
          })}
        </div>
      </>
    );
  };

  // Possible returns with the components
  if (isStartedLoading(props.multiLoading)) {
    return <va-loading-indicator message="Loading facilities..." />;
  }
  const joined = joinData(props.multidata);
  if (joined.length > 0) {
    // only render the section if there are some facilities within the birds-eye radius
    const normalizedFetchedFacilities = normalizeFetchedFacilities(joined);
    return renderNearbyFacilitiesContainer(normalizedFetchedFacilities);
  }
  return null;
};

NearByVALocations.propTypes = {
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

export default connect(mapStateToProps)(NearByVALocations);
