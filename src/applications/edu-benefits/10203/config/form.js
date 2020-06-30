import fullSchema from 'vets-json-schema/dist/22-10203-schema.json';

import { transform } from '../submit-transformer';
import { prefillTransformer } from '../prefill-transformer';
import submitForm from '../submitForm';

import { urlMigration } from '../../config/migrations';

import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import preSubmitInfo from 'platform/forms/preSubmitInfo';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { chapters } from './chapters';

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/10203`,
  submit: submitForm,
  trackingPrefix: 'edu-10203-',
  formId: VA_FORM_IDS.FORM_22_10203,
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
  title: 'Update your education benefits',
  subTitle: 'Form 22-10203',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters,
};

export default formConfig;
