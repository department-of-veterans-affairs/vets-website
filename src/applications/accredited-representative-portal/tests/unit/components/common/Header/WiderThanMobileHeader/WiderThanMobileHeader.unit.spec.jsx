import React from 'react';
import { expect } from 'chai';

import WiderThanMobileLogoRow from '../../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';
import { renderTestApp } from '../../../../helpers';

describe('WiderThanMobileLogoRow', () => {
  it('renders logo', () => {
    const { getByTestId } = renderTestApp(<WiderThanMobileLogoRow />);
    expect(getByTestId('wider-than-mobile-logo-row-logo')).to.exist;
  });

  it('renders sign in link', () => {
    const { getByTestId } = renderTestApp(<WiderThanMobileLogoRow />);
    expect(
      getByTestId('user-nav-wider-than-mobile-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
