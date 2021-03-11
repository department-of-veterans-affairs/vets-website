import { expect } from 'chai';
import { getLayout, parseFixture, renderHTML } from '../../../tests/support';

const layoutPath = 'src/site/layouts/landing_page.drupal.liquid';
const layout = getLayout(layoutPath).toString();

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    const data = parseFixture(
      'src/site/layouts/tests/landing_page/fixtures/landing_page.json',
    );

    it('renders elements with expected values', async () => {
      const container = await renderHTML(layoutPath, layout, data);
      expect(container.querySelector('h1').innerHTML).to.equal(data.title);
      expect(container.querySelector('.va-introtext p').innerHTML).to.equal(
        data.fieldIntroText,
      );
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).to.equal(null);
    });
  });

  describe('with fieldTitleIcon', () => {
    const data = parseFixture(
      'src/site/layouts/tests/landing_page/fixtures/landing_page_with_icon.json',
    );

    it('renders fieldTitleIcon', async () => {
      const container = await renderHTML(layoutPath, layout, data);
      expect(container.querySelector('h1').innerHTML).to.equal(data.title);
      expect(container.querySelector('.va-introtext p').innerHTML).to.equal(
        data.fieldIntroText,
      );
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).not.to.equal(null);
    });
  });
});
