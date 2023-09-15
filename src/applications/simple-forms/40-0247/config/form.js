// we're not using JSON schema for this form.
import environment from 'platform/utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import vetPersInfoNameDatesPg from '../pages/veteranPersonalInfoNameDates';
import vetIdInfoPg from '../pages/veteranIdInfo';
import vetSupportDocsPg from '../pages/veteranSupportDocs';
import requestTypePg from '../pages/requestType';
import appPersInfoPg from '../pages/applicantPersonalInfo';
import appAddrPg from '../pages/applicantAddress';
import appContactInfoPg from '../pages/applicantContactInfo';
import certsPg from '../pages/certificates';
import addlCertsYNPg from '../pages/additionalCertificatesYesNo';
import addlCertsReqsPg from '../pages/additionalCertificatesRequests';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/test-data.json';

const mockData = testData.data;

/** @type {FormConfig} */
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
    showNavLinks: !window.Cypress,
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
    veteranSupportingDocumentationChapter: {
      title: 'Veteran’s supporting documentation',
      pages: {
        veteranSupportDocsPage: {
          path: 'veteran-supporting-documentation',
          title: '',
          uiSchema: vetSupportDocsPg.uiSchema,
          schema: vetSupportDocsPg.schema,
          pageClass: 'veteran-supporting-documentation',
        },
      },
    },
    requestTypeChapter: {
      title: 'Request type',
      pages: {
        requestTypePage: {
          path: 'request-type',
          title: '',
          uiSchema: requestTypePg.uiSchema,
          schema: requestTypePg.schema,
          pageClass: 'request-type',
        },
      },
    },
    applicantPersonalInfoChapter: {
      title: 'Applicant’s personal information',
      pages: {
        applicantPersonalInfoPage: {
          path: 'applicant-personal-information',
          title: '',
          uiSchema: appPersInfoPg.uiSchema,
          schema: appPersInfoPg.schema,
          pageClass: 'applicant-personal-information',
        },
      },
    },
    applicantAddressChapter: {
      title: 'Applicant’s address',
      pages: {
        applicantAddressPage: {
          path: 'applicant-address',
          title: '',
          uiSchema: appAddrPg.uiSchema,
          schema: appAddrPg.schema,
          pageClass: 'applicant-address',
        },
      },
    },
    applicantContactInfoChapter: {
      title: 'Applicant’s contact information',
      pages: {
        applicantContactInfoPage: {
          path: 'applicant-contact-information',
          title: '',
          uiSchema: appContactInfoPg.uiSchema,
          schema: appContactInfoPg.schema,
        },
      },
    },
    certificatesChapter: {
      title: 'Certificates',
      pages: {
        certificatesPage: {
          path: 'certificates',
          title: '',
          uiSchema: certsPg.uiSchema,
          schema: certsPg.schema,
        },
      },
    },
    additionalCertificatesChapter: {
      title: 'Additional certificates request',
      pages: {
        additionalCertificatesYesNoPage: {
          path: 'additional-certificates',
          title: '',
          uiSchema: addlCertsYNPg.uiSchema,
          schema: addlCertsYNPg.schema,
        },
        additionalCertificatesRequestsPage: {
          path: 'additional-certificates-requests',
          title: '',
          depends: formData => formData.additionalCertificates === true,
          uiSchema: addlCertsReqsPg.uiSchema,
          schema: addlCertsReqsPg.schema,
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
