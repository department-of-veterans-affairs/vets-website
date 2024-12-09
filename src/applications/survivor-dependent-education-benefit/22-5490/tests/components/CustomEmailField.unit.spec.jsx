import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as validations from 'platform/forms/validations';
import CustomEmailField from '../../components/CustomEmailField';

describe('CustomEmailField Component', () => {
  const initialState = {
    form: {
      data: {
        email: 'test@example.com',
        'view:phoneNumbers': {
          mobilePhoneNumber: {
            phone: '123-456-7890',
          },
        },
      },
    },
    data: {
      duplicateEmail: [],
    },
  };
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store;
  let sandbox;
  beforeEach(() => {
    store = mockStore(initialState);
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should render with initial email', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CustomEmailField schema={{ type: 'string' }} uiSchema={{}} />
      </Provider>,
    );
    expect(wrapper.find('EmailWidget').prop('value')).to.equal(
      'test@example.com',
    );
    wrapper.unmount();
  });
  it('should not call fetchDuplicateContactInfo when an invalid email is entered', () => {
    sandbox.stub(validations, 'isValidEmail').returns(false);
    const fetchDuplicateContactInfoSpy = sandbox.spy();

    const wrapper = mount(
      <Provider store={store}>
        <CustomEmailField schema={{ type: 'string' }} uiSchema={{}} />
      </Provider>,
    );
    const invalidEmail = 'invalid-email';
    wrapper
      .find('EmailWidget')
      .props()
      .onChange(invalidEmail);
    expect(fetchDuplicateContactInfoSpy.notCalled).to.be.true;
    wrapper.unmount();
  });
});
