import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';

// TODO: Remove this example
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

const { supplies } = fullSchema.definitions;

const formMessages = {
  saveInProgress: {
    messages: {
      inProgress:
        'Your health care supply reordering application (2346) is in progress.',
      expired:
        'Your saved health care supply reordering application (2346) has expired. If you want to reorder supplies, please start a new application.',
      saved: 'Your health care supply reordering application has been saved.',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
};

const customText = {
  appType: 'order',
  appAction: 'placing your supply reorder',
};

const chapters = {
  personalInformationChapter: {
    title: 'Your personal information',
    pages: {
      nameAndDateOfBirth: {
        path: 'name-and-date-of-birth',
        title: 'Name and date of birth',
        uiSchema: nameAndDateOfBirth.uiSchema,
        schema: nameAndDateOfBirth.schema,
      },
    },
  },
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'bam-2346a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: false,
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: { supplies },
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  chapters,
  ...formMessages,
  customText,
  fullWidth: true,
};

export default formConfig;
