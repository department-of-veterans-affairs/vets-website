import { expect } from 'chai';

import {
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_SAVE_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
  DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
  DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
} from '@@profile/actions/directDeposit';
import directDeposit from '@@profile/reducers/directDeposit';

describe('directDeposit reducer', () => {
  const initialState = {
    controlInformation: null,
    paymentAccount: null,
    loadError: null,
    saveError: null,
    ui: {
      isEditing: false,
      isSaving: false,
    },
    veteranStatus: null,
  };

  it('should return the initial state', () => {
    expect(directDeposit(undefined, {})).deep.equal(initialState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_SUCCEEDED', () => {
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
      veteranStatus: 'VETERAN',
    };
    const action = {
      type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
      response,
    };
    const expectedState = {
      controlInformation: response.controlInformation,
      paymentAccount: response.paymentAccount,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: response.veteranStatus,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_FAILED', () => {
    const action = {
      type: DIRECT_DEPOSIT_FETCH_FAILED,
      response: {
        error: 'error',
      },
    };
    const expectedState = {
      ...initialState,
      loadError: action.response.error,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_FAILED and fall back to true', () => {
    const action = {
      type: DIRECT_DEPOSIT_FETCH_FAILED,
      response: {},
    };
    const expectedState = {
      ...initialState,
      loadError: true,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_STARTED', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_STARTED,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isSaving: true,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_SUCCEEDED', () => {
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
      veteranStatus: 'VETERAN',
    };
    const action = {
      type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
      response,
    };
    const expectedState = {
      controlInformation: response.controlInformation,
      paymentAccount: response.paymentAccount,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: response.veteranStatus,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_FAILED', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_FAILED,
      response: { error: 'error' },
    };
    const expectedState = {
      ...initialState,
      saveError: action.response.error,
      ui: {
        ...initialState.ui,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_EDIT_TOGGLED', () => {
    const action = {
      type: DIRECT_DEPOSIT_EDIT_TOGGLED,
      open: true,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: true,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_EDIT_TOGGLED without open parameter', () => {
    const stateWithEditing = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: false,
      },
    };
    const action = {
      type: DIRECT_DEPOSIT_EDIT_TOGGLED,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: true,
      },
    };
    expect(directDeposit(stateWithEditing, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_LOAD_ERROR_CLEARED', () => {
    const stateWithSaveError = {
      ...initialState,
      saveError: 'Some save error',
    };
    const action = {
      type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
    };
    const expectedState = {
      ...initialState,
      saveError: null,
    };
    expect(directDeposit(stateWithSaveError, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_ERROR_CLEARED', () => {
    const stateWithLoadError = {
      ...initialState,
      loadError: 'Some load error',
    };
    const action = {
      type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
    };
    const expectedState = {
      ...initialState,
      loadError: null,
    };
    expect(directDeposit(stateWithLoadError, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_FAILED with errors array', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_FAILED,
      response: { errors: ['Error 1', 'Error 2'] },
    };
    const expectedState = {
      ...initialState,
      saveError: ['Error 1', 'Error 2'],
      ui: {
        ...initialState.ui,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_SUCCEEDED with missing response properties', () => {
    const action = {
      type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
      response: {},
    };
    const expectedState = {
      controlInformation: null,
      paymentAccount: null,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: null,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_SUCCEEDED with null response', () => {
    const action = {
      type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
      response: null,
    };
    const expectedState = {
      controlInformation: null,
      paymentAccount: null,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: null,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_SUCCEEDED with missing response properties', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
      response: {},
    };
    const expectedState = {
      controlInformation: null,
      paymentAccount: null,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: null,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_SUCCEEDED with null response', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
      response: null,
    };
    const expectedState = {
      controlInformation: null,
      paymentAccount: null,
      loadError: null,
      saveError: null,
      ui: {
        isEditing: false,
        isSaving: false,
      },
      veteranStatus: null,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_FETCH_FAILED with null response', () => {
    const action = {
      type: DIRECT_DEPOSIT_FETCH_FAILED,
      response: null,
    };
    const expectedState = {
      ...initialState,
      loadError: true,
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_EDIT_TOGGLED with null open parameter', () => {
    const stateWithEditing = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: true,
      },
    };
    const action = {
      type: DIRECT_DEPOSIT_EDIT_TOGGLED,
      open: null,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: false, // null ?? !true = !true = false
      },
    };
    expect(directDeposit(stateWithEditing, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_EDIT_TOGGLED with undefined open parameter', () => {
    const stateWithEditing = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: false,
      },
    };
    const action = {
      type: DIRECT_DEPOSIT_EDIT_TOGGLED,
      open: undefined,
    };
    const expectedState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        isEditing: true, // undefined ?? !false = !false = true
      },
    };
    expect(directDeposit(stateWithEditing, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_FAILED with only errors array (no error property)', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_FAILED,
      response: { errors: ['Error 1'] },
    };
    const expectedState = {
      ...initialState,
      saveError: ['Error 1'],
      ui: {
        ...initialState.ui,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });

  it('should handle DIRECT_DEPOSIT_SAVE_FAILED with null response', () => {
    const action = {
      type: DIRECT_DEPOSIT_SAVE_FAILED,
      response: null,
    };
    const expectedState = {
      ...initialState,
      saveError: true,
      ui: {
        ...initialState.ui,
        isSaving: false,
      },
    };
    expect(directDeposit(initialState, action)).deep.equal(expectedState);
  });
});
