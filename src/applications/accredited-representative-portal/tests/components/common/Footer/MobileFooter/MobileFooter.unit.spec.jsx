import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { within } from '@testing-library/dom';

import MobileFooter from '../../../../../components/common/Footer/MobileFooter/MobileFooter';

describe('MobileFooter', () => {
  const getMobileFooter = () => render(<MobileFooter />);

  it('renders footer on mobile', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer')).to.exist;
  });

  it('renders accordion', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-accordion')).to.exist;
  });

  it('renders accredited rep button', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-accredited-reps-button')).to.exist;
  });

  it('renders accredited rep section', () => {
    const { getByTestId } = getMobileFooter();
    const accreditedRepServices = getByTestId('mobile-footer-accredited-reps');
    expect(accreditedRepServices).to.exist;
    expect(
      within(accreditedRepServices).getAllByRole('listitem'),
    ).to.have.length(5);
  });

  it('renders veteran programs button', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-veteran-programs-button')).to.exist;
  });

  it('renders veteran programs section', () => {
    const { getByTestId } = getMobileFooter();
    const veteranServices = getByTestId('mobile-footer-veteran-programs');
    expect(veteranServices).to.exist;
    expect(within(veteranServices).getAllByRole('listitem')).to.have.length(10);
  });

  it('renders logo', () => {
    const { getByTestId } = getMobileFooter();
    expect(getByTestId('mobile-footer-logo')).to.exist;
  });
});
