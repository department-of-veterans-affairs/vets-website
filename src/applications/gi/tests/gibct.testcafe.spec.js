import { Selector } from 'testcafe';

import {
  BASE_URL,
  axeCheck,
} from '../../../platform/testing/e2e/testcafe/helpers';

fixture('GI Bill Comparison Tool').page(`${BASE_URL}/gi-bill-comparison-tool/`);

test('Search by city and view first result', async t => {
  await axeCheck(t);
  await t
    .typeText('.keyword-search input[type="text"]', 'washington dc')
    .click('#search-button')
    .expect(Selector('.search-page').exists)
    .ok();
  await axeCheck(t);
  await t
    .click('.search-result a')
    .expect(Selector('.profile-page').exists)
    .ok();
  await axeCheck(t);
});
