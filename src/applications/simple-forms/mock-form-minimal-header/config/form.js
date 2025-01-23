import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { focusByOrder, scrollTo } from 'platform/utilities/ui';
import nameAndDateOfBirth from '../pages/nameAndDateOfBirth';
import exampleRadio from '../pages/exampleRadio';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { CustomTopContent } from '../components/breadcrumbs';

/** @type {FormConfig} */
const minimalFlowProps = {
  v3SegmentedProgressBar: {
    useDiv: true,
  },
  CustomTopContent,
  showSaveLinkAfterButtons: true,
  useTopBackLink: true,
  hideFormTitle: true,
  useCustomScrollAndFocus: true,
  scrollAndFocusTarget: () => {
    setTimeout(() => {
      scrollTo('header-minimal');
      focusByOrder(['h1', 'va-segmented-progress-bar']);
    }, 200);
  },
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  dev: {
    showNavLinks: false,
  },
  ...minimalFlowProps,
  submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-form-minimal-header-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'FORM-MOCK-MINIMAL-HEADER',
  saveInProgress: {},
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for web component examples.',
    noAuth:
      'Please sign in again to continue your application for web component examples.',
  },
  title: 'Mock Form Minimal Header',
  defaultDefinitions: {},
  chapters: {
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInformation1: {
          path: 'name-and-date-of-birth',
          title: 'Name and date of birth',
          uiSchema: nameAndDateOfBirth.uiSchema,
          schema: nameAndDateOfBirth.schema,
        },
      },
    },
    mailingAddressChapter: {
      title: 'Example chapter',
      pages: {
        exampleRadio: {
          path: 'example-radio',
          title: 'Example radio page',
          uiSchema: exampleRadio.uiSchema,
          schema: exampleRadio.schema,
        },
      },
    },
  },
};

export default formConfig;
