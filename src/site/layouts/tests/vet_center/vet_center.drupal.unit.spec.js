import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/vet_center.drupal.liquid';
import testData from './fixtures/vet_center_escanaba_data';

describe.skip('Vet Center Main Page', () => {
  let container;
  const data = parseFixture(
    'src/site/layouts/tests/vet_center/fixtures/vet_center_escanaba_data.json',
  );

  before(async () => {
    container = await renderHTML(layoutPath, data);
  });

  it('reports no axe violations', async () => {
    const violations = await axeCheck(container);
    expect(violations.length).to.equal(0);
  });

  it('renders header and intro text', () => {
    expect(container.querySelector('h1').innerHTML).to.equal(
      testData.entityLabel,
    );
    expect(container.querySelector('div.va-introtext > p').innerHTML).to.equal(
      testData.fieldIntroText,
    );
  });

  it('renders prepare for your visit', () => {
    expect(
      container.querySelectorAll('va-accordion[id^=prepare-for-your-visit]')
        .length,
    ).to.equal(4);
    expect(
      container.querySelectorAll(
        'va-accordion-item[id^=prepare-for-your-visit]',
      ).length,
    ).to.equal(4);
  });

  it('renders counselling services', () => {
    expect(
      container.querySelectorAll('va-accordion[id^=counselling-accordion]')
        .length,
    ).to.equal(9);
    expect(
      container.querySelectorAll('va-accordion-item[id^=counselling-item]')
        .length,
    ).to.equal(9);
  });

  it('renders referral services', () => {
    expect(
      container.querySelectorAll('va-accordion[id^=referral-accordion]').length,
    ).to.equal(3);
    expect(
      container.querySelectorAll('va-accordion-item[id^=referral-item]').length,
    ).to.equal(3);
  });

  it('renders other services', () => {
    expect(
      container.querySelectorAll('va-accordion[id^=other-accordion]').length,
    ).to.equal(1);
    expect(
      container.querySelectorAll('va-accordion-item[id^=other-item]').length,
    ).to.equal(1);
  });
});
