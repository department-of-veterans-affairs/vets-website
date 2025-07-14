import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import { uploadPage } from '../pages/upload';
import { claimantInformationPage } from '../pages/claimantInformation';
import { veteranInformationPage } from '../pages/veteranInformation';
import * as isVeteranModule from '../pages/isVeteranPage';
import transformForSubmit from './submit-transformer';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import { CustomTopContent } from '../pages/helpers';
import submissionError from './submissionError';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

const mockData = testData.data;
const { subTitle, formNumber } = getFormContent();
const formId = `${formNumber.toUpperCase()}-UPLOAD`;
const trackingPrefix = `form-${formNumber.toLowerCase()}-upload-`;

const { isVeteranPage } = isVeteranModule;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: `/${formNumber.toLowerCase()}/`,
  submitUrl: `${
    environment.API_URL
  }/accredited_representative_portal/v0/submit_representative_form`,
  dev: { collapsibleNavLinks: true, showNavLinks: !window.Cypress },
  disableSave: true,
  trackingPrefix,
  confirmation: ConfirmationPage,
  CustomTopContent,
  customText: {
    appType: 'form',
    finishAppLaterMessage: ' ',
    reviewPageTitle: 'Review and submit',
  },
  hideReviewChapters: true,
  introduction: IntroductionPage,
  formId,
  version: 0,
  prefillEnabled: false,
  transformForSubmit,
  submissionError,
  title: `Submit VA Form ${formNumber}`,
  subTitle,
  defaultDefinitions: {},
  v3SegmentedProgressBar: { useDiv: false },
  chapters: {
    isVeteranChapter: {
      title: 'Claimant background',
      pages: {
        isVeteranPage: {
          path: 'is-veteran',
          title: "Claimant's background",
          uiSchema: isVeteranPage.uiSchema,
          schema: isVeteranPage.schema,
        },
      },
    },
    veteranInformationChapter: {
      title: 'Claimant information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Claimant information',
          uiSchema: veteranInformationPage.uiSchema,
          depends: formData => {
            return formData.isVeteran === 'yes';
          },
          schema: veteranInformationPage.schema,
          scrollAndFocusTarget,
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
    claimantInformationChapter: {
      title: 'Claimant and Veteran information',
      pages: {
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant and Veteran information',
          uiSchema: claimantInformationPage.uiSchema,
          depends: formData => {
            return (
              formData.isVeteran === undefined || formData.isVeteran === 'no'
            );
          },
          schema: claimantInformationPage.schema,
          scrollAndFocusTarget,
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
      },
    },
    uploadChapter: {
      title: 'Upload files',
      pages: {
        uploadPage: {
          path: 'upload',
          title: `Upload VA Form ${formNumber}`,
          uiSchema: uploadPage.uiSchema,
          schema: uploadPage.schema,
          scrollAndFocusTarget,
        },
      },
    },
  },
  footerContent,
};

export default formConfig;
