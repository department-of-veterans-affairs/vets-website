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

  it('fetches paymentInformation', () => {
    const fetchAction = {
      type: paymentInfoActions.PAYMENT_INFORMATION_FETCH_SUCCEEDED,
      response: {
        something: 'something',
      },
    };

    const state = vaProfile(undefined, fetchAction);

    expect(state.paymentInformation).to.be.deep.equal(
      fetchAction.response,
      'paymentInformation is initialized',
    );
  });

  it('opens the paymentInformation-edit modal', () => {
    const modalOpenAction = {
      type: paymentInfoActions.PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED,
    };

    const state = vaProfile(undefined, modalOpenAction);

    expect(state.paymentInformationUiState.isEditing).to.be.true;
  });

  it('saves paymentInformation', () => {
    const saveAction = {
      type: paymentInfoActions.PAYMENT_INFORMATION_SAVE_STARTED,
    };

    let state = vaProfile(undefined, saveAction);

    expect(state.paymentInformationUiState.isSaving).to.be.true;

    const savedAction = {
      type: paymentInfoActions.PAYMENT_INFORMATION_SAVE_SUCCEEDED,
      response: {
        somethingElse: 'somethingElse',
      },
    };

    state = vaProfile(state, savedAction);

    expect(state.paymentInformation).to.be.deep.equal(
      savedAction.response,
      'paymentInformation is updated',
    );
  });
});
