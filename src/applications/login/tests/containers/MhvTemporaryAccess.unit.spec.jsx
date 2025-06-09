import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';
import MhvTemporaryAccess from '../../containers/MhvTemporaryAccess';

describe('MhvTemporaryAccess', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox = undefined;
  });

  it('renders main title', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const mainTitle = screen.getByRole('heading', {
      name: /access the my healthevet sign-in option/i,
    });
    expect(mainTitle).to.exist;
  });

  it('renders information paragraph', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const description = screen.getByText(
      /If you received confirmation from VA that we've given you temporary access to My HealtheVet, you can sign in here./i,
    );
    expect(description).to.exist;
  });

  it('renders button and calls login with correct parameters on click', async () => {
    const loginStub = sandbox.stub(authUtilities, 'login');
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const signInHeading = screen.getByRole('heading', { name: /sign in/i });
    expect(signInHeading).to.exist;
    const accessButton = await screen.findByTestId('accessMhvBtn');
    expect(accessButton).to.exist;

    fireEvent.click(accessButton);

    await waitFor(() => {
      sandbox.assert.called(loginStub);
      sandbox.assert.calledWith(loginStub, {
        policy: 'mhv',
        queryParams: { operation: 'mhv_exception' },
      });
    });
    loginStub.restore();
  });

  it('renders update password link with correct parameters on click', async () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const updateHeading = screen.getByRole('heading', {
      name: /Account information and password/i,
    });
    expect(updateHeading).to.exist;
    const accessButton = await screen.findByTestId('updateMhvBtn');
    expect(accessButton).to.exist;

    fireEvent.click(accessButton);
    expect(sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)).to.equal(
      'https://eauth.va.gov/mhv-portal-web/eauth?deeplinking=account-information',
    );
    expect(accessButton.getAttribute('href')).to.contain(
      `https://dev-api.va.gov/v1/sessions/mhv/new?operation=mhv_exception`,
    );
  });

  it('renders recover password link', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const recoverHeading = screen.getByRole('heading', {
      name: /Recover forgotten password/i,
    });
    expect(recoverHeading).to.exist;
    const recoverLink = screen.getByTestId('recoverMhvBtn');
    expect(recoverLink).to.exist;
    expect(recoverLink).to.have.attribute(
      'href',
      'https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/forgot-password?action=new',
    );
  });

  it('renders help and support section', () => {
    const screen = renderInReduxProvider(<MhvTemporaryAccess />);
    const troubleHeading = screen.getByRole('heading', {
      name: /Help and support/i,
    });
    expect(troubleHeading).to.exist;

    const troubleParagraph = screen.getByText(
      /contact the administrator who gave you access to this page/i,
    );
    expect(troubleParagraph).to.exist;
  });
});
