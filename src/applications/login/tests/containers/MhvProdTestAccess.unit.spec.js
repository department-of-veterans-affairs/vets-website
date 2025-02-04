import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import MhvProdTestAccess from '../../containers/MhvProdTestAccess';

describe('MhvProdTestAccess Component', () => {
  it('renders the heading and description', () => {
    const screen = renderInReduxProvider(<MhvProdTestAccess />);
    expect(
      screen.getByRole('heading', {
        name: /Access My HealtheVet test account/i,
      }),
    ).to.exist;
    expect(
      screen.getByText(
        /My HealtheVet test accounts are available for VA and Oracle Health staff only\./i,
      ),
    ).to.exist;
  });

  it('renders email input and validates email with allowed domains', async () => {
    const screen = render(<MhvProdTestAccess />);
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
    const screen = renderInReduxProvider(<MhvProdTestAccess />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    emailInput.value = 'test@va.gov';
    fireEvent.input(emailInput, { detail: { value: 'test@va.gov' } });
    expect(loginButton.getAttribute('disabled')).to.eql('false');

    fireEvent.click(loginButton);
  });

  it('disables the login button for invalid email', () => {
    const screen = renderInReduxProvider(<MhvProdTestAccess />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    emailInput.value = 'invalid-email';
    fireEvent.input(emailInput, { detail: { value: 'invalid-email' } });
    expect(loginButton.getAttribute('disabled')).to.eql('true');
  });

  it('renders the "Having trouble signing in?" section', () => {
    const screen = renderInReduxProvider(<MhvProdTestAccess />);
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
