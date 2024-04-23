import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import MobileLogoRow from '../../../../../components/common/Header/MobileHeader/MobileLogoRow';

describe('MobileLogoRow', () => {
  const getMobileLogoRow = () => render(<MobileLogoRow />);

  it('renders logo', () => {
    const { getByTestId } = getMobileLogoRow();
    expect(getByTestId('mobile-logo-row-logo')).to.exist;
  });

  it('renders sign in link', () => {
    const { getByTestId } = getMobileLogoRow();
    expect(getByTestId('mobile-logo-row-sign-in-link').textContent).to.eq(
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
