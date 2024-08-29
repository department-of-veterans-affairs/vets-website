import { CONTESTABLE_ISSUES_API } from '../constants';

import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockData from './fixtures/data/minimal-test.json';

import { NOD_BASE_URL } from '../../shared/constants';
import downtimeTesting from '../../shared/tests/cypress.downtime';

downtimeTesting({
  baseUrl: NOD_BASE_URL,
  contestableApi: `/v0${CONTESTABLE_ISSUES_API}`,
  formId: '10182',
  inProgressVersion: 2,
  data: mockData.data,
  mockInProgress,
});
