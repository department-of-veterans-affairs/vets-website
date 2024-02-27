import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from 'platform/utilities/api';
import { connect, useDispatch } from 'react-redux';
import VAFacilityInfoSection from './components/VAFacilityInfoSection';
import VetCenterImageSection from './components/VetCenterImageSection';
import {
  fetchMultiFacilityStarted,
  fetchMultiFacilitySuccess,
} from '../actions';
import {
  calculateBoundingBox,
  convertMetersToMiles,
  distancesToNearbyVetCenters,
} from '../../../facility-locator/utils/facilityDistance';
import { getFeaturesFromAddress } from '../../../facility-locator/utils/mapbox';

const NEARBY_VA_LOCATIONS_RADIUS_MILES = 120;

const NearByVALocations = props => {
  const [originalCoordinates, setOriginalCoordinates] = useState([]);
  const [fetchedVALocations, setFetchedVALocations] = useState([]);
  const [nearbyVADistances, setNearbyVADistances] = useState(false);
  const dispatch = useDispatch();

  const fetchNearbyVALocations = useCallback(
    async () => {
      const fetchVALocations = (query, facilityType) => {
        // We are using this action to track the loading state of the multi facility type request
        // Not for multiple facilities. Once all facilityTypes are not in loading state, we can assume
        // that all the facility types have been fetched
        dispatch(fetchMultiFacilityStarted(facilityType));
        apiRequest(query, {
          apiVersion: 'v1',
        }).then(res => {
          dispatch(fetchMultiFacilitySuccess({}, facilityType));
          // All types get put in the locations
          setFetchedVALocations(locations => [
            ...locations,
            ...(res.data || []).map(datum => ({
              ...datum,
              source: facilityType,
            })),
          ]);
        });
      };

      const { mainAddress } = props;
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
          NEARBY_VA_LOCATIONS_RADIUS_MILES,
        );
        const partialParams = [
          'page=1',
          'per_page=2',
          `radius=${NEARBY_VA_LOCATIONS_RADIUS_MILES}`,
          `latitude=${coordinates[1]}`,
          `longitude=${coordinates[0]}`,
          ...boundingBox.map(c => `bbox[]=${c}`),
        ];
        fetchVALocations(
          `/facilities/va/?${[
            'type=health',
            'mobile=false',
            ...partialParams,
          ].join('&')}`,
          'Health',
        );
        fetchVALocations(
          `/facilities/va/?${[
            'type=vet_center',
            'mobile=false',
            ...partialParams,
          ].join('&')}`,
          'VetCenter',
        );
        fetchVALocations(
          `/facilities/va/?${['type=cemetery', ...partialParams].join('&')}`,
          'Cemetery',
        );
      }
    },
    [props, dispatch],
  );

  useEffect(
    () => {
      if (
        !props.togglesLoading &&
        !props.multiLoading.Cemetery &&
        !props.multiLoading.Health &&
        !props.multiLoading.VetCenter &&
        !fetchedVALocations.length
      ) {
        fetchNearbyVALocations();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.togglesLoading, props.multiLoading, fetchedVALocations],
  );

  useEffect(
    () => {
      const noDistancesToMeasure =
        originalCoordinates.length === 0 ||
        fetchedVALocations.length === 0 ||
        props.multiLoading.Health ||
        props.multiLoading.VetCenter ||
        props.multiLoading.Cemetery;

      if (nearbyVADistances || noDistancesToMeasure) {
        return false;
      }
      const facilityCoordinates = fetchedVALocations
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
      originalCoordinates,
      fetchedVALocations,
      nearbyVADistances,
    ],
  );
  const normalizeFetchedFacilityProperties = useCallback(
    vc => {
      let centerDistance = false;

      if (nearbyVADistances.length === fetchedVALocations.length) {
        const facilityDistance = nearbyVADistances.find(
          distance => distance.id === vc.id,
        );
        centerDistance = facilityDistance.distance;
      }
      return {
        id: vc.id,
        entityBundle: vc.attributes.facilityType,
        fieldPhoneNumber: vc.attributes.phone.main,
        fieldPhoneMentalHealth: vc.attributes.phone.mentalHealthClinic,
        distance: centerDistance,
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
        website: vc.attributes.website,
        source: vc.source,
      };
    },
    [nearbyVADistances, fetchedVALocations],
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
          if (
            vaf.source === 'Health' &&
            (acc[0] === null ||
              (vaf.fieldPhoneMentalHealth && !acc[0].fieldPhoneMentalHealth))
          ) {
            acc[0] = vaf;
          } else if (vaf.source === 'Cemetery' && acc[1] === null) {
            acc[1] = vaf;
          } else if (vaf.source === 'VetCenter' && acc[2] === null) {
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
      <div>
        {(useSorted ? sortedVaLocations : filteredByDistance).map(vc => {
          return renderFacility(vc, props.mainPhone);
        })}
      </div>
    );
  };

  const filteredVaLocations = fetchedVALocations.filter(
    vc => vc.id !== props.mainFacilityApiId,
  );
  // Possible returns with the components
  if (
    props.multiLoading.Health ||
    props.multiLoading.VetCenter ||
    props.multiLoading.Cemetery
  ) {
    return <va-loading-indicator message="Loading facilities..." />;
  }

  if (filteredVaLocations.length > 0) {
    // only render the section if there are some facilities within the birds-eye radius
    const normalizedFetchedFacilities = normalizeFetchedFacilities(
      filteredVaLocations,
    );
    return renderNearbyFacilitiesContainer(normalizedFetchedFacilities);
  }
  return null;
};

NearByVALocations.propTypes = {
  mainAddress: PropTypes.object,
  mainFacilityApiId: PropTypes.string,
  mainPhone: PropTypes.string,
  multiLoading: PropTypes.objectOf(PropTypes.bool),
  nearbyLocations: PropTypes.array,
  togglesLoading: PropTypes.bool,
};

const mapStateToProps = store => ({
  multiLoading: store.facility?.multiLoading,
  togglesLoading: store.featureToggles?.loading,
});

export default connect(mapStateToProps)(NearByVALocations);
