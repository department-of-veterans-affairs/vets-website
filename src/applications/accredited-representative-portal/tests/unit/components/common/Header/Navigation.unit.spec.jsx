import React from 'react';
import { expect } from 'chai';

import Navigation from '../../../../../components/common/Header/Navigation';
import { renderTestApp } from '../../../helpers';

describe('Navigation', () => {
  it('should render the mobile logo with correct alt text and source', () => {
    const { getByTestId } = renderTestApp(<Navigation />);
    const logo = getByTestId('mobile-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq('Veteran Affairs logo');
    expect(logo.src).to.include('/img/va.svg');
  });

  it('should render the desktop logo with correct alt text and source', () => {
    const { getByTestId } = renderTestApp(<Navigation />);
    const logo = getByTestId('desktop-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo.png');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderTestApp(<Navigation />);
    const link = getByTestId('nav-home-link');
    expect(link).to.exist;
  });
});
