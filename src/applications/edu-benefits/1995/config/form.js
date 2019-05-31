import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

import { transform as oldTransform } from '../helpers';
import { transform } from '../submit-transformer';

import { urlMigration } from '../../config/migrations';

import FormFooter from '../../../../platform/forms/components/FormFooter';
import environment from '../../../../platform/utilities/environment';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { originalChapters } from './original-chapters';
import { newChapters } from './new-chapters';

const {
  preferredContactMethod,
  date,
  dateRange,
  serviceBefore1977,
} = fullSchema1995.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1995`,
  trackingPrefix: 'edu-1995-',
  formId: '22-1995',
  version: 1,
  migrations: [urlMigration('/1995')],
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: environment.isProduction() ? oldTransform : transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    preferredContactMethod,
    serviceBefore1977,
    date,
    dateRange,
  },
  title: 'Update your education benefits',
  subTitle: 'Form 22-1995',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: environment.isProduction() ? originalChapters : newChapters,
};

export default formConfig;
