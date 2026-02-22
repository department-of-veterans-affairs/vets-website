import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import ProdTestAccess from '../../containers/ProdTestAccess';

describe('ProdTestAccess Component', () => {
  it('renders the heading and description', () => {
    const screen = renderInReduxProvider(<ProdTestAccess />);
    expect(
      screen.getByRole('heading', {
        name: /Access production test account/i,
      }),
    ).to.exist;
    expect(
      screen.getByText(
        /production test accounts are available for VA and Oracle Health staff only\./i,
      ),
    ).to.exist;
  });

  it('renders email input and validates email with allowed domains', async () => {
    const screen = renderInReduxProvider(<ProdTestAccess />, {
      initialState: {
        featureToggles: {
          [TOGGLE_NAMES.identityIal2FullEnforcement]: false,
        },
      },
    });
    const emailInput = screen.getByTestId('mvhemailinput');

    emailInput.value = 'test@va.gov';

    fireEvent.input(emailInput, { detail: { value: 'test@va.gov' } });
    expect(
      screen.queryByText(/Please enter a valid VA or Oracle Health email/i),
    ).to.not.exist;

    emailInput.value = 'test@gmail.com';
    fireEvent.input(emailInput, { detail: { value: 'test@gmail.com' } });
    expect(emailInput.getAttribute('error')).to.eql(
      'Please enter a valid VA or Oracle Health email',
    );
  });

  it('renders the login button and calls handleButtonClick', () => {
    const screen = renderInReduxProvider(<ProdTestAccess />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    emailInput.value = 'test@va.gov';
    fireEvent.input(emailInput, { detail: { value: 'test@va.gov' } });
    expect(loginButton.getAttribute('disabled')).to.eql('false');

    fireEvent.click(loginButton);
  });

  it('disables the login button for invalid email', () => {
    const screen = renderInReduxProvider(<ProdTestAccess />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    emailInput.value = 'invalid-email';
    fireEvent.input(emailInput, { detail: { value: 'invalid-email' } });
    expect(loginButton.getAttribute('disabled')).to.eql('true');
  });

  it('renders the "Having trouble signing in?" section', () => {
    const screen = renderInReduxProvider(<ProdTestAccess />);
    expect(
      screen.getByRole('heading', { name: /Having trouble signing in\?/i }),
    ).to.exist;
    expect(
      screen.getByText(
        /Contact the administrator who gave you access to your test account\./i,
      ),
    ).to.exist;
  });
});
