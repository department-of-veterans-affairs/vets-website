import React from 'react';
import { expect } from 'chai';

import MobileLogoRow from '../../../../../../components/common/Header/MobileHeader/MobileLogoRow';
import { renderTestApp } from '../../../../helpers';

describe('MobileLogoRow', () => {
  it('should render the logo with correct alt text and source', () => {
    const { getByTestId } = renderTestApp(<MobileLogoRow />);
    const logo = getByTestId('mobile-logo-row-logo');
    expect(logo).to.exist;
    expect(logo.alt).to.eq(
      'VA Accredited Representative Portal Logo, U.S. Department of Veterans Affairs',
    );
    expect(logo.src).to.include('/img/arp-header-logo.png');
  });

  it('should have a link that navigates to the home page', () => {
    const { getByTestId } = renderTestApp(<MobileLogoRow />);
    const link = getByTestId('mobile-logo-row-logo-link');
    expect(link).to.exist;
  });
});
