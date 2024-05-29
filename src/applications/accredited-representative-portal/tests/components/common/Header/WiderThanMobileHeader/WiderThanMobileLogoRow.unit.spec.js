import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import WiderThanMobileLogoRow from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';

describe('WiderThanMobileLogoRow', () => {
  const getWiderThanMobileLogoRow = () =>
    render(
      <MemoryRouter>
        <WiderThanMobileLogoRow />
      </MemoryRouter>,
    );

  it('renders logo', () => {
    const { getByTestId } = getWiderThanMobileLogoRow();
    expect(getByTestId('wider-than-mobile-logo-row-logo')).to.exist;
  });

  it('renders contact us link', () => {
    const { getByTestId } = getWiderThanMobileLogoRow();
    expect(
      getByTestId('wider-than-mobile-logo-row-contact-us-link').textContent,
    ).to.eq('Contact us');
  });

  it('renders sign in link', () => {
    const { getByTestId } = getWiderThanMobileLogoRow();
    expect(
      getByTestId('user-nav-wider-than-mobile-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
