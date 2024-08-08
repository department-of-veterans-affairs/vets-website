import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { transform } from './submit-transformer';
import { prefillTransformer } from './prefill-transformer';
import submitForm from './submitForm';

import { urlMigration } from '../../config/migrations';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import ConfirmationPage from '../containers/ConfirmationPage';
import { chapters } from './chapters';

import manifest from '../manifest.json';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import { introductionPage } from '../helpers';

const {
  preferredContactMethod,
  date,
  dateRange,
  serviceBefore1977,
  usaPhone,
} = fullSchema1995.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1995`,
  submit: submitForm,
  trackingPrefix: 'edu-1995-',
  formId: VA_FORM_IDS.FORM_22_1995,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-1995) is in progress.',
      expired:
        'Your saved education benefits application (22-1995) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/1995')],
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: introductionPage(),
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    preferredContactMethod,
    serviceBefore1977,
    date,
    dateRange,
    usaPhone,
  },
  title: 'Change your education benefits',
  subTitle: 'Form 22-1995',
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
