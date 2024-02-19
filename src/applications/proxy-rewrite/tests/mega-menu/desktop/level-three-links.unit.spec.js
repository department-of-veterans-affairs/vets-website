import { expect } from 'chai';
import {
  buildSeeAllLink,
  buildLinks,
  buildImageColumn,
  buildColumns,
} from '../../../partials/desktop/header/mega-menu/level-three-links';

describe('mega menu - level three links', () => {
  describe('buildSeeAllLink', () => {
    it('should return the correct markup', () => {
      const seeAllLink = {
        href: 'https://va.gov/health-care',
        text: 'View all in health care',
      };

      expect(buildSeeAllLink(seeAllLink)).to.deep.equal(
        '\n      <div class="panel-bottom-link">\n        <a data-e2e-id="view-all-in-health-care" href="https://va.gov/health-care">View all in health care\n          <svg class="all-link-arrow" width="444.819" height="444.819" viewBox="0 0 444.819 444.819">\n            <path fill="#004795" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path>\n          </svg>\n        </a>\n      </div>\n    ',
      );
    });
  });

  describe('buildLinks', () => {
    it('should return the correct markup', () => {
      const links = [
        {
          href: 'https://va.gov/health-care/about-va-health-benefits',
          text: 'About VA health benefits',
        },
        {
          href: 'https://va.gov/health-care/refill-track-prescriptions',
          text: 'Refill and track your prescriptions',
        },
      ];

      expect(buildLinks(links)).to.deep.equal([
        '\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="about-va-health-benefits-0" href="https://va.gov/health-care/about-va-health-benefits" target="_self">About VA health benefits</a>\n        </li>\n      ',
        '\n        <li class="mm-link-container">\n          <a class="mm-links" data-e2e-id="refill-and-track-your-prescriptions-1" href="https://va.gov/health-care/refill-track-prescriptions" target="_self">Refill and track your prescriptions</a>\n        </li>\n      ',
      ]);
    });
  });

  describe('buildImageColumn', () => {
    it('should return the correct markup', () => {
      const column = {
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
      };

      expect(buildImageColumn(column, 'test', 'class')).to.deep.equal(
        '\n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-three test" aria-label="columnThree">\n      <div class="mm-marketing-container class">\n      <img src="https://va.gov/img/styles/3_2_medium_thumbnail/public/hub_promos/health-care.png" alt=>\n        <div class="mm-marketing-text">\n          <a class="mm-links" data-e2e-id="the-pact-act-and-your-va-benefits" href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/" target="_self">The PACT Act and your VA benefits</a>\n          <p>Learn what this law means for Veterans and their survivors.</p>\n        </div>\n      </div>\n    </div>\n  ',
      );
    });
  });

  describe('buildColumns', () => {
    it('should return the correct markup', () => {
      const column = {
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
      };

      expect(buildColumns(column, 'test', 'class')).to.deep.equal(
        '\n    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu test class">\n      <h3 data-e2e-id="vetnav-test-header" id="vetnav-test-header">undefined</h3>\n      <ul id="vetnav-test-col" aria-labelledby="vetnav-test-header">\n        <li class="panel-top-link"></li>\n        undefined\n      </ul>\n    </div>\n  ',
      );
    });
  });
});
