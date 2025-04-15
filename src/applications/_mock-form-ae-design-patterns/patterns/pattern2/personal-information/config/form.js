import { VA_FORM_IDS } from 'platform/forms/constants';

// application root imports
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import Confirmation from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';

// page level imports
import IntroductionPage from '../../TaskBlue/IntroductionPage';
import personalInfo from './personalInfo';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/2/personal-information-demo/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'personal-information-demo',
  introduction: IntroductionPage,
  confirmation: Confirmation,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {},
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
      },
    },
  },
};

export default formConfig;
