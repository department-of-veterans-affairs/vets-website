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
const mockMaxData = require('./e2e/fixtures/removal-only-v3.json');

const returnUrl = '/options-selection';

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
        inProgressFormId: 1234,
      },
    },
  },
};

const mockDependents = {
  data: {
    attributes: {
      // Covering 11 scenarios
      // see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/dependents/picklist/flow.md
      persons: [
        {
          firstName: 'SPOUSY', // Divorced
          lastName: 'FOSTER',
          dateOfBirth: createDate(45),
          ssn: '3332',
          relationshipToVeteran: 'Spouse', // prefill
          relationship: 'Spouse', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'SUMMER', // Deceased
          lastName: 'FOSTER',
          dateOfBirth: createDate(46),
          ssn: '3331',
          relationshipToVeteran: 'Spouse', // prefill
          relationship: 'Spouse', // API
          awardIndicator: 'Y',
        },

        {
          firstName: 'PENNY', // Married
          lastName: 'FOSTER',
          dateOfBirth: createDate(17),
          ssn: '3479',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'FRANK', // Death
          lastName: 'FOSTER',
          dateOfBirth: createDate(33),
          ssn: '3236',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'JOE', // Left school & no permanent disability
          lastName: 'FOSTER',
          dateOfBirth: createDate(19),
          ssn: '3468',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'MIKE', // Left school & has permanent disability
          lastName: 'FOSTER',
          dateOfBirth: createDate(20),
          ssn: '3499',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'STACY', // Left household & < 50% financial support
          lastName: 'FOSTER',
          dateOfBirth: createDate(0, 4),
          ssn: '3233',
          relationshipToVeteran: 'Child', // prefill (Stepchild)
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'JENNIFER', // Left household & >= 50% financial support
          lastName: 'FOSTER',
          dateOfBirth: createDate(4),
          ssn: '3311',
          relationshipToVeteran: 'Child', // prefill (Stepchild)
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'FORMER', // Adopted
          lastName: 'FOSTER',
          dateOfBirth: createDate(11),
          ssn: '3145',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'Y',
        },

        {
          firstName: 'PETER', // Deceased
          lastName: 'FOSTER',
          dateOfBirth: createDate(89),
          ssn: '0104',
          relationshipToVeteran: 'Parent', // prefill
          relationship: 'Parent', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'MARY', // Other
          lastName: 'FOSTER',
          dateOfBirth: createDate(85),
          ssn: '0155',
          relationshipToVeteran: 'Parent', // prefill
          relationship: 'Parent', // API
          awardIndicator: 'Y',
        },
        {
          firstName: 'EXTRA', // No award
          lastName: 'FOSTER',
          dateOfBirth: createDate(10),
          ssn: '3189',
          relationshipToVeteran: 'Child', // prefill
          relationship: 'Child', // API
          awardIndicator: 'N',
        },
      ],
    },
  },
};

/**
 * @returns {Object} mock user data with inProgressForms
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

const mockRatingInfo = {
  data: {
    id: '',
    type: 'lighthouse_rating_info',
    attributes: {
      userPercentOfDisability: 70,
      sourceSystem: 'Lighthouse',
    },
  },
};

const responses = {
  'GET /v0/user': userData(),
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'vaDependentsV3', value: true },
        { name: 'va_dependents_v3', value: true },
        { name: 'vaDependentsNetWorthAndPension', value: true },
        { name: 'va_dependents_net_worth_and_pension', value: true },
        { name: 'vaDependentsDuplicateModals', value: true },
        { name: 'va_dependents_duplicate_modals', value: true },
        { name: 'manage_dependents', value: true },
        { name: 'manageDependents', value: true },
        { name: 'vaDependentsVerification', value: true },
        { name: 'va_dependents_verification', value: true },
        { name: 'vaDependentsBrowserMonitoringEnabled', value: true },
        { name: 'va_dependents_browser_monitoring_enabled', value: true },
        { name: 'va_dependents_no_ssn', value: true },
        { name: 'vaDependentsNoSsn', value: true },
      ],
    },
  },
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /data/cms/vamc-ehr.json': {},

  'GET /v0/profile/valid_va_file_number': mockVaFileNumber,
  'GET /v0/in_progress_forms/686C-674-V2': mockSipGet,
  'PUT /v0/in_progress_forms/686C-674-V2': mockSipPut,
  'GET /v0/disability_compensation_form/rating_info': mockRatingInfo,

  'GET /v0/dependents_applications/show': mockDependents,

  'POST /v0/dependents_applications': submission,
};

module.exports = delay(responses, 200);
