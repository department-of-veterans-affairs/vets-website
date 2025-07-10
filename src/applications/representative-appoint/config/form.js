import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../components/GetFormHelp';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { submitRequest } from '../api/submitRequest';
import PreSubmitInfo from '../containers/PreSubmitInfo';
import {
  claimantPersonalInformation,
  claimantContactMailing,
  claimantContactPhoneEmail,
  veteranIdentification,
  checkboxPage,
} from '../pages';

import SubmissionError from '../components/SubmissionError';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  customText: {
    appType: 'form',
    submitButtonText: 'Continue',
  },
  submit: async form => {
    await submitRequest(form.data);

    return Promise.resolve({ attributes: { confirmationNumber: '123123123' } }); // I'm not sure what this confirmation number is about
  },
  trackingPrefix: 'appoint-a-rep-21-22-and-21-22A',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  formId: '21-22',
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
  },
  submissionError: SubmissionError,
  saveInProgress: {
    messages: {
      inProgress: 'Your form is in progress.',
      expired:
        'Your saved VA form has expired. Please start a new application.',
      saved: 'Your VA form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  v3SegmentedProgressBar: true,
  additionalRoutes: [],
  savedFormMessages: {
    notFound: 'Please start over to apply.',
    noAuth: 'Please sign in again to continue your application.',
  },
  title: 'Form title',
  subTitle: 'Form subtitle',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    claimantInfo: {
      title: 'Your information',
      pages: {
        checkboxPage: {
          path: 'checkbox',
          title: 'Checkbox',
          uiSchema: checkboxPage.uiSchema,
          schema: checkboxPage.schema,
        },
        claimantPersonalInformation: {
          path: 'claimant-personal-information',
          title: 'Your Personal Information',
          uiSchema: claimantPersonalInformation.uiSchema,
          schema: claimantPersonalInformation.schema,
        },
        claimantContactMailing: {
          path: 'claimant-contact-mailing',
          title: 'Your mailing address',
          uiSchema: claimantContactMailing.uiSchema,
          schema: claimantContactMailing.schema,
        },
        claimantContactPhoneEmail: {
          path: 'claimant-contact-phone-email',
          title: 'Your phone number and email address',
          uiSchema: claimantContactPhoneEmail.uiSchema,
          schema: claimantContactPhoneEmail.schema,
        },
        veteranIdentification: {
          path: 'veteran-identification',
          title: `Your identification information`,
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
      },
    },
  },
};

export default formConfig;
