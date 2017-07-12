import { expect } from 'chai';

import lettersReducer from '../../../src/js/letters/reducers';

const initialState = {
  letters: [],
  destination: {},
  lettersAvailability: 'awaitingResponse',
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
      { type: 'GET_LETTERS_FAILURE' }
    );

    expect(state.letters).to.be.empty;
    expect(state.lettersAvailability).to.equal('unavailable');
  });

  it('should handle a successful request for letters', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: 'GET_LETTERS_SUCCESS',
        data: {
          data: {
            attributes: {
              letters: [
                {
                  letterType: 'commissary',
                  name: 'Commissary Letter'
                }
              ]
            }
          },
          meta: {
            address: {
              addressLine1: '2476 MAIN STREET',
              fullName: 'MARK WEBB'
            }
          }
        }
      }
    );

    expect(state.letters[0].name).to.eql('Commissary Letter');
    expect(state.destination.addressLine1).to.eql('2476 MAIN STREET');
    expect(state.lettersAvailability).to.equal('available');
  });

  it('should handle failure to fetch benefit summary options', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE' }
    );

    expect(state.benefitInfo).to.be.empty;
    expect(state.serviceInfo).to.be.empty;
    expect(state.optionsAvailable).to.be.false;
  });

  it('should handle a successful request for benefit summary options', () => {
    const state = lettersReducer.letters(
      initialState,
      {
        type: 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS',
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
        type: 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS',
        data: benefitSummaryOptionData
      }
    );
    expect(state.requestOptions.chapter35Eligibility).to.be.true;
    expect(state.requestOptions.monthlyAward).to.be.true;
  });
});
