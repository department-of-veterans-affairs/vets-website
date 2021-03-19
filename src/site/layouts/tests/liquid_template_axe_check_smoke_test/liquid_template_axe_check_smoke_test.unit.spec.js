import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath =
  'src/site/layouts/liquid_template_axe_check_smoke_test.drupal.liquid';

describe('liquid template axe check smoke test', () => {
  const data = parseFixture(
    'src/site/layouts/tests/liquid_template_axe_check_smoke_test/fixtures/liquid_template_axe_check_smoke_test.json',
  );

  it('reports the expected number of axe violations', async () => {
    const container = await renderHTML(layoutPath, data);
    const violations = await axeCheck(container);
    expect(violations.length).to.equal(6);
  });
});
