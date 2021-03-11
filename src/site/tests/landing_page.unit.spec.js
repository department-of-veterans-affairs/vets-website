import { expect } from 'chai';
import { getLayout, parseFixture, renderHTML } from './support';

const layoutPath = 'src/site/tests/temp_layouts/landing_page.drupal.liquid';
const layout = getLayout(layoutPath).toString();

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    const data = parseFixture('landing_page');

    it('renders elements with expected values', async () => {
      const container = await renderHTML(layoutPath, layout, data);
      expect(container.querySelector('h1').innerHTML).to.equal(data.title);
      expect(container.querySelector('p').innerHTML).to.equal(
        data.fieldIntroText,
      );
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).to.equal(null);
    });
  });

  describe('with fieldTitleIcon', () => {
    const data = parseFixture('landing_page_with_icon');

    it('renders fieldTitleIcon', async () => {
      const container = await renderHTML(layoutPath, layout, data);
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).not.to.equal(null);
    });
  });
});
