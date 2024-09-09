import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DesktopFooter from '../../../partials/desktop/footer';
import { headerFooterData } from '../../testing-utilities/header-footer-data';

describe('DesktopFooter', () => {
  it('should render the markup correctly', () => {
    const screen = render(
      <DesktopFooter footerData={headerFooterData.footerData} />,
    );

    const assertData = (index, title, href) => {
      expect(screen.getAllByRole('link')[index].textContent).to.eq(title);
      expect(screen.getAllByRole('link')[index].href).to.eq(href);
    };

    assertData(0, 'Homeless Veterans', 'https://www.va.gov/homeless/');
    assertData(1, 'Women Veterans', 'https://www.va.gov/womenvet/');
    assertData(
      2,
      'Minority Veterans',
      'https://www.va.gov/centerforminorityveterans/',
    );
    assertData(3, 'LGBTQ+ Veterans', 'https://www.patientcare.va.gov/lgbt/');
    assertData(4, 'PTSD', 'https://www.ptsd.va.gov/');
    assertData(5, 'Mental health', 'https://www.mentalhealth.va.gov/');
    assertData(
      6,
      'Adaptive sports and special events',
      'https://department.va.gov/veteran-sports/',
    );
    assertData(
      7,
      'VA outreach events',
      'https://www.va.gov/outreach-and-events/events/',
    );
    assertData(8, 'National Resource Directory', 'https://www.nrd.gov/');
    assertData(9, 'VA forms', 'https://www.va.gov/find-forms/');
    assertData(
      10,
      'VA health care access and quality',
      'https://www.accesstocare.va.gov/',
    );
    assertData(
      11,
      'Get help from an accredited representative or VSO',
      'https://www.va.gov/ogc/accreditation.asp',
    );
    assertData(12, 'VA mobile apps', 'https://www.mobile.va.gov/appstore/');
    assertData(
      13,
      'State Veterans Affairs offices',
      'https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/',
    );
    assertData(
      14,
      'Doing business with VA',
      'https://www.va.gov/opal/fo/dbwva.asp',
    );
    assertData(15, 'Careers at VA', 'https://www.va.gov/jobs/');
    assertData(
      16,
      'VA outreach materials',
      'https://www.va.gov/outreach-and-events/outreach-materials/',
    );
    assertData(17, 'Your VA welcome kit', 'https://www.va.gov/welcome-kit/');
    assertData(18, 'VA news', 'https://www.news.va.gov/');
    assertData(19, 'Press releases', 'https://www.va.gov/opa/pressrel/');
    assertData(
      20,
      'Email updates',
      'https://public.govdelivery.com/accounts/USVA/subscriber/new/',
    );
    assertData(21, 'Facebook', 'https://www.facebook.com/VeteransAffairs');
    assertData(22, 'Instagram', 'https://www.instagram.com/deptvetaffairs/');
    assertData(23, 'Twitter', 'https://www.twitter.com/DeptVetAffairs/');
    assertData(24, 'Flickr', 'https://www.flickr.com/photos/VeteransAffairs/');
    assertData(25, 'YouTube', 'https://www.youtube.com/user/DeptVetAffairs');
    assertData(
      26,
      'All VA social media',
      'https://digital.va.gov/web-governance/social-media/social-media-sites/',
    );
    assertData(27, 'Resources and support', 'https://www.va.gov/resources/');
    assertData(28, 'Contact us', 'https://www.va.gov/contact-us/');
    assertData(29, '800-698-2411', 'tel:18006982411');
    assertData(30, 'TTY: 711', 'tel:+1711');
    assertData(31, 'Find a VA location', 'https://www.va.gov/find-locations/');
    assertData(
      32,
      'Español',
      'https://www.va.gov/asistencia-y-recursos-en-espanol',
    );
    assertData(
      33,
      'Tagalog',
      'https://www.va.gov/tagalog-wika-mapagkukunan-at-tulong',
    );
    assertData(
      34,
      'Other languages',
      'https://www.va.gov/resources/how-to-get-free-language-assistance-from-va/',
    );
    assertData(35, '', 'https://www.va.gov/');
    assertData(36, 'Accessibility', 'https://www.va.gov/accessibility-at-va');
    assertData(
      37,
      'Civil Rights',
      'https://www.va.gov/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint/',
    );
    assertData(
      38,
      'Freedom of Information Act (FOIA)',
      'https://department.va.gov/foia/',
    );
    assertData(39, 'Harassment', 'https://www.va.gov/report-harassment/');
    assertData(40, 'Office of Inspector General', 'https://www.va.gov/oig/');
    assertData(
      41,
      'Plain language',
      'https://www.va.gov/opa/Plain_Language.asp',
    );
    assertData(
      42,
      'Privacy, policies, and legal information',
      'https://www.va.gov/privacy-policy/',
    );
    assertData(43, 'VA Privacy Service', 'https://www.oprm.va.gov/');
    assertData(
      44,
      'No FEAR Act Data',
      'https://www.va.gov/ormdi/NOFEAR_Select.asp',
    );
    assertData(45, 'USA.gov', 'https://www.usa.gov/');
    assertData(
      46,
      'VA performance dashboard',
      'https://www.va.gov/performance-dashboard/',
    );
    assertData(
      47,
      'Veterans Portrait Project',
      'https://www.va.gov/veterans-portrait-project/',
    );
  });
});
