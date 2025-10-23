import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import { PICKLIST_DATA } from '../config/constants';

import { calculateAge } from '../../shared/utils';

export const slugifyKey = dependent =>
  slugifyText(`${dependent?.fullName.first}-${dependent?.ssn.slice(-4)}`);

export const processDependents = (props = {}) => {
  const isPrefill = props.prefill || false;

  /* Prefill dependents structure
   * - va_dependents_v3 disabled:
   *   dependents: [{...}, {...}]
   * - va_dependents_v3 enabled:
   *   dependents: {
   *     success: 'true' | 'false',
   *     dependents: [{...}, {...}]
   *   }
   *
   * Non-prefill - data from the (/show) API (from state.dependents)
   *  dependents: {
   *    loading: false,
   *    error: null,
   *    data: [{...}, {...}]
   *  }
   */
  const isV2Dependents = Array.isArray(props.dependents);
  const isFromApi = !isPrefill && Array.isArray(props.dependents?.data);
  // We don't have direct access to the va_dependents_v3 feature toggle here (it
  // is in localStorage, but may not be reliable), so we infer it based on the
  // structure of the data
  const dependents = isV2Dependents
    ? props.dependents || [] // va_dependents_v3 disabled
    : props.dependents?.dependents || props.dependents?.data || [];

  let hasError = false;
  if (isPrefill && !isV2Dependents) {
    hasError = props.dependents?.success !== 'true';
  } else if (!isPrefill) {
    hasError = props.dependents?.error || false;
  }

  const list = dependents.map(dependent => {
    // API (/show) returns dateOfBirth formatted as `mm/dd/YYYY`
    // prefill data includes dataOfBirth formatted as `YYYY-mm-dd` due to
    // processing on the backend
    const { age, dobStr, labeledAge } = calculateAge(dependent.dateOfBirth, {
      dateInFormat: isFromApi ? 'MM/dd/yyyy' : 'yyyy-MM-dd',
      dateOutFormat: 'yyyy-MM-dd',
    });

    // API (/show) returns "firstName" & "lastName" as strings
    // Prefill data returns "fullName" as an object
    const fullName = dependent.fullName
      ? dependent.fullName
      : {
          first: dependent.firstName,
          middle: dependent?.middleName,
          last: dependent.lastName,
          suffix: dependent?.nameSuffix,
        };

    return {
      ...dependent,
      key: slugifyKey({ ssn: dependent.ssn, fullName }),
      fullName,
      dateOfBirth: dobStr,
      age,
      labeledAge,
    };
  });

  const awarded = hasError
    ? []
    : list.filter(dependent => dependent.awardIndicator === 'Y');

  const notAwarded = hasError
    ? []
    : list.filter(dependent => dependent.awardIndicator !== 'Y');

  return {
    hasError,
    awarded,
    notAwarded,
  };
};

/**
 * Perform API data difference between dependents in form data (A minus B)
 * @param {Object} formData
 * @param {Object} apiDependentsData
 * @returns {Object} new form data with updated dependents list & picklist data
 * difference from apiDepdendentsData & formData
 */
export const updateDependentsInFormData = (formData, apiDependentsData) => {
  const { awarded = [], notAwarded = [] } = apiDependentsData;
  const picklist = formData[PICKLIST_DATA] || [];
  const mergeDependentFromPicklist = dependent => {
    const foundDependent =
      picklist.find(item => item.key === dependent.key) || {};
    return { ...foundDependent, ...dependent };
  };

  // TODO: if design wants us to show which dependents were added/removed
  // from the picklist, we need to preserve that data
  return {
    ...formData,
    [PICKLIST_DATA]: awarded.map(mergeDependentFromPicklist),
    dependents: {
      hasDependents: awarded.length > 0,
      awarded,
      notAwarded,
    },
  };
};
