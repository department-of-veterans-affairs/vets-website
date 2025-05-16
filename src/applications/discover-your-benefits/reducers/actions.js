import {
  BENEFITS_LIST,
  mappingTypes,
  anyType,
  blankType,
} from '../constants/benefits';

export const FETCH_RESULTS_STARTED = 'FETCH_RESULTS_STARTED';
export const FETCH_RESULTS_SUCCESS = 'FETCH_RESULTS_SUCCESS';
export const FETCH_RESULTS_FAILURE = 'FETCH_RESULTS_FAILURE';

const fetchResultsStart = () => ({ type: FETCH_RESULTS_STARTED });

const fetchResultsSuccess = data => ({
  type: FETCH_RESULTS_SUCCESS,
  payload: data,
});

const fetchResultsFailure = error => ({
  type: FETCH_RESULTS_FAILURE,
  error,
});

export const checkExtraConditions = (benefit, formData) => {
  let result = true;

  if (benefit.extraConditions) {
    if (benefit.extraConditions.oneIsNotBlank) {
      result = benefit.extraConditions.oneIsNotBlank.some(
        key => formData[key] !== '',
      );
    }

    if (result === true && benefit.extraConditions.dependsOn) {
      for (let i = 0; i < benefit.extraConditions.dependsOn.length; i++) {
        const dependsOnObj = benefit.extraConditions.dependsOn[i];
        if (
          formData[dependsOnObj.field] === dependsOnObj.value &&
          formData[dependsOnObj.dependsOnField] !== dependsOnObj.dependsOnValue
        )
          result = false;
      }
    }
  }
  return result;
};

/**
 * Check a single condition for a benefit.
 * @param {Object} benefit
 * @param {Object} formData
 * @param {Object} mappingType
 * @returns True if the formData qualifies for the given benefit, otherwise returns false.
 */
export const checkSingleResponse = (benefit, formData, mappingType) => {
  // Does this benefit map to the form input data values?
  if (
    !benefit.mappings[mappingType] ||
    benefit.mappings[mappingType][0] === anyType.ANY
  ) {
    return true;
  }
  for (let i = 0; i < benefit.mappings[mappingType].length; i++) {
    const mappingValue = benefit.mappings[mappingType][i];
    const formResponse = formData[mappingType];
    if (
      (formResponse &&
        (formResponse === mappingValue ||
          formResponse[mappingValue] === true)) ||
      (!formResponse && mappingValue === blankType.BLANK)
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if the responses in formData qualify the user for the given benefit.
 * @param {Object} benefit
 * @param {Object} formData
 * @returns true if the responses in formData qualify for the benefit, otherwise returns false.
 */
export const mapBenefitFromFormInputData = (benefit, formData) => {
  if (checkExtraConditions(benefit, formData) === false) return false;
  const mappingKeys = Object.keys(mappingTypes);
  const userResponseBooleanDictionary = {};
  // Each mapping type (i.e. GOALS).
  for (let m = 0; m < mappingKeys.length; m++) {
    const mappingType = mappingTypes[mappingKeys[m]];
    userResponseBooleanDictionary[mappingType] = checkSingleResponse(
      benefit,
      formData,
      mappingType,
    );
  }
  if (benefit.isQualified !== undefined) {
    return benefit.isQualified(userResponseBooleanDictionary);
  }
  return Object.values(userResponseBooleanDictionary).reduce(
    (accumulator, currentValue) => accumulator && currentValue,
    true,
  );
};

export function getResults(formData) {
  return async dispatch => {
    dispatch(fetchResultsStart());

    try {
      const results = BENEFITS_LIST.filter(b =>
        mapBenefitFromFormInputData(b, formData),
      );

      dispatch(fetchResultsSuccess(results));
    } catch (error) {
      dispatch(fetchResultsFailure(error));
    }
  };
}

export function displayResults(benefitIds) {
  return async dispatch => {
    dispatch(fetchResultsStart());

    try {
      const results = BENEFITS_LIST.filter(b => benefitIds.includes(b.id));

      dispatch(fetchResultsSuccess(results));
    } catch (error) {
      dispatch(fetchResultsFailure(error));
    }
  };
}
