import fullSchema from 'vets-json-schema/dist/22-10203-schema.json';

import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { transform } from '../submit-transformer';
import { prefillTransformer } from '../prefill-transformer';
import submitForm from '../submitForm';

import { urlMigration } from '../../config/migrations';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { chapters } from './chapters';
import PreSubmitInfo from '../containers/PreSubmitInfo';

import manifest from '../manifest.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/10203`,
  submit: submitForm,
  trackingPrefix: 'edu-10203-',
  formId: VA_FORM_IDS.FORM_22_10203,
  saveInProgress: {
    messages: {
      inProgress:
        'Your Rogers STEM Scholarship application (22-10203) is in progress.',
      expired:
        'Your saved Rogers STEM Scholarship application (22-10203) has expired. If you want to apply for Rogers STEM Scholarship, please start a new application.',
      saved: 'Your Rogers STEM Scholarship application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/10203')],
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: 'Apply for the Rogers STEM Scholarship',
  subTitle: 'Form 22-10203',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters,
};

export default formConfig;
