import environment from '~/platform/utilities/environment';

export const shouldMockApiRequest = () =>
  environment.isLocalhost() && !window.Cypress && !window.VetsGov.pollTimeout;

export const mockAppealData = {
  data: [
    {
      // Status: Review your statement of the case - pending_form9
      id: '7387389',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387389', '123'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: true,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'pending_soc',
          details: {
            lastSocDate: '2015-09-12',
            certificationTimeliness: [1, 4],
            socTimeliness: [2, 16],
          },
        },
        docket: null,
        issues: [
          {
            active: true,
            description: 'Service connection for tinnitus',
            lastAction: 'null',
            date: '2016-05-30',
          },
        ],
        alerts: [
          {
            type: 'form9_needed',
            details: {
              date: '2018-01-28',
            },
          },
          {
            type: 'ramp_eligible',
            details: {
              date: '2016-05-30',
            },
          },
          {
            type: 'decision_soon',
            details: {},
          },
        ],
        events: [
          {
            type: 'claim',
            date: '2016-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2016-06-10',
            details: {},
          },
          {
            type: 'form9',
            date: '2016-09-12',
            details: {},
          },
          {
            type: 'soc',
            date: '2016-12-15',
            details: {},
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      // Status: Waiting to be assigned to a judge - on_docket
      id: '7387390',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387390', '456'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: false,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'on_docket',
          details: {
            regionalOffice: 'Chicago Regional Office',
          },
        },
        docket: {
          front: false,
          total: 206900,
          ahead: 109203,
          ready: 22109,
          month: '2016-08-01',
          docketMonth: '2016-04-01',
          eta: null,
        },
        issues: [
          {
            active: true,
            description: 'Service connection for tinnitus',
            lastAction: null,
            date: '2016-05-30',
          },
        ],
        alerts: [],
        events: [
          {
            type: 'claim',
            date: '2010-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2012-06-10',
            details: {},
          },
          {
            type: 'soc',
            date: '2013-06-01',
            details: {},
          },
          {
            type: 'form9',
            date: '2014-06-12',
            details: {},
          },
          {
            type: 'certified',
            date: '2014-09-21',
            details: {},
          },
          {
            type: 'hearing_held',
            date: '2015-05-06',
            details: {
              regionalOffice: 'Chicago',
            },
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      // Status: The Board has made a decision on your appeal - bva_decision
      id: '7387391',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387391', '789'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: false,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'bva_decision',
          details: {
            regionalOffice: 'Chicago Regional Office',
            issues: [
              {
                description: 'Heel, increased rating',
                disposition: 'allowed',
                date: '2016-05-30',
              },
              {
                description: 'Knee, increased rating',
                disposition: 'allowed',
                date: '2016-05-30',
              },
              {
                description: 'Tinnitus, increased rating',
                disposition: 'denied',
                date: '2016-05-30',
              },
              {
                description: 'Leg, service connection',
                disposition: 'denied',
                date: '2016-05-30',
              },
              {
                description: 'Diabetes, service connection',
                disposition: 'remand',
                date: '2016-05-30',
              },
              {
                description: 'Shoulder, service connection',
                disposition: 'remand',
                date: '2016-05-30',
              },
            ],
          },
        },
        docket: {
          front: false,
          total: 206900,
          ahead: 109203,
          ready: 22109,
          eta: '2019-08-31',
        },
        issues: [
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Head, increased rating',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Shoulder, increased rating',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Knee, service connection',
            lastAction: 'field_grant',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Toe, service connection',
            lastAction: 'withdrawn',
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: 'allowed',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Tinnitus, service connection',
            lastAction: 'denied',
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: 'remand',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Tinnitus, service connection',
            lastAction: 'cavc_remand',
            date: '2016-05-30',
          },
        ],
        alerts: [],
        events: [
          {
            type: 'claim',
            date: '2010-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2011-06-10',
            details: {},
          },
          {
            type: 'soc',
            date: '2012-06-10',
            details: {},
          },
          {
            type: 'form9',
            date: '2013-06-10',
            details: {},
          },
          {
            type: 'certified',
            date: '2014-06-10',
            details: {},
          },
          {
            type: 'hearing_held',
            date: '2015-06-10',
            details: {
              regionalOffice: 'Chicago',
            },
          },
          {
            type: 'bva_decision',
            date: '2016-06-10',
            details: {},
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      id: 'SC105',
      type: 'supplementalClaim',
      attributes: {
        appealIds: ['SC105'],
        updated: '2019-05-29T19:38:48-04:00',
        incompleteHistory: false,
        active: true,
        description: 'Eligibility for dental treatment',
        location: 'aoj',
        aoj: 'vha',
        programArea: 'medical',
        status: {
          type: 'sc_received',
          details: {},
        },
        alerts: [],
        issues: [
          {
            description: 'Eligibility for dental treatment',
            diagnosticCode: null,
            active: true,
            lastAction: null,
            date: null,
          },
        ],
        events: [
          {
            type: 'sc_request',
            date: '2019-02-19',
          },
        ],
      },
    },
    {
      id: 'HLR101',
      type: 'higherLevelReview',
      attributes: {
        appealIds: ['HLR101'],
        updated: '2019-08-29T19:38:48-04:00',
        incompleteHistory: false,
        active: true,
        description:
          'Severance of service connection, hypothyroidism, and 1 other',
        location: 'aoj',
        aoj: 'vba',
        programArea: 'compensation',
        status: {
          type: 'hlr_dta_error',
          details: {
            issues: [
              {
                description: 'Service connection, sciatic nerve paralysis',
                disposition: 'denied',
              },
              {
                description: 'Severance of service connection, hypothyroidism',
                disposition: 'allowed',
              },
            ],
          },
        },
        alerts: [
          {
            type: 'ama_post_decision',
            details: {
              decisionDate: '2019-08-05',
              availableOptions: [
                'supplemental_claim',
                'higher_level_review',
                'board_appeal',
              ],
              dueDate: '2020-08-04',
              cavcDueDate: '2019-12-02',
            },
          },
        ],
        issues: [
          {
            description: 'Service connection, sciatic nerve paralysis',
            diagnosticCode: '8520',
            active: false,
            lastAction: 'denied',
            date: '2019-08-05',
          },
          {
            description: 'Severance of service connection, hypothyroidism',
            diagnosticCode: '7903',
            active: false,
            lastAction: 'allowed',
            date: '2019-08-05',
          },
        ],
        events: [
          {
            type: 'hlr_request',
            date: '2019-02-19',
          },
          {
            type: 'hlr_dta_error',
            date: '2019-06-01',
          },
          {
            type: 'hlr_decision',
            date: '2019-08-05',
          },
        ],
      },
    },
    {
      id: 'A102',
      type: 'appeal',
      attributes: {
        appealIds: ['A102'],
        updated: '2019-05-29T19:38:44-04:00',
        incompleteHistory: false,
        type: 'original',
        active: true,
        description:
          'Service connection, malignant skin neoplasm, and 2 others',
        aod: false,
        location: 'bva',
        aoj: 'vba',
        programArea: 'compensation',
        status: {
          type: 'pending_hearing_scheduling',
          details: {
            type: 'video',
          },
        },
        alerts: [],
        docket: {
          type: 'hearing',
          month: '2019-02-01',
          switchDueDate: '2019-06-05',
          eligibleToSwitch: true,
        },
        issues: [
          {
            description: 'Service connection, malignant skin neoplasm',
            diagnosticCode: '7818',
            active: true,
            lastAction: null,
            date: null,
          },
          {
            description: 'Service connection, coronary artery disease',
            diagnosticCode: '7005',
            active: true,
            lastAction: null,
            date: null,
          },
          {
            description: 'Service connection, diabetes',
            diagnosticCode: '7913',
            active: true,
            lastAction: null,
            date: null,
          },
        ],
        events: [
          {
            type: 'ama_nod',
            date: '2019-02-23',
          },
        ],
      },
    },
    {
      id: 'A106',
      type: 'appeal',
      attributes: {
        appealIds: ['A106'],
        updated: '2021-02-29T19:38:44-04:00',
        incompleteHistory: false,
        type: 'original',
        active: false,
        description: 'Reasonableness of attorney fees',
        aod: false,
        location: 'bva',
        aoj: 'other',
        programArea: 'other',
        status: {
          type: 'bva_decision',
          details: {
            issues: [
              {
                description: 'Reasonableness of attorney fees',
                disposition: 'allowed',
              },
            ],
          },
        },
        alerts: [
          {
            type: 'ama_post_decision',
            details: {
              decisionDate: '2021-02-20',
              availableOptions: ['supplemental_claim', 'cavc'],
              dueDate: '2022-02-19',
              cavcDueDate: '2021-06-19',
            },
          },
        ],
        docket: {
          type: 'hearing',
          month: '2019-02-01',
          switchDueDate: '2019-06-05',
          eligibleToSwitch: false,
        },
        issues: [
          {
            description: 'Reasonableness of attorney fees',
            diagnosticCode: null,
            active: false,
            lastAction: 'allowed',
            date: '2021-02-20',
          },
        ],
        events: [
          {
            type: 'ama_nod',
            date: '2019-02-23',
          },
          {
            type: 'hearing_no_show',
            date: '2020-05-21',
          },
          {
            type: 'hearing_held',
            date: '2020-10-21',
          },
          {
            type: 'bva_decision',
            date: '2021-02-20',
          },
        ],
      },
    },
  ],
};
