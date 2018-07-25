import { expect } from 'chai';

import profileReducer from '../../reducers/index';

const { vaProfile } = profileReducer;

describe('index reducer', () => {
  it('should fetch hero info', () => {
    const state = vaProfile({}, {
      type: 'FETCH_HERO_SUCCESS',
      hero: 'heroContent',
    });

    expect(state.hero).to.eql('heroContent');
  });

  it('should fetch personalInformation', () => {
    const state = vaProfile({}, {
      type: 'FETCH_PERSONAL_INFORMATION_SUCCESS',
      personalInformation: 'personalInformation',
    });

    expect(state.personalInformation).to.eql('personalInformation');
  });

  it('should update profile form fields', () => {
    const state = vaProfile({}, {
      type: 'UPDATE_PROFILE_FORM_FIELD',
      field: 'fieldName',
      newState: {
        fieldValue: 'value'
      }
    });

    expect(state.formFields.fieldName).to.eql({
      fieldValue: 'value'
    });
  });

  it('should open modal', () => {
    const state = vaProfile({}, {
      type: 'OPEN_MODAL',
      modal: 'modalName'
    });

    expect(state.modal).to.eql('modalName');
  });

  it('should close modal', () => {
    const state = vaProfile({}, {
      type: 'VET360_TRANSACTION_REQUEST_SUCCEEDED',
    });

    expect(state.modal).to.eql(null);
  });
});
