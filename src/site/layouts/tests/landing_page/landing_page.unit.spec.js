import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/landing_page.drupal.liquid';

describe('intro', () => {
  describe('no fieldTitleIcon', () => {
    let container;
    const data = parseFixture(
      'src/site/layouts/tests/landing_page/fixtures/landing_page.json',
    );

    before(async () => {
      container = await renderHTML(layoutPath, data);
    });

    it('reports no axe violations', async () => {
      const violations = await axeCheck(container);
      expect(violations.length).to.equal(0);
    });

    it('renders elements with expected values', async () => {
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
    let container;
    const data = parseFixture(
      'src/site/layouts/tests/landing_page/fixtures/landing_page_with_icon.json',
    );

    before(async () => {
      container = await renderHTML(layoutPath, data);
    });

    it('reports no axe violations', async () => {
      const violations = await axeCheck(container);
      expect(violations.length).to.equal(0);
    });

    it('renders fieldTitleIcon', async () => {
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
