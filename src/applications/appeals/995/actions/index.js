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
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '7863',
            ratingIssueProfileDate: '2026-01-06',
            ratingIssueDiagnosticCode: null,
            ratingIssueSubjectText: 'Let Knee Instability',
            ratingIssuePercentNumber: '10',
            description:
              'Evaluation of let knee instability, which is currently 10 percent disabling, is continued.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-06',
              },
            ],
            decisionIssueId: null,
            ratingDecisionReferenceId: null,
            approxDecisionDate: '2026-01-06',
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: false,
            activeReview: false,
          },
        },
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '7862',
            ratingIssueProfileDate: '2026-01-06',
            ratingIssueDiagnosticCode: null,
            ratingIssueSubjectText:
              "Dupuytren's contracture (abnormal thickening of tissues in palm of hand), bilateral",
            ratingIssuePercentNumber: '0',
            description:
              "Evaluation of Dupuytren's contracture (abnormal thickening of tissues in palm of hand), bilateral, which is currently 0 percent disabling, is continued.",
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-06',
              },
            ],
            decisionIssueId: null,
            ratingDecisionReferenceId: null,
            approxDecisionDate: '2026-01-06',
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: false,
            activeReview: false,
          },
        },
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '98237498237',
            ratingIssueProfileDate: '2026-01-03',
            ratingIssueDiagnosticCode: null,
            ratingIssueSubjectText: 'Gastritis',
            ratingIssuePercentNumber: '10',
            description:
              'Evaluation of gastritis, which is currently 10 percent disabling, is continued.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-03',
              },
            ],
            decisionIssueId: null,
            ratingDecisionReferenceId: null,
            approxDecisionDate: '2026-01-03',
            rampClaimId: null,
            titleOfActiveReview: 'Supplemental Claim',
            sourceReviewType: null,
            timely: true,
            activeReview: true,
          },
        },
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '7884',
            ratingIssueProfileDate: '2026-01-02',
            ratingIssueDiagnosticCode: '5260',
            ratingIssueSubjectText: 'Right Knee Injury',
            ratingIssuePercentNumber: '30',
            description:
              'Evaluation of right knee injury, which is currently 30 percent disabling, is continued.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-01-02',
              },
            ],
            decisionIssueId: null,
            ratingDecisionReferenceId: null,
            approxDecisionDate: '2026-01-02',
            rampClaimId: null,
            titleOfActiveReview: 'Supplemental Claim',
            sourceReviewType: null,
            timely: false,
            activeReview: true,
          },
        },
        {
          id: null,
          type: 'contestableIssue',
          attributes: {
            ratingIssueReferenceId: '8891',
            ratingIssueProfileDate: '2026-02-20',
            ratingIssueDiagnosticCode: '7101',
            ratingIssueSubjectText: 'Hypertension',
            ratingIssuePercentNumber: null,
            description: 'Service connection for hypertension is denied.',
            isRating: true,
            latestIssuesInChain: [
              {
                id: null,
                approxDecisionDate: '2026-02-20',
              },
            ],
            decisionIssueId: null,
            ratingDecisionReferenceId: null,
            approxDecisionDate: '2026-02-20',
            rampClaimId: null,
            titleOfActiveReview: null,
            sourceReviewType: null,
            timely: false,
            activeReview: false,
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
