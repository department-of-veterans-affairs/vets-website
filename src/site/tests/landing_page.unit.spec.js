// import { getByText } from '@testing-library/dom';
import { expect } from 'chai';
import { parseFixture, renderHTML } from './support';
import { readFileSync } from 'fs';
import path from 'path';

const layout = (() => {
  const layoutPath = path.resolve(
    __dirname,
    './temp_layouts/landing_page.drupal.liquid',
  );
  return readFileSync(layoutPath, 'utf8').toString();
})();

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    const data = parseFixture('landing_page');

    it('renders elements with expected values', async () => {
      const container = await renderHTML(layout, data);
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
      const container = await renderHTML(layout, data);
      expect(
        container.querySelector('i.icon-large.white.hub-icon-foo'),
      ).not.to.equal(null);
    });
  });
});
