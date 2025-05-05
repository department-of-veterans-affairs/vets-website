import React from 'react';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Verify from '../../components/UnifiedVerify';

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
            profile: {
              verified: false,
              signIn: { serviceName: 'idme' },
            },
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
            profile: {
              verified: false,
              signIn: { serviceName: 'logingov' },
            },
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
  });

  it('shows success message when user is verified', async () => {
    const { container } = renderInReduxProvider(<Verify />, {
      initialState: {
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            verified: true,
            signIn: { serviceName: 'idme' },
          },
        },
      },
    });

    await waitFor(() => {
      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
      expect(alert.textContent).to.include('You’re already verified');
    });
  });
});
