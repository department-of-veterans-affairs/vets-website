import { CONTESTABLE_ISSUES_API } from '../constants';

import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockData from './fixtures/data/101-issues.json';

import { NOD_BASE_URL } from '../../shared/constants';
import preventMaxSelections from '../../shared/tests/cypress.max-selections';

preventMaxSelections({
  baseUrl: NOD_BASE_URL,
  contestableApi: `/v1${CONTESTABLE_ISSUES_API}`,
  formId: '10182',
  inProgressVersion: 2,
  data: mockData.data,
  mockInProgress,
});
