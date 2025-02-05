import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import { taskCompletePagePattern1 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/IntroductionPage1010ezr';
import content from 'applications/_mock-form-ae-design-patterns/shared/locales/en/content.json';
import { VIEW_FIELD_SCHEMA } from 'applications/_mock-form-ae-design-patterns/utils/constants';
import { prefillTransformer } from 'applications/_mock-form-ae-design-patterns/utils/helpers/prefill-transformer';

import { EditAddress } from '../EditContactInfoTaskGreen';
import VeteranProfileInformation from '../VeteranProfileInformation';
import { MailingAddressInfoPageTaskGreen } from '../MailingAddressInfoPageTaskGreen';

export const errorMessages = {
  missingEmail: 'Add an email address to your profile',
  missingHomePhone: 'Add a home phone number to your profile',
  missingMobilePhone: 'Add a mobile phone number to your profile',
  missingMailingAddress: 'Add a mailing address to your profile',
  invalidMailingAddress: 'Add a valid mailing address to your profile',
};

const validateValue = (errors, value, errorMsg) => {
  if (!value) {
    errors.addError?.(errorMessages[errorMsg]);
  }
};

const validateAddress = (errors, address) => {
  validateValue(errors, address.addressLine1, 'missingMailingAddress');
  if (
    !address.city ||
    (address.countryCodeIso2 === 'US' &&
      (!address.stateCode || address.zipCode?.length !== 5))
  ) {
    errors.addError?.(errorMessages.invalidMailingAddress);
  }
};

export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {} } = formData || {};

  validateAddress(errors, veteran.address || {});
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/1/task-green/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-green',
  introduction: IntroductionPage,
  confirmation: Confirmation,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {},
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
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: VIEW_FIELD_SCHEMA,
        },
        confirmMailingAddress: {
          title: 'Contact information',
          path: 'veteran-information/confirm-mailing-address',
          uiSchema: {
            'ui:title': ' ',
            'ui:description': MailingAddressInfoPageTaskGreen,
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
          title: 'Edit your mailing address',
          path: 'veteran-information/edit-mailing-address',
          CustomPage: props =>
            EditAddress({
              ...props,
              contactPath:
                '1/task-green/veteran-information/confirm-mailing-address',
              saveButtonText: 'Save to profile',
              subTitle:
                'We send your VA letters, bills, and prescriptions to this address.',
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
