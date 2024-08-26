import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import MobileFooter from '../../../../../components/common/Footer/MobileFooter/MobileFooter';

describe('MobileFooter', () => {
  const getMobileFooter = () => render(<MobileFooter />);

  it('renders footer on mobile', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer')).to.exist;
  });

  it('renders logo', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-logo')).to.exist;
  });

  it('renders bottom links', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-full-links-bottom')).to.exist;
  });
});
