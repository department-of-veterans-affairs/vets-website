import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import * as auth from 'platform/user/authentication/utilities';
import MhvSignIn from '../../containers/MhvSignIn';

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

    // Headings
    expect(
      screen.getByRole('heading', {
        name: /Access My HealtheVet test account/i,
      }),
    ).to.exist;
    expect(
      screen.getByRole('heading', {
        name: /Enter your VA or Oracle Health email/i,
      }),
    ).to.exist;

    // Disclaimer
    expect(
      screen.getByText(
        /By providing your email address you are agreeing to only use My HealtheVet for official VA testing, training, or development purposes\./i,
      ),
    ).to.exist;

    // "Having trouble signing in?" Section
    expect(
      screen.getByRole('heading', { name: /Having trouble signing in\?/i }),
    ).to.exist;
    expect(
      screen.getByText(
        /Contact the administrator who gave you access to your test account\./i,
      ),
    ).to.exist;

    // Email input and button
    expect(screen.getByTestId('mvhemailinput')).to.exist;
    expect(screen.getByTestId('accessMhvBtn')).to.exist;
  });

  //   it('validates email input with allowed and disallowed domains', () => {
  //     const screen = renderInReduxProvider(<MhvSignIn />);
  //     const emailInput = screen.getByTestId('mvhemailinput');

  //     // Invalid email
  //     setInputValue(emailInput, 'test@gmail.com');
  //     const errorContainer = screen.getByTestId('input-error-message');
  //     expect(errorContainer.textContent).to.include(
  //       'Please enter a valid VA or Oracle Health email',
  //     );

  //     // Valid email
  //     setInputValue(emailInput, 'test@va.gov');
  //     expect(screen.queryByTestId('input-error-message')).to.be.null;
  //   });

  it('disables the login button for invalid email and enables for valid email', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    // Invalid email
    setInputValue(emailInput, 'invalid-email');
    expect(loginButton.getAttribute('disabled')).to.equal('true');

    // Empty email
    setInputValue(emailInput, '');
    expect(loginButton.getAttribute('disabled')).to.equal('true');

    // Valid email
    setInputValue(emailInput, 'test@va.gov');
    expect(loginButton.getAttribute('disabled')).to.equal('false');
  });

  it('calls API and login functions on button click with valid email', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    // Valid email
    setInputValue(emailInput, 'test@va.gov');
    fireEvent.click(loginButton);

    // Assert API call
    expect(api.apiRequest.calledOnce).to.be.true;
    expect(api.apiRequest.firstCall.args).to.deep.equal([
      '/something here',
      { method: 'POST' },
    ]);

    // Assert login call
    expect(auth.login.calledOnce).to.be.true;
    expect(auth.login.firstCall.args[0]).to.deep.equal({
      policy: 'mhv',
      queryParams: { operation: 'prod-test-acct' },
    });
  });
});
