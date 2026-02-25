import { expect } from 'chai';

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
  GET_TSA_LETTER_ELIGIBILITY_ERROR,
  GET_TSA_LETTER_ELIGIBILITY_LOADING,
  GET_TSA_LETTER_ELIGIBILITY_SUCCESS,
  INVALID_ADDRESS_PROPERTY,
  LETTER_ELIGIBILITY_ERROR,
  LETTER_TYPES,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
} from '../../utils/constants';

function reduce(action, state = initialState) {
  return lettersReducer.letters(state, action);
}

const benefitSummaryOptionData = {
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
};

describe('letters reducer', () => {
  it('should not modify state if an unrecognized action is passed', () => {
    const state = reduce({ type: 'FOO_BAR' });

    expect(state).to.deep.equal(initialState);
  });

  it('should handle failure to fetch letters', () => {
    const state = reduce({ type: GET_LETTERS_FAILURE });

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.unavailable,
    );
  });

  it('should handle backend service error', () => {
    const state = reduce({ type: BACKEND_SERVICE_ERROR });

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.backendServiceError,
    );
  });

  it('should handle backend authentication error', () => {
    const state = reduce({ type: BACKEND_AUTHENTICATION_ERROR });

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.backendAuthenticationError,
    );
  });

  it('should handle invalid address', () => {
    const state = reduce({ type: INVALID_ADDRESS_PROPERTY });

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.invalidAddressProperty,
    );
  });

  it('should handle a successful request for letters', () => {
    const state = reduce({
      type: GET_LETTERS_SUCCESS,
      data: {
        letters: [
          {
            letterType: LETTER_TYPES.commissary,
            name: 'Commissary Letter',
          },
        ],
        fullName: 'Johann Bach',
      },
    });

    expect(state.letters[0].name).to.eql('Commissary Letter');
    expect(state.letterDownloadStatus[LETTER_TYPES.commissary]).to.equal(
      DOWNLOAD_STATUSES.pending,
    );
    expect(state.fullName).to.equal('Johann Bach');
    expect(state.lettersAvailability).to.equal(AVAILABILITY_STATUSES.available);
  });

  it('should handle failure to fetch benefit summary options', () => {
    const state = reduce({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE });

    expect(state.benefitInfo).to.be.empty;
    expect(state.serviceInfo).to.be.empty;
    expect(state.optionsAvailable).to.be.false;
  });

  it('should handle a successful request for benefit summary options', () => {
    const state = reduce({
      type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
      data: benefitSummaryOptionData,
    });

    expect(state.benefitInfo.hasChapter35Eligibility).to.be.true;
    expect(state.serviceInfo[0].branch).to.equal('ARMY');
    expect(state.optionsAvailable).to.be.true;
  });

  it('should update benefit summary request options', () => {
    const state = reduce({
      type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
      data: benefitSummaryOptionData,
    });
    expect(state.requestOptions.chapter35Eligibility).to.be.true;
    expect(state.requestOptions.monthlyAward).to.be.true;
    // TODO: Test what makes it to requestOptions when we have a firmer grasp of the business logic
  });

  it('should handle a letter eligibility error', () => {
    const state = reduce({ type: LETTER_ELIGIBILITY_ERROR });

    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.letterEligibilityError,
    );
  });

  it('should handle updating a benefit summary request option', () => {
    const state = reduce({
      type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
      propertyPath: 'foo',
      value: 'bar',
    });

    expect(state.requestOptions.foo).to.equal('bar');
  });

  it('should handle downloading a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_DOWNLOADING,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).to.equal(
      DOWNLOAD_STATUSES.downloading,
    );
  });

  it('should handle successfully downloading a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_SUCCESS,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).to.equal(DOWNLOAD_STATUSES.success);
  });

  it('should handle failing to download a pdf', () => {
    const state = reduce({
      type: GET_LETTER_PDF_FAILURE,
      data: 'foo', // The letter name
    });

    expect(state.letterDownloadStatus.foo).to.equal(DOWNLOAD_STATUSES.failure);
  });
  it('should handle a letter with an empty address', () => {
    const state = reduce({ type: 'LETTER_HAS_EMPTY_ADDRESS' });

    expect(state.lettersAvailability).to.equal(
      AVAILABILITY_STATUSES.hasEmptyAddress,
    );
    expect(state.addressAvailability).to.equal(
      AVAILABILITY_STATUSES.hasEmptyAddress,
    );
  });
  it('should handle downloading an enhanced letter', () => {
    const state = reduce({
      type: 'GET_ENHANCED_LETTERS_DOWNLOADING',
      letterType: 'letterType',
    });

    expect(state.enhancedLetterStatus.letterType).to.equal(
      DOWNLOAD_STATUSES.downloading,
    );
  });
  it('should handle successfully fetching enhanced letters', () => {
    const enhancedLetters = [
      { letterType: 'one', name: 'Enhanced One Letter' },
      { letterType: 'two', name: 'Enhanced Two Letter' },
    ];

    const state = reduce({
      type: 'GET_ENHANCED_LETTERS_SUCCESS',
      data: enhancedLetters,
    });

    expect(state.enhancedLetters).to.deep.equal(enhancedLetters);
    expect(state.enhancedLetterStatus.one).to.equal(DOWNLOAD_STATUSES.success);
    expect(state.enhancedLetterStatus.two).to.equal(DOWNLOAD_STATUSES.success);
  });
  it('should handle failing to fetch enhanced letters', () => {
    const state = reduce({
      type: 'GET_ENHANCED_LETTERS_FAILURE',
      letterType: 'letterType',
    });

    expect(state.enhancedLetterStatus.letterType).to.equal(
      DOWNLOAD_STATUSES.failure,
    );
  });

  it('should handle error when fetching TSA letter eligibility', () => {
    const errorState = {
      error: true,
      loading: false,
    };
    const state = reduce({
      type: GET_TSA_LETTER_ELIGIBILITY_ERROR,
    });
    expect(state.tsaLetterEligibility).to.deep.equal(errorState);
  });

  it('should handle loading when fetching TSA letter eligibility', () => {
    const loadingState = {
      error: false,
      loading: true,
    };
    const state = reduce({
      type: GET_TSA_LETTER_ELIGIBILITY_LOADING,
    });
    expect(state.tsaLetterEligibility).to.deep.equal(loadingState);
  });

  it('should handle success when fetching TSA letter eligibility', () => {
    const letter = {
      attributes: {
        documentId: '123',
        documentVersion: 'abc',
      },
    };
    const successState = {
      documentId: '123',
      documentVersion: 'abc',
      error: false,
      loading: false,
    };
    const state = reduce({
      type: GET_TSA_LETTER_ELIGIBILITY_SUCCESS,
      data: letter,
    });
    expect(state.tsaLetterEligibility).to.deep.equal(successState);
  });
});
