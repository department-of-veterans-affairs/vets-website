import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';
import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import * as application from '../pages/application';
import FormFooter from 'platform/forms/components/FormFooter';
import { transform } from '../submit-transformer';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990s`,
  transformForSubmit: transform,
  trackingPrefix: 'edu-1990s-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990S,
  preSubmitInfo,
  footerContent: FormFooter,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Veteran Rapid Retraining Assistance Program application is in progress.',
      expired:
        'Veteran Rapid Retraining Assistance Program application has expired. If you want to apply for Veteran Rapid Retraining Assistance Program, please start a new application.',
      saved:
        'Veteran Rapid Retraining Assistance Program application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Veteran Rapid Retraining Assistance Program (VRRAP)',
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  chapters: {
    form: {
      title: 'Application',
      pages: {
        application,
      },
    },
  },
};

export default formConfig;
