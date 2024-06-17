import { expect } from 'chai';
import { makeMegaMenu } from '../../../partials/mobile/header/mega-menu';

describe('mega menu - level one links', () => {
  describe('makeMegaMenu', () => {
    const megaMenuData = [
      {
        title: 'About VA',
        menuSections: {
          mainColumn: {
            title: 'VA organizations',
            links: [
              {
                text: 'Veterans Health Administration',
                href: '/health',
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
                href: '/ABOUT_VA/index.asp',
              },
            ],
          },
          columnThree: {
            img: {
              src:
                '/img/styles/3_2_medium_thumbnail/public/2019-11/afr-2019_0.jpg',
              alt: 'Agency Financial Report 2019',
            },
            link: {
              text: 'Agency Financial Report',
              href: '/finance/afr/index.asp',
            },
            description:
              'View the 2019 report on VA’s progress in providing benefits and health care.',
          },
        },
      },
      {
        title: 'Find a VA location',
        href: '/find-locations',
      },
    ];

    it('should return the correct markup for a dropdown section', () => {
      expect(makeMegaMenu(megaMenuData)).to.deep.equal(
        '\n    <div id="mobile-mega-menu" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full" hidden>\n      <div>\n        <div id="mobile-search-container"></div>\n        <ul id="header-nav-items" class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">\n          \n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button aria-expanded="false" class="header-menu-item-button level1 vads-u-background-color--primary-darker vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white" data-e2e-id="About VA--1" id="About VA--1" type="button">About VA\n            <svg\n              aria-hidden="true"\n              class="mobile-benhub"\n              focusable="false"\n              viewBox="0 2 20 20"\n              width="20"\n              xmlns="http://www.w3.org/2000/svg"\n            >\n              <path\n                fill="#fff"\n                fillRule="evenodd"\n                clipRule="evenodd"\n                d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"\n              />\n            </svg>\n            <svg\n              aria-hidden="true"\n              class="mobile-benhub"\n              focusable="false"\n              hidden\n              viewBox="0 2 20 20"\n              width="20"\n              xmlns="http://www.w3.org/2000/svg"\n            >\n              <path\n                fill="#fff"\n                fillRule="evenodd"\n                clipRule="evenodd"\n                d="M19 13H5V11H19V13Z"\n              />\n            </svg>\n          </button>\n        </li>\n        <ul hidden aria-label="About VA" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0" id="About VA--1">\n          \n      <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="VA organizations">\n        <button\n          aria-controls="va-organizations-menu"\n          class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n          data-e2e-id="VA organizations--2"\n          id="VA organizations--2" \n          type="button"\n        >\n        VA organizations\n        \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Innovation at VA">\n      <button\n        aria-controls="innovation-at-va-menu"\n        class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n        data-e2e-id="Innovation at VA--2"\n        id="Innovation at VA--2" \n        type="button"\n      >\n        Innovation at VA\n        \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Learn about VA">\n    <button\n      aria-controls="learn-about-va-menu"\n      class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n      data-e2e-id="Learn about VA--2"\n      id="Learn about VA--2" \n      type="button"\n    >\n      Learn about VA\n      \n    <svg\n      aria-hidden="true"\n      focusable="false"\n      viewBox="-1 2 17 17"\n      width="22"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n      <path\n        fill="#005ea2"\n        fillRule="evenodd"\n        clipRule="evenodd"\n        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"\n      />\n    </svg>\n  \n    </button>\n  </li>\n    \n        </ul>\n      \n    <li class="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n      <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/find-locations">\n        Find a VA Location\n      </a>\n    </li>\n    \n          <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">\n            <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/contact-us/">Contact us</a>\n          </li>\n        </ul>\n      </div>\n      \n    <div id="va-organizations-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <svg\n              aria-hidden="true"\n              focusable="false"\n              viewBox="8 5 13 13"\n              width="17"\n              xmlns="http://www.w3.org/2000/svg"\n            >\n              <path\n                fill="#005ea2"\n                fillRule="evenodd"\n                clipRule="evenodd"\n                d="M14 6L15.41 7.41L10.83 12L15.41 16.59L14 18L8.00003 12L14 6Z"\n              />\n            </svg>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="veterans-health-administration"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/health" data-e2e-id="veterans-health-administration">Veterans Health Administration</a></li>\n      </ul>\n    </div>\n  \n    <div id="innovation-at-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <svg\n              aria-hidden="true"\n              focusable="false"\n              viewBox="8 5 13 13"\n              width="17"\n              xmlns="http://www.w3.org/2000/svg"\n            >\n              <path\n                fill="#005ea2"\n                fillRule="evenodd"\n                clipRule="evenodd"\n                d="M14 6L15.41 7.41L10.83 12L15.41 16.59L14 18L8.00003 12L14 6Z"\n              />\n            </svg>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="health-research"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.research.va.gov/" data-e2e-id="health-research">Health research</a></li>\n      </ul>\n    </div>\n  \n    <div id="learn-about-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <svg\n              aria-hidden="true"\n              focusable="false"\n              viewBox="8 5 13 13"\n              width="17"\n              xmlns="http://www.w3.org/2000/svg"\n            >\n              <path\n                fill="#005ea2"\n                fillRule="evenodd"\n                clipRule="evenodd"\n                d="M14 6L15.41 7.41L10.83 12L15.41 16.59L14 18L8.00003 12L14 6Z"\n              />\n            </svg>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="about-va"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/ABOUT_VA/index.asp" data-e2e-id="about-va">About VA</a></li>\n      </ul>\n    </div>\n  \n    </div>   \n  ',
      );
    });

    it('should return the correct markup for a simple link section', () => {
      const data = [
        {
          href: 'https://www.va.gov/find-locations',
          title: 'Find a VA Location',
        },
      ];

      expect(makeMegaMenu(data)).to.deep.equal(
        '\n    <div id="mobile-mega-menu" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full" hidden>\n      <div>\n        <div id="mobile-search-container"></div>\n        <ul id="header-nav-items" class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">\n          \n    <li class="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n      <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/find-locations">\n        Find a VA Location\n      </a>\n    </li>\n    \n          <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">\n            <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/contact-us/">Contact us</a>\n          </li>\n        </ul>\n      </div>\n      \n    </div>   \n  ',
      );
    });
  });
});
