const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const mockSipPut = require('./fixtures/mocks/in-progress-forms.json');
const mockSipGet = require('./fixtures/mocks/prefill.json');

const mockUser = require('../../shared/tests/fixtures/mocks/user.json');

const validDate = dateFns.format(
  dateFns.add(new Date(), { months: -2 }),
  'yyyy-MM-dd',
);

const responses = {
  ...commonResponses,

  'GET /v0/user': mockUser,

  'GET /v0/feature_toggles': { data: { features: [] } },

  'GET /v0/maintenance_windows': { data: [] },

  'GET /data/cms/vamc-ehr.json': { data: [] },

  'GET /v0/in_progress_forms/20-0996': mockSipGet,

  'PUT /v0/in_progress_forms/20-0996': mockSipPut,

  'GET /v1/higher_level_reviews/contestable_issues/compensation': {
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
  },
};

module.exports = delay(responses, 1000);
