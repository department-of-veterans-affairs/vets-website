import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import { uploadPage, UploadPage } from '../pages/upload';
import * as claimantInformationModule from '../pages/claimantInformation';
import * as veteranInformationModule from '../pages/veteranInformation';
import * as isVeteranModule from '../pages/isVeteranPage';
import transformForSubmit from './submit-transformer';
import CustomReviewTopContent from '../components/CustomReviewTopContent';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import { CustomTopContent } from '../pages/helpers';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

const mockData = testData.data;
const { title, subTitle, formNumber } = getFormContent();
const formId = `${formNumber.toUpperCase()}-UPLOAD`;
const trackingPrefix = `form-${formNumber.toLowerCase()}-upload-`;

const {
  claimantInformationPage,
  ClaimantInformationPage,
} = claimantInformationModule;
const {
  veteranInformationPage,
  VeteranInformationPage,
} = veteranInformationModule;
const { isVeteranPage } = isVeteranModule;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: `/${formNumber.toLowerCase()}/`,
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/v0/submit_representative_form`,
  dev: { collapsibleNavLinks: true, showNavLinks: !window.Cypress },
  trackingPrefix,
  confirmation: ConfirmationPage,
  CustomTopContent,
  CustomReviewTopContent,
  customText: { appType: 'form' },
  hideReviewChapters: true,
  introduction: IntroductionPage,
  formId,
  version: 0,
  prefillEnabled: false,
  transformForSubmit,
  savedFormMessages: {
    notFound: 'Please start over to upload your form.',
    noAuth: 'Please sign in again to continue uploading your form.',
  },
  title,
  subTitle,
  defaultDefinitions: {},
  v3SegmentedProgressBar: { useDiv: false },
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
  footerContent,
};

export default formConfig;
