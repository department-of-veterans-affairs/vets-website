import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import LandingPage from '../../containers/LandingPage';

describe('LandingPage', () => {
  const getLandingPage = () =>
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

  it('renders main heading', () => {
    const { getByTestId } = getLandingPage();
    expect(getByTestId('landing-page-heading').textContent).to.eq(
      'Welcome to the Accredited Representative Portal',
    );
  });

  it('renders the link to bypass signing in', () => {
    const { getByTestId } = getLandingPage();
    expect(getByTestId('landing-page-bypass-sign-in-link').textContent).to.eq(
      'Until sign in is added use this to see dashboard',
    );
  });

  it('renders the link to sign in', () => {
    const { getByTestId } = getLandingPage();
    expect(getByTestId('landing-page-sign-in-link').textContent).to.eq(
      'Sign in or create account',
    );
  });
});
