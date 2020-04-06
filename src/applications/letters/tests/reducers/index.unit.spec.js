import lettersReducer, { initialState } from '../../reducers';

import {
  AVAILABILITY_STATUSES,
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  DOWNLOAD_STATUSES,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  INVALID_ADDRESS_PROPERTY,
  LETTER_ELIGIBILITY_ERROR,
  LETTER_TYPES,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
} from '../../utils/constants';

function reduce(action, state = initialState) {
  return lettersReducer.letters(state, action);
}

const benefitSummaryOptionData = {
  data: {
    attributes: {
      benefitInformation: {
        awardEffectiveDate: '1965-01-01T05:00:00.000+00:00',
        monthlyAwardAmount: 200,
        hasChapter35Eligibility: true,
      },
      militaryService: [
        {
          branch: 'ARMY',
          characterOfService: 'HONORABLE',
          enteredDate: '1965-01-01T05:00:00.000+00:00',
          releasedDate: '1972-10-01T04:00:00.000+00:00',
        },
      ],
    },
  },
};

describe('letters reducer', () => {
  it('should not modify state if an unrecognized action is passed', () => {
    const state = reduce({ type: 'FOO_BAR' });

    expect(state).toEqual(initialState);
  });

  it('should handle failure to fetch letters', () => {
    const state = reduce({ type: GET_LETTERS_FAILURE });

    expect(state.letters).toHaveLength(0);
    expect(state.lettersAvailability).toBe(AVAILABILITY_STATUSES.unavailable);
  });

  it('should handle backend service error', () => {
    const state = reduce({ type: BACKEND_SERVICE_ERROR });

    expect(state.letters).toHaveLength(0);
    expect(state.lettersAvailability).toBe(
      AVAILABILITY_STATUSES.backendServiceError,
    );
  });

  it('should handle backend authentication error', () => {
    const state = reduce({ type: BACKEND_AUTHENTICATION_ERROR });

    expect(state.letters).toHaveLength(0);
    expect(state.lettersAvailability).toBe(
      AVAILABILITY_STATUSES.backendAuthenticationError,
    );
  });

  it('should handle invalid address', () => {
    const state = reduce({ type: INVALID_ADDRESS_PROPERTY });

    expect(state.letters).toHaveLength(0);
    expect(state.lettersAvailability).toBe(
      AVAILABILITY_STATUSES.invalidAddressProperty,
    );
  });

  it('should handle a successful request for letters', () => {
    const state = reduce({
      type: GET_LETTERS_SUCCESS,
      data: {
        data: {
          attributes: {
            letters: [
              {
                letterType: LETTER_TYPES.commissary,
                name: 'Commissary Letter',
              },
            ],
            fullName: 'Johann Bach',
          },
        },
      },
    });

    expect(state.letters[0].name).toBe('Commissary Letter');
    expect(state.letterDownloadStatus[LETTER_TYPES.commissary]).toBe(
      DOWNLOAD_STATUSES.pending,
    );
    expect(state.fullName).toBe('Johann Bach');
    expect(state.lettersAvailability).toBe(AVAILABILITY_STATUSES.available);
  });

  it('should handle failure to fetch benefit summary options', () => {
    const state = reduce({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE });

    expect(state.benefitInfo).toHaveLength(0);
    expect(state.serviceInfo).toHaveLength(0);
    expect(state.optionsAvailable).toBe(false);
  });

  it('should handle a successful request for benefit summary options', () => {
    const state = reduce({
      type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
      data: benefitSummaryOptionData,
    });

    expect(state.benefitInfo.hasChapter35Eligibility).toBe(true);
    expect(state.serviceInfo[0].branch).toBe('ARMY');
    expect(state.optionsAvailable).toBe(true);
  });

  it('should update benefit summary request options', () => {
    const state = reduce({
      type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
      data: benefitSummaryOptionData,
    });
    expect(state.requestOptions.chapter35Eligibility).toBe(true);
    expect(state.requestOptions.monthlyAward).toBe(true);
    // TODO: Test what makes it to requestOptions when we have a firmer grasp of the business logic
  });

  it('should handle a letter eligibility error', () => {
    const state = reduce({ type: LETTER_ELIGIBILITY_ERROR });

    expect(state.lettersAvailability).toBe(
      AVAILABILITY_STATUSES.letterEligibilityError,
    );
  });

  it('should handle updating a benefit summary request option', () => {
    const state = reduce({
      type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
      propertyPath: 'foo',
      value: 'bar',
    });

    expect(state.requestOptions.foo).toBe('bar');
  });

  it('should handle downloading a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_DOWNLOADING,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).toBe(DOWNLOAD_STATUSES.downloading);
  });

  it('should handle successfully downloading a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_SUCCESS,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).toBe(DOWNLOAD_STATUSES.success);
  });

  it('should handle failing to download a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_FAILURE,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).toBe(DOWNLOAD_STATUSES.failure);
  });
});
