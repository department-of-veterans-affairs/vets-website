import contestableIssuesReducer from '../../shared/reducers/contestableIssues';

/**
 * We don't use getEligibleContestableIssues from util/submit here because we
 * need to filter issues based on a feature flag; once NOD v3 (nod_part3_update)
 * is stable at 100%, we can remove the feature flag and replace this function
 * from utils/submit
 */
const getEligibleContestableIssues = data => data;

export default contestableIssuesReducer(getEligibleContestableIssues);
