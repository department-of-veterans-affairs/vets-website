// import fullSchema from 'vets-json-schema/dist/HC-QSTNR-schema.json';

import React from 'react';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AppointmentInfoBox from '../components/AppointmentInfoBox';
import ReasonForVisit from '../components/reason-for-visit';
import ChiefComplaint from '../components/chief-complaint';
import GetHelp from '../components/get-help';

// import AdditionalQuestions from '../components/additional-questions'
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;
const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/healthcare_questionnaire`,
  trackingPrefix: 'healthcare-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_HC_QSTNR,
  version: 0,
  prefillEnabled: true,
  footerContent: GetHelp.footer,
  savedFormMessages: {
    notFound: 'Please start over to apply for Upcoming Visit questionnaire.',
    noAuth:
      'Please sign in again to continue your application for Upcoming Visit questionnaire.',
  },
  title: 'Reason for visit clipboard',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: "Veteran's Information",
      pages: {
        demographicsPage: {
          path: 'demographics',
          hideHeaderRow: true,
          title: 'Veteran Information',
          uiSchema: {
            'view:veteranInfo': {
              'ui:field': AppointmentInfoBox,
              'ui:reviewField': AppointmentInfoBox,
              'ui:options': {
                viewComponent: AppointmentInfoBox,
              },
              seen: {},
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:veteranInfo': {
                type: 'object',
                properties: {
                  seen: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    chapter2: {
      title: 'Reason for visit and concerns',
      pages: {
        reasonForVisit: {
          path: 'reason-for-visit',
          title: 'Reason for visit and concerns',
          uiSchema: {
            reasonForVisit: {
              'ui:field': ReasonForVisit.field,
              'ui:title': ' ',
              'ui:reviewField': ReasonForVisit.review,
            },
            chiefComplaint: {
              'ui:widget': ChiefComplaint.field,
              'ui:title': (
                <span>
                  Are there any <strong>additional details</strong> you’d like
                  to share with your provider about{' '}
                  <strong>this appointment</strong>?
                </span>
              ),
            },
            lifeEvents: {
              'ui:widget': 'textarea',
              'ui:title': (
                <span>
                  Are there any <strong>life events</strong> that are positively
                  or negatively affecting your health (e.g. marriage, divorce,
                  new job, retirement, parenthood, or finances)?
                </span>
              ),
            },
            questions: {
              items: {
                additionalQuestions: {
                  'ui:title':
                    'Do you have other questions you want to ask your provider? Please enter them below with your most important question listed first.',
                },
              },
              'ui:options': {
                keepInPageOnReview: true,
                itemName: 'Question',
                viewField: formData => {
                  return <>{formData.formData.additionalQuestions}</>;
                },
              },
              // 'ui:reviewField': AdditionalQuestions.review,
              'ui:title': 'Ranked questions for your provider',
            },
          },
          schema: {
            type: 'object',
            required: ['chiefComplaint'],
            properties: {
              reasonForVisit: {
                type: 'string',
              },
              chiefComplaint: {
                type: 'string',
              },
              lifeEvents: {
                type: 'string',
              },
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    additionalQuestions: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
