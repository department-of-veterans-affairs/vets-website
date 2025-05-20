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

export const checkBranchComponentResponse = (formData, mappingValue) => {
  return Object.values(formData.branchComponents).some(
    branchComponent => branchComponent[mappingValue] === true,
  );
};

/**
 * Checks a single condition for a benefit.
 * This function checks each condition of a benefit seperately e.g. CHARACTER_OF_DISCHARGE. The reason for this is so we can specify how
 * different conditions relate to one another. Do all of the conditions need to be true, can some be false if another is true?
 *
 * @param {Object} benefit the benefit the function is checking for qualification.
 * @param {Object} formData the user responses to the questionnaire.
 * @param {Object} mappingType the name of the condition the function is checking.
 * @returns True if the formData qualifies for the given benefit, otherwise returns false.
 */
export const checkSingleResponse = (benefit, formData, mappingType) => {
  if (
    !benefit.mappings[mappingType] ||
    benefit.mappings[mappingType][0] === anyType.ANY
  ) {
    return true;
  }
  for (let i = 0; i < benefit.mappings[mappingType].length; i++) {
    const mappingValue = benefit.mappings[mappingType][i];
    const formResponse = formData[mappingType];
    if (mappingType === mappingTypes.BRANCH_COMPONENT) {
      return checkBranchComponentResponse(formData, mappingValue);
    }
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
 * Checks if the user responses in formData qualify the user for the given benefit.
 *
 * @param {Object} benefit the benefit the function is checking for qualification.
 * @param {Object} formData the user responses to the questionnaire.
 * @returns true if the user responses in formData qualify the user for the benefit, otherwise returns false.
 */
export const mapBenefitFromFormInputData = (benefit, formData) => {
  const mappingKeys = Object.keys(mappingTypes);
  // Maps each benefit condition to a boolean indicating if the user meets that condition
  const userBenefitConditionQualificationMap = {};
  // Each mapping type (i.e. GOALS).
  for (let m = 0; m < mappingKeys.length; m++) {
    const mappingType = mappingTypes[mappingKeys[m]];
    userBenefitConditionQualificationMap[mappingType] = checkSingleResponse(
      benefit,
      formData,
      mappingType,
    );
  }
  if (benefit.isQualified !== undefined) {
    // Use benefit specific logic to determine qualification.
    return benefit.isQualified(userBenefitConditionQualificationMap);
  }
  return Object.values(userBenefitConditionQualificationMap).reduce(
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
