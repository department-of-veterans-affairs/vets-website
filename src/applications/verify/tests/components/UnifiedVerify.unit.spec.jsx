import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Verify from '../../components/UnifiedVerify';

describe('Verify', () => {
  afterEach(cleanup);

  it('renders the Verify component', () => {
    const { getByTestId } = renderInReduxProvider(<Verify />);
    expect(getByTestId('unauthenticated-verify-app')).to.exist;
  });

  it('displays the "Verify your identity" heading', () => {
    const { container } = renderInReduxProvider(<Verify />);
    const heading = $('h1', container);
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Verify your identity');
  });

  it('displays both Login.gov and ID.me buttons when unauthenticated', () => {
    const { getByTestId } = renderInReduxProvider(<Verify />);
    const buttonGroup = getByTestId('verify-button-group');
    expect(buttonGroup.children.length).to.equal(2);
  });

  context('when a user is authenticated', () => {
    it('displays only the ID.me button when authenticated with ID.me', () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: {
              signIn: { serviceName: 'idme' },
              verified: false,
            },
          },
        },
      });
      const idmeButton = container.querySelector('.idme-verify-button');
      expect(idmeButton).to.exist;

      const logingovButton = container.querySelector('.logingov-verify-button');
      expect(logingovButton).to.not.exist;
    });

    it('displays only the Login.gov button when authenticated with Login.gov', () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: {
              signIn: { serviceName: 'logingov' },
              verified: false,
            },
          },
        },
      });
      const logingovButton = container.querySelector('.logingov-verify-button');
      expect(logingovButton).to.exist;

      const idmeButton = container.querySelector('.idme-verify-button');
      expect(idmeButton).to.not.exist;
    });

    it('displays a success message when user is verified', () => {
      const { container } = renderInReduxProvider(<Verify />, {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
            profile: {
              signIn: { serviceName: 'idme' },
              verified: true,
            },
          },
        },
      });

      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
      expect(alert.innerHTML).to.contain('You’re verified');

      const goToMyVALink = container.querySelector('a[href="/my-va"]');
      expect(goToMyVALink).to.exist;
      expect(goToMyVALink.textContent).to.contain('Go to My VA');

      const buttonGroup = container.querySelector(
        '[data-testid="verify-button-group"]',
      );
      expect(buttonGroup).to.not.exist;
    });
  });
});
