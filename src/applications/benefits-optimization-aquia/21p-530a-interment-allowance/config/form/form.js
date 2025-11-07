import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
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
import { transform } from '@bio-aquia/21p-530a-interment-allowance/config/submit-transform/transform';
import {
  AdditionalRemarksPage,
  burialBenefitsRecipientPage,
  LocationsAndRankPage,
  burialOrganizationMailingAddressPage,
  organizationInformationPage,
  PreviousNameEntryPage,
  relationshipToVeteranPage,
  ServiceBranchPage,
  ServiceDatesPage,
  ServicePeriodsPage,
  veteranBirthInformationPage,
  veteranBurialInformationPage,
  veteranPersonalInformationPage,
  VeteranPreviousNamesPage,
  VeteranServedUnderDifferentNamePage,
  veteranIdentificationPage,
} from '@bio-aquia/21p-530a-interment-allowance/pages';

// Import review pages
import { AdditionalRemarksReviewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/additional-remarks/additional-remarks-review';
import { ServicePeriodsReviewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/service-periods/service-periods-review';
import { VeteranPreviousNamesReviewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/veteran-previous-names/veteran-previous-names-review';
import { VeteranServedUnderDifferentNameReviewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/veteran-served-under-different-name/veteran-served-under-different-name-review';

const defaultSchema = {
  type: 'object',
  properties: {},
};

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
        relationshipToVeteran: {
          path: 'relationship-to-veteran',
          title: 'Relationship to the Veteran',
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
          pagePerItemIndex: 0,
        },
        organizationInformation: {
          path: 'organization-information',
          title: "Your organization's information",
          uiSchema: organizationInformationPage.uiSchema,
          schema: organizationInformationPage.schema,
        },
        burialBenefitsRecipient: {
          path: 'burial-benefits-recipient',
          title: 'Burial benefits recipient',
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
        veteranSsnFileNumber: {
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
          title: 'Burial information',
          uiSchema: veteranBurialInformationPage.uiSchema,
          schema: veteranBurialInformationPage.schema,
        },
      },
    },
    militaryHistoryChapter: {
      title: 'Military history',
      pages: {
        serviceBranch: {
          initialData: {
            tempServicePeriod: {
              isEditing: true,
            },
          },
          path: 'service-branch',
          title: 'Branch of service',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ServiceBranchPage,
          CustomPageReview: null,
          depends: formData => {
            // Show if we're editing/adding a service period
            return formData?.tempServicePeriod?.isEditing === true;
          },
        },
        serviceDates: {
          path: 'service-dates',
          title: 'Service dates',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ServiceDatesPage,
          CustomPageReview: null,
          depends: formData => {
            // Show if we're editing/adding a service period
            return formData?.tempServicePeriod?.isEditing === true;
          },
        },
        locationsAndRank: {
          path: 'locations-and-rank',
          title: 'Locations and rank',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: LocationsAndRankPage,
          CustomPageReview: null,
          depends: formData => {
            // Show if we're editing/adding a service period
            return formData?.tempServicePeriod?.isEditing === true;
          },
        },
        servicePeriods: {
          path: 'service-periods',
          title: 'Service periods',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ServicePeriodsPage,
          CustomPageReview: ServicePeriodsReviewPage,
          // Always show summary page (not dependent on isEditing)
        },
        veteranServedUnderDifferentName: {
          path: 'veteran-served-under-different-name',
          title: 'Previous names',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranServedUnderDifferentNamePage,
          CustomPageReview: VeteranServedUnderDifferentNameReviewPage,
          pagePerItemIndex: 0,
        },
        previousNameEntry: {
          initialData: {
            tempPreviousName: {
              isEditing: true,
            },
          },
          path: 'previous-name-entry',
          title: 'Previous name',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: PreviousNameEntryPage,
          CustomPageReview: null,
          depends: formData => {
            // Show if we're editing/adding a previous name
            return (
              formData?.tempPreviousName?.isEditing === true &&
              formData?.veteranServedUnderDifferentName
                ?.veteranServedUnderDifferentName === 'yes'
            );
          },
        },
        veteranPreviousNames: {
          path: 'review-previous-names',
          title: 'Previous names',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranPreviousNamesPage,
          CustomPageReview: VeteranPreviousNamesReviewPage,
          pagePerItemIndex: 0,
          depends: formData =>
            formData?.veteranServedUnderDifferentName
              ?.veteranServedUnderDifferentName === 'yes',
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
          CustomPage: AdditionalRemarksPage,
          CustomPageReview: AdditionalRemarksReviewPage,
          pagePerItemIndex: 0,
        },
      },
    },
  },
};

export default formConfig;
