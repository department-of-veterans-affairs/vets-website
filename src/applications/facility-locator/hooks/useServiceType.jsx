import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { connectDrupalStaticDataFileVaHealthServices } from 'platform/site-wide/drupal-static-data/source-files/va-health-services/connect';

// Note: this file is hard-coded with data from https://www.va.gov/data/cms/va-healthcare-services.json
// It should be updated periodically, especially when local changes are made that affect the matching logic so we can be
// sure our code handles what services actually exist in prod
import vaHealthServicesData from '../tests/hooks/test-va-healthcare-services.json';

export const FACILITY_TYPE_FILTERS = {
  VET_CENTER: 'vet_center',
  VBA: 'vba',
  VAMC: 'vamc',
  TRICARE: 'tricare',
};

/**
 * function termMatcher
 * @param { string } term
 * @param {[string, string, string[], string, string, boolean, boolean, boolean, boolean, number, string, string]} hsdatum
 * @param { number } index
 * @param { boolean? } includes
 * @returns { number }
 */
const termMatcher = (term, hsdatum, index, includes = false) => {
  if (includes) {
    return hsdatum[index]?.toLowerCase().includes(term?.toLowerCase()) ? 1 : -1;
  }

  const returnMatch = hsdatum[index]?.toLowerCase().search(term);

  if (returnMatch === undefined) {
    return -1;
  }

  return returnMatch;
};

/** function matchHelper
 * @param { string } term
 * @param {[string, string, string[], string, string, boolean, boolean, boolean, boolean, number, string, string]} hsdatum
 * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }}
 */
const matchHelper = (term, hsdatum) => {
  const safeRegexTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexTerm = new RegExp(safeRegexTerm, 'i');

  const returnMatcher = {
    nameMatch: termMatcher(regexTerm, hsdatum, 0),
    akaMatch: termMatcher(regexTerm, hsdatum, 1),
    commonCondMatch: hsdatum[2].findIndex(commonCond =>
      commonCond.toLowerCase().includes(term.toLowerCase()),
    ),
    descriptionMatch: termMatcher(term, hsdatum, 10, true),
    tricareDescriptionMatch: termMatcher(term, hsdatum, 11, true),
    hsdatum,
  };

  if (
    returnMatcher.nameMatch >= 0 ||
    returnMatcher.akaMatch >= 0 ||
    returnMatcher.commonCondMatch >= 0
  ) {
    returnMatcher.priorityMatch = 1;
    returnMatcher.secondaryMatch = 0;
  } else if (
    returnMatcher.descriptionMatch >= 0 ||
    returnMatcher.tricareDescriptionMatch >= 0
  ) {
    returnMatcher.secondaryMatch = 1;
    returnMatcher.priorityMatch = 0;
  }

  return returnMatcher;
};

const prioritySort = (a, b) => {
  if (a.priorityMatch > b.priorityMatch) return -1;
  if (a.priorityMatch < b.priorityMatch) return 1;
  if (a.secondaryMatch > b.secondaryMatch) return -1;
  if (a.secondaryMatch < b.secondaryMatch) return 1;
  return 0;
};

export const filterDataByFacilityType = (selectorFiltered, facilityType) => {
  return selectorFiltered.filter(
    hsdatum =>
      (hsdatum[5] && facilityType === FACILITY_TYPE_FILTERS.VET_CENTER) ||
      (hsdatum[6] && facilityType === FACILITY_TYPE_FILTERS.VBA) ||
      (hsdatum[7] && facilityType === FACILITY_TYPE_FILTERS.VAMC) ||
      (hsdatum[8] && facilityType === FACILITY_TYPE_FILTERS.TRICARE),
  );
};

// Exported for unit testing
export const filterMatches = (selector, term, facilityType) => {
  const selectorFiltered = selector.data
    .map(hsdatum => {
      const matched = matchHelper(term, hsdatum);

      if (matched.priorityMatch || matched.secondaryMatch) {
        return matched;
      }

      return null;
    })
    .filter(v => v)
    .sort(prioritySort)
    .map(data => data.hsdatum);

  if (facilityType) {
    return filterDataByFacilityType(selectorFiltered, facilityType);
  }

  return selectorFiltered;
};

export const alphabetizeServices = services => {
  return services.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }

    if (a[0] > b[0]) {
      return 1;
    }

    return 0;
  });
};

export default function useServiceType() {
  const dispatch = useDispatch();
  const allServicesOptionForVamc = ['All VA health services'];
  const localEnv = environment?.BUILDTYPE === 'localhost';
  let selector = useSelector(
    state => state.drupalStaticData.vaHealthServicesData || [],
  );

  if (localEnv) {
    selector = vaHealthServicesData;
  }

  useEffect(
    () => {
      connectDrupalStaticDataFileVaHealthServices(dispatch);
    },
    [dispatch],
  );

  /**
   * function serviceTypeFilter
   * @param { string } term
   * @param { string? } facilityType
   * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }[]}
   */
  const serviceTypeFilter = useCallback(
    (term, facilityType = '') => {
      if (!selector || selector.loading) return [];

      // initial load of services
      if (!term?.length && facilityType && selector.data) {
        const filteredServices = filterDataByFacilityType(
          selector.data,
          facilityType,
        );

        const sortedServices = alphabetizeServices(filteredServices);

        if (
          facilityType === FACILITY_TYPE_FILTERS.VAMC &&
          sortedServices?.length
        ) {
          return [allServicesOptionForVamc, ...sortedServices];
        }

        return sortedServices;
      }

      if (selector.data) {
        const matches = filterMatches(selector, term, facilityType);

        if (facilityType === FACILITY_TYPE_FILTERS.VAMC && matches?.length) {
          return [allServicesOptionForVamc, ...matches];
        }

        return matches;
      }

      return [];
    },
    [selector],
  );

  return {
    isServiceTypeFilterLoading: selector.isLoading,
    serviceTypeFilter,
  };
}
