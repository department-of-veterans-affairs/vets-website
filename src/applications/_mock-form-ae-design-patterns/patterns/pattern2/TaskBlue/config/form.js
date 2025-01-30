import { VA_FORM_IDS } from 'platform/forms/constants';

// application root imports
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import { taskCompletePagePattern2 } from 'applications/_mock-form-ae-design-patterns/shared/config/taskCompletePage';

// page level imports
import IntroductionPage from '../IntroductionPage';
import personalInfo from './personalInfo';
import { contactInfo } from './contactInfo';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/task-blue/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'task-blue',
  introduction: IntroductionPage,
  confirmation: Confirmation,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer(pages, formData, metadata) {
    const transformedData = {
      ssn: formData?.veteranSocialSecurityNumber || null,
      vaFileNumber: formData?.veteranVAFileNumber || null,
    };
    return {
      metadata,
      formData: transformedData,
      pages,
    };
  },
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  customText: {
    appType: 'application',
    finishAppLaterMessage: 'Finish this request later',
  },
  title: 'Request a Board Appeal',
  subTitle: 'VA Form 10182 (Notice of Disagreement)',
  defaultDefinitions: {},
  chapters: {
    contactInfo: {
      title: 'Veteran information',
      pages: {
        ...personalInfo,
        ...contactInfo,
        taskCompletePagePattern2,
      },
    },
  },
};

export default formConfig;
