import { expect } from 'chai';
import { getLayout, parseFixture, renderHTML } from './support';

const layoutPath = 'src/site/layouts/health_care_region_page.drupal.liquid';
const layout = getLayout(layoutPath).toString();

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    const data = parseFixture('health_care_region_page');

    it('renders elements with expected values', async () => {
      const container = await renderHTML(layoutPath, layout, data);
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
