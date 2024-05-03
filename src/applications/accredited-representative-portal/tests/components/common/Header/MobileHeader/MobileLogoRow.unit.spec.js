import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import MobileLogoRow from '../../../../../components/common/Header/MobileHeader/MobileLogoRow';

describe('MobileLogoRow', () => {
  const getMobileLogoRow = () =>
    render(
      <MemoryRouter>
        <MobileLogoRow />
      </MemoryRouter>,
    );

  it('renders logo', () => {
    const { getByTestId } = getMobileLogoRow();
    expect(getByTestId('mobile-logo-row-logo')).to.exist;
  });

  it('renders sign in link', () => {
    const { getByTestId } = getMobileLogoRow();
    expect(getByTestId('user-nav-mobile-sign-in-link').textContent).to.eq(
      'Sign in',
    );
  });

  it('renders menu button', () => {
    const { getByTestId } = getMobileLogoRow();
    expect(getByTestId('mobile-logo-row-menu-button').textContent).to.eq(
      'Menu',
    );
  });
});
