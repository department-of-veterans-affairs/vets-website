/* eslint-disable camelcase */
const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

// const cancelledAppointmentCompletedQuestionnaire = require('../mock-data/fhir/cancelled.appointment.completed.primary.care.questionnaire.json');
// const cancelledAppointmentInProgressQuestionnaire = require('../mock-data/fhir/cancelled.appointment.in.progress.primary.care.questionnaire.json');
// const cancelledAppointmentNotStartedQuestionnaire = require('../mock-data/fhir/cancelled.appointment.not.started.primary.care.questionnaire.json');
// const upcomingPrimaryCareAppointmentCompletedQuestionnaire = require('../mock-data/fhir/upcoming.appointment.completed.primary.care.questionnaire.json');
// const upcomingPrimaryCareAppointmentInProgressQuestionnaire = require('../mock-data/fhir/upcoming.appointment.in.progress.primary.care.questionnaire.json');
// const upcomingMentalHealthAppointmentNotStartedQuestionnaire = require('../mock-data/fhir/upcoming.appointment.not.started.mental.health.questionnaire.json');
const upcomingPrimaryCareAppointmentNotStartedQuestionnaire = require('../mock-data/fhir/upcoming.appointment.not.started.primary.care.questionnaire.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: ['21-526EZ'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
        ],
        va_profile: {
          status: 'OK',
          birth_date: '19511118',
          family_name: 'Hunter',
          gender: 'M',
          given_names: ['Julio', 'E'],
          active_status: 'active',
          facilities: [
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
          ],
        },
      },
    },
    meta: { errors: null },
  },
  'GET /v0/feature_toggles': (_req, _res) => {},
  'GET /health_quest/v0/questionnaire_manager': {
    data: [upcomingPrimaryCareAppointmentNotStartedQuestionnaire],
  },
  'POST /health_quest/v0/questionnaire_manager': {
    data: {
      resourceType: 'QuestionnaireResponse',
      id: 'dcfbea7a-a9eb-4356-bee5-74eeb13f5022',
      meta: {
        lastUpdated: '2021-05-17T20:18:48.596Z',
        tag: [
          {
            system: 'https://api.va.gov/services/pgd',
            code: '66a5960c-68ee-4689-88ae-4c7cccf7ca79',
            display: 'VA GOV CLIPBOARD',
          },
        ],
      },
      text: {
        status: 'generated',
        div: '<div><h1>Psychiatry clinic questionnaire</h1></div>',
      },
      identifier: {
        type: {
          coding: [
            {
              system: 'https://pki.dmdc.osd.mil/milconnect',
              code: 'QuestionnaireResponseID',
              userSelected: false,
            },
          ],
        },
        system: 'urn:uuid:2.16.840.1.113883.4.349',
        value: '1776c749-91b8-4f33-bece-a5a72f3bb09b',
      },
      questionnaire: 'Questionnaire/2e0c7ae8-a33d-4e53-925a-d8eb61017123',
      status: 'completed',
      subject: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Appointment/I2-3PYJBEU2DIBW5RZT2XI3PASYGMQFEQEGUDEHYKKFBLHSVPEO6XJA0000',
      },
      authored: '2021-05-17T20:18:47+00:00',
      source: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1013424543V075307',
      },
      item: [
        {
          linkId: '01',
          text: 'What is the reason for this appointment?',
          answer: [{ valueString: 'Routine or follow-up visit' }],
        },
        {
          linkId: '02',
          text:
            'Are there any additional details you’d like to share with your provider about this appointment?',
          answer: [
            {
              valueString:
                "I am experiencing lower back pain and I can't sleep",
            },
          ],
        },
        {
          linkId: '03',
          text:
            'Are there any other concerns or changes in your life that are affecting you or your health? (For example, a marriage, divorce, new baby, change in your job, retirement, or other medical conditions)',
        },
        {
          linkId: '04',
          text:
            'Do you have a question you want to ask your provider? Please enter your most important question first.',
        },
      ],
    },
  },
  'PUT /v0/in_progress_forms/:formId': {
    data: {
      data: {
        id: '10439',
        type: 'in_progress_forms',
        attributes: {
          formId:
            'HC-QSTNR_I2-3PYJBEU2DIBW5RZT2XI3PASYGMQFEQEGUDEHYKKFBLHSVPEO6XJA0000_2e0c7ae8-a33d-4e53-925a-d8eb61017123',
          createdAt: '2021-05-17T14:32:18.318Z',
          updatedAt: '2021-05-17T20:18:47.212Z',
          metadata: {
            version: 1,
            returnUrl: '/veteran-information',
            savedAt: 1621282726845,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: 1621282726843,
              hasAttemptedSubmit: true,
            },
            expiresAt: 1627762727,
            lastUpdated: 1621282727,
            inProgressFormId: 10439,
          },
        },
      },
    },
  },
  'DELETE /v0/in_progress_forms/:formId': { data: {} },
};

module.exports = responses;
