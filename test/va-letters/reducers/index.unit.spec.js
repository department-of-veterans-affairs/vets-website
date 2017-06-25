import { expect } from 'chai';

import lettersReducer from '../../../src/js/va-letters/reducers';

const initialState = {
  letters: [],
  destination: {},
  available: false
};

describe('letters reducer', () => {
  it('should handle failure to fetch letters', () => {
    const state = lettersReducer.letters(
      initialState,
      { type: 'GET_LETTERS_FAILURE' }
    );

    expect(state.letters).to.be.empty;
    expect(state.available).to.be.false;
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
                },
                {
                  letterType: 'proof_of_service',
                  name: 'Proof of Service Letter'
                }
              ]
            }
          },
          meta: {
            address: {
              addressLine1: '2476 MAIN STREET',
              addressLine2: 'STE # 12',
              addressLine3: 'West',
              city: 'RESTON',
              country: 'US',
              foreignCode: '865',
              fullName: 'MARK WEBB',
              state: 'VA',
              zipCode: '12345'
            }
          }
        }
      }
    );

    expect(state.letters[0].name).to.eql('Commissary Letter');
    expect(state.destination.addressLine1).to.eql('2476 MAIN STREET');
    expect(state.available).to.be.true;
  });
});
