import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import footerContent from '~/platform/forms/components/FormFooter';
// import { apiRequest } from '~/platform/utilities/api';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { uploadPage } from '../pages/upload';
import { reviewPage } from '../pages/review';
import { identificationInformationPage, zipCodePage } from '../pages/loa1';
import { submitPage } from '../pages/submit';
import { TITLE, SUBTITLE } from './constants';
import prefillTransformer from './prefill-transformer';
// import { getFormNumber, getFormUploadContent } from '../helpers';

// const formNumber = getFormNumber(window.location);

const scrollAndFocusTarget = () => {
  scrollTo('topScrollElement');
  focusByOrder(['va-segmented-progress-bar', 'h1']);
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'form-upload-flow-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM-UPLOAD-FLOW',
  saveInProgress: {
    messages: {
      inProgress: 'Your form upload is in progress.',
      expired:
        'Your form upload has expired. If you want to upload a form, please start a new request.',
      saved: 'Your form upload has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to upload your form.',
    noAuth: 'Please sign in again to continue uploading your form.',
  },
  title: TITLE,
  subtitle: SUBTITLE,
  // subtitle: getFormUploadContent(formNumber),
  defaultDefinitions: {},
  v3SegmentedProgressBar: {
    useDiv: true,
  },
  stepLabels: 'Upload your file;Review your information;Submit your form',
  chapters: {
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
      },
    },
    reviewChapter: {
      title: 'Review',
      pages: {
        reviewPage: {
          path: 'review',
          title: 'Review Your Information',
          uiSchema: reviewPage.uiSchema,
          schema: reviewPage.schema,
          pageClass: 'review',
          scrollAndFocusTarget,
        },
        identificationInformationPage: {
          depends: formData =>
            formData?.['view:veteranPrefillStore']?.loa !== 3,
          path: 'identification-info',
          title: 'Identification information',
          uiSchema: identificationInformationPage.uiSchema,
          schema: identificationInformationPage.schema,
          pageClass: 'review',
          scrollAndFocusTarget,
        },
        zipCodePage: {
          depends: formData =>
            formData?.['view:veteranPrefillStore']?.loa !== 3,
          path: 'zip-code',
          title: 'Your zip code',
          uiSchema: zipCodePage.uiSchema,
          schema: zipCodePage.schema,
          pageClass: 'review',
          scrollAndFocusTarget,
        },
      },
    },
    submitChapter: {
      title: 'Submit',
      pages: {
        submitPage: {
          path: 'submit',
          title: 'Submit Your Form',
          uiSchema: submitPage.uiSchema,
          schema: submitPage.schema,
          pageClass: 'review',
          scrollAndFocusTarget,
        },
      },
    },
  },
  footerContent,
  getHelp,
};

export default formConfig;