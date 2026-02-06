const formatISO = require('date-fns/formatISO');
const subDays = require('date-fns/subDays');

const createApplications = (updatedDaysAgo = 1) => {
  const daysAgo = subDays(Date.now(), updatedDaysAgo);

  return {
    data: [
      {
        id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
        type: 'submission_status',
        attributes: {
          id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
          detail: '',
          formType: '21-0845',
          message: null,
          status: 'received',
          createdAt: '2023-12-15T20:40:47.583Z',
          updatedAt: formatISO(daysAgo),
          pdfSupport: true,
        },
      },
      {
        id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
        type: 'submission_status',
        attributes: {
          id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
          detail: '',
          formType: '22-1990',
          message: null,
          status: 'vbms',
          createdAt: '2023-12-15T20:40:47.583Z',
          updatedAt: formatISO(daysAgo),
          pdfSupport: false,
        },
      },
      {
        // Error 'API DOC105' on form submission from the Benefits Intake API
        id: '417f5024-1154-4949-9e2e-4a196726014e',
        type: 'submission_status',
        attributes: {
          id: '417f5024-1154-4949-9e2e-4a196726014e',
          detail: 'Invalid or unknown id',
          formType: '686C-674-V2',
          message: null,
          status: 'error',
          createdAt: '2025-04-30T14:50:48.504Z',
          updatedAt: null,
          pdfSupport: false,
        },
      },
    ],
  };
};

const createApplicationsEmpty = () => {
  return {
    data: [],
  };
};

const createApplicationsFailure = () => {
  return {
    errors: [
      {
        title: 'Bad Request',
        detail: 'Received a bad request response from the upstream server',
        code: 'EVSS400',
        source: 'EVSS::DisabilityCompensationForm::Service',
        status: '400',
        meta: {},
      },
    ],
  };
};

module.exports = {
  createApplications,
  createApplicationsEmpty,
  createApplicationsFailure,
};
