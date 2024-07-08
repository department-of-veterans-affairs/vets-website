// import fullSchema from 'vets-json-schema/dist/FORM-UPLOAD-schema.json';

import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { uploadPage } from '../pages/upload';
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
  title: 'Upload VA Form 21-0779',
  // subitle: getFormUploadContent(formNumber),
  subitle:
    'Request for Nursing Home Information in Connection with Claim for Aid and Attendance',
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
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
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    submitChapter: {
      title: 'Submit',
      pages: {
        submitPage: {
          path: 'submit',
          title: 'Submit Your Form',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
