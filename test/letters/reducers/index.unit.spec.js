import { expect } from 'chai';

import lettersReducer from '../../../src/js/letters/reducers';

import {
  AVAILABILITY_STATUSES,
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  DOWNLOAD_STATUSES,
  GET_ADDRESS_FAILURE,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
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
  REQUEST_OPTIONS,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_FAILURE,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
} from '../../../src/js/letters/utils/constants';

const initialState = {
  letters: [],
  address: {},
  countries: [],
  states: [],
  lettersAvailability: AVAILABILITY_STATUSES.awaitingResponse,
  benefitInfo: {},
  serviceInfo: [],
  optionsAvailable: false,
  requestOptions: {}
};

const benefitSummaryOptionData = {
  data: {
    attributes: {
      benefitInformation: {
        awardEffectiveDate: '1965-01-01T05:00:00.000+00:00',
        monthlyAwardAmount: 200,
        hasChapter35Eligibility: true
      },
      militaryService: [
        {
          branch: 'ARMY',
          characterOfService: 'HONORABLE',
          enteredDate: '1965-01-01T05:00:00.000+00:00',
          releasedDate: '1972-10-01T04:00:00.000+00:00'
        }
      ]
    }
  }
};

describe('letters reducer', () => {
  it('should handle failure to fetch letters', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: GET_LETTERS_FAILURE }
    );

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal('unavailable');
  });

  it('should handle backend service error', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: BACKEND_SERVICE_ERROR }
    );

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal('backendServiceError');
  });

  it('should handle backend authentication error', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: BACKEND_AUTHENTICATION_ERROR }
    );

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal('backendAuthenticationError');
  });

  it('should handle invalid address', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: INVALID_ADDRESS_PROPERTY }
    );

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal('invalidAddressProperty');
  });

  it('should handle a successful request for letters', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_LETTERS_SUCCESS,
        data: {
          data: {
            attributes: {
              letters: [
                {
                  letterType: LETTER_TYPES.commissary,
                  name: 'Commissary Letter'
                }
              ]
            }
          }
        }
      }
    );

    expect(state.letters[0].name).to.eql('Commissary Letter');
    expect(state.lettersAvailability).to.equal(LETTER_TYPES.available);
  });

  it('should handle failure to fetch benefit summary options', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE }
    );

    expect(state.benefitInfo).to.be.empty;
    expect(state.serviceInfo).to.be.empty;
    expect(state.optionsAvailable).to.be.false;
  });

  it('should handle a successful request for benefit summary options', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
        data: benefitSummaryOptionData
      }
    );

    expect(state.benefitInfo.hasChapter35Eligibility).to.be.true;
    expect(state.serviceInfo[0].branch).to.equal('ARMY');
    expect(state.optionsAvailable).to.be.true;
  });

  it('should update benefit summary request options', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
        data: benefitSummaryOptionData
      }
    );
    expect(state.requestOptions.chapter35Eligibility).to.be.true;
    expect(state.requestOptions.monthlyAward).to.be.true;
  });

  it('should handle a successful request for the address', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_ADDRESS_SUCCESS,
        data: {
          data: {
            attributes: {
              address: {
                addressOne: '2746 Main St'
              },
              controlInformation: {
                canUpdate: true,
              }
            }
          }
        }
      }
    );

    expect(state.address.addressOne).to.equal('2746 Main St');
  });

  it('should handle failure to fetch the address', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: GET_ADDRESS_FAILURE }
    );

    expect(state.address).to.be.empty;
  });

  it('should handle successful request for the countries', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_ADDRESS_COUNTRIES_SUCCESS,
        countries: {
          data: {
            attributes: {
              countries: ['USA', 'France', 'India']
            }
          }
        }
      }
    );

    expect(state.countries).to.contain('USA');
  });

  it('should handle failure to fetch countries', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: GET_ADDRESS_COUNTRIES_FAILURE }
    );

    expect(state.countries).to.be.empty;
  });

  it('should handle successful request for the states', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: GET_ADDRESS_STATES_SUCCESS,
        states: {
          data: {
            attributes: {
              states: ['IL', 'MA', 'DC']
            }
          }
        }
      }
    );

    expect(state.states).to.contain('IL');
  });

  it('should handle failure to fetch states', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: GET_ADDRESS_STATES_FAILURE }
    );

    expect(state.states).to.be.empty;
  });
});
