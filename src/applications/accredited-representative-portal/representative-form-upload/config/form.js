import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import { uploadPage, UploadPage } from '../pages/upload';
import {
  NameAndZipCodePage,
  nameAndZipCodePage,
} from '../pages/nameAndZipCode';
// fix cross import
import GetFormHelp from '../../../accreditation/21a/components/common/GetFormHelp';
import { SAVE_IN_PROGRESS_CONFIG } from './constants';
import transformForSubmit from './submit-transformer';
import { getMockData, scrollAndFocusTarget, getFormContent } from '../helpers';
import {
  VeteranIdentificationInformationPage,
  veteranIdentificationInformationPage,
} from '../pages/veteranIdentificationInformation';
import { phoneNumberAndEmailPage } from '../pages/phoneNumberAndEmail';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/veteran.json';

// export isLocalhost() to facilitate unit-testing
export function isLocalhost() {
  return environment.isLocalhost();
}

const mockData = testData.data;
const { title, subTitle, formNumber } = getFormContent();

const formConfig = {
  formId: formNumber,
  version: 0,
  footerContent: FormFooter,
  rootUrl: manifest.rootUrl,
  urlPrefix: `/${formNumber}/`,
  transformForSubmit,
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/submit_scanned_form`,
  // fix url
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
};

export default formConfig;
