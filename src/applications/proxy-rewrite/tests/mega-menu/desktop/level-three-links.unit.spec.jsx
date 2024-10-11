import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LevelThreeLinks from '../../../partials/desktop/header/mega-menu/level-three-links';
import { headerFooterData } from '../../testing-utilities/header-footer-data';

describe('mega menu - level three links', () => {
  describe('benefit hub links', () => {
    const section = headerFooterData.megaMenuData[0].menuSections[3];

    it('should return the correct markup', () => {
      const screen = render(
        <LevelThreeLinks section={section} aboutVA={false} />,
      );

      const assertData = (index, title, href) => {
        expect(screen.getAllByRole('link')[index].textContent).to.eq(title);
        expect(screen.getAllByRole('link')[index].href).to.eq(href);
      };

      assertData(
        0,
        'View all in careers and employment',
        'https://www.va.gov/careers-employment',
      );
      assertData(
        1,
        'About Veteran Readiness and Employment (VR&E)',
        'https://www.va.gov/careers-employment/vocational-rehabilitation',
      );
      assertData(
        2,
        'How to apply',
        'https://www.va.gov/careers-employment/vocational-rehabilitation/how-to-apply',
      );
      assertData(
        3,
        'Educational and career counseling',
        'https://www.va.gov/careers-employment/education-and-career-counseling',
      );
      assertData(
        4,
        'Veteran-owned small business support',
        'https://www.va.gov/careers-employment/veteran-owned-business-support',
      );
      assertData(
        5,
        'Apply for VR&E benefits',
        'https://www.va.gov/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/',
      );
      assertData(
        6,
        'VA transition assistance',
        'https://www.benefits.va.gov/tap/',
      );
      assertData(7, 'Find a job', 'https://www.dol.gov/veterans/findajob/');
      assertData(8, 'Find VA careers and support', 'https://www.va.gov/jobs/');
      assertData(
        9,
        'Print your civil service preference letter',
        'https://www.va.gov/records/download-va-letters',
      );
      assertData(10, 'VA for Vets', 'https://www.vaforvets.va.gov/');
    });
  });

  describe('about va links', () => {
    const section = headerFooterData.megaMenuData[1].menuSections;

    it('should return the correct markup', () => {
      const screen = render(<LevelThreeLinks section={section} aboutVA />);

      const assertData = (index, title, href) => {
        expect(screen.getAllByRole('link')[index].textContent).to.eq(title);
        expect(screen.getAllByRole('link')[index].href).to.eq(href);
      };

      assertData(
        0,
        'Veterans Health Administration',
        'https://www.va.gov/health',
      );
      assertData(
        1,
        'Veterans Benefits Administration',
        'https://www.benefits.va.gov/benefits/',
      );
      assertData(
        2,
        'National Cemetery Administration',
        'https://www.cem.va.gov/',
      );
      assertData(3, 'VA Leadership', 'https://www.va.gov/opa/bios/index.asp');
      assertData(4, 'Public Affairs', 'https://www.va.gov/OPA/index.asp');
      assertData(
        5,
        'Congressional Affairs',
        'https://www.va.gov/oca/index.asp',
      );
      assertData(
        6,
        'All VA offices and organizations',
        'https://www.va.gov/landing_organizations.htm',
      );
      assertData(7, 'Health research', 'https://www.research.va.gov/');
      assertData(8, 'Public health', 'https://www.publichealth.va.gov/');
      assertData(9, 'VA open data', 'https://www.va.gov/data/');
      assertData(
        10,
        'Veterans analysis and statistics',
        'https://www.va.gov/VETDATA/index.asp',
      );
      assertData(
        11,
        'Appeals modernization',
        'https://www.benefits.va.gov/benefits/appeals.asp',
      );
      assertData(12, 'VA Innovation Center', 'https://www.innovation.va.gov/');
      assertData(13, 'Recovery Act', 'https://www.va.gov/recovery/');
      assertData(14, 'About VA', 'https://www.va.gov/ABOUT_VA/index.asp');
      assertData(
        15,
        'History of VA',
        'https://www.va.gov/about_va/vahistory.asp',
      );
      assertData(
        16,
        'VA plans, budget, finances, and performance',
        'https://www.va.gov/performance/',
      );
      assertData(
        17,
        'National cemetery history program',
        'https://www.cem.va.gov/cem/history/index.asp',
      );
      assertData(
        18,
        'Veterans legacy program',
        'https://www.cem.va.gov/cem/legacy/index.asp',
      );
      assertData(
        19,
        'Volunteer or donate',
        'https://www.volunteer.va.gov/index.asp',
      );
      assertData(
        20,
        'Agency Financial Report',
        'https://www.va.gov/finance/afr/index.asp',
      );
    });
  });
});
