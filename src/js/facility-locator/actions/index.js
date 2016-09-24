// import sampleOutput from 'json!../sampleData/sampleOutput.json';
import { mapboxClient } from '../components/MapboxClient';
import { find } from 'lodash';

export const FETCH_VA_FACILITY = 'FETCH_VA_FACILITY';
export const FETCH_VA_FACILITIES = 'FETCH_VA_FACILITIES';
export const SEARCH_QUERY_UPDATED = 'SEARCH_QUERY_UPDATED';
export const SEARCH_SUCCEEDED = 'SEARCH_SUCCEEDED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_STARTED = 'SEARCH_STARTED';

export function updateSearchQuery(query) {
  return {
    type: SEARCH_QUERY_UPDATED,
    payload: {
      ...query,
    }
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
      main: '360-759-1901 x',
      fax: '360-690-0864 x',
      afterHours: '360-696-4061 x',
      patientAdvocate: '503-273-5308 x',
      enrollmentCoordinator: '503-273-5069 x',
      pharmacy: '503-273-5183 x',
    },
    hours: {
      monday: '730AM-430PM',
      tuesday: '730AM-630PM',
      wednesday: '730AM-430PM',
      thursday: '730AM-430PM',
      friday: '730AM-430PM',
      saturday: '800AM-1000AM',
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

export function fetchVAFacility(id, facility = null) {
  if (facility) {
    return {
      type: FETCH_VA_FACILITY,
      payload: mockFacility,
    };
  }

  return {
    type: FETCH_VA_FACILITY,
    payload: {
      ...mockFacility,
      id,
    },
  };
}

export function fetchVAFacilities(bounds) {
  const mockResults = [...Array(10)].map((_, i) => {
    return {
      ...mockFacility,
      id: i + 1,
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
      const zipCode = find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }).text;

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
        dispatch(fetchVAFacilities({
          latitude: coordinates[1],
          longitude: coordinates[0],
        }));
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
