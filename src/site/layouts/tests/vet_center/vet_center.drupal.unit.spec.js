import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/vet_center.drupal.liquid';
import testData from './fixtures/vet_center_escanaba_data';

describe('Vet Center Main Page', () => {
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
});
