import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileFooter from '../../../../../components/common/Footer/WiderThanMobileFooter/WiderThanMobileFooter';

describe('WiderThanMobileFooter', () => {
  const getWiderThanMobileFooter = () => render(<WiderThanMobileFooter />);

  it('renders footer on screens wider than mobile', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('wider-than-mobile-footer')).to.exist;
  });

  it('renders logo', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('wider-than-mobile-footer-full-logo')).to.exist;
  });

  it('renders bottom links', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('wider-than-mobile-footer-full-links-bottom')).to.exist;
  });
});
