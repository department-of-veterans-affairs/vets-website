import React from 'react';
import { expect } from 'chai';
import { cleanup, render, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Verify from '../../components/UnifiedVerify';

const mockStore = configureStore([]);

describe('Verify', () => {
  afterEach(cleanup);

  it('renders the Verify component', async () => {
    const { getByTestId } = renderInReduxProvider(<Verify />);
    await waitFor(
      () => expect(getByTestId('unauthenticated-verify-app')).to.exist,
    );
  });

  it('displays the "Verify your identity" heading', async () => {
    const { container } = renderInReduxProvider(<Verify />);
    await waitFor(() => {
      const heading = $('h1', container);
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Verify your identity');
    });
  });

  it('displays both Login.gov and ID.me buttons when unauthenticated', async () => {
    const { getByTestId } = renderInReduxProvider(<Verify />);
    await waitFor(() => {
      const buttonGroup = getByTestId('verify-button-group');
      expect(buttonGroup.children.length).to.equal(2);
    });
  });

  context('when a user is authenticated', () => {
    it('displays only the ID.me button when authenticated with ID.me', async () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: { verified: false, signIn: { serviceName: 'idme' } },
          },
        },
      });

      await waitFor(() => {
        const idmeButton = container.querySelector('.idme-verify-button');
        const logingovButton = container.querySelector(
          '.logingov-verify-button',
        );
        expect(idmeButton).to.exist;
        expect(logingovButton).to.not.exist;
      });
    });

    it('displays only the Login.gov button when authenticated with Login.gov', async () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: { verified: false, signIn: { serviceName: 'logingov' } },
          },
        },
      });

      await waitFor(() => {
        const logingovButton = container.querySelector(
          '.logingov-verify-button',
        );
        const idmeButton = container.querySelector('.idme-verify-button');
        expect(logingovButton).to.exist;
        expect(idmeButton).to.not.exist;
      });
    });

    it('shows success alert with link when already verified', async () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: { verified: true, signIn: { serviceName: 'idme' } },
          },
        },
      });

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('You’re already verified');

        const link = container.querySelector('a[href="/my-va"]');
        expect(link).to.exist;
      });
    });

    it('shows "Redirecting..." message after verification completes', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: false, signIn: { serviceName: 'idme' } },
        },
      };

      const store = mockStore(initialState);

      const { rerender, getByText } = render(
        <Provider store={store}>
          <Verify />
        </Provider>,
      );

      // Wait for loading to clear
      await act(() => new Promise(resolve => setTimeout(resolve, 150)));

      // Update to verified = true to simulate completion
      const updatedState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: true, signIn: { serviceName: 'idme' } },
        },
      };

      const newStore = mockStore(updatedState);

      rerender(
        <Provider store={newStore}>
          <Verify />
        </Provider>,
      );

      await waitFor(() => {
        expect(getByText(/Redirecting you to My VA/i)).to.exist;
      });
    });
    it('redirects to My VA after verification is completed', async () => {
      const initialState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            verified: false,
            signIn: { serviceName: 'idme' },
          },
        },
      };

      const store = mockStore(initialState);

      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      const { rerender } = render(
        <Provider store={store}>
          <Verify />
        </Provider>,
      );

      await act(() => new Promise(resolve => setTimeout(resolve, 150)));

      const updatedState = {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: true, signIn: { serviceName: 'idme' } },
        },
      };

      const newStore = mockStore(updatedState);

      rerender(
        <Provider store={newStore}>
          <Verify />
        </Provider>,
      );

      await waitFor(
        () => {
          expect(window.location.href).to.equal('/my-va');
        },
        { timeout: 2500 },
      );

      window.location = originalLocation;
    });
  });
});
