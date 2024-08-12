/**
 * Run mock appeals server using
 * yarn mock-api --responses ./src/applications/appeals/shared/tests/mock-api.js
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const mockSipGet = require('./fixtures/mocks/prefill.json');
const mockSipPut = require('./fixtures/mocks/put-progress-forms.json');
const mockUser = require('./fixtures/mocks/user.json');
const issues = require('./fixtures/mocks/contestable-issues.json');
const itf = require('../../995/tests/fixtures/mocks/intent-to-file.json');

const validDate = dateFns.format(
  dateFns.add(new Date(), { months: -2 }),
  'yyyy-MM-dd',
);

const hlrIssues = {
  data: [
    {
      id: null,
      type: 'contestableIssue',
      attributes: {
        ratingIssueReferenceId: '142894',
        ratingIssueProfileDate: validDate,
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

const responses = {
  ...commonResponses,

  'GET /v0/user': mockUser,

  'GET /v0/feature_toggles': { data: { features: [] } },

  'GET /v0/maintenance_windows': { data: [] },

  'GET /data/cms/vamc-ehr.json': { data: [] },

  'GET /v0/in_progress_forms/20-0996': mockSipGet(),

  'PUT /v0/in_progress_forms/20-0996': mockSipPut,

  'GET /v0/intent_to_file': itf,

  'GET /v0/notice_of_disagreements/contestable_issues': issues,
  'GET /v1/supplemental_claims/contestable_issues/compensation': issues,
  'GET /v1/higher_level_reviews/contestable_issues/compensation': hlrIssues,
};

module.exports = delay(responses, 200);
