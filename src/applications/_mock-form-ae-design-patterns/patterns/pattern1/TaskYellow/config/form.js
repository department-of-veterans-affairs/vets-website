import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/IntroductionPage1010ezr';
import { taskCompletePagePattern1 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';
import content from 'applications/_mock-form-ae-design-patterns/shared/locales/en/content.json';
import { VIEW_FIELD_SCHEMA } from 'applications/_mock-form-ae-design-patterns/utils/constants';
import { prefillTransformer } from 'applications/_mock-form-ae-design-patterns/utils/helpers/prefill-transformer';

import VeteranProfileInformationTaskYellow from '../VeteranProfileInformationTaskYellow';
import { MailingAddressInfoPageTaskYellow } from '../MailingAddressInfoPageTaskYellow';
import { EditMailingAddressTaskYellow } from '../EditMailingAddressTaskYellow';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/1/task-yellow/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-yellow',
  introduction: IntroductionPage,
  confirmation: Confirmation,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  title: 'Update your VA health benefits information',
  subTitle: 'Health Benefits Update Form (VA Form 10-10EZR)',
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        profileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformationTaskYellow,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
        confirmMailingAddress: {
          title: 'Contact information',
          path: 'veteran-information/confirm-mailing-address',
          uiSchema: {
            'ui:title': ' ',
            'ui:description': MailingAddressInfoPageTaskYellow,
            'ui:required': () => false, // don't allow progressing without all contact info// needed to block form progression
            'ui:options': {
              hideOnReview: true, // We're using the `ReveiwDescription`, so don't show this page
              forceDivWrapper: true, // It's all info and links, so we don't need a fieldset or legend
            },
            'view:doesMailingMatchHomeAddress': yesNoUI(
              content['vet-address-match-title'],
            ),
          },
          schema: {
            type: 'object',
            properties: {
              'view:doesMailingMatchHomeAddress': yesNoSchema,
            },
            required: ['view:doesMailingMatchHomeAddress'],
          },
        },
        editMailingAddress: {
          title: 'Mailing address',
          path: 'veteran-information/edit-mailing-address',
          CustomPage: props =>
            EditMailingAddressTaskYellow({
              ...props,
              contactPath:
                '1/task-yellow/veteran-information/confirm-mailing-address',
              saveButtonText: 'Save',
              subTitle:
                'We’ll send any important information about your application to this address.',
            }),
          CustomPageReview: null,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        taskCompletePagePattern1,
      },
    },
  },
};

export default formConfig;
