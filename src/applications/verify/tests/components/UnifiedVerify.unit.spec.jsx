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
    await waitFor(() => {
      expect(getByTestId('unauthenticated-verify-app')).to.exist;
    });
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
    const { getByTestId } = renderInReduxProvider(<Verify />, {
      initialState: {
        user: {
          login: { currentlyLoggedIn: false },
          profile: { verified: false },
        },
      },
    });

    await waitFor(() => {
      const buttonGroup = getByTestId('verify-button-group');
      expect(buttonGroup.children.length).to.equal(2);
    });
  });

  context('when a user is authenticated', () => {
    it('shows only the ID.me button', async () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: { verified: false, signIn: { serviceName: 'idme' } },
          },
        },
      });

      await waitFor(() => {
        expect(container.querySelector('.idme-verify-button')).to.exist;
        expect(container.querySelector('.logingov-verify-button')).to.not.exist;
      });
    });

    it('shows only the Login.gov button', async () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: { verified: false, signIn: { serviceName: 'logingov' } },
          },
        },
      });

      await waitFor(() => {
        expect(container.querySelector('.logingov-verify-button')).to.exist;
        expect(container.querySelector('.idme-verify-button')).to.not.exist;
      });
    });

    it('shows success alert and link when already verified', async () => {
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
        expect(alert.textContent).to.include('You’re verified');
        expect(container.querySelector('a[href="/my-va"]')).to.exist;
      });
    });
  });
});
