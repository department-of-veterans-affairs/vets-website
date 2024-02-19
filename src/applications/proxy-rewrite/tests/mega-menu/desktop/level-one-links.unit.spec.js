import { expect } from 'chai';
import { buildLevelOneLinks } from '../../../partials/desktop/header/mega-menu';

describe('mega menu - level one links', () => {
  describe('buildLevelOneLinks', () => {
    it('should return the correct markup for a dropdown section', () => {
      const sectionData = {
        title: 'VA Benefits and Health Care',
        menuSections: [
          {
            links: {
              columnOne: {
                title: 'Get health care benefits',
                links: [
                  {
                    href: 'https://va.gov/health-care/about-va-health-benefits',
                    text: 'About VA health benefits',
                  },
                ],
              },
              columnTwo: {
                title: 'Manage your health',
                links: [
                  {
                    href:
                      'https://va.gov/health-care/refill-track-prescriptions',
                    text: 'Refill and track your prescriptions',
                  },
                ],
              },
              columnThree: {
                description:
                  'Learn what this law means for Veterans and their survivors.',
                img: {
                  alt: '',
                  src:
                    'https://va.gov/img/styles/3_2_medium_thumbnail/public/hub_promos/health-care.png',
                },
                link: {
                  href:
                    'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
                  text: 'The PACT Act and your VA benefits',
                },
              },
              seeAllLink: {
                href: 'https://va.gov/health-care',
                text: 'View all in health care',
              },
            },
          },
        ],
      };

      expect(buildLevelOneLinks(sectionData)).to.deep.equal(
        '\n      <li>\n        <button\n          type="button"\n          aria-expanded="false"\n          aria-controls="vetnav-va-benefits-and-health-care"\n          aria-haspopup="true"\n          class="vetnav-level1"\n          data-e2e-id="va-benefits-and-health-care-undefined"\n        >\n          VA Benefits and Health Care\n        </button>\n        <div\n          id="vetnav-va-benefits-and-health-care"\n          class="vetnav-panel" \n          hidden\n        >\n          <ul aria-label="VA Benefits and Health Care">\n            \n          <li class="mm-link-container">\n            <button\n              aria-expanded="false"\n              class="vetnav-level2"\n              aria-controls="vetnav--ms"\n              aria-haspopup="true"\n            >\n              undefined\n            </button>\n            <div id="vetnav--ms" role="group" hidden>\n              <button class="back-button" aria-controls="vetnav-">Back to Menu</button>\n              \n    \n      <div class="panel-bottom-link">\n        <a data-e2e-id="view-all-in-health-care" href="https://va.gov/health-care">View all in health care\n          <svg class="all-link-arrow" width="444.819" height="444.819" viewBox="0 0 444.819 444.819">\n            <path fill="#004795" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path>\n          </svg>\n        </a>\n      </div>\n    \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-one ">\n      <h3 data-e2e-id="vetnav-column-one-header" id="vetnav-column-one-header">Get health care benefits</h3>\n      <ul id="vetnav-column-one-col" aria-labelledby="vetnav-column-one-header">\n        <li class="panel-top-link"></li>\n        \n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="about-va-health-benefits-0" href="https://va.gov/health-care/about-va-health-benefits" target="_self">About VA health benefits</a>\n        </li>\n      \n      </ul>\n    </div>\n  \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-two ">\n      <h3 data-e2e-id="vetnav-column-two-header" id="vetnav-column-two-header">Manage your health</h3>\n      <ul id="vetnav-column-two-col" aria-labelledby="vetnav-column-two-header">\n        <li class="panel-top-link"></li>\n        \n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="refill-and-track-your-prescriptions-0" href="https://va.gov/health-care/refill-track-prescriptions" target="_self">Refill and track your prescriptions</a>\n        </li>\n      \n      </ul>\n    </div>\n  \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-three " aria-label="columnThree">\n      <div class="mm-marketing-container ">\n      <img src="https://va.gov/img/styles/3_2_medium_thumbnail/public/hub_promos/health-care.png" alt=>\n        <div class="mm-marketing-text">\n          <a class="mm-links" data-e2e-id="the-pact-act-and-your-va-benefits" href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/" target="_self">The PACT Act and your VA benefits</a>\n          <p>Learn what this law means for Veterans and their survivors.</p>\n        </div>\n      </div>\n    </div>\n  \n  \n            </div>\n          </li>\n        \n          </ul>\n        </div>\n      </li>\n    ',
      );
    });

    it('should return the correct markup for a simple link section', () => {
      const link = {
        href: 'https://va.gov/find-locations',
        title: 'Find a VA Location',
      };

      expect(buildLevelOneLinks(link)).to.deep.equal(
        '\n    <li>\n      <a class="vetnav-level1 medium-screen:vads-u-padding--2" data-e2e-id="find-a-va-location-undefined" href="https://va.gov/find-locations">Find a VA Location</a>\n    </li>\n  ',
      );
    });
  });
});
