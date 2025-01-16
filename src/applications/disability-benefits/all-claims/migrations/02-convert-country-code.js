import { countries } from 'platform/forms/address/index.js';
import _ from 'platform/utilities/data';

/**
 * Changes the form 781 and 781a addresses to use the full country name instead of the
 *  3-letter country code.
 */
export default function convertCountryCode(savedData) {
  const addressPaths = [
    {
      path: 'incident0.incidentLocation.country',
      returnUrl: 'disabilities/ptsd-incident-location-0',
    },
    {
      path: 'incident1.incidentLocation.country',
      returnUrl: 'disabilities/ptsd-incident-location-1',
    },
    {
      path: 'incident2.incidentLocation.country',
      returnUrl: 'disabilities/ptsd-incident-location-2',
    },
    {
      path: 'secondaryIncident0.incidentLocation.country',
      returnUrl: 'disabilities/ptsd-secondary-incident-location-0',
    },
    {
      path: 'secondaryIncident1.incidentLocation.country',
      returnUrl: 'disabilities/ptsd-secondary-incident-location-1',
    },
    {
      path: 'secondaryIncident2incidentLocation.country',
      returnUrl: 'disabilities/ptsd-secondary-incident-location-2',
    },
  ];

  // If they've got a 3-letter country code, try to match it to the list of form data countries
  let earliestReturnUrl = '';
  let { formData: newData } = savedData;
  addressPaths.forEach(({ path, returnUrl }) => {
    const countryCode = _.get(path, newData);
    if (!countryCode) return;

    const match = countries.find(c => c.value === countryCode);
    if (match) {
      // Reset the code to the full name (except for USA, which is valid in the list of full country names)
      if (match.value !== 'USA') {
        newData = _.set(path, match.label, newData);
      }
    } else if (!earliestReturnUrl) {
      // If we can't match, default to USA and set the returnUrl to the earliest page
      newData = _.set(path, 'USA', newData);
      earliestReturnUrl = returnUrl;
    }
  });

  return {
    formData: newData,
    metadata: _.set(
      'returnUrl',
      earliestReturnUrl || savedData.metadata.returnUrl,
      savedData.metadata,
    ),
  };
}
