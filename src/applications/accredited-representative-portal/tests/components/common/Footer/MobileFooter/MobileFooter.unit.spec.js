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
  it('renders accordion', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('va-footer-accordion')).to.exist;
  });
  it('renders accredited rep button', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('footer-accredited-reps')).to.exist;
  });
  it('renders veteran programs', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('footer-accredited-reps')).to.exist;
  });
  it('renders logo', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('footer-logo')).to.exist;
  });
});
