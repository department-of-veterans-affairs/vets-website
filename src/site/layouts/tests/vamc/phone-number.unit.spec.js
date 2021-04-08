import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';

const layoutPath = 'src/site/components/phone-number.drupal.liquid';
const data = parseFixture(
  'src/site/layouts/tests/vamc/fixtures/phone-number.json',
);

describe('phone-number', () => {
  describe('number has label and location', () => {
    it('displays fieldPhoneLabel in h5', async () => {
      const container = await renderHTML(
        layoutPath,
        data.labelAndLocationName,
        'labelAndLocationName',
      );

      expect(container.querySelector('h5').innerHTML).to.equal(
        data.labelAndLocationName.number.fieldPhoneLabel,
      );
    });
  });

  describe('number has no label, has location', () => {
    it('displays phoneLabel in h5', async () => {
      const container = await renderHTML(
        layoutPath,
        data.noLabelLocationName,
        'noLabelLocationName',
      );

      expect(container.querySelector('h5').innerHTML).to.equal('Fax');
    });
  });

  describe('number has neither label nor location', () => {
    it('displays phoneLabel in h4', async () => {
      const container = await renderHTML(
        layoutPath,
        data.noLabelNoLocationName,
        'noLabelNoLocationName',
      );

      expect(container.querySelector('h4').innerHTML).to.equal('Phone');
    });
  });

  describe('phone number formatting', () => {
    it('without extension', async () => {
      const container = await renderHTML(
        layoutPath,
        data.noLabelNoLocationName,
        'noLabelNoLocationName',
      );

      expect(container.querySelector('a').innerHTML.trim()).to.equal(
        data.noLabelNoLocationName.number.fieldPhoneNumber,
      );
      expect(container.querySelector('a').getAttribute('aria-label')).to.equal(
        '1 2 3 4 5 6 7 8 9 0',
      );
    });

    it('with extension', async () => {
      const container = await renderHTML(
        layoutPath,
        data.numberWithExtension,
        'numberWithExtension',
      );

      expect(container.querySelector('a').innerHTML.trim()).to.equal(
        `${data.numberWithExtension.number.fieldPhoneNumber}x ${
          data.numberWithExtension.number.fieldPhoneExtension
        }`,
      );

      expect(container.querySelector('a').getAttribute('aria-label')).to.equal(
        '1 2 3 4 5 6 7 8 9 0 extension: 1 0 0',
      );
    });
  });
});
