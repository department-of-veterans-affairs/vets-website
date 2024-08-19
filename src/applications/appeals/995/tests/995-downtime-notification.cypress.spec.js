import { CONTESTABLE_ISSUES_API } from '../constants';

import mockData from './fixtures/data/minimal-test.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';

import { SC_BASE_URL } from '../../shared/constants';
import downtimeTesting from '../../shared/tests/cypress.downtime';

downtimeTesting({
  baseUrl: SC_BASE_URL,
  contestableApi: `/v1${CONTESTABLE_ISSUES_API}`,
  formId: '20-0995',
  data: mockData.data,
  inProgressVersion: 1,
  mockInProgress,
});
