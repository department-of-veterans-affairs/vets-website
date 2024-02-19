import { expect } from 'chai';
import { buildLevelTwoLinks } from '../../../partials/desktop/header/mega-menu/level-two-links';

describe('mega menu - level two links', () => {
  describe('buildLevelTwoLinks', () => {
    const sectionData = [
      {
        title: 'Records',
        links: {
          seeAllLink: {
            text: 'View all in records',
            href: 'https://va.govrecords',
          },
          columnOne: {
            title: 'Get your records',
            links: [
              {
                text: 'Get your VA medical records (Blue Button)',
                href: 'https://va.govhealth-care/get-medical-records',
              },
              {
                text: 'Download your VA benefits letters',
                href: 'https://va.govrecords/download-va-letters',
              },
              {
                text: 'Learn how to request a home loan COE',
                href:
                  'https://va.govhousing-assistance/home-loans/how-to-request-coe',
              },
              {
                text: 'Get Veteran ID cards',
                href: 'https://va.govrecords/get-veteran-id-cards',
              },
            ],
          },
          columnTwo: {
            title: 'Manage your records',
            links: [
              {
                text: 'Request your military records (DD214)',
                href: 'https://va.govrecords/get-military-service-records',
              },
              {
                text: 'Change your address',
                href: 'https://va.govchange-address',
              },
              {
                text: 'How to apply for a discharge upgrade',
                href: 'https://www.va.gov/discharge-upgrade-instructions',
              },
              {
                text: 'View your VA payment history',
                href: 'https://va.govva-payment-history',
              },
              {
                text: 'Search historical military records (National Archives)',
                href: 'https://www.archives.gov/',
              },
            ],
          },
          columnThree: {
            img: {
              src:
                'https://va.govimg/styles/3_2_medium_thumbnail/public/hub_promos/records.png',
              alt: '',
            },
            link: {
              text: 'Confirm your VA benefit status',
              href: 'https://va.govrecords/download-va-letters',
            },
            description:
              'Download letters like your eligibility or award letter for certain benefits.',
          },
        },
      },
    ];

    it('should correctly return the markup given the sectionData', () => {
      expect(buildLevelTwoLinks(sectionData)).to.deep.equal([
        '\n          <li class="mm-link-container">\n            <button\n              aria-expanded="false"\n              class="vetnav-level2"\n              aria-controls="vetnav-records-ms"\n              aria-haspopup="true"\n            >\n              Records\n            </button>\n            <div id="vetnav-records-ms" role="group" hidden>\n              <button class="back-button" aria-controls="vetnav-records">Back to Menu</button>\n              \n    \n      <div class="panel-bottom-link">\n        <a data-e2e-id="view-all-in-records" href="https://va.govrecords">View all in records\n          <svg class="all-link-arrow" width="444.819" height="444.819" viewBox="0 0 444.819 444.819">\n            <path fill="#004795" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path>\n          </svg>\n        </a>\n      </div>\n    \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-one ">\n      <h3 data-e2e-id="vetnav-column-one-header" id="vetnav-column-one-header">Get your records</h3>\n      <ul id="vetnav-column-one-col" aria-labelledby="vetnav-column-one-header">\n        <li class="panel-top-link"></li>\n        \n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="get-your-va-medical-records-blue-button-0" href="https://va.govhealth-care/get-medical-records" target="_self">Get your VA medical records (Blue Button)</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="download-your-va-benefits-letters-1" href="https://va.govrecords/download-va-letters" target="_self">Download your VA benefits letters</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="learn-how-to-request-a-home-loan-coe-2" href="https://va.govhousing-assistance/home-loans/how-to-request-coe" target="_self">Learn how to request a home loan COE</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="get-veteran-id-cards-3" href="https://va.govrecords/get-veteran-id-cards" target="_self">Get Veteran ID cards</a>\n        </li>\n      \n      </ul>\n    </div>\n  \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-two ">\n      <h3 data-e2e-id="vetnav-column-two-header" id="vetnav-column-two-header">Manage your records</h3>\n      <ul id="vetnav-column-two-col" aria-labelledby="vetnav-column-two-header">\n        <li class="panel-top-link"></li>\n        \n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="request-your-military-records-dd-214-0" href="https://va.govrecords/get-military-service-records" target="_self">Request your military records (DD214)</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="change-your-address-1" href="https://va.govchange-address" target="_self">Change your address</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="how-to-apply-for-a-discharge-upgrade-2" href="https://www.va.gov/discharge-upgrade-instructions" target="_self">How to apply for a discharge upgrade</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="view-your-va-payment-history-3" href="https://va.govva-payment-history" target="_self">View your VA payment history</a>\n        </li>\n      ,\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="search-historical-military-records-national-archives-4" href="https://www.archives.gov/" target="_self">Search historical military records (National Archives)</a>\n        </li>\n      \n      </ul>\n    </div>\n  \n    \n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-three " aria-label="columnThree">\n      <div class="mm-marketing-container ">\n      <img src="https://va.govimg/styles/3_2_medium_thumbnail/public/hub_promos/records.png" alt=>\n        <div class="mm-marketing-text">\n          <a class="mm-links" data-e2e-id="confirm-your-va-benefit-status" href="https://va.govrecords/download-va-letters" target="_self">Confirm your VA benefit status</a>\n          <p>Download letters like your eligibility or award letter for certain benefits.</p>\n        </div>\n      </div>\n    </div>\n  \n  \n            </div>\n          </li>\n        ',
      ]);
    });
  });
});
