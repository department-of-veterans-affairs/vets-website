import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Pages
import identificationInformation from '../pages/identificationInformation';
import dateReleasedFromActiveDuty from '../pages/dateReleasedFromActiveDuty';
import activeDutyStatus from '../pages/activeDutyStatus';
import applicantFullname from '../pages/applicantFullname';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'edu-10297',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10297,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-10297) is in progress.',
    //   expired: 'Your saved education benefits application (22-10297) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    identificationChapter: {
      title: 'Veteran’s information',
      pages: {
        applicantFullName: {
          path: 'applicant-fullname',
          title: 'Provide your full name',
          uiSchema: applicantFullname.uiSchema,
          schema: applicantFullname.schema,
        },
        identificationInformation: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: identificationInformation.uiSchema,
          schema: identificationInformation.schema,
        },
        dateReleasedFromActiveDuty: {
          path: 'date-released-from-active-duty',
          title: 'Date released from active duty',
          uiSchema: dateReleasedFromActiveDuty.uiSchema,
          schema: dateReleasedFromActiveDuty.schema,
        },
        activeDutyStatus: {
          path: 'active-duty-status',
          title: 'Active duty status',
          uiSchema: activeDutyStatus.uiSchema,
          schema: activeDutyStatus.schema,
        },
      },
    },
  },
  // getHelp,
  footerContent,
};

export default formConfig;
