import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import {
  uploadPage,
  UploadReviewPage,
  uploadReviewPage,
} from '../pages/upload';
import {
  NameAndZipCodePage,
  nameAndZipCodePage,
} from '../pages/nameAndZipCode';
import { SAVE_IN_PROGRESS_CONFIG, PROGRESS_BAR_LABELS } from './constants';
import prefillTransformer from './prefill-transformer';
import submitTransformer from './submit-transformer';
import CustomReviewTopContent from '../containers/CustomReviewTopContent';
import { scrollAndFocusTarget, getFormContent } from '../helpers';
import {
  VeteranIdentificationInformationPage,
  veteranIdentificationInformationPage,
} from '../pages/veteranIdentificationInformation';

const formConfig = (pathname = null) => {
  const { title, subTitle, formNumber } = getFormContent(pathname);

  return {
    rootUrl: manifest.rootUrl,
    urlPrefix: `/${formNumber}/`,
    submitUrl: `${environment.API_URL}/simple_forms_api/v1/submit_scanned_form`,
    dev: {
      collapsibleNavLinks: true,
      showNavLinks: !window.Cypress,
    },
    trackingPrefix: 'form-upload-flow-',
    confirmation: ConfirmationPage,
    CustomReviewTopContent,
    customText: {
      appType: 'form',
    },
    hideReviewChapters: true,
    introduction: IntroductionPage,
    formId: 'FORM-UPLOAD-FLOW',
    saveInProgress: SAVE_IN_PROGRESS_CONFIG,
    version: 0,
    prefillEnabled: true,
    prefillTransformer,
    transformForSubmit: submitTransformer,
    savedFormMessages: {
      notFound: 'Please start over to upload your form.',
      noAuth: 'Please sign in again to continue uploading your form.',
    },
    title,
    subTitle,
    defaultDefinitions: {},
    v3SegmentedProgressBar: {
      useDiv: true,
    },
    stepLabels: PROGRESS_BAR_LABELS,
    chapters: {
      personalInformationChapter: {
        title: 'Personal information',
        pages: {
          nameAndZipCodePage: {
            path: 'name-and-zip-code',
            title: 'Personal information',
            uiSchema: nameAndZipCodePage.uiSchema,
            schema: nameAndZipCodePage.schema,
            CustomPage: NameAndZipCodePage,
            scrollAndFocusTarget,
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
      uploadChapter: {
        title: 'Upload',
        pages: {
          uploadPage: {
            path: 'upload',
            title: 'Upload Your File',
            uiSchema: uploadPage.uiSchema,
            schema: uploadPage.schema,
            pageClass: 'upload',
            scrollAndFocusTarget,
          },
          uploadReviewPage: {
            depends: formData => formData.uploadedFile?.warnings?.length > 0,
            path: 'upload-review',
            title: 'Review Your File Upload',
            uiSchema: uploadReviewPage.uiSchema,
            schema: uploadReviewPage.schema,
            CustomPage: UploadReviewPage,
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
