import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
import ConfirmationPage from '@bio-aquia/21-0779-nursing-home-information/containers/confirmation-page';
import IntroductionPage from '@bio-aquia/21-0779-nursing-home-information/containers/introduction-page';
import manifest from '@bio-aquia/21-0779-nursing-home-information/manifest.json';
import {
  createPageValidator,
  createValidationErrorHandler,
} from '@bio-aquia/shared/utils';
import prefillTransformer from './prefill-transformer';
import GetHelpFooter from '../components/get-help';
import {
  ContactInformationPage,
  MailingAddressPage,
  NursingCareInformationPage,
  NursingHomeDetailsPage,
  PersonalInformationPage,
} from '../pages';
import {
  contactInfoSchema,
  mailingAddressSchema,
  nursingCareInfoSchema,
  nursingHomeDetailsSchema,
  personalInfoSchema,
} from '../schemas';

const defaultSchema = {
  type: 'object',
  properties: {},
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/form21_0779',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0779-nursing-home-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelpFooter,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21_0779,
  saveInProgress: {
    messages: {
      inProgress:
        'Your nursing home information request (21-0779) is in progress.',
      expired:
        'Your saved nursing home information request (21-0779) has expired. If you want to submit your information, please start a new request.',
      saved: 'Your nursing home information request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to submit your nursing home information.',
    noAuth: 'Please sign in again to continue your request.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformation: {
          path: 'personal-information',
          title: 'Personal information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: PersonalInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(personalInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('personalInfo'),
        },
      },
    },
    mailingAddressChapter: {
      title: 'Mailing address',
      pages: {
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MailingAddressPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(mailingAddressSchema)(values),
          onErrorChange: createValidationErrorHandler('mailingAddress'),
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Contact information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ContactInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(contactInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('contactInfo'),
        },
      },
    },
    nursingHomeChapter: {
      title: 'Nursing home information',
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home details',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingHomeDetailsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(nursingHomeDetailsSchema)(values),
          onErrorChange: createValidationErrorHandler('nursingHomeDetails'),
        },
        nursingCareInformation: {
          path: 'nursing-care-information',
          title: 'Care and payment information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingCareInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(nursingCareInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('nursingCareInfo'),
        },
      },
    },
  },
};

export default formConfig;
