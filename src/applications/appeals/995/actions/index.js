import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { DEFAULT_BENEFIT_TYPE } from '../../shared/constants';
import { SUPPORTED_BENEFIT_TYPES } from '../constants';
import { CONTESTABLE_ISSUES_API, ITF_API } from '../constants/apis';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../shared/actions';

export const getContestableIssues = props => {
  const benefitType = props?.benefitType || DEFAULT_BENEFIT_TYPE;
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    const foundBenefitType = SUPPORTED_BENEFIT_TYPES.find(
      type => type.value === benefitType,
    );

    if (!foundBenefitType || !foundBenefitType?.isSupported) {
      return Promise.reject(new Error('invalidBenefitType')).catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
    }

    const apiUrl = `${
      environment.API_URL
    }${CONTESTABLE_ISSUES_API}/${benefitType}`;

    const response = {
      data: [
        // SAME-DATE ISSUE (will be blocked)
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '142894',
            ratingIssueProfileDate: '2026-01-12', // Today's date
            ratingIssueDiagnosticCode: '5260',
            ratingIssueSubjectText: 'Tinnitus',
            ratingIssuePercentNumber: '10',
            description:
              'Ringing in ears. Decision made today - should be blocked from appeal.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-12', // TODAY - triggers blocking
              },
            ],
            decisionIssueId: 1001,
            ratingDecisionReferenceId: 'REF123',
            approxDecisionDate: '2026-01-12', // TODAY - triggers blocking
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: true,
          },
        },

        // ANOTHER SAME-DATE ISSUE (will be blocked)
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '142895',
            ratingIssueProfileDate: '2026-01-12', // Today's date
            ratingIssueDiagnosticCode: '8045',
            ratingIssueSubjectText: 'Back condition',
            ratingIssuePercentNumber: '20',
            description:
              'Lower back pain. Decision made today - should also be blocked.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-12', // TODAY - triggers blocking
              },
            ],
            decisionIssueId: 1002,
            ratingDecisionReferenceId: 'REF124',
            approxDecisionDate: '2026-01-12', // TODAY - triggers blocking
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: true,
          },
        },

        // PAST DATE ISSUE (selectable) This shouldn't show for HLR because issues cannot be more than one year old.
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '142896',
            ratingIssueProfileDate: '2024-08-15',
            ratingIssueDiagnosticCode: '7101',
            ratingIssueSubjectText: 'Hypertension',
            ratingIssuePercentNumber: '30',
            description:
              'High blood pressure. Past decision - can be appealed.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2024-08-15', // PAST DATE - selectable
              },
            ],
            decisionIssueId: 1003,
            ratingDecisionReferenceId: 'REF125',
            approxDecisionDate: '2024-08-15', // PAST DATE - selectable
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: true,
          },
        },

        // YESTERDAY'S DATE ISSUE (selectable)
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '142897',
            ratingIssueProfileDate: '2026-01-11',
            ratingIssueDiagnosticCode: '6260',
            ratingIssueSubjectText: 'Hearing loss',
            ratingIssuePercentNumber: '40',
            description:
              "Bilateral hearing loss. Yesterday's decision - can be appealed.",
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-11', // YESTERDAY - selectable
              },
            ],
            decisionIssueId: 1004,
            ratingDecisionReferenceId: 'REF126',
            approxDecisionDate: '2026-01-11', // YESTERDAY - selectable
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: true,
          },
        },
      ],
    };

    return apiRequest(apiUrl)
      .then(() =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
          benefitType,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
          benefitType,
        }),
      );
  };
};

/** ITF copied from 526 (all-claims) */
export const ITF_FETCH_INITIATED = 'ITF_FETCH_INITIATED';
export const ITF_FETCH_SUCCEEDED = 'ITF_FETCH_SUCCEEDED';
export const ITF_FETCH_FAILED = 'ITF_FETCH_FAILED';

export const ITF_CREATION_INITIATED = 'ITF_CREATION_INITIATED';
export const ITF_CREATION_SUCCEEDED = 'ITF_CREATION_SUCCEEDED';
export const ITF_CREATION_FAILED = 'ITF_CREATION_FAILED';

export function fetchITF({ accountUuid, inProgressFormId }) {
  const apiUrl = `${environment.API_URL}${ITF_API}`;
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });
    return apiRequest(apiUrl)
      .then(({ data }) => dispatch({ type: ITF_FETCH_SUCCEEDED, data }))
      .catch(() => {
        window.DD_LOGS?.logger.error('SC ITF fetch failed', {
          name: 'sc_itf_fetch_failed',
          accountUuid,
          inProgressFormId,
        });
        dispatch({ type: ITF_FETCH_FAILED });
      });
  };
}

export function createITF({
  accountUuid,
  benefitType = DEFAULT_BENEFIT_TYPE,
  inProgressFormId,
}) {
  const apiUrl = `${environment.API_URL}${ITF_API}/${benefitType}`;
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest(apiUrl, { method: 'POST' })
      .then(({ data }) => dispatch({ type: ITF_CREATION_SUCCEEDED, data }))
      .catch(() => {
        window.DD_LOGS?.logger.error('SC ITF creation failed', {
          name: 'sc_itf_creation_failed',
          accountUuid,
          inProgressFormId,
        });
        dispatch({ type: ITF_CREATION_FAILED });
      });
  };
}
