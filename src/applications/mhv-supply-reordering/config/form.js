import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import { TITLE as title, SUBTITLE as subTitle } from '../constants';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../components/GetFormHelp';
import manifest from '../manifest.json';

// TODO: Remove this example
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';

const dev = {
  showNavLinks: true,
  collapsibleNavLinks: true,
};

const { supplies } = fullSchema.definitions;

const saveInProgress = {
  messages: {
    inProgress:
      'Your health care supply reordering application (2346) is in progress.',
    expired:
      'Your saved health care supply reordering application (2346) has expired. If you want to reorder supplies, please start a new application.',
    saved: 'Your health care supply reordering application has been saved.',
  },
  // restartFormCallback: () => 'url', // restart desitination url
};

const savedFormMessages = {
  notFound: 'Please start over to reorder health care supplies.',
  noAuth:
    'Please sign in again to continue your application for health care supply reordering.',
};

const customText = {
  // appSavedSuccessfullyMessage: '',
  appType: 'order',
  // continueAppButtonText: '',
  // reviewPageTitle: '',
  // startNewAppButtonText: '',
  // submitButtonText: '',
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

const formOptions = {
  // noTitle: true,
  // noTopNav: true,
  // noBottomNav: true,
  fullWidth: true,
};

/** @type {FormConfig} */
const formConfig = {
  dev,
  title,
  subTitle,
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/mdot/supplies`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mhv-supply-reordering',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  chapters,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: false,
  defaultDefinitions: { supplies },
  getHelp: GetFormHelp,
  footerContent: FormFooter,
  savedFormMessages,
  saveInProgress,
  customText,
  formOptions,
};

export default formConfig;
