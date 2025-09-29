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
import prefillTransformer from '@bio-aquia/21-0779-nursing-home-information/config/prefill-transformer';
import GetHelpFooter from '@bio-aquia/21-0779-nursing-home-information/components/get-help';
import PreSubmitInfo from '@bio-aquia/21-0779-nursing-home-information/components/pre-submit-info';
import {
  CertificationLevelOfCarePage,
  ClaimantIdentificationPage,
  MedicaidAndCostPage,
  NursingHomeDetailsPage,
  OfficialInfoAndSignaturePage,
  VeteranIdentificationPage,
} from '@bio-aquia/21-0779-nursing-home-information/pages';
import {
  certificationLevelOfCareSchema,
  claimantIdentificationSchema,
  medicaidAndCostSchema,
  nursingHomeDetailsSchema,
  officialInfoAndSignatureSchema,
  veteranIdentificationSchema,
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
  preSubmitInfo: PreSubmitInfo,
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
    veteranInformationChapter: {
      title: 'Veteran information',
      pages: {
        veteranIdentification: {
          path: 'veteran-identification',
          title: 'Veteran identification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranIdentificationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(veteranIdentificationSchema)(values),
          onErrorChange: createValidationErrorHandler('veteranIdentification'),
        },
      },
    },
    claimantInformationChapter: {
      title: 'Claimant information',
      pages: {
        claimantIdentification: {
          path: 'claimant-identification',
          title: 'Claimant identification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ClaimantIdentificationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(claimantIdentificationSchema)(values),
          onErrorChange: createValidationErrorHandler('claimantIdentification'),
        },
      },
    },
    nursingHomeChapter: {
      title: 'Nursing home information',
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home facility details',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingHomeDetailsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(nursingHomeDetailsSchema)(values),
          onErrorChange: createValidationErrorHandler('nursingHomeDetails'),
        },
        medicaidAndCost: {
          path: 'medicaid-and-cost',
          title: 'Medicaid and cost information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidAndCostPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(medicaidAndCostSchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidAndCost'),
        },
      },
    },
    certificationChapter: {
      title: 'Certification',
      pages: {
        certificationLevelOfCare: {
          path: 'certification-level-of-care',
          title: 'Level of care certification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CertificationLevelOfCarePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(certificationLevelOfCareSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'certificationLevelOfCare',
          ),
        },
        officialInfoAndSignature: {
          path: 'official-info-and-signature',
          title: "Official's information and signature",
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: OfficialInfoAndSignaturePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(officialInfoAndSignatureSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'officialInfoAndSignature',
          ),
        },
      },
    },
    certificationChapter: {
      title: 'Certification',
      pages: {
        certificationLevelOfCare: {
          path: 'certification-level-of-care',
          title: 'Level of care certification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CertificationLevelOfCarePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(certificationLevelOfCareSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'certificationLevelOfCare',
          ),
        },
        officialInfoAndSignature: {
          path: 'official-info-and-signature',
          title: "Official's information and signature",
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: OfficialInfoAndSignaturePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(officialInfoAndSignatureSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'officialInfoAndSignature',
          ),
        },
      },
    },
  },
};

export default formConfig;
