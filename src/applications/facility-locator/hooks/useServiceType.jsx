import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { connectDrupalStaticDataFileVaHealthServices } from 'platform/site-wide/drupal-static-data/source-files/va-health-services/connect';

// Note: this file is hard-coded with data from https://www.va.gov/data/cms/va-healthcare-services.json
// It should be updated periodically, especially when local changes are made that affect the matching logic so we can be
// sure our code handles what services actually exist in prod
import vaHealthcareServices from '../tests/hooks/test-va-healthcare-services.json';

/** VA health service example structure
 * [
    'Mental health care',     0. Name (string)
    'Behavioral health',      1. AKA (string)
    [                         2. Common conditions (string[])
      'addiction',
      'depression',
      'anxiety',
      'trauma',
      'PTSD',
      'bipolar disorder',
      'schizophrenia',
      'OCD'
    ],
    'mentalHealth',            3. API ID (string)
    'Mental health care',      4. Service type of care (string)
    true,                      5. Show for Vet Center (boolean)
    false,                     6. Show for VBA facilities (boolean)
    true,                      7. Show for VAMC facilities (boolean)
    false,                     8. Show for TRICARE (boolean)
    443,                       9. Service ID (number)
    'Regular description',     10. Description (string)
    'TRICARE description'      11. TRICARE description (string)
  ]
 */

export const FACILITY_TYPE_FILTERS = {
  VET_CENTER: 'vet_center',
  VBA: 'vba',
  VAMC: 'vamc',
  TRICARE: 'tricare',
};

const createArrayFromServiceData = data =>
  data
    .replace(/[()]/g, '')
    .toLowerCase()
    .split(' ');

const serviceMatchesTerm = (term, serviceData) =>
  serviceData.toLowerCase().startsWith(term.toLowerCase());

const lookForMatch = (term, arrayFromServiceData) =>
  arrayFromServiceData.find(service => serviceMatchesTerm(term, service));

/**
 * Receives a term and either a string or string array value to match against
 * e.g. a name such as "Mental health" or a list of common conditions such as
 * ["addiction", "depression", "anxiety"]
 *
 * Ultimately we want to check each word of any string or string array value
 * to see if it starts with the given search term
 * Returns 1 if a match is found, -1 if it is not
 * @param { string } term
 * @param { string | string[] } serviceData
 * @returns { number }
 */
const termMatcher = (term, serviceData) => {
  const isMultiWord = string => string.trim().includes(' ');

  if (!serviceData || !serviceData?.length) {
    return false;
  }

  if (isMultiWord(term)) {
    if (Array.isArray(serviceData)) {
      // console.log('term: ', term);
      // console.log('serviceData: ', serviceData);
      const match = serviceData.find(chunk => serviceMatchesTerm(term, chunk));

      return match?.length > 0;
    }

    console.log('here: ', term, serviceData);
    return serviceMatchesTerm(term, serviceData);
  }

  // Common conditions is an array of strings and requires more drilling down
  if (Array.isArray(serviceData)) {
    const arrayToMatch = [...serviceData];

    const foundMatches = arrayToMatch.find(chunk => {
      let toMatch = [chunk];

      // If the string in the array is multiple words, break it up
      if (isMultiWord(chunk)) {
        toMatch = createArrayFromServiceData(chunk);
      }

      return lookForMatch(term, toMatch);
    });

    return foundMatches?.length > 0;
  }

  const arrayToMatch = createArrayFromServiceData(serviceData);

  return lookForMatch(term, arrayToMatch)?.length > 0;
};

/** Given a term and a VA health service, determine if the term is found in the service data
 * Priority matches are on name and AKA
 * Secondary matches are on common conditions, description and TRICARE description
 * We check each whole word of any of the above five fields to see it starts with the term
 *
 * Example: term = "can"
 * If the description contains the word "cancer," it matches
 * If a common condition is "lung cancer," it matches
 * If the AKA has the word "scan," it's not a match
 * @param { string } term
 * @param { VA health service } service
 * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }}
 */
const determineIfServiceMatches = (term, service) => {
  // Remove special characters from the search term
  const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const serviceToMatch = [...service];

  const matchDeterminant = {
    nameMatch: termMatcher(safeTerm, service[0]),
    akaMatch: termMatcher(safeTerm, service[1]),
    commonCondMatch: termMatcher(safeTerm, service[2]),
    descriptionMatch: termMatcher(term, service[10]),
    tricareDescriptionMatch: termMatcher(term, service[11]),
  };

  if (matchDeterminant.nameMatch || matchDeterminant.akaMatch) {
    serviceToMatch.primaryMatch = true;
  } else if (
    matchDeterminant.commonCondMatch ||
    matchDeterminant.descriptionMatch ||
    matchDeterminant.tricareDescriptionMatch
  ) {
    serviceToMatch.secondaryMatch = true;
  }

  return serviceToMatch;
};

/**
 * Alphabetizes a given array of VA health services
 * by the name of the service (first index)
 * @param { VA health service[] } services
 * @returns { VA health service[] }
 */
