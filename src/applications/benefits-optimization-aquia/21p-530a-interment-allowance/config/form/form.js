import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  SUBTITLE,
  TITLE,
  TRACKING_PREFIX,
} from '@bio-aquia/21p-530a-interment-allowance/constants';
import prefillTransformer from '@bio-aquia/21p-530a-interment-allowance/config/prefill-transformer';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import { transform } from '@bio-aquia/21p-530a-interment-allowance/config/submit-transform/transform';

import { ConfirmationPage } from '@bio-aquia/21p-530a-interment-allowance/components/confirmation-page';
import { IntroductionPage } from '@bio-aquia/21p-530a-interment-allowance/components/introduction-page';
import { GetHelp as GetHelpFooter } from '@bio-aquia/21p-530a-interment-allowance/components/get-help';
import PreSubmitInfo from '@bio-aquia/21p-530a-interment-allowance/components/pre-submit-info';

import {
  additionalRemarksPage,
  burialBenefitsRecipientPage,
  burialOrganizationMailingAddressPage,
  organizationNamePage,
  veteranBirthInformationPage,
  veteranBurialInformationPage,
  veteranPersonalInformationPage,
  veteranIdentificationPage,
  servicePeriodsPages,
  previousNamePages,
} from '@bio-aquia/21p-530a-interment-allowance/pages';

/**
 * Form configuration for VA Form 21P-530a - State or Tribal Organization Application for Interment Allowance
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form21p530a`,
  transformForSubmit: transform,
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
  prefillEnabled: false,
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
          uiSchema: organizationNamePage.uiSchema,
          schema: organizationNamePage.schema,
        },
        burialBenefitsRecipient: {
          path: 'burial-benefits-recipient',
          title: 'VA interment allowance benefits recipient',
          uiSchema: burialBenefitsRecipientPage.uiSchema,
          schema: burialBenefitsRecipientPage.schema,
        },
        mailingAddress: {
          path: 'organization-mailing-address',
          title: 'Mailing address',
          uiSchema: burialOrganizationMailingAddressPage.uiSchema,
          schema: burialOrganizationMailingAddressPage.schema,
        },
      },
    },
    veteranInformationChapter: {
      title: 'Deceased Veteran information',
      pages: {
        veteranPersonalInformation: {
          path: 'veteran-personal-information',
          title: "Veteran's name",
          uiSchema: veteranPersonalInformationPage.uiSchema,
          schema: veteranPersonalInformationPage.schema,
        },
        veteranIdentification: {
          path: 'veteran-identification',
          title: 'Veteran identification information',
          uiSchema: veteranIdentificationPage.uiSchema,
          schema: veteranIdentificationPage.schema,
        },
        veteranBirthInformation: {
          path: 'veteran-birth-information',
          title: 'Birth information',
          uiSchema: veteranBirthInformationPage.uiSchema,
          schema: veteranBirthInformationPage.schema,
        },
        veteranBurialInformation: {
          path: 'veteran-burial-information',
          title: 'Interment information',
          uiSchema: veteranBurialInformationPage.uiSchema,
          schema: veteranBurialInformationPage.schema,
        },
      },
    },
    militaryHistoryChapter: {
      title: 'Military history',
      pages: {
        ...servicePeriodsPages,
        ...previousNamePages,
      },
    },
    additionalRemarksChapter: {
      title: 'Additional remarks',
      pages: {
        additionalRemarks: {
          path: 'additional-remarks',
          title: 'Additional remarks',
          uiSchema: additionalRemarksPage.uiSchema,
          schema: additionalRemarksPage.schema,
        },
      },
    },
  },
};

export default formConfig;
