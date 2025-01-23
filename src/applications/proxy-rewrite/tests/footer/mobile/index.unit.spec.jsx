import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MobileFooter from '../../../partials/mobile/footer';
import { headerFooterData } from '../../testing-utilities/header-footer-data';

describe('MobileFooter', () => {
  it('should render the markup correctly', () => {
    const screen = render(
      <MobileFooter footerData={headerFooterData.footerData} />,
    );

    const assertData = (index, title, href) => {
      expect(screen.getAllByRole('link')[index].textContent).to.eq(title);
      expect(screen.getAllByRole('link')[index].href).to.eq(href);
    };

    assertData(0, 'Resources and support', 'https://www.va.gov/resources/');
    assertData(1, 'Contact us', 'https://www.va.gov/contact-us/');
    assertData(2, '800-698-2411', 'tel:18006982411');
    assertData(3, 'TTY: 711', 'tel:+1711');
    assertData(4, 'Find a VA location', 'https://www.va.gov/find-locations/');
    assertData(5, 'Homeless Veterans', 'https://www.va.gov/homeless/');
    assertData(6, 'Women Veterans', 'https://www.va.gov/womenvet/');
    assertData(
      7,
      'Minority Veterans',
      'https://www.va.gov/centerforminorityveterans/',
    );
    assertData(8, 'LGBTQ+ Veterans', 'https://www.patientcare.va.gov/lgbt/');
    assertData(9, 'PTSD', 'https://www.ptsd.va.gov/');
    assertData(10, 'Mental health', 'https://www.mentalhealth.va.gov/');
    assertData(
      11,
      'Adaptive sports and special events',
      'https://department.va.gov/veteran-sports/',
    );
    assertData(
      12,
      'VA outreach events',
      'https://www.va.gov/outreach-and-events/events/',
    );
    assertData(13, 'National Resource Directory', 'https://www.nrd.gov/');
    assertData(14, 'VA forms', 'https://www.va.gov/find-forms/');
    assertData(
      15,
      'VA health care access and quality',
      'https://www.accesstocare.va.gov/',
    );
    assertData(
      16,
      'Get help from an accredited representative or VSO',
      'https://www.va.gov/ogc/accreditation.asp',
    );
    assertData(17, 'VA mobile apps', 'https://www.mobile.va.gov/appstore/');
    assertData(
      18,
      'State Veterans Affairs offices',
      'https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/',
    );
    assertData(
      19,
      'Doing business with VA',
      'https://www.va.gov/opal/fo/dbwva.asp',
    );
    assertData(20, 'Careers at VA', 'https://www.va.gov/jobs/');
    assertData(
      21,
      'VA outreach materials',
      'https://www.va.gov/outreach-and-events/outreach-materials/',
    );
    assertData(22, 'Your VA welcome kit', 'https://www.va.gov/welcome-kit/');
    assertData(23, 'VA news', 'https://www.news.va.gov/');
    assertData(24, 'Press releases', 'https://www.va.gov/opa/pressrel/');
    assertData(
      25,
      'Email updates',
      'https://public.govdelivery.com/accounts/USVA/subscriber/new/',
    );
    assertData(26, 'Facebook', 'https://www.facebook.com/VeteransAffairs');
    assertData(27, 'Instagram', 'https://www.instagram.com/deptvetaffairs/');
    assertData(28, 'Twitter', 'https://www.twitter.com/DeptVetAffairs/');
    assertData(29, 'Flickr', 'https://www.flickr.com/photos/VeteransAffairs/');
    assertData(30, 'YouTube', 'https://www.youtube.com/user/DeptVetAffairs');
    assertData(
      31,
      'All VA social media',
      'https://digital.va.gov/web-governance/social-media/social-media-sites/',
    );
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
