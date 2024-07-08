import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { uploadPage } from '../pages/upload';
import { reviewPage } from '../pages/review';
import { submitPage } from '../pages/submit';
import { TITLE, SUBTITLE } from './constants';
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
  formId: 'FORM-UPLOAD',
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
  savedFormMessages: {
    notFound: 'Please start over to upload your form.',
    noAuth: 'Please sign in again to continue uploading your form.',
  },
  title: TITLE,
  // subitle: getFormUploadContent(formNumber),
  subitle: SUBTITLE,
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
