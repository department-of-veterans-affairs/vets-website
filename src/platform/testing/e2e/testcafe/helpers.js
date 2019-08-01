import { axeCheck, createReport } from 'axe-testcafe';

const HOST = process.env.WEB_HOST || 'localhost';
const PORT = process.env.WEB_PORT || 3001;
const BASE_URL = `http://${HOST}:${PORT}`;

const axeCheckWrapper = async t => {
  const { violations } = await axeCheck(t);
  await t.expect(violations.length === 0).ok(createReport(violations));
};

export { BASE_URL, axeCheckWrapper as axeCheck };
