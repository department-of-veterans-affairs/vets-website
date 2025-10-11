import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  SUBMIT_URL,
  SUBTITLE,
  TITLE,
  TRACKING_PREFIX,
} from '@bio-aquia/21p-530a-interment-allowance/constants';
import ConfirmationPage from '@bio-aquia/21p-530a-interment-allowance/containers/confirmation-page';
import IntroductionPage from '@bio-aquia/21p-530a-interment-allowance/containers/introduction-page';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import {
  createPageValidator,
  createValidationErrorHandler,
} from '@bio-aquia/shared/utils';

import prefillTransformer from '@bio-aquia/21p-530a-interment-allowance/config/prefill-transformer';
import GetHelpFooter from '@bio-aquia/21p-530a-interment-allowance/components/get-help';
import PreSubmitInfo from '@bio-aquia/21p-530a-interment-allowance/components/pre-submit-info';
import {
  CemeteryInformationPage,
  OfficialSignaturePage,
  VeteranIdentificationPage,
  VeteranServicePage,
} from '@bio-aquia/21p-530a-interment-allowance/pages';
import {
  cemeteryInformationSchema,
  officialSignatureSchema,
  veteranIdentificationSchema,
  veteranServiceSchema,
} from '@bio-aquia/21p-530a-interment-allowance/schemas';

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
    veteranInformationChapter: {
      title: 'Deceased veteran information',
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
        veteranService: {
          path: 'veteran-service',
          title: 'Veteran service information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranServicePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(veteranServiceSchema)(values),
          onErrorChange: createValidationErrorHandler('veteranService'),
        },
      },
    },
    cemeteryChapter: {
      title: 'Cemetery and organization',
      pages: {
        cemeteryInformation: {
          path: 'cemetery-information',
          title: 'Cemetery information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CemeteryInformationPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(cemeteryInformationSchema)(values),
          onErrorChange: createValidationErrorHandler('cemeteryInformation'),
        },
      },
    },
    certificationChapter: {
      title: 'Certification',
      pages: {
        officialSignature: {
          path: 'official-signature',
          title: 'Official signature',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: OfficialSignaturePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(officialSignatureSchema)(values),
          onErrorChange: createValidationErrorHandler('officialSignature'),
        },
      },
    },
  },
};

export default formConfig;
