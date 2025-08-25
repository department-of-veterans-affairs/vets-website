import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersonalInformation from '../../components/PersonalInformation';

describe('PersonalInformation component', () => {
  const mockStore = configureStore();

  const validName = {
    first: 'John',
    middle: 'M',
    last: 'Doe',
  };

  const validProfile = {
    userFullName: validName,
    dob: '1990-01-01',
  };

  const createWrapper = profile => {
    const store = mockStore({ user: { profile } });
    return mount(
      <Provider store={store}>
        <PersonalInformation />
      </Provider>,
    );
  };

  const expectAlertWithMessage = wrapper => {
    expect(wrapper.find('va-alert').exists()).to.be.true;
    expect(wrapper.text()).to.include('Personal Information Not Available');
    expect(wrapper.text()).to.include('VA.gov profile');
    wrapper.unmount();
  };

  describe('when all data is present', () => {
    it('renders complete profile information correctly', () => {
      const wrapper = createWrapper(validProfile);

      expect(wrapper.find('.usa-alert.background-color-only').exists()).to.be
        .true;
      expect(
        wrapper.find('.usa-alert.background-color-only').text(),
      ).to.include('Your personal information');
      expect(wrapper.find('.personal-info-border').exists()).to.be.true;
      expect(wrapper.find('.personal-info-border').text()).to.include(
        'John M Doe',
      );
      expect(wrapper.find('.personal-info-border').text()).to.include(
        'Date of birth: January 1, 1990',
      );

      wrapper.unmount();
    });
  });

  describe('when data is missing', () => {
    const testCases = [
      {
        name: 'missing first name',
        profile: {
          userFullName: { ...validName, first: '' },
          dob: '1990-01-01',
        },
      },
      {
        name: 'missing last name',
        profile: {
          userFullName: { ...validName, last: '' },
          dob: '1990-01-01',
        },
      },
      {
        name: 'missing DOB',
        profile: {
          userFullName: validName,
          dob: '',
        },
      },
      {
        name: 'undefined profile',
        profile: undefined,
      },
      {
        name: 'null profile',
        profile: null,
      },
      {
        name: 'missing userFullName',
        profile: {
          dob: '1990-01-01',
        },
      },
    ];

    testCases.forEach(({ name, profile }) => {
      it(`shows alert when ${name}`, () => {
        const wrapper = createWrapper(profile);
        expectAlertWithMessage(wrapper);
      });
    });
  });

  describe('alert message rendering', () => {
    it('includes correct status and content', () => {
      const wrapper = createWrapper({
        userFullName: { first: '', last: '' },
        dob: '',
      });

      const alert = wrapper.find('va-alert');
      expect(alert.prop('status')).to.equal('info');
      expect(wrapper.find('h3[slot="headline"]').text()).to.equal(
        'Personal Information Not Available',
      );
      expect(wrapper.find('a[href="/profile"]').text()).to.equal(
        'VA.gov profile',
      );

      wrapper.unmount();
    });
  });
});
