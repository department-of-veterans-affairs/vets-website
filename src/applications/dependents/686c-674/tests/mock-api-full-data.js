/**
 * Run mock 686c-674 server with max data using
 * > yarn mock-api --responses ./src/applications/dependents/686c-674/tests/mock-api-full-data.js
 * Run this in browser console
 * > localStorage.setItem('hasSession', true)
 */
const dateFns = require('date-fns');
const delay = require('mocker-api/lib/delay');

const mockUser = require('./e2e/user.json');
const mockVaFileNumber = require('./e2e/fixtures/va-file-number.json');
const mockMaxData = require('./e2e/fixtures/picklist.json');

const returnUrl = '/options-selection/remove-active-dependents'; // '/review-and-submit';

const createDate = (yearsAgo = 0, monthsAgo = 0, formatDate = 'MM/dd/yyyy') =>
  dateFns.format(
    dateFns.sub(new Date(), { years: yearsAgo, months: monthsAgo }),
    formatDate,
  );

const submission = {
  formSubmissionId: '123fake-submission-id-567',
  timestamp: '2020-11-12',
  attributes: {
    guid: '123fake-submission-id-567',
  },
};

const mockSipGet = {
  formData: mockMaxData,
  metadata: {
    version: 0,
    prefill: false,
    returnUrl,
  },
};

const mockSipPut = {
  data: {
    id: '1234',
    type: 'in_progress_forms',
    attributes: {
      formId: '686C-674-V2',
      createdAt: '2021-06-03T00:00:00.000Z',
      updatedAt: '2021-06-03T00:00:00.000Z',
      metadata: {
        version: 1,
        returnUrl,
        savedAt: 1593500000000,
        lastUpdated: 1593500000000,
        expiresAt: 99999999999,
      },
    },
  },
};

const mockDependents = {
  data: {
    attributes: {
      persons: [
        {
          firstName: 'PENNY',
          lastName: 'FOSTER',
          dateOfBirth: createDate(17),
          ssn: '793473479',
          relationshipToVeteran: 'Child',
          awardIndicator: 'Y',
          isStepchild: 'N',
          // options: 'childMarried', 'childNotInSchool', 'stepchildNotMember',
          // 'childAdopted', 'childDied'
          removalReason: 'childMarried',
          marriageDate: createDate(0, 4, 'yyyy-MM-dd'),
        },
        {
          firstName: 'STACY',
          lastName: 'FOSTER',
          dateOfBirth: createDate(0, 4),
          ssn: '798703232',
          relationshipToVeteran: 'Child',
          awardIndicator: 'Y',
        },
        {
          firstName: 'SPOUSY',
          lastName: 'FOSTER',
          dateOfBirth: createDate(45),
          ssn: '702023332',
          relationshipToVeteran: 'Spouse',
          awardIndicator: 'Y',
        },
        {
          firstName: 'PREVIOUS',
          lastName: 'FOSTER',
          dateOfBirth: createDate(44),
          ssn: '702023331',
          relationshipToVeteran: 'Spouse',
          awardIndicator: 'Y',
        },
        {
          firstName: 'PETER',
          lastName: 'FOSTER',
          dateOfBirth: createDate(82),
          ssn: '997010104',
          relationshipToVeteran: 'Parent',
          awardIndicator: 'Y',
        },
        {
          firstName: 'MARY',
          lastName: 'FOSTER',
          dateOfBirth: createDate(85),
          ssn: '997010155',
          relationshipToVeteran: 'Parent',
          awardIndicator: 'Y',
        },
      ],
    },
  },
};

/**
 * @returns mock user data with inProgressForms
 */
const userData = () => {
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = {
    form: '686C-674-V2',
    metadata: {
      version: 1,
      returnUrl,
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
    lastUpdated: twoMonthsAgo,
  };

  return {
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        inProgressForms: [sipData],
      },
    },
  };
};

const responses = {
  'GET /v0/user': userData(),
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'vaDependentsV2', value: true },
        { name: 'va_dependents_v2', value: true },
        { name: 'vaDependentsV3', value: true },
        { name: 'va_dependents_v3', value: true },
        { name: 'vaDependentsNetWorthAndPension', value: true },
        { name: 'va_dependents_net_worth_and_pension', value: true },
        { name: 'vaDependentsDuplicateModals', value: true },
        { name: 'va_dependents_duplicate_modals', value: true },
      ],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/profile/valid_va_file_number': mockVaFileNumber,
  'GET /v0/in_progress_forms/686C-674-V2': mockSipGet,
  'PUT /v0/in_progress_forms/686C-674-V2': mockSipPut,

  'GET /v0/dependents_applications/show': mockDependents,

  'POST /v0/dependents_applications': submission,
};

module.exports = delay(responses, 200);
