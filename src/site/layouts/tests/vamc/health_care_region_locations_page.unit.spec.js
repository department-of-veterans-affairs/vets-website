import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/health_care_region_page.drupal.liquid';

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    let container;
    const data = parseFixture(
      'src/site/layouts/tests/vamc/fixtures/health_care_region_page.json',
    );

    before(async () => {
      container = await renderHTML(layoutPath, data);
    });

    it('reports no axe violations', async () => {
      const violations = await axeCheck(container);
      expect(violations.length).to.equal(0);
    });

    it('renders elements with expected values', () => {
      expect(container.querySelector('h1').innerHTML).to.equal(data.title);
      expect(container.querySelector('p').innerHTML).to.equal(
        'An official website of the United States government',
      );
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).to.equal(null);
    });
  });
});
