import sampleData from 'json!../sampleData/sampleData.json';
import { mapboxClient } from '../components/MapboxClient';
import { find, filter } from 'lodash';

export const FETCH_VA_FACILITY = 'FETCH_VA_FACILITY';
export const FETCH_VA_FACILITIES = 'FETCH_VA_FACILITIES';
export const SEARCH_QUERY_UPDATED = 'SEARCH_QUERY_UPDATED';
export const SEARCH_SUCCEEDED = 'SEARCH_SUCCEEDED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const LOCATION_UPDATED = 'LOCATION_UPDATED';

export function updateSearchQuery(query) {
  return {
    type: SEARCH_QUERY_UPDATED,
    payload: {
      ...query,
    }
  };
}

export function updateLocation(propertyPath, value) {
  return {
    type: LOCATION_UPDATED,
    propertyPath,
    value
  };
}

const mockFacility = {
  id: 539,
  type: 'va_health_facility',
  attributes: {
    visnId: 20,
    name: 'Portland VA Medical Center-Vancouver',
    classification: 'VA Medical Center (VAMC)',
    address: {
      building: null,
      street: '1601 East 4th Plain Boulevard',
      suite: null,
      city: 'Vancouver',
      state: 'WA',
      zip: '98661',
      zip4: '3753'
    },
    phone: {
      main: '360-759-1901',
      fax: '360-690-0864',
      afterHours: '360-696-4061',
      patientAdvocate: '503-273-5308',
      enrollmentCoordinator: '503-273-5069',
      pharmacy: '503-273-5183',
    },
    hours: {
      monday: '7:30am-4:30pm',
      tuesday: '7:30am-6:30pm',
      wednesday: '7:30am-4:30pm',
      thursday: '7:30am-4:30pm',
      friday: '7:30am-4:30pm',
      saturday: '8:00am-10:00am',
      sunday: '-',
    },
    services: [
      ['Audiology', []],
      ['DentalServices', []],
      ['DiagnosticServices', ['ImagingAndRadiology']],
      ['EyeCare', []],
      ['MentalHealthCare', ['OutpatientMHCare', 'OutpatientSpecMHCare',
        'VocationalAssistance'
      ]],
      ['OutpatientSurgicalSpecialty', ['Podiatry']],
      ['PrimaryCare', []],
      ['Rehabilitation', []],
      ['WellnessAndPreventativeCare', []]
    ],
    lat: 45.63941626,
    'long': -122.65528736,
  }
};

/* eslint-disable camelcase */
const facilityTypes = {
  va_health_facility: 'VA Medical Center',
  va_benefits_facility: 'VA Benefits Office',
  va_cemetery: 'VA Cemetery',
};
/* eslint-enable camelcase */

export function fetchVAFacility(id, facility = null) {
  if (facility) {
    return {
      type: FETCH_VA_FACILITY,
      payload: facility,
    };
  }

  const specificSampleFacility = find(sampleData, d => {
    return d.id === parseInt(id, 10);
  });

  return {
    type: FETCH_VA_FACILITY,
    payload: {
      ...specificSampleFacility,
      attributes: {
        ...mockFacility.attributes,
        address: {
          ...specificSampleFacility.attributes.address,
          city: 'Denver',
          state: 'CO',
          zip: 80123,
        },
        name: ((specificSampleFacility.type === undefined || specificSampleFacility.type === 'all') ? specificSampleFacility.attributes.name.slice(3) : `${facilityTypes[specificSampleFacility.type]}-${specificSampleFacility.attributes.name.split('-')[1]}`),
      },
      id,
    },
  };
}

export function fetchVAFacilities(bounds, type) {
  let resultData;

  if (type === undefined || type === 'all') {
    resultData = sampleData.slice(0, 10);
  } else {
    resultData = filter(sampleData, f => {
      return f.type === type;
    }).slice(0, 10);
  }

  const mockResults = resultData.map((o) => {
    const specificSampleFacility = find(sampleData, d => {
      return d.id === o.id;
    });

    return {
      ...mockFacility,
      attributes: {
        ...mockFacility.attributes,
        address: {
          ...specificSampleFacility.attributes.address,
          city: 'Denver',
          state: 'CO',
          zip: 80123,
        },
        name: ((type === undefined || type === 'all') ? specificSampleFacility.attributes.name.slice(3) : `${facilityTypes[specificSampleFacility.type]}-${specificSampleFacility.attributes.name.split('-')[1]}`),
      },
      type: ((type === undefined || type === 'all') ? specificSampleFacility.type : type),
      id: o.id,
      lat: bounds.latitude + (Math.random() / 25 * (Math.floor(Math.random() * 2) === 1 ? 1 : -1)),
      'long': bounds.longitude + (Math.random() / 25 * (Math.floor(Math.random() * 2) === 1 ? 1 : -1)),
    };
  });

  return {
    type: FETCH_VA_FACILITIES,
    payload: mockResults,
  };
}

export function searchWithAddress(query) {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    mapboxClient.geocodeForward(query.searchString, (err, res) => {
      const coordinates = res.features[0].center;
      const zipCode = (find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }) || {}).text || res.features[0].place_name;

      if (!err) {
        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            context: zipCode,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
          }
        });

        // TODO (bshyong): replace this with a call to the API
        dispatch(
          fetchVAFacilities({
            latitude: coordinates[1],
            longitude: coordinates[0],
          }, query.facilityType)
        );
      } else {
        dispatch({
          type: SEARCH_FAILED,
          err,
        });
      }
    });
  };
}

export function searchWithCoordinates(bounds) {
  // TODO (bshyong): replace this with a call to the API
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    dispatch(fetchVAFacilities({
      latitude: bounds.latitude,
      longitude: bounds.longitude,
    }));
  };
}
