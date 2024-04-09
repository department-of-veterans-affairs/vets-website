import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileLogoRow from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';

describe('WiderThanMobileLogoRow', () => {
  const getWiderThanMobileLogoRow = () => render(<WiderThanMobileLogoRow />);

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
      getByTestId('wider-than-mobile-logo-row-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
