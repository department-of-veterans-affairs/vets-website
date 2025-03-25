import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import * as uploadPageModule from '../pages/upload';
import * as claimantInformationModule from '../pages/claimantInformation';
import * as veteranInformationModule from '../pages/veteranInformation';
import * as isVeteranModule from '../pages/isVeteranPage';
import GetFormHelp from '../../../accreditation/21a/components/common/GetFormHelp';

import { SAVE_IN_PROGRESS_CONFIG } from './constants';
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
const {
  veteranInformationPage,
  VeteranInformationPage,
} = veteranInformationModule;
const { uploadPage, UploadPage } = uploadPageModule;
const { isVeteranPage } = isVeteranModule;

/** @type {FormConfig} */
const formConfig = {
  formId: formNumber,
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
    isVeteranChapter: {
      title: 'Who is the claimant?',
      pages: {
        isVeteranPage: {
          path: 'is-veteran',
          title: 'Who is the claimant?',
          uiSchema: isVeteranPage.uiSchema,
          schema: isVeteranPage.schema,
        },
      },
    },
    veteranInformationChapter: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: veteranInformationPage.uiSchema,
          depends: formData => {
            return formData.isVeteran === true;
          },
          schema: veteranInformationPage.schema,
          CustomPage: VeteranInformationPage,
          scrollAndFocusTarget,
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
    claimantInformationChapter: {
      title: 'Claimant Information',
      pages: {
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant information',
          uiSchema: claimantInformationPage.uiSchema,
          depends: formData => {
            return formData.isVeteran === false;
          },
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
  },
};

export default formConfig;
