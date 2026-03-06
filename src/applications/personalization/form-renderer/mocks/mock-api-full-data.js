/* eslint-disable camelcase */
const dateFns = require('date-fns');
const mockData = require('../../../dependents/686c-674/tests/e2e/fixtures/maximal.json');
const mockUser = require('../../../dependents/686c-674/tests/e2e/user.json');
const mockSubmission = require('./testdata');

const userData = () => {
  const twoMonthsAgo = dateFns.getUnixTime(
    dateFns.add(new Date(), { months: -2 }),
  );

  const sipData = {
    form: '686C-674-V2',
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

const mockSipGet = {
  formData: mockData,
  metadata: {
    version: 0,
    prefill: false,
    returnUrl: '/veteran-information',
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
        returnUrl: '/veteran-information',
        savedAt: 1593500000000,
        lastUpdated: 1593500000000,
        expiresAt: 99999999999,
        inProgressFormId: 1234,
      },
    },
  },
};

const createDate = (yearsAgo = 0, monthsAgo = 0, formatDate = 'MM/dd/yyyy') =>
  dateFns.format(
    dateFns.sub(new Date(), { years: yearsAgo, months: monthsAgo }),
    formatDate,
  );

const mockDependents = {
  data: {
    attributes: {
      persons: [
        {
          firstName: 'SUMMER', // Deceased
          lastName: 'FOSTER',
          dateOfBirth: createDate(46),
          ssn: '3331',
          relationshipToVeteran: 'Spouse', // prefill
          relationship: 'Spouse', // API
          awardIndicator: 'Y',
        },
      ],
    },
  },
};

const responses = {
  'GET /v0/user': userData(),
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'dependents_enable_form_viewer_mfe', value: true },
        { name: 'vaDependentsV3', value: true },
        { name: 'va_dependents_v3', value: true },
      ],
    },
  },
  'GET /v0/profile/valid_va_file_number': {
    data: {
      id: '',
      type: 'va_file_number_response',
      attributes: {
        validVaFileNumber: true,
      },
    },
  },
  'GET /v0/in_progress_forms/686C-674-V2': mockSipGet,
  'PUT /v0/in_progress_forms/686C-674-V2': mockSipPut,
  'GET /v0/dependents_applications/show': mockDependents,
  'GET /data/cms/vamc-ehr.json': {},
  'GET /v0/digital_forms_api/submissions/12345': {
    submission: mockSubmission.data,
    template: mockSubmission.config,
  },
  'POST /v0/dependents_applications': {
    formSubmissionId: '123fake-submission-id-567',
    timestamp: '2020-11-12',
    attributes: {
      guid: '123fake-submission-id-567',
    },
    submissionId: 12345,
  },
};

module.exports = responses;
