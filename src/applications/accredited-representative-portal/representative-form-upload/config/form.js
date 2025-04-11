import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import { uploadPage, UploadPage } from '../pages/upload';
import {
  NameAndZipCodePage,
  nameAndZipCodePage,
} from '../pages/nameAndZipCode';
import { SAVE_IN_PROGRESS_CONFIG } from './constants';
import prefillTransformer from './prefill-transformer';
import transformForSubmit from './submit-transformer';
import CustomReviewTopContent from '../components/CustomReviewTopContent';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import {
  VeteranIdentificationInformationPage,
  veteranIdentificationInformationPage,
} from '../pages/veteranIdentificationInformation';
import { phoneNumberAndEmailPage } from '../pages/phoneNumberAndEmail';
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

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: `/${formNumber.toLowerCase()}/`,
  submitUrl: `${environment.API_URL}/accredited_representative_portal/v0/submit_representative_form`,
  dev: { collapsibleNavLinks: true, showNavLinks: !window.Cypress },
  trackingPrefix,
  confirmation: ConfirmationPage,
  CustomTopContent,
  CustomReviewTopContent,
  customText: { appType: 'form' },
  hideReviewChapters: true,
  introduction: IntroductionPage,
  formId,
  saveInProgress: SAVE_IN_PROGRESS_CONFIG,
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
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
    personalInformationChapter: {
      title: 'Veteran information',
      pages: {
        nameAndZipCodePage: {
          path: 'name-and-zip-code',
          title: 'Veteran information',
          uiSchema: nameAndZipCodePage.uiSchema,
          schema: nameAndZipCodePage.schema,
          CustomPage: NameAndZipCodePage,
          scrollAndFocusTarget,
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData: getMockData(mockData, isLocalhost),
        },
        veteranIdentificationInformationPage: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: veteranIdentificationInformationPage.uiSchema,
          schema: veteranIdentificationInformationPage.schema,
          CustomPage: VeteranIdentificationInformationPage,
          scrollAndFocusTarget,
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        phoneNumberAndEmailPage: {
          path: 'phone-number-and-email',
          title: 'Phone and email address',
          uiSchema: phoneNumberAndEmailPage.uiSchema,
          schema: phoneNumberAndEmailPage.schema,
          scrollAndFocusTarget,
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
