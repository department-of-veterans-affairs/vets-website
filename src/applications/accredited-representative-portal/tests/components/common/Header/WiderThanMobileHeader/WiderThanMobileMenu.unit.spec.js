import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import WiderThanMobileMenu from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileMenu';

describe('WiderThanMobileMenu', () => {
  const getWiderThanMobileMenu = () => render(<WiderThanMobileMenu />);

  it('renders about button', () => {
    const { getByTestId } = getWiderThanMobileMenu();
    expect(
      getByTestId('wider-than-mobile-menu-about-button').textContent,
    ).to.eq('About');
  });

  it('renders Power of attorney link', () => {
    const { getByTestId } = getWiderThanMobileMenu();
    expect(getByTestId('wider-than-mobile-menu-poa-link').textContent).to.eq(
      'Power of attorney',
    );
  });

  it('renders accreditation button', () => {
    const { getByTestId } = getWiderThanMobileMenu();
    expect(
      getByTestId('wider-than-mobile-menu-accreditation-button').textContent,
    ).to.eq('Accreditation');
  });

  it('renders resources button', () => {
    const { getByTestId } = getWiderThanMobileMenu();
    expect(
      getByTestId('wider-than-mobile-menu-resources-button').textContent,
    ).to.eq('Resources');
  });
});
