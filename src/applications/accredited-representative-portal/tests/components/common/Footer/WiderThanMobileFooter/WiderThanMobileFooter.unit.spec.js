import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileFooter from '../../../../../components/common/Footer/WiderThanMobileFooter/WiderThanMobileFooter';

describe('WiderThanMobileFooter', () => {
  const getWiderThanMobileFooter = () => render(<WiderThanMobileFooter />);

  it('renders footer on mobile', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('wider-than-mobile-footer')).to.exist;
  });
  it('renders accredited rep section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-accredited-reps')).to.exist;
  });
  it('renders veteran programs section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-veteran-services')).to.exist;
  });
  it('renders veteran programs more section', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-veteran-services-more')).to.exist;
  });
  it('renders crisis line call to action', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-crisis-line')).to.exist;
  });
  it('renders logo', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-logo')).to.exist;
  });
  it('renders bottom links', () => {
    const { getByTestId } = getWiderThanMobileFooter();
    expect(getByTestId('footer-full-links-bottom')).to.exist;
  });
});
