import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';

const layoutPath = 'src/site/includes/operatingStatusFlags.drupal.liquid';
const data = parseFixture(
  'src/site/layouts/tests/includes/fixtures/operatingStatusFlags.json',
);

describe('operatingStatusFlags', () => {
  describe('notice', () => {
    it('renders appropriate markup', async () => {
      const container = await renderHTML(layoutPath, data.notice, 'notice');

      expect(
        container
          .querySelector('a i.fa-info-circle')
          .nextSibling.textContent.trim(),
      ).to.equal('Facility notice');
    });
  });

  describe('limited', () => {
    it('renders appropriate markup', async () => {
      const container = await renderHTML(layoutPath, data.limited, 'limited');

      expect(
        container
          .querySelector('a i.fa-exclamation-triangle')
          .nextSibling.textContent.trim(),
      ).to.equal('Limited services and hours');
    });
  });

  describe('closed', () => {
    it('renders appropriate markup', async () => {
      const container = await renderHTML(layoutPath, data.closed, 'closed');

      expect(
        container
          .querySelector('a i.fa-exclamation-circle')
          .nextSibling.textContent.trim(),
      ).to.equal('Facility Closed');
    });
  });
});
