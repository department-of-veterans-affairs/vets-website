import React from 'react';
import { expect } from 'chai';

import Navigation from '../../../../../../components/common/Header/Navigation';
import { renderTestApp } from '../../../../helpers';

describe('Navigation', () => {
  it('should render the logo with correct alt text and source', () => {
    const { getByTestId } = renderTestApp(<Navigation />);
    const logo = getByTestId('mobile-logo-row-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo.png');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderTestApp(<Navigation />);
    const link = getByTestId('mobile-logo-row-logo-link');
    expect(link).to.exist;
  });
});
