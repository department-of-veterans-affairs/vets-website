import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Footer from '~/platform/site-wide/representative/components/footer/Footer';

describe('Footer', () => {
  const getFooter = () => render(<Footer />);

  it('renders footer', () => {
    const { getByTestId } = getFooter();
    expect(getByTestId('arp-footer')).to.exist;
  });

  it('renders logo', () => {
    const { getByTestId } = getFooter();
    expect(getByTestId('footer-full-logo')).to.exist;
  });

  it('renders bottom links', () => {
    const { getByTestId } = getFooter();
    expect(getByTestId('footer-full-links-bottom')).to.exist;
  });
});
