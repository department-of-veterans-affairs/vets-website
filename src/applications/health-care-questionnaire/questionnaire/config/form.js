import React from 'react';

import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import VeteranInfoPage from '../components/veteran-info';
import ReasonForVisit from '../components/reason-for-visit';
import ReasonForVisitDescription from '../components/reason-for-visit-description';
import { GetHelpFooter, NeedHelpSmall } from '../../shared/components/footer';
import ExpiresAt from '../components/expires-at';
import Messages from '../components/messages';

import { TITLES, createPathFromTitle } from './utils';
import { preventLargeFields } from './validators';
import manifest from '../manifest.json';
import { submit, transformForSubmit } from '../../shared/api';

import { updateUrls } from './migrations';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/health_quest/v0/questionnaire_responses`,
  trackingPrefix: 'health-care-questionnaire',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  downtime: {
    dependencies: [externalServices.hcq],
  },
  submit,
  transformForSubmit,
  submissionError: Messages.ServiceDown,
  formId: VA_FORM_IDS.FORM_HC_QSTNR,
  saveInProgress: {
    resumeOnly: true,
    messages: {
      inProgress: '',
      expired: 'Your saved upcoming appointment questionnaire has expired.',
      saved: 'Your questionnaire has been saved.',
    },
  },
  version: 1,
  migrations: [updateUrls],
  prefillEnabled: true,
  footerContent: GetHelpFooter,
  preSubmitInfo: {
    CustomComponent: NeedHelpSmall,
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
      title: TITLES.demographics,
      reviewDescription: VeteranInfoPage.review,
      pages: {
        demographicsPage: {
          path: createPathFromTitle(TITLES.demographics),
          hideHeaderRow: true,
          title: TITLES.demographics,
          uiSchema: {
            veteranInfo: {
              'ui:field': VeteranInfoPage.field,
              'ui:options': {
                hideLabelText: true,
              },
            },

            daysTillExpires: {
              'ui:field': ExpiresAt.field,
              'ui:options': {
                hideLabelText: true,
                hideOnReview: true,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteranInfo: {
                type: 'object',
                properties: {},
              },
              daysTillExpires: {
                type: 'number',
              },
            },
          },
        },
      },
    },
    chapter2: {
      title: TITLES.reasonForVisit,
      pages: {
        reasonForVisit: {
          path: createPathFromTitle(TITLES.reasonForVisit),
          title: TITLES.reasonForVisit,
          uiSchema: {
            reasonForVisit: {
              'ui:field': ReasonForVisit.field,
              'ui:options': {
                hideLabelText: true,
              },
              'ui:reviewField': ReasonForVisit.review,
            },
            reasonForVisitDescription: {
              'ui:widget': ReasonForVisitDescription.field,
              'ui:validations': [preventLargeFields],
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
                  divorce, new baby, change in your job, retirement, or other
                  medical conditions)
                </span>
              ),
              'ui:validations': [preventLargeFields],
            },
            questions: {
              items: {
                additionalQuestions: {
                  'ui:validations': [preventLargeFields],
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
