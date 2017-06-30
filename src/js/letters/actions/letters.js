import { apiRequest } from '../utils/helpers';

export function getLetterList() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters',
      null,
      (response) => {
        return dispatch({
          type: 'GET_LETTERS_SUCCESS',
          data: response,
        });
      },
      () => dispatch({ type: 'GET_LETTERS_FAILURE' })
    );
  };
}

export function getBenefitSummaryOptions() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters/beneficiary',
      null,
      (response) => {
        return dispatch({
          type: 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS',
          data: response,
        });
      },
      () => dispatch({ type: 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE' })
    );
  };
}

export function updateBenefitSummaryOption(propertyPath, value) {
  return {
    type: 'UPDATE_BENEFIT_SUMMARY_OPTION',
    propertyPath,
    value
  };
}
