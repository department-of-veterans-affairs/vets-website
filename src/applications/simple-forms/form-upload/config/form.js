import footerContent from '~/platform/forms/components/FormFooter';
import manifest from '../manifest.json';
import getHelp from '../../shared/components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { uploadPage } from '../pages/upload';
import { reviewPage } from '../pages/review';
import { identificationInformationPage, zipCodePage } from '../pages/loa1';
import {
  TITLE,
  SUBTITLE,
  SAVE_IN_PROGRESS_CONFIG,
  PROGRESS_BAR_LABELS,
} from './constants';
import prefillTransformer from './prefill-transformer';
import CustomReviewTopContent from '../containers/CustomReviewTopContent';
import {
  handleSubmit,
  isUnverifiedUser,
  scrollAndFocusTarget,
} from '../helpers';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit: formData => handleSubmit(formData),
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: !window.Cypress,
  },
  trackingPrefix: 'form-upload-flow-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  CustomReviewTopContent,
  hideReviewChapters: true,
  formId: 'FORM-UPLOAD-FLOW',
  saveInProgress: SAVE_IN_PROGRESS_CONFIG,
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to upload your form.',
    noAuth: 'Please sign in again to continue uploading your form.',
  },
  title: TITLE,
  subtitle: SUBTITLE,
  defaultDefinitions: {},
  v3SegmentedProgressBar: {
    useDiv: true,
  },
  stepLabels: PROGRESS_BAR_LABELS,
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
          depends: formData => isUnverifiedUser(formData),
          path: 'identification-info',
          title: 'Identification information',
          uiSchema: identificationInformationPage.uiSchema,
          schema: identificationInformationPage.schema,
          pageClass: 'review',
          scrollAndFocusTarget,
        },
        zipCodePage: {
          depends: formData => isUnverifiedUser(formData),
          path: 'zip-code',
          title: 'Your zip code',
          uiSchema: zipCodePage.uiSchema,
          schema: zipCodePage.schema,
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
