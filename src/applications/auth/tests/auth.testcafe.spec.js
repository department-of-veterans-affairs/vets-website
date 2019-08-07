import { Selector } from 'testcafe';

import {
  BASE_URL,
  login,
} from '../../../platform/testing/e2e/testcafe/helpers';

fixture.skip('Auth').page(BASE_URL);

test('Log in and log out', async t => {
  await t
    .click('.va-modal-close')
    .click('.sign-in-link')
    .click(Selector('.va-button-primary').withText('Sign in with ID.me'));

  await login();

  await t
    .expect(Selector('.sign-in-link').exists)
    .notOk()
    .expect(Selector('.user-dropdown-email').textContent)
    .contains('Sean')
    .click(
      Selector('.va-dropdown-trigger').withAttribute(
        'aria-controls',
        'account-menu',
      ),
    )
    .click(Selector('#account-menu li').withText('Sign Out'))
    .expect(Selector('.sign-in-link').exists)
    .ok();
});
