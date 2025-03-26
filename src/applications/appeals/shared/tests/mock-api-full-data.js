/**
 * Run mock appeals server with max data using
 * > yarn mock-api --responses ./src/applications/appeals/shared/tests/mock-api-full-data.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const mockSipPut = require('./fixtures/mocks/put-progress-forms.json');
const mockUser = require('./fixtures/mocks/user.json');

const mockScMax = require('../../995/tests/fixtures/data/maximal-test-v2.json');
const mockHlrMax = require('../../996/tests/fixtures/data/maximal-test-v2.json');
const mockNodMax = require('../../10182/tests/fixtures/data/maximal-test.json');

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
            approxDecisionDate: validDate(-2),
          },
        ],
        decisionIssueId: null,
        ratingDecisionReferenceId: null,
        approxDecisionDate: validDate(-2),
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

const createSip = data => ({
  formData: data.data,
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/veteran-information',
  },
});

/**
 *
 * @param {String} inProgressFormId - pass in '20-0995', '20-0996', or '10182'
 * @returns mock user data with inProgressForms
 */
const userData = () => {
  const lastUpdated = new Date().getTime();
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = form => ({
    form,
    metadata: {
      version: 1,
      returnUrl: '/veteran-information',
      savedAt: new Date().getTime(),
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      createdAt: twoMonthsAgo,
      expiresAt: dateFns.getUnixTime(dateFns.add(new Date(), { years: 1 })),
      lastUpdated: twoMonthsAgo,
      inProgressFormId: 1234,
    },
    lastUpdated,
  });

  return {
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        inProgressForms: [
          sipData('20-0995'),
          sipData('20-0996'),
          sipData('10182'),
        ],
      },
    },
  };
};

const responses = {
  'GET /v0/user': userData(),
  'GET /v0/feature_toggles': {
    data: {
      features: [
        { name: 'sc_new_form', value: true },
        { name: 'hlrConfirmationUpdate', value: true },
        { name: 'nodConfirmationUpdate', value: true },
      ],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/in_progress_forms/20-0995': createSip(mockScMax),
  'GET /v0/in_progress_forms/20-0996': createSip(mockHlrMax),
  'GET /v0/in_progress_forms/10182': createSip(mockNodMax),

  'PUT /v0/in_progress_forms/20-0995': mockSipPut,
  'PUT /v0/in_progress_forms/20-0996': mockSipPut,
  'PUT /v0/in_progress_forms/10182': mockSipPut,

  'GET /v0/intent_to_file': itf,

  'GET /decision_reviews/v1/notice_of_disagreements/contestable_issues': issues,
  'GET /decision_reviews/v1/supplemental_claims/contestable_issues/compensation': issues,
  'GET /decision_reviews/v1/higher_level_reviews/contestable_issues/compensation': issues,
};

module.exports = delay(responses, 200);
