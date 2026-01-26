import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import { uploadPage, UploadPage } from '../pages/upload';
import {
  uploadSupportingDocuments,
  showSupportingDocuments,
} from '../pages/uploadSupportingDocuments';
import {
  NameAndZipCodePage,
  nameAndZipCodePage,
} from '../pages/nameAndZipCode';
import { SAVE_IN_PROGRESS_CONFIG } from './constants';
import prefillTransformer from './prefill-transformer';
import transformForSubmit from './submit-transformer';
import CustomReviewTopContent from '../components/CustomReviewTopContent';
import {
  getMockData,
  scrollAndFocusTarget,
  getFormContent,
  formMappings,
} from '../helpers';
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

/** @returns {FormConfig} */
const formConfig = (pathname = null) => {
  const { title, subTitle, formNumber } = getFormContent(pathname);
  const formId = `${formNumber.toUpperCase()}-UPLOAD`;
  const trackingPrefix = `form-${formNumber.toLowerCase()}-upload-`;

  return {
    rootUrl: manifest.rootUrl,
    urlPrefix: `/${formNumber.toLowerCase()}/`,
    submitUrl: `${environment.API_URL}/simple_forms_api/v1/submit_scanned_form`,
    dev: { collapsibleNavLinks: true, showNavLinks: !window.Cypress },
    trackingPrefix,
    confirmation: ConfirmationPage,
    CustomReviewTopContent,
    dynamicPaths: true,
    ...minimalHeaderFormConfigOptions(),
    customText: {
      appType: 'form',
      reviewPageFormTitle: `Review and submit VA Form ${formNumber}`,
    },
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
        title: 'Veteran’s information',
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
        title: 'Upload form',
        reviewTitle: 'Uploaded form',
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
      uploadSupportingDocuments: {
        title: 'Upload supporting documents',
        reviewTitle: 'Uploaded supporting documents',
        pages: {
          showSupportingDocuments: {
            path: 'supporting-documents',
            title: 'Supporting documents',
            uiSchema: showSupportingDocuments.uiSchema,
            schema: showSupportingDocuments.schema,
            depends: () => formMappings[formNumber]?.showSupportingDocuments,
            scrollAndFocusTarget,
          },
          uploadSupportingDocuments: {
            path: 'upload-supporting-documents',
            title: 'Upload Supporting Documents',
            uiSchema: uploadSupportingDocuments.uiSchema,
            schema: uploadSupportingDocuments.schema,
            depends: formData => formData.showSupportingDocuments,
            scrollAndFocusTarget,
          },
        },
      },
    },
    footerContent,
    getHelp,
  };
};
export default formConfig;
