import { getEligibleContestableIssues } from '../utils/helpers';

import contestableIssuesReducer from '../../shared/reducers/contestableIssues';

export default contestableIssuesReducer(getEligibleContestableIssues);
