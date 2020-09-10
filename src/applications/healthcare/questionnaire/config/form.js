// import fullSchema from 'vets-json-schema/dist/HC-QSTNR-schema.json';

import React from 'react';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import AppointmentInfoBox from '../components/AppointmentInfoBox';
import ReasonForVisit from '../components/reason-for-visit';
import ChiefComplaint from '../components/chief-complaint';
import environment from 'platform/utilities/environment';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/healthcare_questionnaire`,
  trackingPrefix: 'healthcare-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'HC-QSTNR',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Upcoming Visit questionnaire.',
    noAuth:
      'Please sign in again to continue your application for Upcoming Visit questionnaire.',
  },
  title: 'Reason fort visit clipboard',
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
              'ui:widget': ReasonForVisit.field,
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
              'ui:options': {
                // eslint-disable-next-line no-unused-vars
                viewField: formData => {
                  // console.log({ formData });
                  return <>BOOOP</>;
                },
              },
              'ui:title': (
                <span style={{ fontWeight: 'normal' }}>
                  Do you have any other additional questions you want to discuss
                  with your provider?
                </span>
              ),
            },
          },
          schema: {
            type: 'object',
            // required: ['chiefComplaint'],
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
