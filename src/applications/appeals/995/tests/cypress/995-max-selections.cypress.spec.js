import { CONTESTABLE_ISSUES_API } from '../../constants/apis';

import mockData from '../fixtures/data/pre-api-101-issues.json';
import mockInProgress from '../fixtures/mocks/in-progress-forms.json';

import { SC_BASE_URL } from '../../../shared/constants';
import preventMaxSelections from '../../../shared/tests/cypress.max-selections';

preventMaxSelections({
  baseUrl: SC_BASE_URL,
  contestableApi: `${CONTESTABLE_ISSUES_API}/compensation`,
  formId: '20-0995',
  data: mockData.data,
  inProgressVersion: 1,
  mockInProgress,
});
