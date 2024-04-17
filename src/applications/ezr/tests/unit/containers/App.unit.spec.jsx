import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../../../containers/App';

describe('EZR App', () => {
  const getData = ({ loading = false, loggedIn = false }) => ({
    props: {
      location: { pathname: '/introduction', search: '' },
      children: <h1>Intro</h1>,
    },
    mockStore: {
      getState: () => ({
        featureToggles: {
          loading,
          ezrProdEnabled: true,
        },
        enrollmentStatus: {
          canSubmitFinancialInfo: true,
        },
        form: {
          data: {
            veteranFullName: {
              first: 'Test',
              last: 'Testerson',
            },
          },
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
            loa: { current: loggedIn ? 3 : null },
            dob: '1990-01-01',
            gender: 'M',
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  /*
    This will allow us to intercept the redirect that gets triggered by the components when authentication
    is required.
  */
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: () => {},
          includes: () => {},
        },
        assign: () => {},
        replace: () => {},
      },
      writable: true,
    });
  });

  context('when the user is not authenticated', () => {
    it("should render with the RequiredLoginView's 'va-loading-indicator' component, meaning the user was successfully redirected", () => {
      const { mockStore, props } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="redirect-to-login"]',
      );

      expect(selector).to.exist;
    });
  });

  context('when the user is authenticated', () => {
    it("should render with the EZR 'va-loading-indicator' component, meaning the user was NOT redirected", () => {
      const { mockStore, props } = getData({ loading: true, loggedIn: true });
      const { container } = render(
        <Provider store={mockStore}>
          <App {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="ezr-loading-indicator"]',
      );

      expect(selector).to.exist;
    });
  });
});
