import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { within } from '@testing-library/dom';

import WiderThanMobileFooter from '../../../../../components/common/Footer/WiderThanMobileFooter/WiderThanMobileFooter';

describe('WiderThanMobileFooter', () => {
  const getWiderThanMobileFooter = () => render(<WiderThanMobileFooter />);

  it('renders footer on screens wider than mobile', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('wider-than-mobile-footer')).to.exist;
  });

  it('renders accredited rep section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    const accreditedRepServices = getByTestId(
      'wider-than-mobile-footer-full-accredited-reps',
    );
    expect(accreditedRepServices).to.exist;
    expect(
      within(accreditedRepServices).getAllByRole('listitem'),
    ).to.have.length(5);
  });

  it('renders veteran programs section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    const veteranServices = getByTestId(
      'wider-than-mobile-footer-full-veteran-programs',
    );
    expect(veteranServices).to.exist;
    expect(within(veteranServices).getAllByRole('listitem')).to.have.length(5);
  });

  it('renders veteran programs more section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    const veteranServices = getByTestId(
      'wider-than-mobile-footer-full-veteran-programs-more',
    );
    expect(veteranServices).to.exist;
    expect(within(veteranServices).getAllByRole('listitem')).to.have.length(5);
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
