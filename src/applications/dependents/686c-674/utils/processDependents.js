import { slugifyText } from 'platform/forms-system/src/js/patterns/array-builder';

import { PICKLIST_DATA } from '../config/constants';

import { calculateAge } from '../../shared/utils';

/**
 * @typedef {object} FullName
 * @property {string} first - First name
 * @property {string} [middle] - Middle name
 * @property {string} last - Last name
 *
 * @typedef {object} Dependent
 * @property {FullName} fullName - Dependent's full name
 * @property {string} ssn - Dependent's SSN
 *
 * @param {Dependent} dependent - Dependent object
 * @returns {string} Slugified key for the dependent
 */
export const slugifyKey = dependent =>
  slugifyText(
    `${dependent?.fullName?.first || ''}-${dependent?.ssn?.slice(-4) || ''}`,
    { convertCamelCase: false },
  );

/**
 * @typedef {object} ProcessDependentsProps
 * @property {boolean} [prefill] - Indicates if data is from prefill
 * @property {Array|object} dependents - Dependents data from prefill or API
 *
 * @param {ProcessDependentsProps} props - Process dependents props
 * @returns {React.ReactElement} Processed dependents data
 */
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
    // prefill includes dataOfBirth formatted as `YYYY-mm-dd` due to
    // processing on the backend
    const { age, dobStr, labeledAge } = calculateAge(dependent.dateOfBirth, {
      dateInFormat: isFromApi ? 'MM/dd/yyyy' : 'yyyy-MM-dd',
      dateOutFormat: 'yyyy-MM-dd',
    });

    // API (/show) returns "fullName", "firstName" & "lastName" as strings
    // Prefill returns "fullName" as an object
    const fullName =
      typeof dependent.fullName === 'object'
        ? dependent.fullName
        : {
            first: dependent.firstName,
            middle: dependent?.middleName,
            last: dependent.lastName,
            suffix: dependent?.nameSuffix,
          };

    // API (/show) returns "relationship"
    // Prefill returns "relationshipToVeteran"
    const relationshipToVeteran =
      dependent.relationship || dependent.relationshipToVeteran;

    return {
      ...dependent,
      key: slugifyKey({ ssn: dependent.ssn, fullName }),
      fullName,
      dateOfBirth: dobStr,
      relationshipToVeteran,
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
 * @param {Object} formData - current form data
 * @param {Object} apiDependentsData - dependents data from API
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
