import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import * as uploadPageModule from '../pages/upload';
import * as claimantInformationModule from '../pages/claimantInformation';
import GetFormHelp from '../../../accreditation/21a/components/common/GetFormHelp';

import { SAVE_IN_PROGRESS_CONFIG } from './constants';
import prefillTransformer from './prefill-transformer';
import transformForSubmit from './submit-transformer';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

const mockData = testData.data;
const { title, subTitle, formNumber } = getFormContent();
const {
  claimantInformationPage,
  ClaimantInformationPage,
} = claimantInformationModule;
const { uploadPage, UploadPage } = uploadPageModule;
/** @type {FormConfig} */
const formConfig = {
  // formId: VA_FORM_IDS.FORM_21_686C,
  formId: 'REPRESENTATIVE-FORM-UPLOAD-FLOW',
  version: 0,
  footerContent: FormFooter,
  rootUrl: manifest.rootUrl,
  urlPrefix: `/${formNumber}/`,
  transformForSubmit,
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/v0/submit_representative_form`,
  trackingPrefix: 'representative-form-upload-flow-',
  title,
  subTitle,
  prefillTransformer,
  // different format
  v3SegmentedProgressBar: {
    useDiv: false,
  },
  getHelp: GetFormHelp,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  errorText: '',
  prefillEnabled: true,
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: !window.Cypress,
  },
  saveInProgress: SAVE_IN_PROGRESS_CONFIG,
  savedFormMessages: {
    notFound: 'Please start over to upload your form.',
    noAuth: 'Please sign in again to continue uploading your form.',
  },
  defaultDefinitions: {},
  chapters: {
    // claimantInformationChapter
    claimantInformationChapter: {
      title: 'Claimant Information',
      pages: {
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant information',
          uiSchema: claimantInformationPage.uiSchema,
          schema: claimantInformationPage.schema,
          CustomPage: ClaimantInformationPage,
          scrollAndFocusTarget,
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
    uploadChapter: {
      title: 'Upload',
      pages: {
        uploadPage: {
          path: 'upload',
          title: 'Upload Your File',
          uiSchema: uploadPage.uiSchema,
          schema: uploadPage.schema,
          CustomPage: UploadPage,
          scrollAndFocusTarget,
        },
      },
    },
    //   title: 'Upload',
    //   pages: {
    //     uploadPage: {
    //       path: 'upload',
    //       title: 'Upload Your File',
    //       uiSchema: uploadPage.uiSchema,
    //       schema: uploadPage.schema,
    //       CustomPage: UploadPage,
    //       scrollAndFocusTarget,
    //     },
    //   },
    // },
  },
};

export default formConfig;
