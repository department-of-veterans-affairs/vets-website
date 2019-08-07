import { axeCheck, createReport } from 'axe-testcafe';
import { t } from 'testcafe';

const HOST = process.env.WEB_HOST || 'localhost';
const PORT = process.env.WEB_PORT || 3001;
const BASE_URL = `http://${HOST}:${PORT}`;

/**
 * Checks current page for aXe violations and fails test if there are any.
 */
const axeCheckWrapper = async test => {
  const { violations } = await axeCheck(test);
  await test.expect(violations.length === 0).ok(createReport(violations));
};

/**
 * Performs an ID.me login with credentials provided by environment variables.
 */
const login = async () => {
  await t
    .typeText('#user_email', process.env.USER_EMAIL)
    .typeText('#user_password', process.env.USER_PASSWORD)
    .pressKey('enter')
    .click('.btn-primary')
    .click('.btn-primary');
};

export { BASE_URL, axeCheckWrapper as axeCheck, login };
