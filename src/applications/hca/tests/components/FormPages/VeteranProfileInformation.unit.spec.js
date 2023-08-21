import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import VeteranProfileInformation from '../../../components/FormPages/VeteranProfileInformation';
import { normalizeFullName } from '../../../utils/helpers';

describe('hca VeteranProfileInformation', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const defaultData = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        userFullName: {
          first: 'John',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    },
  };

  describe('when the component renders', () => {
    it('should render full name from the user profile', () => {
      const store = mockStore(defaultData);
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-veteran-fullname"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        normalizeFullName(defaultData.user.profile.userFullName, true),
      );
    });

    it('should render form navigation buttons', () => {
      const store = mockStore(defaultData);
      const props = { goBack: () => {}, goForward: () => {} };
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation {...props} />
        </Provider>,
      );
      const formNav = {
        back: container.querySelector('.usa-button-secondary'),
        continue: container.querySelector('.usa-button-primary'),
      };
      expect(formNav.back).to.exist;
      expect(formNav.continue).to.exist;
    });
  });

  describe('when date of birth is not in the profile data', () => {
    const store = mockStore(defaultData);

    it('should only reference `name` in the opening paragraph', () => {
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-veteran-profile-intro"]',
      );
      expect(selector).to.contain.text(
        'Here’s the name we have on file for you.',
      );
    });

    it('should not render date of birth container', () => {
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-veteran-dob"]',
      );
      expect(selector).to.not.exist;
    });
  });

  describe('when date of birth is in the profile data', () => {
    const data = {
      ...defaultData,
      user: {
        ...defaultData.user,
        profile: {
          ...defaultData.user.profile,
          dob: '1990-11-24',
        },
      },
    };
    const store = mockStore(data);

    it('should reference `personal information` in the opening paragraph', () => {
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-veteran-profile-intro"]',
      );
      expect(selector).to.contain.text(
        'This is the personal information we have on file for you.',
      );
    });

    it('should render date of birth container', () => {
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-veteran-dob"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('November 24, 1990');
    });
  });
});
