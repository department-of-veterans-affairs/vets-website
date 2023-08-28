import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VeteranInformation from '../../../components/FormPages/VeteranInformation';

describe('hca VeteranInformation', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const authData = {
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
  const guestData = {
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {},
    },
  };
  const formData = {
    'view:isLoggedIn': false,
    veteranFullName: {
      first: 'John',
      middle: 'Marjorie',
      last: 'Smith',
      suffix: 'Sr.',
    },
    veteranDateOfBirth: '1986-01-01',
    veteranSocialSecurityNumber: '211557777',
  };
  const defaultProps = {
    data: {
      'view:isLoggedIn': false,
      veteranDateOfBirth: null,
      veteranSocialSecurityNumber: null,
      veteranFullName: {},
    },
    goBack: sinon.spy(),
    goForward: sinon.spy(),
  };

  describe('when the component renders', () => {
    describe('default behavior', () => {
      it('should render form navigation buttons', () => {
        const store = mockStore(guestData);
        const props = { ...defaultProps, data: formData };
        const { container } = render(
          <Provider store={store}>
            <VeteranInformation {...props} />
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

    describe('when the user is logged in', () => {
      it('should render Veteran information from profile', () => {
        const store = mockStore(authData);
        const props = {
          ...defaultProps,
          data: { ...formData, 'view:isLoggedIn': true },
        };
        const { container } = render(
          <Provider store={store}>
            <VeteranInformation {...props} />
          </Provider>,
        );
        const selectors = {
          profile: container.querySelector(
            '[data-testid="hca-veteran-profile-intro"]',
          ),
          guest: container.querySelector(
            '[data-testid="hca-guest-confirm-intro"]',
          ),
        };
        expect(selectors.profile).to.exist;
        expect(selectors.guest).to.not.exist;
      });
    });

    describe('when the user is not logged in', () => {
      it('should render Veteran information from ID form', () => {
        const store = mockStore(guestData);
        const props = { ...defaultProps, data: formData };
        const { container } = render(
          <Provider store={store}>
            <VeteranInformation {...props} />
          </Provider>,
        );
        const selectors = {
          profile: container.querySelector(
            '[data-testid="hca-veteran-profile-intro"]',
          ),
          guest: container.querySelector(
            '[data-testid="hca-guest-confirm-intro"]',
          ),
        };
        expect(selectors.profile).to.not.exist;
        expect(selectors.guest).to.exist;
      });
    });
  });

  describe('when the `back` button is clicked', () => {
    it('should fire `goBack` method', () => {
      const store = mockStore(guestData);
      const props = { ...defaultProps, data: formData };
      const { container } = render(
        <Provider store={store}>
          <VeteranInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-secondary');
      fireEvent.click(selector);
      expect(defaultProps.goBack.called).to.be.true;
    });
  });

  describe('when the `continue` button is clicked', () => {
    it('should fire `goForward` method', () => {
      const store = mockStore(guestData);
      const props = { ...defaultProps, data: formData };
      const { container } = render(
        <Provider store={store}>
          <VeteranInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(defaultProps.goForward.called).to.be.true;
    });
  });
});
