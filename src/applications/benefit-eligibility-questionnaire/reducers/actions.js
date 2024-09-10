import { BENEFITS_LIST, mappingTypes, anyType } from '../constants/benefits';

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

const mapBenefitFromFormInputData = (benefit, formData) => {
  // Check the any value condition first.
  if (benefit.mappings[0] === anyType.ANY) {
    return true;
  }

  const mappingKeys = Object.keys(mappingTypes);
  // Each mapping type (i.e. GOALS).
  for (let m = 0; m < mappingKeys.length; m++) {
    const key = mappingTypes[mappingKeys[m]];

    // Does this benefit map to the form input data values?
    // Condition is OR, so if one value is mapped successfully, return true.
    for (
      let i = 0;
      benefit.mappings[key] && i < benefit.mappings[key].length;
      i++
    ) {
      const mappingValue = benefit.mappings[key][i];

      if (
        formData[key] === mappingValue ||
        formData[key][mappingValue] === true
      ) {
        return true;
      }
    }
  }
  return false;
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
