const addDays = require('date-fns/addDays');
const format = require('date-fns/format');

const createAppealsSuccess = (updatedDaysAgo = 10) => {
  const daysAgo = addDays(new Date(), -updatedDaysAgo);
  const formattedDaysAgo = format(daysAgo, 'yyyy-MM-dd');

  return {
    data: [
      {
        id: '2765759',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['2765759'],
          updated: '2021-03-04T19:55:21-05:00',
          incompleteHistory: false,
          type: 'original',
          // this determines if the appeal is open or closed
          active: true,
          description: 'Benefits as a result of VA error (Section 1151)',
          aod: false,
          location: 'bva',
          aoj: 'vba',
          programArea: 'compensation',
          status: { type: 'on_docket', details: {} },
          alerts: [],
          docket: {
            front: false,
            total: 140135,
            ahead: 101381,
            ready: 16432,
            month: '2012-04-01',
            docketMonth: '2011-01-01',
            eta: null,
          },
          issues: [
            {
              description: 'Benefits as a result of VA error (Section 1151)',
              diagnosticCode: null,
              active: true,
              lastAction: 'withdrawn',
              date: new Date().toISOString(),
            },
            {
              description: null,
              diagnosticCode: null,
              active: false,
              lastAction: 'withdrawn',
              date: new Date().toISOString(),
            },
            {
              description: null,
              diagnosticCode: null,
              active: false,
              lastAction: null,
              date: null,
            },
            {
              description: null,
              diagnosticCode: null,
              active: false,
              lastAction: null,
              date: null,
            },
            {
              description: 'Benefits as a result of VA error (Section 1151)',
              diagnosticCode: null,
              active: false,
              lastAction: null,
              date: null,
            },
          ],
          events: [
            { type: 'nod', date: '2012-02-02' },
            { type: 'soc', date: '2012-03-03' },
            { type: 'form9', date: '2012-04-04' },
            { type: 'hearing_held', date: formattedDaysAgo },
          ],
          evidence: [],
        },
      },
      {
        id: 'HLR4196',
        type: 'higherLevelReview',
        attributes: {
          appealIds: ['HLR4196'],
          updated: '2025-09-26T10:48:46-04:00',
          incompleteHistory: false,
          active: true,
          description: '1 medical issue',
          location: 'aoj',
          aoj: 'vha',
          programArea: 'medical',
          status: {
            type: 'hlr_received',
            details: {},
          },
          alerts: [],
          issues: [
            {
              active: true,
              lastAction: null,
              date: null,
              description: 'Beneficiary Travel - This is a test',
              diagnosticCode: null,
            },
            {
              active: true,
              lastAction: null,
              date: null,
              description: null,
              diagnosticCode: null,
            },
            {
              active: true,
              lastAction: null,
              date: null,
              description: null,
              diagnosticCode: null,
            },
          ],
          events: [
            {
              type: 'hlr_request',
              date: '2023-01-11',
            },
          ],
          evidence: [],
        },
      },
      {
        id: 'SC3239',
        type: 'supplementalClaim',
        attributes: {
          appealIds: ['SC3239'],
          updated: '2025-09-26T10:48:46-04:00',
          incompleteHistory: false,
          active: true,
          description: '1 medical issue',
          location: 'aoj',
          aoj: 'vha',
          programArea: 'medical',
          status: {
            type: 'sc_recieved',
            details: {},
          },
          alerts: [],
          issues: [
            {
              active: true,
              lastAction: null,
              date: null,
              description: 'Beneficiary Travel - This is a test',
              diagnosticCode: null,
            },
            {
              active: true,
              lastAction: null,
              date: null,
              description: null,
              diagnosticCode: null,
            },
          ],
          events: [
            {
              type: 'sc_request',
              date: '2023-01-11',
            },
          ],
          evidence: [],
        },
      },
    ],
  };
};

const createAppealsFailure = () => {
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

module.exports = { createAppealsFailure, createAppealsSuccess };
