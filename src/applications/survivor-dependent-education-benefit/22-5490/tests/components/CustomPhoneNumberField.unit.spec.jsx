import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import CustomPhoneNumberField from '../../components/CustomPhoneNumberField';

describe('CustomPhoneNumberField', () => {
  const mockStore = configureStore();
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
  beforeEach(() => {
    store = mockStore(initialState);
    // Create spies for the action props
    fetchDuplicateContactInfoSpy = sinon.spy();
    setFormDataSpy = sinon.spy();
    wrapper = mount(
      <Provider store={store}>
        <CustomPhoneNumberField
          schema={{ type: 'string' }}
          uiSchema={{}}
          // Action props
          fetchDuplicateContactInfo={fetchDuplicateContactInfoSpy}
          setFormData={setFormDataSpy}
          // State props
          mobilePhone={initialState.form.data.mobilePhone}
          duplicateEmail={initialState.data.duplicateEmail}
          formData={initialState.form.data}
        />
      </Provider>,
    );
  });
  afterEach(() => {
    wrapper.unmount();
    sinon.restore();
  });
  it('should render the PhoneNumberWidget with correct value', () => {
    expect(wrapper.find(PhoneNumberWidget)).to.have.lengthOf(1);
    expect(wrapper.find(PhoneNumberWidget).prop('value')).to.equal(
      '123-867-5309',
    );
  });
  it('should call setFormData with updated phone number when handleChange is called', () => {
    const newPhoneNumber = '9876543210';
    wrapper
      .find(PhoneNumberWidget)
      .props()
      .onChange(newPhoneNumber);
    expect(setFormDataSpy.calledOnce).to.be.true;
    const expectedFormData = {
      ...initialState.form.data,
      duplicatePhone: [{ value: '', dupe: '' }],
      mobilePhone: {
        ...initialState.form.data.mobilePhone,
        phone: newPhoneNumber,
      },
    };
    expect(setFormDataSpy.calledWith(expectedFormData)).to.be.true;
  });
  it('should call fetchDuplicateContactInfo when phone number length > 9', () => {
    const newPhoneNumber = '9876543210'; // Length is 10
    wrapper
      .find(PhoneNumberWidget)
      .props()
      .onChange(newPhoneNumber);
    expect(fetchDuplicateContactInfoSpy.calledOnce).to.be.true;
    expect(
      fetchDuplicateContactInfoSpy.calledWith(
        initialState.data.duplicateEmail,
        [{ value: newPhoneNumber, dupe: '' }],
      ),
    ).to.be.true;
  });
  it('should not call fetchDuplicateContactInfo when phone number length <= 9', () => {
    const newPhoneNumber = '987654321'; // Length is 9
    wrapper
      .find(PhoneNumberWidget)
      .props()
      .onChange(newPhoneNumber);
    expect(fetchDuplicateContactInfoSpy.notCalled).to.be.true;
  });
});
