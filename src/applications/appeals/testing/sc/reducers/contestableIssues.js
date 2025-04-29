import { getEligibleContestableIssues } from '../../../shared/utils/issues';
import contestableIssuesReducer from '../../../shared/reducers/contestableIssues';

export default contestableIssuesReducer(getEligibleContestableIssues);
