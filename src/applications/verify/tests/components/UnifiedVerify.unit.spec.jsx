import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import * as selectors from 'platform/user/authentication/selectors';
import { $, fixSelector } from 'platform/forms-system/src/js/utilities/ui';
import Verify from '../../components/UnifiedVerify';

describe('Verify', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    window.localStorage.clear();
  });

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

  it('displays only the ID.me button when authenticated with ID.me', () => {
    sandbox.stub(selectors, 'isAuthenticatedWithOAuth').returns(true);
    sandbox.stub(selectors, 'signInServiceName').returns('idme');

    const { container } = renderInReduxProvider(<Verify />);
    const idmeButton = $(fixSelector('.idme-verify-button'), container);
    expect(idmeButton).to.exist;

    const logingovButton = $(fixSelector('.logingov-verify-button'), container);
    expect(logingovButton).to.not.exist;
  });

  it('displays only the Login.gov button when authenticated with Login.gov', () => {
    sandbox.stub(selectors, 'isAuthenticatedWithOAuth').returns(true);
    sandbox.stub(selectors, 'signInServiceName').returns('logingov');

    const { container } = renderInReduxProvider(<Verify />);
    const logingovButton = $(fixSelector('.logingov-verify-button'), container);
    expect(logingovButton).to.exist;

    const idmeButton = $(fixSelector('.idme-verify-button'), container);
    expect(idmeButton).to.not.exist;
  });

  it('includes a link to learn more about verifying identity', () => {
    const { container } = renderInReduxProvider(<Verify />);
    const link = $(
      'a[href="/resources/verifying-your-identity-on-vagov/"]',
      container,
    );
    expect(link).to.exist;
    expect(link.textContent).to.include(
      'Learn more about verifying your identity',
    );
  });
});
