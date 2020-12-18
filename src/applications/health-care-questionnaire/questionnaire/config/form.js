// import fullSchema from 'vets-json-schema/dist/HC-QSTNR-schema.json';

import React from 'react';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import VeteranInfoPage from '../components/veteran-info';
import ReasonForVisit from '../components/reason-for-visit';
import ReasonForVisitDescription from '../components/reason-for-visit-description';
import GetHelp from '../components/get-help';

import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/health_quest/v0/questionnaire_responses`,
  trackingPrefix: 'health-care-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submit: form => {
    // just for MVP until we have an API set up
    return new Promise((resolve, _reject) => {
      resolve(form.data);
    });
  },
  formId: VA_FORM_IDS.FORM_HC_QSTNR,
  saveInProgress: {
    resumeOnly: true,
    messages: {
      inProgress: '',
      expired:
        'Your saved upcoming appointment questionnaire has expired. If you want to apply for appointment questionnaire, please start a new application.',
      saved: 'Your questionnaire has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  footerContent: GetHelp.footer,
  preSubmitInfo: {
    CustomComponent: GetHelp.review,
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for Upcoming Visit questionnaire.',
    noAuth:
      'Please sign in again to continue your application for Upcoming Visit questionnaire.',
  },
  title: 'Upcoming appointment questionnaire',
  defaultDefinitions: {},
  customText: {
    reviewPageTitle: 'Review',
    appType: 'questionnaire',
    appAction: 'answering questions',
    continueAppButtonText: 'Continue questions',
    finishAppLaterMessage: 'Finish this questionnaire later.',
    appSavedSuccessfullyMessage: 'Questionnaire has been saved.',
    submitButtonText: 'Submit answers',
  },
  chapters: {
    chapter1: {
      title: 'Veteran Information',
      reviewDescription: VeteranInfoPage.review,
      pages: {
        demographicsPage: {
          path: 'demographics',
          hideHeaderRow: true,
          title: 'Veteran Information',
          uiSchema: {
            veteranInfo: {
              'ui:description': VeteranInfoPage.field,
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteranInfo: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
    chapter2: {
      title: 'Prepare for Your Appointment',
      pages: {
        reasonForVisit: {
          path: 'reason-for-visit',
          title: 'Prepare for Your Appointment',
          uiSchema: {
            reasonForVisit: {
              'ui:field': ReasonForVisit.field,
              'ui:title': ' ',
              'ui:reviewField': ReasonForVisit.review,
            },
            reasonForVisitDescription: {
              'ui:widget': ReasonForVisitDescription.field,
              'ui:title': (
                <span>
                  Are there any additional details you’d like to share with your
                  provider about this appointment?
                </span>
              ),
            },
            lifeEvents: {
              'ui:widget': 'textarea',
              'ui:title': (
                <span>
                  Are there any other concerns or changes in your life that are
                  affecting you or your health? (For example, a marriage,
                  divorce, new baby, change in your job, or other medical
                  conditions)
                </span>
              ),
            },
            questions: {
              items: {
                additionalQuestions: {
                  'ui:title':
                    'Do you have a question you want to ask your provider? Please enter your most important question first.',
                },
              },
              'ui:options': {
                doNotScroll: true,
                keepInPageOnReview: true,
                itemName: 'question',
                viewField: formData => {
                  return <>{formData.formData.additionalQuestions}</>;
                },
              },
              'ui:title': 'Additional questions for your provider',
            },
          },
          schema: {
            type: 'object',
            required: ['reasonForVisitDescription'],
            properties: {
              reasonForVisit: {
                type: 'string',
              },
              reasonForVisitDescription: {
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
