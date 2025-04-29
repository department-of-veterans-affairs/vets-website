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

export const mapBenefitFromFormInputData = (benefit, formData) => {
  if (checkExtraConditions(benefit, formData) === false) return false;

  const mappingKeys = Object.keys(mappingTypes);
  // Each mapping type (i.e. GOALS).
  for (let m = 0; m < mappingKeys.length; m++) {
    const key = mappingTypes[mappingKeys[m]];

    // Does this benefit map to the form input data values?
    let foundMappingValue = false;
    if (!benefit.mappings[key] || benefit.mappings[key][0] === anyType.ANY) {
      foundMappingValue = true;
    }
    for (
      let i = 0;
      !foundMappingValue && i < benefit.mappings[key].length;
      i++
    ) {
      const mappingValue = benefit.mappings[key][i];

      if (
        (formData[key] &&
          (formData[key] === mappingValue ||
            formData[key][mappingValue] === true)) ||
        (!formData[key] && mappingValue === blankType.BLANK)
      ) {
        foundMappingValue = true;
      }
    }

    if (!foundMappingValue) return false;
  }

  return true;
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
