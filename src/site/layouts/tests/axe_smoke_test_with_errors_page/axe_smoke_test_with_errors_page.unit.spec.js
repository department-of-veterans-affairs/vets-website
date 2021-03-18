import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/axe_smoke_test_with_errors.drupal.liquid';

describe('axe check smoke test', () => {
  const data = parseFixture(
    'src/site/layouts/tests/axe_smoke_test_with_errors_page/fixtures/axe_smoke_test_with_errors_page.json',
  );

  it('reports no axe violations', async () => {
    const container = await renderHTML(layoutPath, data);
    const violations = await axeCheck(container);
    expect(violations.length).to.equal(0);
  });
});
