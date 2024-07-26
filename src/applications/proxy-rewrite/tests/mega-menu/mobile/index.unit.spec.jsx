import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MegaMenu from '../../../partials/mobile/header/mega-menu';

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

    expect(screen.getAllByRole('button')[1].textContent).to.eq(
      'VA Benefits and Health Care',
    );
    expect(screen.getAllByRole('button')[2].textContent).to.eq('About VA');
    expect(screen.getAllByRole('link')[0].textContent).to.eq(
      'Find a VA Location',
    );
    expect(screen.getAllByRole('link')[0].href).to.eq(
      'https://www.va.gov/find-locations',
    );
    expect(screen.getAllByRole('link')[1].textContent).to.eq('Contact us');
    expect(screen.getAllByRole('link')[1].href).to.eq(
      'https://www.va.gov/contact-us/',
    );
  });
});
