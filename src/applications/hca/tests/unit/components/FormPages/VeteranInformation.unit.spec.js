import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VeteranInformation from '../../../../components/FormPages/VeteranInformation';

describe('hca VeteranInformation', () => {
  const authUser = {
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
  };
  const guestUser = {
    login: {
      currentlyLoggedIn: false,
    },
    profile: {},
  };
  const mockData = {
    'view:isLoggedIn': false,
    'view:veteranInformation': {
      veteranFullName: {
        first: 'John',
        middle: 'Marjorie',
        last: 'Smith',
        suffix: 'Sr.',
      },
      veteranDateOfBirth: '1986-01-01',
      veteranSocialSecurityNumber: '211557777',
    },
  };
  const getData = ({ formData = {}, user = {} }) => ({
    props: {
      data: formData,
      goBack: sinon.spy(),
      goForward: sinon.spy(),
    },
    mockStore: {
      getState: () => ({
        form: {
          data: formData,
        },
        user,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the user is logged in', () => {
    it('should render Veteran information from profile', () => {
      const { mockStore, props } = getData({
        user: authUser,
        formData: { ...mockData, 'view:isLoggedIn': true },
      });
      const { container } = render(
        <Provider store={mockStore}>
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

  context('when the user is not logged in', () => {
    it('should render Veteran information from ID form', () => {
      const { mockStore, props } = getData({
        user: guestUser,
        formData: mockData,
      });
      const { container } = render(
        <Provider store={mockStore}>
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

  context('when the `back` button is clicked', () => {
    it('should fire `goBack` method', () => {
      const { mockStore, props } = getData({
        user: guestUser,
        formData: mockData,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VeteranInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-secondary');
      fireEvent.click(selector);
      expect(props.goBack.called).to.be.true;
    });
  });

  context('when the `continue` button is clicked', () => {
    it('should fire `goForward` spy', () => {
      const { mockStore, props } = getData({
        user: guestUser,
        formData: mockData,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VeteranInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.true;
    });
  });
});
