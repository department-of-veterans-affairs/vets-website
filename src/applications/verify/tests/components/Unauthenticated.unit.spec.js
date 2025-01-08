import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import * as VerifyUtils from 'platform/user/authentication/components/VerifyButton'; // Spy on verifyHandler
import UnauthenticatedVerify from '../../components/UnauthenticatedVerify';

describe('UnauthenticatedVerify', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox(); // Create a sandbox for each test
  });

  afterEach(() => {
    sandbox.restore(); // Restore the sandbox after each test
  });

  it('renders the UnauthenticatedVerify component', () => {
    const { getByTestId } = renderInReduxProvider(<UnauthenticatedVerify />);
    expect(getByTestId('unauthenticated-verify-app')).to.exist;
  });

  it('displays the introductory message for identity verification', () => {
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    expect(container.textContent).to.include(
      'We need you to verify your identity for your',
    );
    expect(container.textContent).to.include(
      'This step helps us protect all Veterans’ information and prevent scammers from stealing your benefits.',
    );
  });

  it('renders both Login.gov and ID.me buttons', () => {
    const { getByTestId } = renderInReduxProvider(<UnauthenticatedVerify />);
    const buttonGroup = getByTestId('verify-button-group');
    expect(buttonGroup).to.exist;
    expect(buttonGroup.children.length).to.equal(2);
  });

  it('ensures the Login.gov button calls the correct verify handler', () => {
    const verifyHandlerSpy = sandbox.spy(VerifyUtils, 'verifyHandler');
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    const loginGovButton = container.querySelector('.logingov-verify-button');
    expect(loginGovButton).to.exist;

    loginGovButton.click();

    expect(verifyHandlerSpy.calledOnce).to.be.true;
    expect(verifyHandlerSpy.firstCall.args[0]).to.include({
      policy: 'logingov',
    });
    expect(verifyHandlerSpy.firstCall.args[0].queryParams).to.include({
      operation: 'unauthenticated_verify_page',
    });
  });

  it('ensures the ID.me button calls the correct verify handler', () => {
    const verifyHandlerSpy = sandbox.spy(VerifyUtils, 'verifyHandler');
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    const idMeButton = container.querySelector('.idme-verify-button');
    expect(idMeButton).to.exist;

    idMeButton.click();

    expect(verifyHandlerSpy.calledOnce).to.be.true;
    expect(verifyHandlerSpy.firstCall.args[0]).to.include({ policy: 'idme' });
    expect(verifyHandlerSpy.firstCall.args[0].queryParams).to.include({
      operation: 'unauthenticated_verify_page',
    });
  });

  it('includes a link to learn more about verifying identity', () => {
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    const link = container.querySelector(
      'a[href="/resources/verifying-your-identity-on-vagov/"]',
    );
    expect(link).to.exist;
    expect(link.textContent).to.include(
      'Learn more about verifying your identity',
    );
  });

  it('renders the "Verify your identity" heading', () => {
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    const heading = container.querySelector('h1');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Verify your identity');
  });
});
