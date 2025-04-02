import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersonalInformation from '../../components/PersonalInformation';

describe('PersonalInformation component', () => {
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

  it('renders the PersonalInformation footer', () => {
    expect(<PersonalInformation />);
  });

  it('should render the user full name and formatted date of birth', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <PersonalInformation />
      </Provider>,
    );
    expect(wrapper.text()).to.include('John M Doe');
    expect(wrapper.text()).to.include('Date of birth: January 1, 1990');
    wrapper.unmount();
  });

  it('should render the user full name and formatted date of birth', () => {
    initialState.user.profile.dob = '';
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <PersonalInformation />
      </Provider>,
    );
    expect(wrapper.text()).to.include('John M Doe');
    expect(wrapper.text()).to.include('Date of birth: Not available');
    wrapper.unmount();
  });
});
