import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { transform } from './submit-transformer';
import { prefillTransformer } from './prefill-transformer';
import submitForm from './submitForm';

import { urlMigration } from '../../config/migrations';

// import GetFormHelp from '../../components/GetFormHelp';
import GetFormHelp1995 from '../components/GetFormHelp1995';
// import FormFooter from '../components/FormFooter';

import ErrorText from '../../components/ErrorText';

import ConfirmationPage from '../containers/ConfirmationPage';
import { allChapters } from './chapters';

import manifest from '../manifest.json';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import IntroductionRouter from '../containers/IntroductionRouter';
import { isRerouteEnabled } from '../helperFunctions/isRerouteEnabled';

const { preferredContactMethod, date, dateRange, serviceBefore1977, usaPhone } =
  fullSchema1995.definitions;

const baseConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1995`,
  submit: submitForm,
  trackingPrefix: 'edu-1995-',
  formId: VA_FORM_IDS.FORM_22_1995,
  disableSave: isRerouteEnabled(),
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
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    preferredContactMethod,
    serviceBefore1977,
    date,
    dateRange,
    usaPhone,
  },
  title: 'Change your education benefits',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp1995,
  errorText: ErrorText,
  // Always render the wrapper; it decides which intro component to show once
  introduction: IntroductionRouter,
  v3SegmentedProgressBar: true,
};

export default {
  ...baseConfig,
  chapters: allChapters,
};
