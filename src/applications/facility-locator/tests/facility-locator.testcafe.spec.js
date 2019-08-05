import { Selector } from 'testcafe';

import {
  BASE_URL,
  axeCheck,
} from '../../../platform/testing/e2e/testcafe/helpers';

fixture.skip('Facility Locator').page(`${BASE_URL}/find-locations/`);

test('Search facility and view details', async t => {
  await axeCheck(t);
  await t
    .typeText('input[name="street-city-state-zip"]', 'Seattle, WA')
    .click('input[type="submit"]');
  await axeCheck(t);
  await t
    .click('.facility-result a h5')
    .expect(Selector('.all-details').exists)
    .ok();
  await axeCheck(t);
});
