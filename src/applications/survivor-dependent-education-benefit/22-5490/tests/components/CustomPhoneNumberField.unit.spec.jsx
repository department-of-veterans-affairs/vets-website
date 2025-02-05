import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import CustomPhoneNumberField from '../../components/CustomPhoneNumberField';

describe('CustomPhoneNumberField', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  const initialState = {
    form: {
      data: {
        mobilePhone: {
          phone: '123-867-5309',
        },
        email: 'test@test.com',
      },
    },
    data: {
      duplicatePhone: [],
      duplicateEmail: [],
    },
  };
  let store;
  let wrapper;
  let fetchDuplicateContactInfoSpy;
  let setFormDataSpy;
  let sandbox;

  beforeEach(() => {
    store = mockStore(initialState);
    fetchDuplicateContactInfoSpy = sinon.spy();
    setFormDataSpy = sinon.spy();
    sandbox = sinon.sandbox.create();
    wrapper = mount(
      <Provider store={store}>
        <CustomPhoneNumberField
          schema={{ type: 'string' }}
          uiSchema={{}}
          fetchDuplicateContactInfo={fetchDuplicateContactInfoSpy}
          setFormData={setFormDataSpy}
          mobilePhone={initialState.form.data.mobilePhone}
          duplicateEmail={initialState.data.duplicateEmail}
          formData={initialState.form.data}
        />
      </Provider>,
    );
  });
  afterEach(() => {
    wrapper.unmount();
    sandbox.restore();
  });
  it('should render the PhoneNumberWidget with correct value', () => {
    expect(wrapper.find(PhoneNumberWidget)).to.have.lengthOf(1);
    expect(wrapper.find(PhoneNumberWidget).prop('value')).to.equal(
      '123-867-5309',
    );
  });

  it('should not call fetchDuplicateContactInfo when phone number length <= 9', () => {
    const newPhoneNumber = '987654321';
    wrapper
      .find(PhoneNumberWidget)
      .props()
      .onChange(newPhoneNumber);
    expect(fetchDuplicateContactInfoSpy.notCalled).to.be.true;
  });
});
