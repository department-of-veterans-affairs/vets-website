import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CustomPhoneNumberField from '../../components/CustomPhoneNumberField';

const initialState = {
  user: {
    profile: {
      userFullName: {
        first: 'Michael',
        middle: 'Thomas',
        last: 'Wazowski',
        suffix: 'Esq.',
      },
      dob: '1990-02-03',
    },
  },
  form: {
    data: {
      mobilePhone: '123-867-5309',
      email: 'test@test.com',
    },
  },
  data: {
    duplicatePhone: [],
    duplicateEmail: [],
    formData: {
      data: {
        attributes: {
          claimant: {
            firstName: 'john',
            middleName: 'doe',
            lastName: 'smith',
            dateOfBirth: '1990-01-01',
          },
        },
      },
    },
  },
  schema: {
    type: 'number',
  },
  options: {
    inputType: 'number',
  },
};

describe('CustomPhoneNumberField', () => {
  const mockStore = configureStore();
  const store = mockStore(initialState);

  xit('should render with data', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CustomPhoneNumberField />
      </Provider>,
    );
    expect(wrapper.text()).to.include('John M Doe');
  });
});
