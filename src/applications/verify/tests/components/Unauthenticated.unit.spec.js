import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import UnauthenticatedVerify from '../../components/UnauthenticatedVerify';

describe('UnauthenticatedVerify', () => {
  it('renders the UnauthenticatedVerify component', () => {
    const { getByTestId } = renderInReduxProvider(<UnauthenticatedVerify />);
    expect(getByTestId('unauthenticated-verify-app')).to.exist;
  });

  it('displays deprecation notice for My HealtheVet users', () => {
    const { container } = renderInReduxProvider(<UnauthenticatedVerify />);
    expect(container.textContent).to.include(
      'We need you to verify your identity for your',
    );
  });

  it('renders both Login.gov and ID.me buttons', () => {
    const { getByTestId } = renderInReduxProvider(<UnauthenticatedVerify />);
    const buttonGroup = getByTestId('verify-button-group');
    expect(buttonGroup.children.length).to.equal(2);
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
