import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { taskCompletePagePattern2 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';
import manifest from '../manifest.json';

import { contactInformation } from './pages/contactInformation';
import { reviewAndSubmit } from './pages/reviewAndSubmit';
import { applicantInformation } from './pages/applicantInformation';
import { editVeteranAddress } from './pages/editVeteranAddress';

import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer } from '../helpers';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/task-orange/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990`,
  trackingPrefix: 'edu-',
  formId: VA_FORM_IDS.FORM_22_1990,
  version: 1,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  dev: {
    showNavLinks: environment?.isLocalhost(),
  },
  prefillEnabled: true,
  prefillTransformer,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation,
      },
    },
    personalInformation: {
      title: 'Contact information',
      pages: {
        contactInformation,
      },
    },
    review: {
      title: 'Review Application',
      pages: {
        reviewAndSubmit,
        taskCompleted: taskCompletePagePattern2,
        editVeteranAddress,
      },
    },
  },
};

export const formConfigForOrangeTask = formConfig;

export default formConfig;
