import { expect } from 'chai';
import { buildLevelThreeLinks } from '../../../partials/mobile/header/mega-menu/level-three-links';

describe('mega menu - level three links', () => {
  describe('buildLevelThreeLinks', () => {
    describe('when the sectionData is an array', () => {
      const sectionData = [
        {
          title: 'Records',
          links: {
            seeAllLink: {
              text: 'View all in records',
              href: 'https://va.gov/records',
            },
            columnOne: {
              title: 'Get your records',
              links: [
                {
                  text: 'Get your VA medical records (Blue Button)',
                  href: 'https://va.gov/health-care/get-medical-records',
                },
                {
                  text: 'Download your VA benefits letters',
                  href: 'https://va.gov/records/download-va-letters',
                },
                {
                  text: 'Learn how to request a home loan COE',
                  href:
                    'https://va.gov/housing-assistance/home-loans/how-to-request-coe',
                },
                {
                  text: 'Get Veteran ID cards',
                  href: 'https://va.gov/records/get-veteran-id-cards',
                },
              ],
            },
            columnTwo: {
              title: 'Manage your records',
              links: [
                {
                  text: 'Request your military records (DD214)',
                  href: 'https://va.gov/records/get-military-service-records',
                },
                {
                  text: 'Change your address',
                  href: 'https://va.gov/change-address',
                },
                {
                  text: 'How to apply for a discharge upgrade',
                  href: 'https://www.va.gov/discharge-upgrade-instructions',
                },
                {
                  text: 'View your VA payment history',
                  href: 'https://va.gov/va-payment-history',
                },
                {
                  text:
                    'Search historical military records (National Archives)',
                  href: 'https://www.archives.gov/',
                },
              ],
            },
            columnThree: {
              img: {
                src:
                  'https://va.gov/img/styles/3_2_medium_thumbnail/public/hub_promos/records.png',
                alt: '',
              },
              link: {
                text: 'Confirm your VA benefit status',
                href: 'https://va.gov/records/download-va-letters',
              },
              description:
                'Download letters like your eligibility or award letter for certain benefits.',
            },
          },
        },
      ];

      it('should correctly return the markup given the sectionData', () => {
        expect(buildLevelThreeLinks(sectionData)).to.deep.equal([
          '\n    <div id="records-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="view-all-in-records"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/records" data-e2e-id="view-all-in-records">View all in records</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="get-your-va-medical-records-blue-button"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/health-care/get-medical-records" data-e2e-id="get-your-va-medical-records-blue-button">Get your VA medical records (Blue Button)</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="download-your-va-benefits-letters"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/records/download-va-letters" data-e2e-id="download-your-va-benefits-letters">Download your VA benefits letters</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="learn-how-to-request-a-home-loan-coe"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/housing-assistance/home-loans/how-to-request-coe" data-e2e-id="learn-how-to-request-a-home-loan-coe">Learn how to request a home loan COE</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="get-veteran-id-cards"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/records/get-veteran-id-cards" data-e2e-id="get-veteran-id-cards">Get Veteran ID cards</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="request-your-military-records-dd-214"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/records/get-military-service-records" data-e2e-id="request-your-military-records-dd-214">Request your military records (DD214)</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="change-your-address"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/change-address" data-e2e-id="change-your-address">Change your address</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="how-to-apply-for-a-discharge-upgrade"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/discharge-upgrade-instructions" data-e2e-id="how-to-apply-for-a-discharge-upgrade">How to apply for a discharge upgrade</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="view-your-va-payment-history"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/va-payment-history" data-e2e-id="view-your-va-payment-history">View your VA payment history</a></li><li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="search-historical-military-records-national-archives"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.archives.gov/" data-e2e-id="search-historical-military-records-national-archives">Search historical military records (National Archives)</a></li>\n      </ul>\n    </div>\n  ',
        ]);
      });
    });
  });

  describe('when the sectionData is an object', () => {
    const sectionData = {
      mainColumn: {
        title: 'VA organizations',
        links: [
          {
            text: 'Veterans Health Administration',
            href: 'https://va.gov/health',
          },
        ],
      },
      columnOne: {
        title: 'Innovation at VA',
        links: [
          {
            text: 'Health research',
            href: 'https://www.research.va.gov/',
          },
        ],
      },
      columnTwo: {
        title: 'Learn about VA',
        links: [
          {
            text: 'About VA',
            href: 'https://department.va.gov/about/',
          },
        ],
      },
      columnThree: {
        img: {
          src:
            'https://va.gov/img/styles/3_2_medium_thumbnail/public/2023-11/disability%20icon.png',
          alt: 'Paper icon',
        },
        link: {
          text: 'Agency Financial Report',
          href:
            'https://department.va.gov/administrations-and-offices/management/finance/agency-financial-report/',
        },
        description:
          'View the FY 2023 report that includes VA accomplishments with taxpayer dollars and the challenges that remain.',
      },
    };

    it('should correctly return the markup given the sectionData', () => {
      expect(buildLevelThreeLinks(sectionData)).to.deep.equal([
        '\n    <div id="va-organizations-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="veterans-health-administration"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/health" data-e2e-id="veterans-health-administration">Veterans Health Administration</a></li>\n      </ul>\n    </div>\n  ',
        '\n    <div id="innovation-at-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="health-research"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.research.va.gov/" data-e2e-id="health-research">Health research</a></li>\n      </ul>\n    </div>\n  ',
        '\n    <div id="learn-about-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="about-va"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://department.va.gov/about/" data-e2e-id="about-va">About VA</a></li>\n      </ul>\n    </div>\n  ',
      ]);
    });
  });
});
