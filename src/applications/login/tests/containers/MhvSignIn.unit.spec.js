import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import * as auth from 'platform/user/authentication/utilities';
import MhvSignIn, { isAllowedEmail } from '../../containers/MhvSignIn';

describe('MhvSignIn Component', () => {
  let sandbox;

  const setInputValue = (e, value) => {
    e.value = value;
    fireEvent(
      e,
      new CustomEvent('input', {
        detail: { value },
        bubbles: true,
      }),
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(api, 'apiRequest').resolves();
    sandbox.stub(auth, 'login');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders all key elements', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);

    expect(
      screen.getByRole('heading', {
        name: /Access My HealtheVet test account/i,
      }),
    ).to.exist;
    expect(
      screen.getByRole('heading', { name: /Having trouble signing in\?/i }),
    ).to.exist;

    expect(
      screen.getByText(
        /My HealtheVet test accounts are available for VA and Oracle Health staff only\./i,
      ),
    ).to.exist;
    expect(
      screen.getByText(
        /By providing your email address you are agreeing to only use My HealtheVet for official VA testing, training, or development purposes\./i,
      ),
    ).to.exist;

    expect(screen.getByTestId('mvhemailinput')).to.exist;
    expect(screen.getByTestId('accessMhvBtn')).to.exist;
  });

  it('validates email input and shows error message after blur event', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');

    setInputValue(emailInput, 'test@gmail.com');
    expect(emailInput.getAttribute('error')).to.be.null;

    fireEvent.blur(emailInput);
    expect(emailInput.getAttribute('error')).to.equal(
      'Please enter a valid VA or Oracle Health email',
    );

    setInputValue(emailInput, 'test@va.gov');
    fireEvent.blur(emailInput);
    expect(emailInput.getAttribute('error')).to.be.null;
  });

  it('disables the login button for invalid email and enables for valid email', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    setInputValue(emailInput, 'invalid-email');
    expect(loginButton.getAttribute('disabled')).to.equal('true');

    setInputValue(emailInput, '');
    expect(loginButton.getAttribute('disabled')).to.equal('true');

    setInputValue(emailInput, 'test@va.gov');
    expect(loginButton.getAttribute('disabled')).to.equal('false');
  });

  it('calls API and login functions on button click with valid email', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    setInputValue(emailInput, 'test@va.gov');
    fireEvent.click(loginButton);

    expect(api.apiRequest.calledOnce).to.be.true;
    expect(api.apiRequest.firstCall.args).to.deep.equal([
      '/v0/test_account_user_email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
    ]);

    expect(auth.login.calledOnce).to.be.true;
    expect(auth.login.firstCall.args[0]).to.deep.equal({
      policy: 'mhv',
      queryParams: { operation: 'prod-test-acct' },
    });
  });

  it('validates email domains using isAllowedEmail', () => {
    const validEmails = ['test@va.gov', 'user@oracle.com'];
    const invalidEmails = [
      'test@gmail.com',
      'user@va',
      'user@oracle',
      '@oracle.com',
    ];

    validEmails.forEach(email => {
      expect(isAllowedEmail(email)).to.be.true;
    });

    invalidEmails.forEach(email => {
      expect(isAllowedEmail(email)).to.be.false;
    });
  });
});
