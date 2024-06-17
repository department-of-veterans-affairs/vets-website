import { expect } from 'chai';
import { buildLevelTwoLinks } from '../../../partials/mobile/header/mega-menu/level-two-links';

describe('mega menu - level two links', () => {
  describe('buildLevelTwoLinks', () => {
    describe('when sectionData is an array', () => {
      const sectionData = [
        {
          title: 'Records',
          links: {
            seeAllLink: {
              text: 'View all in records',
              href: 'https://www.va.gov/records',
            },
            columnOne: {
              title: 'Get your records',
              links: [
                {
                  text: 'Get your VA medical records (Blue Button)',
                  href: 'https://www.va.gov/health-care/get-medical-records',
                },
                {
                  text: 'Download your VA benefits letters',
                  href: 'https://www.va.gov/records/download-va-letters',
                },
                {
                  text: 'Learn how to request a home loan COE',
                  href:
                    'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe',
                },
                {
                  text: 'Get Veteran ID cards',
                  href: 'https://www.va.gov/records/get-veteran-id-cards',
                },
              ],
            },
            columnTwo: {
              title: 'Manage your records',
              links: [
                {
                  text: 'Request your military records (DD214)',
                  href:
                    'https://www.va.gov/records/get-military-service-records',
                },
                {
                  text: 'Change your address',
                  href: 'https://www.va.gov/change-address',
                },
                {
                  text: 'How to apply for a discharge upgrade',
                  href: 'https://www.va.gov/discharge-upgrade-instructions',
                },
                {
                  text: 'View your VA payment history',
                  href: 'https://www.va.gov/va-payment-history',
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
                  'https://www.va.gov/img/styles/3_2_medium_thumbnail/public/hub_promos/records.png',
                alt: '',
              },
              link: {
                text: 'Confirm your VA benefit status',
                href: 'https://www.va.gov/records/download-va-letters',
              },
              description:
                'Download letters like your eligibility or award letter for certain benefits.',
            },
          },
        },
      ];

      it('should correctly return the markup given the sectionData', () => {
        expect(buildLevelTwoLinks(sectionData)).to.deep.equal([
          '\n          <li class="vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Records">\n            <button\n              aria-controls="records-menu"\n              class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n              data-e2e-id="Records--2"\n              id="Records--2" \n              type="button"\n            >\n              Records\n              \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n            </button>\n          </li>\n        ',
        ]);
      });
    });
  });

  describe('when sectionData is an object', () => {
    const sectionData = {
      mainColumn: {
        title: 'VA organizations',
        links: [
          {
            text: 'Veterans Health Administration',
            href: 'https://www.va.gov/health',
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
            'https://www.va.gov/img/styles/3_2_medium_thumbnail/public/2023-11/disability%20icon.png',
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
      expect(buildLevelTwoLinks(sectionData)).to.deep.equal(
        '\n      <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="VA organizations">\n        <button\n          aria-controls="va-organizations-menu"\n          class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n          data-e2e-id="VA organizations--2"\n          id="VA organizations--2" \n          type="button"\n        >\n        VA organizations\n        \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Innovation at VA">\n      <button\n        aria-controls="innovation-at-va-menu"\n        class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n        data-e2e-id="Innovation at VA--2"\n        id="Innovation at VA--2" \n        type="button"\n      >\n        Innovation at VA\n        \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Learn about VA">\n    <button\n      aria-controls="learn-about-va-menu"\n      class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n      data-e2e-id="Learn about VA--2"\n      id="Learn about VA--2" \n      type="button"\n    >\n      Learn about VA\n      \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n    </button>\n  </li>\n    ',
      );
    });
  });
});
