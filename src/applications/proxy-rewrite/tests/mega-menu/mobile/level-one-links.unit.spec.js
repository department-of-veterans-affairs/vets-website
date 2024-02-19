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
        '\n    <div id="mobile-mega-menu" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full" hidden>\n      <label class="vads-u-font-size--base vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5" for="header-search">Search</label>\n      <div>\n        <div id="mobile-search-container"></div>\n        <ul id="header-nav-items" class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">\n          \n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button aria-expanded="false" class="header-menu-item-button level1 vads-u-background-color--primary-darker vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white" data-e2e-id="About VA--1" id="About VA--1" type="button">About VA\n            <i aria-hidden="true" class="fa fa-plus vads-u-margin-left--1 vads-u-font-size--lg"></i><i aria-hidden="true" hidden class="fa fa-minus vads-u-margin-left--1 vads-u-font-size--lg"></i>\n          </button>\n        </li>\n        <ul hidden aria-label="About VA" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0" id="About VA--1">\n          \n      <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="VA organizations">\n        <button\n          aria-controls="va-organizations-menu"\n          class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n          data-e2e-id="VA organizations--2"\n          id="VA organizations--2" \n          type="button"\n        >\n        VA organizations\n        <i aria-hidden="true" class="fa fa-chevron-right vads-u-margin-left--1 vads-u-font-size--lg"></i>\n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Innovation at VA">\n      <button\n        aria-controls="innovation-at-va-menu"\n        class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n        data-e2e-id="Innovation at VA--2"\n        id="Innovation at VA--2" \n        type="button"\n      >\n        Innovation at VA\n        <i aria-hidden="true" class="fa fa-chevron-right vads-u-margin-left--1 vads-u-font-size--lg"></i>\n      </button>\n    </li>\n    <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="Learn about VA">\n    <button\n      aria-controls="learn-about-va-menu"\n      class="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" \n      data-e2e-id="Learn about VA--2"\n      id="Learn about VA--2" \n      type="button"\n    >\n      Learn about VA\n      <i aria-hidden="true" class="fa fa-chevron-right vads-u-margin-left--1 vads-u-font-size--lg"></i>\n    </button>\n  </li>\n    \n        </ul>\n      \n    <li class="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n      <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/find-locations">\n        Find a VA Location\n      </a>\n    </li>\n    \n          <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">\n            <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/contact-us/">Contact us</a>\n          </li>\n        </ul>\n      </div>\n      \n    <div id="va-organizations-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="veterans-health-administration"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/health" data-e2e-id="veterans-health-administration">Veterans Health Administration</a></li>\n      </ul>\n    </div>\n  \n    <div id="innovation-at-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="health-research"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.research.va.gov/" data-e2e-id="health-research">Health research</a></li>\n      </ul>\n    </div>\n  \n    <div id="learn-about-va-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">\n      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">\n        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">\n            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu\n          </button>\n        </li>\n        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="about-va"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/ABOUT_VA/index.asp" data-e2e-id="about-va">About VA</a></li>\n      </ul>\n    </div>\n  \n    </div>   \n  ',
      );
    });

    it('should return the correct markup for a simple link section', () => {
      const data = [
        {
          href: 'https://va.gov/find-locations',
          title: 'Find a VA Location',
        },
      ];

      expect(makeMegaMenu(data)).to.deep.equal(
        '\n    <div id="mobile-mega-menu" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full" hidden>\n      <label class="vads-u-font-size--base vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5" for="header-search">Search</label>\n      <div>\n        <div id="mobile-search-container"></div>\n        <ul id="header-nav-items" class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">\n          \n    <li class="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">\n      <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/find-locations">\n        Find a VA Location\n      </a>\n    </li>\n    \n          <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">\n            <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://va.gov/contact-us/">Contact us</a>\n          </li>\n        </ul>\n      </div>\n      \n    </div>   \n  ',
      );
    });
  });
});
