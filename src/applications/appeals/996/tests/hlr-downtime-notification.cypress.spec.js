import { CONTESTABLE_ISSUES_API } from '../constants';

import mockData from './fixtures/data/minimal-test-v2.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';

import { HLR_BASE_URL } from '../../shared/constants';
import downtimeTesting from '../../shared/tests/cypress.downtime';

downtimeTesting({
  baseUrl: HLR_BASE_URL,
  contestableApi: `/v0${CONTESTABLE_ISSUES_API}`,
  formId: '20-0996',
  data: mockData.data,
  inProgressVersion: 3,
  mockInProgress,
});
