import { expect } from 'chai';

import profileReducer from '../../reducers/index';
import * as paymentInfoActions from '../../actions/paymentInformation';

const { vaProfile } = profileReducer;

describe('index reducer', () => {
  it('should fetch hero info', () => {
    const state = vaProfile(
      {},
      {
        type: 'FETCH_HERO_SUCCESS',
        hero: 'heroContent',
      },
    );

    expect(state.hero).to.eql('heroContent');
  });

  it('should fetch personalInformation', () => {
    const state = vaProfile(
      {},
      {
        type: 'FETCH_PERSONAL_INFORMATION_SUCCESS',
        personalInformation: 'personalInformation',
      },
    );

    expect(state.personalInformation).to.eql('personalInformation');
  });

  it('updates payment info and ui state', () => {
    const fetchAction = {
      type: paymentInfoActions.FETCH_PAYMENT_INFORMATION_SUCCESS,
      paymentInformation: {
        something: 'something',
      },
    };

    let state = vaProfile({}, fetchAction);

    expect(state.paymentInformation).to.be.deep.equal(
      fetchAction.paymentInformation,
      'paymentInformation is initialized',
    );

    const editAction = {
      type: paymentInfoActions.SET_PAYMENT_INFO_UI_STATE,
      state: {
        isEditing: true,
      },
    };

    state = vaProfile(state, editAction);

    expect(state.paymentInformationUiState.isEditing).to.be.true;

    const saveAction = {
      type: paymentInfoActions.SAVE_PAYMENT_INFORMATION,
    };

    state = vaProfile(state, saveAction);

    expect(state.paymentInformationUiState.isEditing).to.be.true;
    expect(state.paymentInformationUiState.isSaving).to.be.true;

    const savedAction = {
      type: paymentInfoActions.SAVE_PAYMENT_INFORMATION_SUCCESS,
      paymentInformation: {
        somethingElse: 'somethingElse',
      },
    };

    state = vaProfile(state, savedAction);

    expect(state.paymentInformation).to.be.deep.equal(
      savedAction.paymentInformation,
      'paymentInformation is updated',
    );
  });
});
