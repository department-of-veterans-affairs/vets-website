import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MegaMenu from '../../../partials/desktop/header/mega-menu';

describe('mega menu - level one links', () => {
  it('should return the correct markup for a dropdown section', () => {
    const megaMenuData = [
      {
        title: 'VA Benefits and Health Care',
        menuSections: [],
      },
      {
        title: 'About VA',
        menuSections: [],
      },
      {
        title: 'Find a VA location',
        href: '/find-locations',
      },
    ];

    const screen = render(<MegaMenu megaMenuData={megaMenuData} />);

    expect(screen.getAllByRole('button')[0].textContent).to.eq(
      'VA Benefits and Health Care',
    );
    expect(screen.getAllByRole('button')[1].textContent).to.eq('About VA');
    expect(screen.getAllByRole('link')[1].textContent).to.eq(
      'Find a VA location',
    );
  });
});