const alphabetizeServices = services => {
  return services.sort((a, b) => {
    if (a[0].toLowerCase() < b[0].toLowerCase()) {
      return -1;
    }

    if (a[0].toLowerCase() > b[0].toLowerCase()) {
      return 1;
    }

    return 0;
  });
};

/**
 * Given an array of VA health services with primaryMatch or secondaryMatch keys,
 * return an array with alpha-sorted primary matches first
 * and alpha-sorted secondary matches second
 * @param { VA health service[] } matches
 * @returns { VA health service[] } sortedMatches
 */
const sortMatches = matches => {
  const primaryMatches = matches.filter(match => match.primaryMatch);
  const secondaryMatches = matches.filter(match => match.secondaryMatch);
  const sortedMatches = [];

  if (primaryMatches?.length) {
    sortedMatches.push(...alphabetizeServices(primaryMatches));
  }

  if (secondaryMatches?.length) {
    sortedMatches.push(...alphabetizeServices(secondaryMatches));
  }

  return sortedMatches;
};

/**
 * Returns all available services for a given facility type using
 * the booleans that indicate which service they belong to
 * @param { VA health service[] } allServices
 * @param { string } facilityType
 * @returns { VA health service[] }
 */
export const filterServicesByFacilityType = (allServices, facilityType) => {
  return allServices.filter(
    service =>
      (service[5] && facilityType === FACILITY_TYPE_FILTERS.VET_CENTER) ||
      (service[6] && facilityType === FACILITY_TYPE_FILTERS.VBA) ||
      (service[7] && facilityType === FACILITY_TYPE_FILTERS.VAMC) ||
      (service[8] && facilityType === FACILITY_TYPE_FILTERS.TRICARE),
  );
};

/**
 * Look through all services for a given facility,
 * check for "starts with" matches
 * sort alphabetically by priority and return
 * @param { VA health service[] } allServicesByFacilityType
 * @param { string } term
 * @returns { VA health service[] or [] }
 */
export const filterMatches = (allServicesByFacilityType, term) => {
  const matchedServices = [];

  allServicesByFacilityType.forEach(service => {
    const checkedService = determineIfServiceMatches(term, service);

    if (checkedService.primaryMatch || checkedService.secondaryMatch) {
      matchedServices.push(checkedService);
    }
  });

  if (!matchedServices) {
    return [];
  }

  if (matchedServices?.length === 1) {
    return matchedServices;
  }

  return sortMatches(matchedServices);
};

export default function useServiceType() {
  const dispatch = useDispatch();
  const ALL_SERVICES_VAMC = ['All VA health services'];
  const localEnv = environment?.BUILDTYPE === 'localhost';

  let selector = useSelector(
    state => state.drupalStaticData.vaHealthServicesData || [],
  );

  // Facility Locator can't run on localhost:3002,
  // which is where the VA health services data is served
  // Locally, we can use a static JSON file copied from the prod data
  if (localEnv) {
    selector = vaHealthcareServices;
  }

  useEffect(
    () => {
      connectDrupalStaticDataFileVaHealthServices(dispatch);
    },
    [dispatch],
  );

  /**
   * When the autosuggest component is first loaded,
   * return all services for that facility type alphabetized
   * @param { VA health service[] } filteredServices
   * @param { string } facilityType
   * @returns { VA health service[]} sortedServices
   */
  const populateInitialServiceList = (
    allServicesByFacilityType,
    facilityType,
  ) => {
    const sortedServices = alphabetizeServices(allServicesByFacilityType);

    // If the facility type is VAMC, add the "All VA health services" option
    if (facilityType === FACILITY_TYPE_FILTERS.VAMC && sortedServices?.length) {
      return [ALL_SERVICES_VAMC, ...sortedServices];
    }

    return sortedServices;
  };

  /**
   * Entry point for getting services for the autosuggest dropdown
   * after the data fetch
   * @param { string } term
   * @param { string } facilityType
   * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }[]}
   */
  const serviceTypeFilter = useCallback(
    (term, facilityType) => {
      // If the typed term is the hardcoded VAMC "All VA health services" option,
      // simply return that option
      if (term === ALL_SERVICES_VAMC[0]) {
        return [ALL_SERVICES_VAMC];
      }

      if (selector.data) {
        const allServicesByFacilityType = filterServicesByFacilityType(
          selector.data,
          facilityType,
        );

        if (!allServicesByFacilityType?.length) {
          return [];
        }

        if (!term?.length) {
          return populateInitialServiceList(
            allServicesByFacilityType,
            facilityType,
          );
        }

        // If the user has typed the minimum number of characters,
        // use the term to filter the matches
        const matches = filterMatches(allServicesByFacilityType, term);

        if (facilityType === FACILITY_TYPE_FILTERS.VAMC && matches?.length) {
          return [ALL_SERVICES_VAMC, ...matches];
        }

        return matches;
      }

      return [];
    },
    [selector],
  );

  return {
    selector,
    serviceTypeFilter,
  };
}
