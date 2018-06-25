import { expect } from 'chai';

import calculatorReducer from '../../reducers/calculator';

describe('calculator reducer', () => {
  it('should correctly change non-dollar input', () => {
    const state = calculatorReducer(
      {},
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'field',
        value: 'value'
      }
    );

    expect(state).to.eql({ field: 'value' });
  });

  it('should correctly change dollar input', () => {
    const state = calculatorReducer(
      {},
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'tuitionFees',
        value: '$1000.00'
      }
    );

    expect(state).to.eql({ tuitionFees: 1000 });
  });

  it('should correctly change inState input and set inState tuition', () => {
    const state = calculatorReducer(
      { tuitionInState: 10 },
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'inState',
        value: 'yes'
      }
    );

    expect(state).to.eql({
      tuitionInState: 10,
      inState: 'yes',
      inStateTuitionFees: 10,
      tuitionFees: 10,
    });
  });

  it('should correctly change inState input and set out of state tuition', () => {
    const state = calculatorReducer(
      { tuitionOutOfState: 100, tuitionInState: 10 },
      {
        type: 'CALCULATOR_INPUTS_CHANGED',
        field: 'inState',
        value: 'no'
      }
    );

    expect(state).to.eql({
      tuitionOutOfState: 100,
      inStateTuitionFees: 10,
      inState: 'no',
      tuitionInState: 10,
      tuitionFees: 100,
    });
  });

  describe('FETCH_BAH_FAILED', () => {
    it('should add error and clear values', () => {
      const previousState = {
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: 5000,
        housingAllowanceCity: 'New York, NY'
      };

      const action = {
        type: 'FETCH_BAH_FAILED',
        beneficiaryZIPFetched: '88888',
        payload: {
          error: 'error'
        }
      };

      const expectedState = {
        beneficiaryZIPError: action.payload.error,
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });

    it('should not modify the state if beneficiaryZIPFetched on state does not match action', () => {
      const previousState = {
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '99999',
        beneficiaryLocationBah: 5000,
        housingAllowanceCity: 'New York, NY'
      };

      const action = {
        type: 'FETCH_BAH_FAILED',
        beneficiaryZIPFetched: '88888',
        payload: {
          error: 'error'
        }
      };

      const newState = calculatorReducer(previousState, action);

      expect(previousState).to.eql(newState);
    });
  });

  describe('FETCH_BAH_STARTED', () => {
   it('should clear errors and fetch loading state', () => {
      const previousState = {
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: 5000,
        housingAllowanceCity: 'New York, NY'
      };

      const action = {
        type: 'FETCH_BAH_STARTED',
        beneficiaryZIPFetched: '88888',
      };

      const expectedState = {
        beneficiaryZIPError: '',
        beneficiaryZIP: '88888',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });
  });

  describe('FETCH_BAH_SUCCEEDED', () => {
    it('should clear errors and set retrieved state', () => {
      const previousState = {
        beneficiaryZIP: '88888',
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const action = {
        type: 'FETCH_BAH_SUCCEEDED',
        beneficiaryZIPFetched: '88888',
        payload: {
          data: {
            mha_rate: 5000,
            mha_name: 'Los Angeles, CA'
          }
        }
      };

      const expectedState = {
        beneficiaryZIPError: '',
        beneficiaryZIP: '88888',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: 5000,
        housingAllowanceCity: 'Los Angeles, CA'
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });

    it('should not modify the state if beneficiaryZIPFetched on state does not match action', () => {
      const previousState = {
        beneficiaryZIP: '88888',
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const action = {
        type: 'FETCH_BAH_SUCCEEDED',
        beneficiaryZIPFetched: '11111',
        payload: {
          data: {
            mha_rate: 5000,
            mha_name: 'Los Angeles, CA'
          }
        }
      };

      const newState = calculatorReducer(previousState, action);

      expect(previousState).to.eql(newState);
    });
  });
  describe('BENEFICIARY_ZIP_CODE_CHANGED', () => {
    it ('adds the input to the state and resets amounts and errors', () => {
      const previousState = {
        beneficiaryZIP: '88888',
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const action = {
        type: 'BENEFICIARY_ZIP_CODE_CHANGED',
        beneficiaryZIP: '1111'
      };

      const expectedState = {
        beneficiaryZIPError: '',
        beneficiaryZIP: '1111',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });

    it('adds an error to the state when zip code has letters', () => {
      const previousState = {
        beneficiaryZIP: '88888',
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const action = {
        type: 'BENEFICIARY_ZIP_CODE_CHANGED',
        beneficiaryZIP: '1dd'
      };

      const expectedState = {
        beneficiaryZIPError: 'ZIP Code must be a five digit number',
        beneficiaryZIP: '1dd',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });

    it('adds and error to the state when zip code is too long', () => {
      const previousState = {
        beneficiaryZIP: '88888',
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '88888',
        beneficiaryLocationBah: null,
        housingAllowanceCity: 'Loading...'
      };

      const action = {
        type: 'BENEFICIARY_ZIP_CODE_CHANGED',
        beneficiaryZIP: '1111111'
      };

      const expectedState = {
        beneficiaryZIPError: 'ZIP Code must be a five digit number',
        beneficiaryZIP: '1111111',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
      };

      const newState = calculatorReducer(previousState, action);

      expect(expectedState).to.eql(newState);
    });
  });
});
