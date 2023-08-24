// we're not using JSON schema for this form.
import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import vetPersInfoNameDatesPg from '../pages/veteranPersonalInfoNameDates';
import vetPersInfoDemoPg from '../pages/veteranPersonalInfoDemographics';
import vetPersInfoGenderIdPg from '../pages/veteranPersonalInfoGenderIdentity';
import vetIdInfoPg from '../pages/veteranIdInfo';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/test-data.json';

const mockData = testData.data;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({
      confirmationNumber: '[mock-confirmation-number]',
    }),
  trackingPrefix: '0247-pmc',
  dev: {
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '40-0247',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your certificate request (40-0247) is in progress.',
    //   expired: 'Your saved certificate request (40-0247) has expired. If you want a certificate, please start a new request.',
    //   saved: 'Your certificate request has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to request a certificate.',
    noAuth: 'Please sign in again to continue your request for certificate.',
  },
  title: 'Request a Presidential Memorial Certificate',
  subTitle: 'Presidential Memorial Certificate request form (VA Form 40-0247)',
  defaultDefinitions: {
    privacyAgreementAccepted: {
      type: 'boolean',
      enum: [true],
    },
  },
  chapters: {
    veteranPersonalInfoChapter: {
      title: 'Veteran’s personal information',
      pages: {
        veteranPersonalInfoNameDatesPage: {
          path: 'veteran-personal-information-name-dates',
          title: 'Name and dates',
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          uiSchema: vetPersInfoNameDatesPg.uiSchema,
          schema: vetPersInfoNameDatesPg.schema,
          pageClass: 'veteran-personal-information-name-dates',
        },
        veteranPersonalInfoDemographicsPage: {
          path: 'veteran-personal-information-demographics',
          title: 'Demographics',
          uiSchema: vetPersInfoDemoPg.uiSchema,
          schema: vetPersInfoDemoPg.schema,
          pageClass: 'veteran-personal-information-demographics',
        },
        veteranPersonalInfoGenderIdentityPage: {
          path: 'veteran-personal-information-gender-identity',
          title: 'Gender identity',
          uiSchema: vetPersInfoGenderIdPg.uiSchema,
          schema: vetPersInfoGenderIdPg.schema,
          pageClass: 'veteran-personal-information-gender-identity',
        },
      },
    },
    veteranIdentificationInfoChapter: {
      title: 'Veteran’s identification information',
      pages: {
        veteranIdentificationInfoPage: {
          path: 'veteran-identification-information',
          title: '',
          uiSchema: vetIdInfoPg.uiSchema,
          schema: vetIdInfoPg.schema,
          pageClass: 'veteran-identification-information',
        },
      },
    },
  },
  footerContent,
  getHelp,
  customText: {
    appType: 'request',
  },
};

export default formConfig;
