import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import React, { useState } from 'react';
import { URL, envUrl } from '../constants';
import { convertToLatLng } from '../utils/mapbox';
import SearchControls from './search/SearchControls';
import SearchItem from './search/SearchItem';

// const facilities = {
//   data: [
//     {
//       id: 'vha_442GC',
//       type: 'facility',
//       attributes: {
//         classification: 'Other Outpatient Services (OOS)',
//         distance: 0.0,
//         facilityType: 'va_health_facility',
//         id: 'vha_442GC',
//         lat: 40.553874,
//         long: -105.087951,
//         mobile: false,
//         name: 'Fort Collins VA Clinic',
//         operationalHoursSpecialInstructions: null,
//         uniqueId: '442GC',
//         visn: '19',
//         website:
//           'https://www.va.gov/cheyenne-health-care/locations/fort-collins-va-clinic/',
//         tmpCovidOnlineScheduling: null,
//         address: {
//           physical: {
//             zip: '80526-8108',
//             city: 'Fort Collins',
//             state: 'CO',
//             address1: '2509 Research Boulevard',
//           },
//         },
//         feedback: {
//           health: {
//             primaryCareUrgent: 0.800000011920929,
//             primaryCareRoutine: 0.9399999976158142,
//           },
//           effectiveDate: '2024-02-08',
//         },
//         hours: {
//           monday: '700AM-500PM',
//           tuesday: '700AM-500PM',
//           wednesday: '700AM-500PM',
//           thursday: '700AM-500PM',
//           friday: '700AM-500PM',
//           saturday: 'Closed',
//           sunday: 'Closed',
//         },
//         operatingStatus: {
//           code: 'NORMAL',
//         },
//         phone: {
//           fax: '970-962-4901',
//           main: '970-224-1550',
//           pharmacy: '866-420-6337',
//           afterHours: '307-778-7550',
//           patientAdvocate: '307-778-7550 x7573',
//           mentalHealthClinic: '307-778-7349',
//           enrollmentCoordinator: '970-593-3311',
//         },
//         services: {
//           health: [
//             {
//               name: 'My HealtheVet coordinator',
//               serviceId: 'myHealtheVetCoordinator',
//               link:
//                 'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services/myHealtheVetCoordinator',
//             },
//             {
//               name: 'Nutrition, food, and dietary care',
//               serviceId: 'nutrition',
//               link:
//                 'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services/nutrition',
//             },
//             {
//               name: 'Pharmacy',
//               serviceId: 'pharmacy',
//               link:
//                 'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services/pharmacy',
//             },
//             {
//               name: 'Primary care',
//               serviceId: 'primaryCare',
//               link:
//                 'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services/primaryCare',
//             },
//             {
//               name: 'Social work',
//               serviceId: 'socialWork',
//               link:
//                 'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services/socialWork',
//             },
//           ],
//           link:
//             'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_442GC/services',
//           lastUpdated: '2024-07-24',
//         },
//       },
//     },
//   ],
//   meta: {
//     pagination: {
//       current_page: 1,
//       prev_page: null,
//       next_page: 2,
//       total_pages: 139,
//       total_entries: 1381,
//     },
//   },
//   links: {
//     self:
//       'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=40.553874&long=-105.087951&page=1&per_page=10&state=CO&type=health',
//     first:
//       'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=40.553874&long=-105.087951&per_page=10&state=CO&type=health',
//     prev: null,
//     next:
//       'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=40.553874&long=-105.087951&page=2&per_page=10&state=CO&type=health',
//     last:
//       'https://dev-api.va.gov/ask_va_api/v0/health_facilities?lat=40.553874&long=-105.087951&page=139&per_page=10&state=CO&type=health',
//   },
// };

const facilities = { data: [] };

const MedicalFacilitySearch = ({ onChange }) => {
  const [apiData, setApiData] = useState(facilities);
  const [isSearching, setIsSearching] = useState(false);
  const [pageURL, setPageURL] = useState('');

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const getApiData = url => {
    setIsSearching(true);
    return apiRequest(url, options)
      .then(res => {
        setApiData(res);
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  };

  const getFacilitiesFromLocation = async input => {
    const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?type=health&lat=${
      input[1]
    }&long=${input[0]}`;
    await getApiData(url);
    setPageURL(url);
  };

  const getFacilities = async input => {
    const latLong = await convertToLatLng(input);
    const url = `${envUrl}${URL.GET_HEALTH_FACILITY}?lat=${latLong[1]}&long=${
      latLong[0]
    }`;
    await getApiData(url);
    setPageURL(url);
  };

  return (
    <>
      <div className="facility-locator vads-u-margin-top--2">
        <SearchControls
          locateUser={getFacilitiesFromLocation}
          onSubmit={getFacilities}
        />
        {isSearching ? (
          <va-loading-indicator
            label="Loading"
            message="Loading..."
            set-focus
          />
        ) : (
          <SearchItem
            facilityData={apiData}
            pageURL={pageURL}
            getData={getApiData}
            onChange={onChange}
          />
        )}
      </div>
    </>
  );
};

export default MedicalFacilitySearch;
