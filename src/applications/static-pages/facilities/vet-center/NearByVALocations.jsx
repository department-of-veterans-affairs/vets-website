import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import VAFacilityInfoSection from './components/VAFacilityInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import { multiTypeQuery } from '../actions';
import {
  convertMetersToMiles,
  distancesToNearbyVetCenters,
} from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/utils/mapbox';
import createStructuredVALocation from './createStructuredVALocation';
import { generatePartialParams } from './generatePartialParams';
import { getCenterDistance } from './distances';

const NEARBY_VA_LOCATIONS_RADIUS_MILES = 150;

const strParams = (facilityType, mobileFalse, partialParams) => {
  const params = [`type=${facilityType}`, ...partialParams];
  if (mobileFalse) {
    params.push('mobile=false');
  }
  return `/facilities/va/?${params.join('&')}`;
};
const getCoordinates = async mainAddress => {
  const query = `${mainAddress.addressLine1}, ${mainAddress.locality} ${
    mainAddress.administrativeArea
  } ${mainAddress.postalCode}`;
  const mapboxResponse = await getFeaturesFromAddress(query);
  return mapboxResponse?.body.features[0].center; // [longitude,latitude]
};
const processCenters = facilities => {
  return facilities.map(facility => {
    return {
      id: facility.id,
      coordinates: [facility.attributes.long, facility.attributes.lat],
    };
  });
};
processCenters.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
const hasStartedLoading = (togglesLoading, multidata, multiLoading) => {
  return (
    !togglesLoading &&
    !multiLoading.Cemetery &&
    !multiLoading.Health &&
    !multiLoading.VetCenter &&
    !multidata.VetCenter?.data.length &&
    !multidata.Health?.data.length &&
    !multidata.Cemetery?.data.length
  );
};

const isStateLoading = (multidata, multiLoading) => {
  return (
    multiLoading.Health ||
    multiLoading.VetCenter ||
    multiLoading.Cemetery ||
    !multidata.Health?.data ||
    !multidata.VetCenter?.data ||
    !multidata.Cemetery?.data
  );
};
const isFinishedLoading = (multiLoading, multidata) => {
  return (
    !multiLoading.Health &&
    !multiLoading.VetCenter &&
    !multiLoading.Cemetery &&
    !!multidata.Health?.data &&
    !!multidata.VetCenter?.data &&
    !!multidata.Cemetery?.data
  );
};
const fetchMulti = async (dispatch, mainAddress, coordinates) => {
  if (coordinates) {
    const partialParams = generatePartialParams(
      coordinates,
      NEARBY_VA_LOCATIONS_RADIUS_MILES,
    );
    dispatch(
      multiTypeQuery('Health', strParams('health', true, partialParams)),
    );
    dispatch(
      multiTypeQuery('VetCenter', strParams('vet_center', true, partialParams)),
    );
    dispatch(
      multiTypeQuery('Cemetery', strParams('cemetery', false, partialParams)),
    );
  }
};
const joinData = (health, vetCenter, cemetery) => {
  return [
    ...(health?.data || []),
    ...(vetCenter?.data || []),
    ...(cemetery?.data || []),
  ];
};
const NearbyLocations = props => {
  const [nearbyVADistances, setNearbyVADistances] = useState([]);
  const [originalCoordinates, setOriginalCoordinates] = useState(null);
  const dispatch = useDispatch();

  const fetchNearbyVALocations = useCallback(
    async () => {
      if (!props.mainAddress) {
        return;
      }
      const coordinates = await getCoordinates(props.mainAddress);
      setOriginalCoordinates(coordinates);
      fetchMulti(dispatch, props.mainAddress, coordinates);
    },
    [props, dispatch],
  );

  useEffect(
    () => {
      if (
        hasStartedLoading(
          props.togglesLoading,
          props.multidata,
          props.multiLoading,
        )
      ) {
        fetchNearbyVALocations();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.togglesLoading, props.multiLoading, props.multidata],
  );

  useEffect(
    () => {
      if (
        nearbyVADistances.length ||
        isStateLoading(props.multidata, props.multiLoading)
      ) {
        return false;
      }
      const { Cemetery, VetCenter, Health } = props.multidata;
      const facilityCoordinates = processCenters([
        ...Cemetery.data,
        ...VetCenter.data,
        ...Health.data,
      ]);

      const fetchDrivingData = async () => {
        if (!isFinishedLoading(props.multiLoading, props.multidata)) {
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
      originalCoordinates,
      nearbyVADistances,
      props.multidata,
    ],
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
  const normalizeFetchedFacilityProperties = useCallback(
    vc => {
      let centerDistance = false;
      if (isFinishedLoading(props.multiLoading, props.multidata)) {
        centerDistance = getCenterDistance(nearbyVADistances, vc);
      }
      return createStructuredVALocation(vc, centerDistance);
    },
    [nearbyVADistances, props.multiLoading, props.multidata],
  );
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
  if (
    props.multiLoading.Health ||
    props.multiLoading.VetCenter ||
    props.multiLoading.Cemetery
  ) {
    return <va-loading-indicator message="Loading facilities..." />;
  }
  const joinedFacilities = joinData(
    props.multidata.Health,
    props.multidata.VetCenter,
    props.multidata.Cemetery,
  );
  if (joinedFacilities.length > 0) {
    // only render the section if there are some facilities within the birds-eye radius
    const normalizedFetchedFacilities = normalizeFetchedFacilities(
      joinedFacilities,
    );
    return renderNearbyFacilitiesContainer(normalizedFetchedFacilities);
  }
  return null;
};

NearbyLocations.propTypes = {
  mainAddress: PropTypes.object,
  mainFacilityApiId: PropTypes.string,
  mainPhone: PropTypes.string,
  multiLoading: PropTypes.objectOf(PropTypes.bool),
  multidata: PropTypes.object,
  nearbyLocations: PropTypes.array,
  togglesLoading: PropTypes.bool,
};

const mapStateToProps = store => ({
  multiLoading: store.facility?.multiLoading,
  multidata: store.facility?.multidata, // why no camel case??
  togglesLoading: store.featureToggles?.loading,
});

export default connect(mapStateToProps)(NearbyLocations);
