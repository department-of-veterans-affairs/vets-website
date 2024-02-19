import { expect } from 'chai';
import {
  buildBottomRail,
  buildColumn,
  getFormattedFooterData,
} from '../../utilities/footer';
import {
  footerColumnData,
  headerFooterData,
} from '../testing-utilities/header-footer-data';

describe('teamsites footer utilities', () => {
  describe('buildColumn', () => {
    describe('column 1', () => {
      it('should correctly format and build the footer column data', () => {
        expect(JSON.stringify(buildColumn(footerColumnData, 1))).to.deep.equal(
          JSON.stringify(
            '<li>\n    <a href=https://va.gov/homeless/>Homeless Veterans</a>\n  </li><li>\n    <a href=https://va.gov/womenvet/>Women Veterans</a>\n  </li><li>\n    <a href=https://va.gov/centerforminorityveterans/>Minority Veterans</a>\n  </li><li>\n    <a href=https://www.patientcare.va.gov/lgbt/>LGBTQ+ Veterans</a>\n  </li><li>\n    <a href=https://www.ptsd.va.gov>PTSD</a>\n  </li><li>\n    <a href=https://www.mentalhealth.va.gov>Mental health</a>\n  </li><li>\n    <a href=https://department.va.gov/veteran-sports/>Adaptive sports and special events</a>\n  </li><li>\n    <a href=https://va.gov/outreach-and-events/events/>VA outreach events</a>\n  </li><li>\n    <a href=https://www.nrd.gov/>National Resource Directory</a>\n  </li>',
          ),
        );
      });
    });

    describe('column 2', () => {
      it('should correctly format and build the footer column data', () => {
        expect(JSON.stringify(buildColumn(footerColumnData, 2))).to.deep.equal(
          JSON.stringify(
            '<li>\n    <a href=https://va.gov/find-forms/>VA forms</a>\n  </li><li>\n    <a href=https://www.accesstocare.va.gov/>VA health care access and quality</a>\n  </li><li>\n    <a href=https://va.gov/ogc/accreditation.asp>Accredited claims representatives</a>\n  </li><li>\n    <a href=https://www.mobile.va.gov/appstore/>VA mobile apps</a>\n  </li><li>\n    <a href=https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/>State Veterans Affairs offices</a>\n  </li><li>\n    <a href=https://va.gov/opal/fo/dbwva.asp>Doing business with VA</a>\n  </li><li>\n    <a href=https://va.gov/jobs/>Careers at VA</a>\n  </li><li>\n    <a href=https://va.gov/outreach-and-events/outreach-materials/>VA outreach materials</a>\n  </li><li>\n    <a href=https://va.gov/welcome-kit/>Your VA welcome kit</a>\n  </li>',
          ),
        );
      });
    });

    describe('column 3', () => {
      it('should correctly format and build the footer column data', () => {
        expect(JSON.stringify(buildColumn(footerColumnData, 3))).to.deep.equal(
          JSON.stringify(
            '<li>\n    <a href=https://www.news.va.gov/>VA news</a>\n  </li><li>\n    <a href=https://va.gov/opa/pressrel/>Press releases</a>\n  </li><li>\n    <a href=https://public.govdelivery.com/accounts/USVA/subscriber/new/>Email updates</a>\n  </li><li>\n    <a href=https://www.facebook.com/VeteransAffairs>Facebook</a>\n  </li><li>\n    <a href=https://www.instagram.com/deptvetaffairs/>Instagram</a>\n  </li><li>\n    <a href=https://www.twitter.com/DeptVetAffairs/>Twitter</a>\n  </li><li>\n    <a href=https://www.flickr.com/photos/VeteransAffairs/>Flickr</a>\n  </li><li>\n    <a href=https://www.youtube.com/user/DeptVetAffairs>YouTube</a>\n  </li><li>\n    <a href=https://digital.va.gov/web-governance/social-media/social-media-sites/>All VA social media</a>\n  </li>',
          ),
        );
      });
    });

    describe('column 4', () => {
      it('should correctly format and build the footer column data', () => {
        expect(JSON.stringify(buildColumn(footerColumnData, 4))).to.deep.equal(
          JSON.stringify(
            '<li>\n    <a href=https://va.gov/resources/>Resources and support</a>\n  </li><li>\n    <a href=https://va.gov/contact-us/>Contact us</a>\n  </li><li><h2 class="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">Call us</h2>\n    <a href=tel:18006982411>800-698-2411</a>\n  </li><li>\n    <a href=tel:+1711>TTY: 711</a>\n  </li><li><h2 class="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">Visit a medical center or regional office</h2>\n    <a href=https://va.gov/find-locations/>Find a VA location</a>\n  </li>',
          ),
        );
      });
    });
  });

  describe('buildBottomRail', () => {
    it('should correctly format and build the bottom rail data', () => {
      expect(
        JSON.stringify(buildBottomRail(headerFooterData.footerData)),
      ).to.deep.equal(
        JSON.stringify(
          `<li><a href=https://va.gov/homeless/>Homeless Veterans</a></li><li><a href=https://va.gov/womenvet/>Women Veterans</a></li><li><a href=https://va.gov/centerforminorityveterans/>Minority Veterans</a></li><li><a href=https://www.patientcare.va.gov/lgbt/>LGBTQ+ Veterans</a></li><li><a href=https://www.ptsd.va.gov>PTSD</a></li><li><a href=https://www.mentalhealth.va.gov>Mental health</a></li><li><a href=https://department.va.gov/veteran-sports/>Adaptive sports and special events</a></li><li><a href=https://va.gov/outreach-and-events/events/>VA outreach events</a></li><li><a href=https://www.nrd.gov/>National Resource Directory</a></li><li><a href=https://va.gov/find-forms/>VA forms</a></li><li><a href=https://www.accesstocare.va.gov/>VA health care access and quality</a></li><li><a href=https://va.gov/ogc/accreditation.asp>Accredited claims representatives</a></li><li><a href=https://www.mobile.va.gov/appstore/>VA mobile apps</a></li><li><a href=https://department.va.gov/about/state-departments-of-veterans-affairs-office-locations/>State Veterans Affairs offices</a></li><li><a href=https://va.gov/opal/fo/dbwva.asp>Doing business with VA</a></li><li><a href=https://va.gov/jobs/>Careers at VA</a></li><li><a href=https://va.gov/outreach-and-events/outreach-materials/>VA outreach materials</a></li><li><a href=https://va.gov/welcome-kit/>Your VA welcome kit</a></li><li><a href=https://www.news.va.gov/>VA news</a></li><li><a href=https://va.gov/opa/pressrel/>Press releases</a></li><li><a href=https://public.govdelivery.com/accounts/USVA/subscriber/new/>Email updates</a></li><li><a href=https://www.facebook.com/VeteransAffairs>Facebook</a></li><li><a href=https://www.instagram.com/deptvetaffairs/>Instagram</a></li><li><a href=https://www.twitter.com/DeptVetAffairs/>Twitter</a></li><li><a href=https://www.flickr.com/photos/VeteransAffairs/>Flickr</a></li><li><a href=https://www.youtube.com/user/DeptVetAffairs>YouTube</a></li><li><a href=https://digital.va.gov/web-governance/social-media/social-media-sites/>All VA social media</a></li><li><a href=https://va.gov/resources/>Resources and support</a></li><li><a href=https://va.gov/contact-us/>Contact us</a></li><li><a href=tel:18006982411>800-698-2411</a></li><li><a href=tel:+1711>TTY: 711</a></li><li><a href=https://va.gov/find-locations/>Find a VA location</a></li><li><a href=https://va.gov/accessibility-at-va>Accessibility</a></li><li><a href=https://va.gov/resources/your-civil-rights-and-how-to-file-a-discrimination-complaint/>Civil Rights</a></li><li><a href=https://department.va.gov/foia/>Freedom of Information Act (FOIA)</a></li><li><a href=https://va.gov/report-harassment/>Harassment</a></li><li><a href=https://va.gov/oig/>Office of Inspector General</a></li><li><a href=https://va.gov/opa/Plain_Language.asp>Plain language</a></li><li><a href=https://va.gov/privacy-policy/>Privacy policies and legal information</a></li><li><a href=https://www.oprm.va.gov/>VA Privacy Service</a></li><li><a href=https://va.gov/ormdi/NOFEAR_Select.asp>No FEAR Act Data</a></li><li><a href=https://www.usa.gov/>USA.gov</a></li><li><a href=https://va.gov/performance-dashboard/>VA performance dashboard</a></li><li><a href=https://va.gov/veterans-portrait-project/>Veterans Portrait Project</a></li>`,
        ),
      );
    });
  });

  describe('getFormattedFooterData', () => {
    it('should correctly format and return the data', () => {
      expect(getFormattedFooterData(headerFooterData.footerData)).to.deep.equal(
        footerColumnData,
      );
    });
  });
});
