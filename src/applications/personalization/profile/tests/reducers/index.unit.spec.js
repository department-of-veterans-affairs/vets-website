import { expect } from 'chai';

import profileReducer from '../../reducers/index';
import * as paymentInfoActions from '../../actions/paymentInformation';

const { vaProfile } = profileReducer;

describe('index reducer', () => {
  it('should fetch hero info', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_HERO_SUCCESS',
      hero: 'heroContent',
    });

    expect(state.hero).to.eql('heroContent');
  });

  it('should populate hero with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_HERO_FAILED',
      hero: {
        errors: ['This is an error'],
      },
    });

    expect(state.hero).to.eql({ errors: ['This is an error'] });
  });

  it('should fetch personalInformation', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_PERSONAL_INFORMATION_SUCCESS',
      personalInformation: 'personalInformation',
    });

    expect(state.personalInformation).to.eql('personalInformation');
  });

  it('should populate personalInformation with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_PERSONAL_INFORMATION_FAILED',
      personalInformation: {
        errors: ['error'],
      },
    });

    expect(state.personalInformation.errors).to.eql(['error']);
  });

  it('should fetch militaryInformation', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_MILITARY_INFORMATION_SUCCESS',
      militaryInformation: 'military info',
    });

    expect(state.militaryInformation).to.eql('military info');
  });

  it('should populate militaryInformation with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_MILITARY_INFORMATION_FAILED',
      militaryInformation: {
        errors: ['error'],
      },
    });

    expect(state.militaryInformation.errors).to.eql(['error']);
  });

  it('fetches cnpPaymentInformation', () => {
    const fetchAction = {
      type: paymentInfoActions.CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
      response: {
        something: 'something',
      },
    };

    const state = vaProfile(undefined, fetchAction);

    expect(state.cnpPaymentInformation).to.be.deep.equal(
      fetchAction.response,
      'paymentInformation is initialized',
    );
  });

  it('toggles the cnpPaymentInformation edit view', () => {
    const editToggledAction = {
      type: paymentInfoActions.CNP_PAYMENT_INFORMATION_EDIT_TOGGLED,
    };

    const state = vaProfile(undefined, editToggledAction);

    expect(state.cnpPaymentInformationUiState.isEditing).to.be.true;
  });

  it('saves cnpPaymentInformation', () => {
    const saveAction = {
      type: paymentInfoActions.CNP_PAYMENT_INFORMATION_SAVE_STARTED,
    };

    let state = vaProfile(undefined, saveAction);

    expect(state.cnpPaymentInformationUiState.isSaving).to.be.true;

    const savedAction = {
      type: paymentInfoActions.CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
      response: {
        somethingElse: 'somethingElse',
      },
    };

    state = vaProfile(state, savedAction);

    expect(state.cnpPaymentInformation).to.be.deep.equal(
      savedAction.response,
      'paymentInformation is updated',
    );
  });

  it('fetches eduPaymentInformation', () => {
    const action = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
      response: {
        something: 'something',
      },
    };

    const state = vaProfile(undefined, action);

    expect(state.eduPaymentInformation).to.be.deep.equal(action.response);
  });

  it('toggles the eduPaymentInformation edit view', () => {
    const action = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_EDIT_TOGGLED,
    };

    const state = vaProfile(undefined, action);

    expect(state.eduPaymentInformationUiState.isEditing).to.be.true;
  });

  it('saves eduPaymentInformation', () => {
    const saveStartedAction = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_SAVE_STARTED,
    };

    let state = vaProfile(undefined, saveStartedAction);

    expect(state.eduPaymentInformationUiState.isSaving).to.be.true;

    const saveCompletedAction = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
      response: {
        somethingElse: 'somethingElse',
      },
    };

    state = vaProfile(state, saveCompletedAction);

    expect(state.eduPaymentInformationUiState.isSaving).to.be.false;
  });

  it('handles eduPayment save failures', () => {
    const saveStartedAction = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_SAVE_STARTED,
    };

    let state = vaProfile(undefined, saveStartedAction);

    expect(state.eduPaymentInformationUiState.isSaving).to.be.true;

    const saveFailedAction = {
      type: paymentInfoActions.EDU_PAYMENT_INFORMATION_SAVE_FAILED,
      response: {
        error: 'error',
      },
    };

    state = vaProfile(state, saveFailedAction);

    expect(state.eduPaymentInformationUiState.isSaving).to.be.false;
    expect(state.eduPaymentInformationUiState.responseError).to.deep.equal(
      saveFailedAction.response,
    );
  });
});
