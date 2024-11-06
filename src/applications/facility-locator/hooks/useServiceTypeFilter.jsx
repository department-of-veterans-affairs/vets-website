import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line @department-of-veterans-affairs/use-resolved-path
import { useCallback, useEffect } from 'react';
import { connectDrupalStaticDataFileVaHealthServices } from 'platform/site-wide/drupal-static-data/source-files/va-health-services/connect';

/*
 * @returns { { isServiceTypeFilterLoading: Boolean, serviceTypeFilter: (term: string, facilityType: string) => [string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string][] } }
 */
export default function useServiceTypeFilter() {
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
   * @param { string } term
   * @param { string? } facilityType
   * @returns { [string, string, string|null, string, string, boolean, boolean, boolean, boolean, number, string, string][] }
   */
  const serviceTypeFilter = useCallback(
    (term, facilityType = '') => {
      if (!selector || selector.loading) return [];
      if (term?.length < 3) return [];
      if (selector.data) {
        const selectorFiltered = selector.data
          .map(hsdatum => {
            const regexTermMatcher = new RegExp(term, 'i');
            const nameMatch =
              hsdatum[0]?.toLowerCase().search(regexTermMatcher) || -1;
            const akaMatch =
              hsdatum[1]?.toLowerCase().search(regexTermMatcher) || -1;
            const commonCondMatch = hsdatum[2].findIndex(commonCond =>
              commonCond.toLowerCase().startsWith(term.toLowerCase()),
            );
            const apiIdMatch =
              hsdatum[3]?.toLowerCase().search(regexTermMatcher) || -1;
            const descriptionMatch =
              !!hsdatum[10]?.toLowerCase().includes(term.toLowerCase()) ||
              false;
            const tricareDescriptionMatch =
              !!hsdatum[11]?.toLowerCase().includes(term.toLowerCase()) ||
              false;

            if (
              nameMatch >= 0 ||
              akaMatch >= 0 ||
              commonCondMatch >= 0 ||
              apiIdMatch >= 0 ||
              descriptionMatch ||
              tricareDescriptionMatch
            ) {
              return {
                hsdatum,
                nameMatch,
                akaMatch,
                commonCondMatch,
                apiIdMatch,
                descriptionMatch,
                tricareDescriptionMatch,
              };
            }
            return null;
          })
          .filter(v => v);

        selectorFiltered.sort((a, b) => {
          const aPriorityMatch =
            a.nameMatch >= 0 ||
            a.akaMatch >= 0 ||
            a.commonCondMatch >= 0 ||
            a.apiIdMatch >= 0;
          const bPriorityMatch =
            b.nameMatch >= 0 ||
            b.akaMatch >= 0 ||
            b.commonCondMatch >= 0 ||
            b.apiIdMatch >= 0;
          const aSecondaryMatch =
            a.descriptionMatch || a.tricareDescriptionMatch;
          const bSecondaryMatch =
            b.descriptionMatch || b.tricareDescriptionMatch;
          if (aPriorityMatch && !bPriorityMatch) return -1;
          if (!aPriorityMatch && bPriorityMatch) return 1;
          if (aSecondaryMatch && !bSecondaryMatch) return -1;
          if (!aSecondaryMatch && bSecondaryMatch) return 1;
          return 0;
        });
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
