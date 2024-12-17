import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

// application root imports
import { taskCompletePagePattern2 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';

// page level component imports
import IntroductionPage from '../pages/introduction/IntroductionPage';

// config imports
import { contactInformation } from './pages/contactInformation';
import { reviewAndSubmit } from './pages/reviewAndSubmit';
import { applicantInformation } from './pages/applicantInformation';
import { editVeteranAddress } from './pages/editVeteranAddress';

import { prefillTransformer } from '../helpers';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/task-orange/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990`,
  trackingPrefix: 'edu-',
  formId: VA_FORM_IDS.FORM_22_1990,
  version: 0,
  migrations: [],
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  dev: {
    showNavLinks: false,
  },
  prefillEnabled: true,
  prefillTransformer,
  introduction: IntroductionPage,
  confirmation: Confirmation,
  defaultDefinitions: {},
  saveInProgress: {},
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
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
