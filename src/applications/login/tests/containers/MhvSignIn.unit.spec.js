import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import * as auth from 'platform/user/authentication/utilities';
import MhvSignIn from '../../containers/MhvSignIn';

describe('MhvSignIn Component', () => {
  // afterEach(() => {
  //   sinon.restore();
  // });

  it('renders the heading and description', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
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

  it('renders email input and validates email with allowed domains', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');

    fireEvent.input(emailInput, { detail: { value: 'test@va.gov' } });
    expect(emailInput).to.have.value('test@va.gov');
    expect(
      screen.queryByText(/Please enter a valid VA or Oracle Health email/i),
    ).to.not.exist;

    fireEvent.input(emailInput, { detail: { value: 'test@gmail.com' } });
    expect(emailInput).to.have.value('test@gmail.com');
    expect(screen.getByText(/Please enter a valid VA or Oracle Health email/i))
      .to.exist;
  });

  it('renders the login button and calls handleButtonClick', () => {
    const apiRequestStub = sinon.stub(api, 'apiRequest').resolves();
    const loginStub = sinon.stub(auth, 'login');

    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    fireEvent.input(emailInput, { detail: { value: 'test@va.gov' } });
    expect(loginButton).to.not.have.attribute('disabled');

    fireEvent.click(loginButton);
    expect(apiRequestStub.calledOnce).to.be.true;
    expect(
      loginStub.calledOnceWith({
        policy: 'mhv',
        queryParams: { operation: 'prod-test-acct' },
      }),
    ).to.be.true;
  });

  it('disables the login button for invalid email', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    const loginButton = screen.getByTestId('accessMhvBtn');

    fireEvent.input(emailInput, { detail: { value: 'invalid-email' } });
    expect(loginButton).to.have.attribute('disabled');
  });

  it('renders the disclaimer', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    expect(
      screen.getByText(
        /By providing your email address you are agreeing to only use My HealtheVet for official VA testing, training, or development purposes\./i,
      ),
    ).to.exist;
  });

  it('renders the "Having trouble signing in?" section', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
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
