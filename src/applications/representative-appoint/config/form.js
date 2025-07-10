import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import FormFooter from 'platform/forms/components/FormFooter';

import GetFormHelp from '../components/GetFormHelp';
import configService from '../utilities/configService';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { generatePDF } from '../api/generatePDF';
import { submitPOARequest } from '../api/submitPOARequest';
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

const formConfigFromService = configService.getFormConfig();

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  customText: {
    appType: 'form',
    submitButtonText: 'Continue',
  },
  submit: async form => {
    await generatePDF(form.data);

    if (form.data.representativeSubmissionMethod === 'digital') {
      await submitPOARequest(form.data);
    }

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
      inProgress:
        'Your VA accredited representative appointment application (21-22-AND-21-22A) is in progress.',
      expired:
        'Your saved VA accredited representative appointment application (21-22-AND-21-22A) has expired. If you want to apply for VA accredited representative appointment, please start a new application.',
      saved:
        'Your VA accredited representative appointment application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  v3SegmentedProgressBar: true,
  additionalRoutes: [],
  savedFormMessages: {
    notFound:
      'Please start over to apply for VA accredited representative appointment.',
    noAuth:
      'Please sign in again to continue your application for VA accredited representative appointment.',
  },
  title: 'Request help from a VA accredited representative or VSO',
  subTitle: formConfigFromService.subTitle || 'VA Forms 21-22 and 21-22a',
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

configService.setFormConfig(formConfig);

export default formConfig;
