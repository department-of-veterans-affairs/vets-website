import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  SUBMIT_URL,
  SUBTITLE,
  TITLE,
  TRACKING_PREFIX,
} from '@bio-aquia/21p-530a-interment-allowance/constants';
import { ConfirmationPage } from '@bio-aquia/21p-530a-interment-allowance/containers/confirmation-page';
import { IntroductionPage } from '@bio-aquia/21p-530a-interment-allowance/containers/introduction-page';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import { GetHelp as GetHelpFooter } from '@bio-aquia/21p-530a-interment-allowance/components/get-help';
import PreSubmitInfo from '@bio-aquia/21p-530a-interment-allowance/components/pre-submit-info';
import prefillTransformer from '@bio-aquia/21p-530a-interment-allowance/config/prefill-transformer';
import {
  PlaceholderPage,
  OrganizationInformationPage,
  BurialBenefitsRecipientPage,
  MailingAddressPage,
} from '@bio-aquia/21p-530a-interment-allowance/pages';

const defaultSchema = {
  type: 'object',
  properties: {},
};

/**
 * Form configuration for VA Form 21P-530a - State or Tribal Organization Application for Interment Allowance
 * @type {FormConfig}
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: TRACKING_PREFIX,
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_21P_530A,
  saveInProgress: {
    messages: {
      inProgress:
        'Your state or tribal organization interment allowance application (21P-530a) is in progress.',
      expired:
        'Your saved interment allowance application (21P-530a) has expired. If you want to submit your application, please start a new one.',
      saved: 'Your interment allowance application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound:
      'Please start over to submit your interment allowance application.',
    noAuth: 'Please sign in again to continue your application.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    organizationInformationChapter: {
      title: "Your organization's information",
      pages: {
        organizationInformation: {
          path: 'organization-information',
          title: "Your organization's information",
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: OrganizationInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
        burialBenefitsRecipient: {
          path: 'burial-benefits-recipient',
          title: 'Burial benefits recipient',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: BurialBenefitsRecipientPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
        mailingAddress: {
          path: 'mailing-address',
          title: 'Mailing address',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MailingAddressPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    veteranInformationChapter: {
      title: 'Deceased Veteran information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Deceased Veteran information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: PlaceholderPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    militaryHistoryChapter: {
      title: 'Military history',
      pages: {
        militaryHistory: {
          path: 'military-history',
          title: 'Military history',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: PlaceholderPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
    additionalRemarksChapter: {
      title: 'Additional remarks',
      pages: {
        additionalRemarks: {
          path: 'additional-remarks',
          title: 'Additional remarks',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: PlaceholderPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
        },
      },
    },
  },
};

export default formConfig;
