import { Selector } from 'testcafe';
import { axeCheck, createReport } from 'axe-testcafe';

import { baseUrl } from '../../../platform/testing/e2e/helpers';

fixture('Facility Locator').page(`${baseUrl}/find-locations/`);

test('Search facility and view details', async t => {
  const { violations } = await axeCheck(t);

  await t
    .typeText('input[name="street-city-state-zip"]', 'Seattle, WA')
    .click('input[type="submit"]')
    .click('.facility-result a h5')
    .expect(Selector('.all-details').exists)
    .ok()
    .expect(violations.length === 0)
    .ok(createReport(violations));
});
