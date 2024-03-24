import { expect } from 'chai';

import {
  DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED,
  DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED,
} from '@@profile/actions/directDeposit';
import directDeposit from '@@profile/reducers/directDeposit';

describe('directDeposit reducer', () => {
  const initialState = {
    controlInformation: null,
    paymentAccount: null,
    error: null,
    ui: {
      isEditing: false,
      isSaving: false,
    },
  };

  it('should return the initial state', () => {
    expect(directDeposit(undefined, {})).deep.equal(initialState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED', () => {
    const response = {
      controlInformation: {
        canUpdateDirectDeposit: true,
        isCorpAvailable: true,
        isEduClaimAvailable: true,
        isCorpRecFound: true,
        hasNoBdnPayments: true,
        hasIdentity: true,
        hasIndex: true,
        isCompetent: true,
        hasMailingAddress: true,
        hasNoFiduciaryAssigned: true,
        isNotDeceased: true,
        hasPaymentAddress: true,
      },
      paymentAccount: {
        name: 'SUCCESS TEST - DIRECT DEPOSIT',
        accountType: 'CHECKING',
        accountNumber: '*******5487',
        routingNumber: '*****1533',
      },
    };
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED,
      response,
    };
    const expectedState = {
      controlInformation: response.controlInformation,
      paymentAccount: response.paymentAccount,
      error: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED', () => {
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED,
      response: {
        error: 'error',
      },
    };
    const expectedState = {
      ...initialState,
      error: action.response.error,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED and fall back to true', () => {
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED,
      response: {},
    };
    const expectedState = {
      ...initialState,
      error: true,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED', () => {
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        responseError: null,
        isSaving: true,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED', () => {
    const response = {
      controlInformation: {
        canUpdateDirectDeposit: true,
        isCorpAvailable: true,
        isEduClaimAvailable: true,
        isCorpRecFound: true,
        hasNoBdnPayments: true,
        hasIdentity: true,
        hasIndex: true,
        isCompetent: true,
        hasMailingAddress: true,
        hasNoFiduciaryAssigned: true,
        isNotDeceased: true,
        hasPaymentAddress: true,
      },
      paymentAccount: {
        name: 'SUCCESS TEST - DIRECT DEPOSIT',
        accountType: 'CHECKING',
        accountNumber: '*******5487',
        routingNumber: '*****1533',
      },
    };
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED,
      response,
    };
    const expectedState = {
      controlInformation: response.controlInformation,
      paymentAccount: response.paymentAccount,
      error: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED', () => {
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED,
      response: 'error',
    };
    const expectedState = {
      ...initialState,
      error: action.response,
      ui: {
        ...initialState.ui,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED', () => {
    const action = {
      type: DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED,
      open: true,
    };
    const expectedState = {
      ...initialState,
      error: null,
      ui: {
        ...initialState.ui,
        isEditing: true,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });
});
