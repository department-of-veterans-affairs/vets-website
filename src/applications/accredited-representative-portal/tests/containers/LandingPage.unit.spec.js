import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

// import { SIGN_IN_URL } from '../../constants';
import LandingPage from '../../containers/LandingPage';

describe('Landing Page', () => {
  it('renders Landing Page', () => {
    render(<LandingPage />);
  });

  it('renders heading', () => {
    const { getByTestId } = render(<LandingPage />);
    expect(getByTestId('landing-heading').textContent).to.eq(
      'Welcome to the Accredited Representative Portal',
    );
  });

  // it('renders the link to bypass signing in', () => {
  //   const { getByTestId } = render(<LandingPage />);
  //   expect(getByTestId('landing-bypass-sign-in-link')).to.have.attribute(
  //     'href',
  //     '/dashboard',
  //   );
  // });

  it('renders the link to sign in', () => {
    const { getByTestId } = render(<LandingPage />);
    expect(getByTestId('landing-sign-in-link').textContent).to.eq(
      'Sign in or create an account',
    );
    // expect(getByTestId('landing-sign-in-link')).to.have.attribute(
    //   'href',
    //   SIGN_IN_URL,
    // );
  });
});
