/**
 * Run mock appeals server using
 * > yarn mock-api --responses ./src/applications/appeals/shared/tests/mock-api.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const mockSipGet = require('./fixtures/mocks/prefill.json');
const mockSipPut = require('./fixtures/mocks/put-progress-forms.json');
const mockUser = require('./fixtures/mocks/user.json');

const validDate = offset =>
  dateFns.format(dateFns.add(new Date(), { months: offset }), 'yyyy-MM-dd');

const issues = {
  data: [
    {
      id: null,
      type: 'contestableIssue',
      attributes: {
        ratingIssueReferenceId: '142894',
        ratingIssueProfileDate: validDate(-2),
        ratingIssueDiagnosticCode: '5260',
        ratingIssueSubjectText: 'Ankylosis of knee',
        ratingIssuePercentNumber: '10',
        description:
          'Service connection for Ankylosis of knee is granted with an evaluation of 10 percent effective December 2, 2020.',
        isRating: true,
        latestIssuesInChain: [
          {
            id: null,
            approxDecisionDate: validDate,
          },
        ],
        decisionIssueId: null,
        ratingDecisionReferenceId: null,
        approxDecisionDate: validDate,
        rampClaimId: null,
        titleOfActiveReview: null,
        sourceReviewType: null,
        timely: true,
      },
    },
  ],
};

const itf = {
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: validDate(-6),
          expirationDate: validDate(6),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
      ],
    },
  },
};

const responses = {
  'GET /v0/user': mockUser,
  'GET /v0/feature_toggles': {
    data: {
      features: [{ name: 'placeholderToggle', value: false }],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/20-0995': mockSipGet,
  'GET /v0/in_progress_forms/20-0996': mockSipGet,
  'GET /v0/in_progress_forms/10182': mockSipGet,

  'PUT /v0/in_progress_forms/20-0995': mockSipPut,
  'PUT /v0/in_progress_forms/20-0996': mockSipPut,
  'PUT /v0/in_progress_forms/10182': mockSipPut,

  'GET /v0/intent_to_file': itf,

  'GET /decision_reviews/v1/notice_of_disagreements/contestable_issues': issues,
  'GET /decision_reviews/v1/supplemental_claims/contestable_issues/compensation': issues,
  'GET /decision_reviews/v1/higher_level_reviews/contestable_issues/compensation': issues,
};

module.exports = delay(responses, 200);
