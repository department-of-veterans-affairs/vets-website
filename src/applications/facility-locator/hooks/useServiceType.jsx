import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { connectDrupalStaticDataFileVaHealthServices } from 'platform/site-wide/drupal-static-data/source-files/va-health-services/connect';

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
    return hsdatum[index]?.toLowerCase().includes(term) ? 1 : -1;
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
 * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, apiIdMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }}
 */
const matchHelper = (term, hsdatum) => {
  const regexTerm = new RegExp(term, 'i');
  const returnMatcher = {
    nameMatch: termMatcher(regexTerm, hsdatum, 0),
    akaMatch: termMatcher(regexTerm, hsdatum, 1),
    commonCondMatch: hsdatum[2].findIndex(commonCond =>
      commonCond.toLowerCase().startsWith(term.toLowerCase()),
    ),
    apiIdMatch: termMatcher(regexTerm, hsdatum, 3),
    descriptionMatch: termMatcher(term, hsdatum, 10, true),
    tricareDescriptionMatch: termMatcher(true, hsdatum, 11, true),
    hsdatum,
  };

  if (
    returnMatcher.nameMatch >= 0 ||
    returnMatcher.akaMatch >= 0 ||
    returnMatcher.commonCondMatch >= 0 ||
    returnMatcher.apiIdMatch >= 0
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

export default function useServiceType() {
  const dispatch = useDispatch();

  const selector = useSelector(
    state => state.drupalStaticData.vaHealthServicesData || [],
  );

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
   * @returns {{nameMatch: number, akaMatch: number, commonCondMatch: number, apiIdMatch: number, descriptionMatch: number, tricareDescriptionMatch: number, hsdatum:[string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string] }[]}
   */
  const serviceTypeFilter = useCallback(
    (term, facilityType = '') => {
      if (!selector || selector.loading) return [];
      if (term?.length < 3) return [];
      if (selector.data) {
        const selectorFiltered = selector.data
          .map(hsdatum => {
            const matched = matchHelper(term, hsdatum);
            if (matched.priorityMatch || matched.secondaryMatch) {
              return matched;
            }
            return null;
          })
          .filter(v => v);

        selectorFiltered.sort(prioritySort);
        if (facilityType) {
          return selectorFiltered.filter(
            hsdatum =>
              (hsdatum.hsdatum[5] && facilityType === 'vet_center') ||
              (hsdatum.hsdatum[6] && facilityType === 'vba') ||
              (hsdatum.hsdatum[8] && facilityType === 'vamc') ||
              (hsdatum.hsdatum[9] && facilityType === 'tricare'),
          );
        }
        return selectorFiltered;
      }
      return [];
    },
    [selector],
  );
  return { isServiceTypeFilterLoading: selector.isLoading, serviceTypeFilter };
}
