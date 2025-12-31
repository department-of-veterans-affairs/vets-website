import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { App } from '../../containers/App';
import { createMockStore, createMockLocation } from '../helpers/test-helpers';

describe('App', () => {
  it('should render', () => {
    const mockStore = createMockStore();
    const location = createMockLocation();
    const { container } = render(
      // @ts-expect-error - react-redux Provider has React type version mismatch
      <Provider store={mockStore as any}>
        <App location={location}>Test content</App>
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should show loading indicator when debt is pending and user is logged in', () => {
    const mockStore = createMockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          verified: true,
        },
      },
      availableDebts: {
        isDebtPending: true,
        availableDebts: [],
        isDebtError: false,
        debtError: '',
      },
    });
    const location = createMockLocation();
    const { container } = render(
      // @ts-expect-error - react-redux Provider has React type version mismatch
      <Provider store={mockStore as any}>
        <App location={location}>Test content</App>
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator?.getAttribute('message')).to.equal('Loading application...');
  });

  it('should render children when not loading', () => {
    const mockStore = createMockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          verified: true,
        },
      },
      availableDebts: {
        isDebtPending: false,
        availableDebts: [],
        isDebtError: false,
        debtError: '',
      },
    });
    const location = createMockLocation();
    const { getByText } = render(
      // @ts-expect-error - react-redux Provider has React type version mismatch in test environment
      <Provider store={mockStore as any}>
        <App location={location}>Test content</App>
      </Provider>,
    );

    expect(getByText('Test content')).to.exist;
  });
});
