import { CONTESTABLE_ISSUES_API } from '../constants/apis';
import mockData from './fixtures/data/101-issues.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';

import { HLR_BASE_URL } from '../../shared/constants';
import preventMaxSelections from '../../shared/tests/cypress.max-selections';

preventMaxSelections({
  baseUrl: HLR_BASE_URL,
  contestableApi: `${CONTESTABLE_ISSUES_API}/compensation`,
  formId: '20-0996',
  data: mockData.data,
  inProgressVersion: 3,
  mockInProgress,
});
