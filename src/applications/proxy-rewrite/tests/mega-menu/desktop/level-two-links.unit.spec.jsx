import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LevelTwoLinks from '../../../partials/desktop/header/mega-menu/level-two-links';
import { headerFooterData } from '../../testing-utilities/header-footer-data';

describe('mega menu - level two links', () => {
  it('should correctly return the benefit hub megamenu given the sectionData', () => {
    const screen = render(
      <LevelTwoLinks
        levelTwoIndexOpen={0}
        sectionData={headerFooterData.megaMenuData[0].menuSections}
        setLevelTwoIndexOpen={() => {}}
      />,
    );

    expect(screen.getAllByRole('button')[0].textContent).to.eq('Health care');
    expect(screen.getAllByRole('button')[2].textContent).to.eq('Disability');
    expect(screen.getAllByRole('button')[4].textContent).to.eq(
      'Education and training',
    );
    expect(screen.getAllByRole('button')[6].textContent).to.eq(
      'Careers and employment',
    );
    expect(screen.getAllByRole('button')[8].textContent).to.eq('Pension');
    expect(screen.getAllByRole('button')[10].textContent).to.eq(
      'Housing assistance',
    );
    expect(screen.getAllByRole('button')[12].textContent).to.eq(
      'Life insurance',
    );
    expect(screen.getAllByRole('button')[14].textContent).to.eq(
      'Burials and memorials',
    );
    expect(screen.getAllByRole('button')[16].textContent).to.eq('Records');
    expect(screen.getByText('Service member benefits')).to.exist;
    expect(screen.getByText('Family member benefits')).to.exist;
  });
});
