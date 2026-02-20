import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from 'platform/utilities/environment';
import moment from 'moment';
import { getStatus, extractMessages } from '../helpers';
import {
  CH31_CASE_MILESTONES_FETCH_FAILED,
  CH31_CASE_MILESTONES_FETCH_STARTED,
  CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
} from '../constants';

export function submitCh31CaseMilestones({ milestoneCompletionType, user }) {
  return dispatch => {
    dispatch({ type: CH31_CASE_MILESTONES_FETCH_STARTED });

    const url = `${environment.API_URL}/vre/v0/ch31_case_milestones`;

    return apiRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        icn: user.profile.icn,
        milestones: [
          {
            milestoneType: milestoneCompletionType,
            isMilestoneCompleted: true,
            milestoneCompletionDate: moment().format('YYYY-MM-DD'),
            milestoneSubmissionUser: user.profile.accountUuid,
          },
        ],
      }),
    })
      .then(response => {
        dispatch({
          type: CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
          payload: response.data,
        });
      })
      .catch(errOrResp => {
        const status = getStatus(errOrResp);
        const messages = extractMessages(errOrResp);

        dispatch({
          type: CH31_CASE_MILESTONES_FETCH_FAILED,
          error: {
            status: status ?? null,
            messages: messages.length
              ? messages
              : [errOrResp?.message || 'Network error'],
          },
        });
      });
  };
}
