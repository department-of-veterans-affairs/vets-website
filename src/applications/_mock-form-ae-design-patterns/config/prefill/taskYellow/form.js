import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import manifest from '../../../manifest.json';
import content from '../../../locales/en/content.json';

import IntroductionPage from '../../../containers/IntroductionPage1010ezr';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import { taskCompletePage } from '../../taskCompletePage';
import { GetFormHelp } from '../../../components/GetFormHelp/index';

import VeteranProfileInformationTaskYellow from '../../../components/FormPages/VeteranProfileInformationTaskYellow';
import { MailingAddressInfoPageTaskYellow } from '../../../components/FormPages/MailingAddressInfoPageTaskYellow';
import { EditMailingAddressTaskYellow } from '../../../components/EditMailingAddress/EditMailingAddressTaskYellow';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/task-yellow/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-yellow',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
  prefillTransformer(pages, formData, metadata) {
    const transformedData = {
      veteranSocialSecurityNumber:
        formData?.data?.attributes?.veteran?.ssn || null,
    };
    return {
      metadata,
      formData: transformedData,
      pages,
    };
  },
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
                'task-yellow/veteran-information/confirm-mailing-address',
              saveButtonText: 'Save',
              subTitle:
                'We’ll send any important information about your application to this address.',
            }),
          CustomPageReview: null,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        taskCompletePage,
      },
    },
  },
};

export default formConfig;
