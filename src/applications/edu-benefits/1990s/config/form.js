import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import manifest from '../manifest.json';
import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import * as application from '../pages/application';
import { transform } from '../submit-transformer';
import { prefillTransformer } from '../prefill-transformer';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../../components/GetFormHelp';
import analytics from '../analytics/analytics-functions';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990s`,
  transformForSubmit: transform,
  trackingPrefix: 'edu-1990s-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990S,
  getHelp: GetFormHelp,
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
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
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Apply for the Veteran Rapid Retraining Assistance Program (VRRAP)',
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  chapters: {
    form: {
      title: 'VRRAP application',
      pages: {
        application: {
          ...application,
          onContinue: analytics.application,
        },
      },
    },
  },
};

export default formConfig;
