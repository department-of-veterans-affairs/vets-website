import { VA_FORM_IDS } from 'platform/forms/constants';
import { EditAddress } from '../../../components/EditContactInfo';
import { MailingAddressInfoPage } from '../../../containers/MailingAddressInfoPage';
import manifest from '../../../manifest.json';

import IntroductionPage from '../../../containers/IntroductionPage1010ezr';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import VeteranProfileInformation from '../../../components/FormPages/VeteranProfileInformation';
import { VIEW_FIELD_SCHEMA } from '../../../utils/constants';
import { GetFormHelp } from '../../../components/GetFormHelp';

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
  urlPrefix: '/task-green/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-green',
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
    // console.log({ formData });

    const transformedData = {
      veteranSocialSecurityNumber: formData?.data?.attributes?.veteran?.ssn,
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
  title: 'Prefill Task Green',
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
            'ui:description': MailingAddressInfoPage,
            'ui:required': () => true, // don't allow progressing without all contact info
            'ui:validations': [contactInfoValidation], // needed to block form progression
            'ui:options': {
              hideOnReview: true, // We're using the `ReveiwDescription`, so don't show this page
              forceDivWrapper: true, // It's all info and links, so we don't need a fieldset or legend
            },
          },
          schema: {
            type: 'object',
            properties: {}, // no form elements on this page
          },
        },
        editMailingAddress: {
          title: 'Edit your mailing address',
          path: 'veteran-information/edit-mailing-address',
          CustomPage: props =>
            EditAddress({
              ...props,
              contactPath:
                'task-green/veteran-information/confirm-mailing-address',
              saveButtonText: 'Save to profile',
              subTitle:
                'We’ll send any important information about your application to this address.',
            }),
          CustomPageReview: null,
          depends: () => false, // accessed from contact info page
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
};

export default formConfig;
