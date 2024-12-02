import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ApplicantIdentityView from '../../../components/ApplicantIdentityView';

describe('ApplicantIdentityView', () => {
  const mockStore = configureStore();
  const initialState = {
    user: {
      profile: {
        userFullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        },
        dob: '1990-01-01',
      },
    },
  };
  it('should render the user full name and formatted date of birth', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ApplicantIdentityView />
      </Provider>,
    );
    expect(wrapper.text()).to.include('John M Doe');
    expect(wrapper.text()).to.include('Date of birth: January 1st, 1990');
    wrapper.unmount();
  });
  it('should render the paragraph content correctly', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ApplicantIdentityView />
      </Provider>,
    );
    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.equal(
      'We have this personal information on file for you. Any updates you make will change the information for your education benefits only. If you want to update your personal information for other VA benefits, update your information on your profile.',
    );
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain(
      'If you want to request that we change your name or date of birth, you will need to send additional information. Learn more on how to change your legal name on file with VA.',
    );
    wrapper.unmount();
  });
});
