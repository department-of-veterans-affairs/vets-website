import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import footerContent from 'platform/forms/components/FormFooter';
import getHelp from '../../shared/components/GetFormHelp';

import manifest from '../manifest.json';
// we're NOT using JSON Schema for this form, so we don't need to import it

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import preparerTypePg from '../pages/preparerType';
import persInfoPg from '../pages/personalInfo';
import citizenIdInfoPg from '../pages/citizenIdentificationInfo';
import nonCitizenIdInfoPg from '../pages/nonCitizenIdentificationInfo';
import addressPg from '../pages/address';
import phoneEmailPg from '../pages/phoneEmail';
import recordSelectionsPg from '../pages/recordSelections';
import disExamDetailsPg from '../pages/disabilityExamDetails';
import finRecDetailsPg from '../pages/financialRecordDetails';
import lifeInsBenefitDetailsPg from '../pages/lifeInsuranceBenefitDetails';
import otherCompPenDetailsPg from '../pages/otherCompensationAndPensionDetails';
import otherBenefitDetailsPg from '../pages/otherBenefitDetails';
import { PREPARER_TYPES, RECORD_TYPES } from './constants';

// mock-data import for local development
import testData from '../tests/e2e/fixtures/data/test-data.json';

const mockData = testData.data;

/** @type {FormConfig} */
const formConfig = {
  dev: {
    showNavLinks: !window.Cypress,
  },
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'pa-10206-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '20-10206',
  hideUnauthedStartLink: true,

  saveInProgress: {
    messages: {
      inProgress: 'Your personal records request (20-10206) is in progress.',
      expired:
        'Your saved Personal records request (20-10206) has expired. If you want to request personal records, please start a new application.',
      saved: 'Your Personal records request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to request personal records.',
    noAuth: 'Please sign in again to continue your Personal records request.',
  },
  title: 'Request personal records',
  defaultDefinitions: {},
  v3SegmentedProgressBar: true,
  chapters: {
    preparerTypeChapter: {
      title: 'Your identity',
      pages: {
        preparerTypePage: {
          // we want req'd fields prefilled for LOCAL testing/previewing
          // one single initialData prop here will suffice for entire form
          initialData:
            !!mockData && environment.isLocalhost() && !window.Cypress
              ? mockData
              : undefined,
          path: 'preparer-type',
          title: 'Preparer type',
          uiSchema: preparerTypePg.uiSchema,
          schema: preparerTypePg.schema,
          pageClass: 'preparer-type-page',
        },
      },
    },
    personalInformationChapter: {
      title: 'Your personal information',
      pages: {
        personalInfoPage: {
          path: 'personal-information',
          title: 'Name and date of birth',
          uiSchema: persInfoPg.uiSchema,
          schema: persInfoPg.schema,
          pageClass: 'personal-information',
        },
        citizenIdentificationInfoPage: {
          depends: {
            preparerType: PREPARER_TYPES.CITIZEN,
          },
          path: 'citizen-identification-information',
          title: 'Identification information',
          uiSchema: citizenIdInfoPg.uiSchema,
          schema: citizenIdInfoPg.schema,
          pageClass: 'citizen-identification-information',
        },
        nonCitizenIdentificationInfoPage: {
          depends: {
            preparerType: PREPARER_TYPES.NON_CITIZEN,
          },
          path: 'non-citizen-identification-information',
          title: 'Identification information',
          uiSchema: nonCitizenIdInfoPg.uiSchema,
          schema: nonCitizenIdInfoPg.schema,
          pageClass: 'citizen-identification-information',
        },
      },
    },
    contactInformationChapter: {
      title: 'Your contact information',
      pages: {
        addressPage: {
          path: 'contact-information',
          title: 'Mailing address',
          uiSchema: addressPg.uiSchema,
          schema: addressPg.schema,
          pageClass: 'address',
        },
        phoneEmailPage: {
          path: 'phone-email',
          title: 'Phone and email address',
          uiSchema: phoneEmailPg.uiSchema,
          schema: phoneEmailPg.schema,
          pageClass: 'phone-email',
        },
      },
    },
    recordsChapter: {
      title: 'Records',
      pages: {
        recordSelectionsPage: {
          path: 'record-selections',
          title: 'Select at least one record',
          uiSchema: recordSelectionsPg.uiSchema,
          schema: recordSelectionsPg.schema,
          pageClass: 'record-selections',
        },
      },
    },
    disabilityExamDetailsChapter: {
      title: 'Disability exam details',
      pages: {
        disabilityExamDetailsPage: {
          depends: {
            recordSelections: {
              [RECORD_TYPES.DISABILITY_EXAMS]: true,
            },
          },
          path: 'disability-exam-details',
          title: 'Disability exam details',
          uiSchema: disExamDetailsPg.uiSchema,
          schema: disExamDetailsPg.schema,
          pageClass: 'disability-exam-details',
        },
      },
    },
    financialRecordDetailsChapter: {
      title: 'Financial record details',
      pages: {
        financialRecordDetailsPage: {
          depends: {
            recordSelections: {
              [RECORD_TYPES.FINANCIAL]: true,
            },
          },
          path: 'financial-record-details',
          title: 'Financial record details',
          uiSchema: finRecDetailsPg.uiSchema,
          schema: finRecDetailsPg.schema,
          pageClass: 'financial-record-details',
        },
      },
    },
    lifeInsuranceBenefitDetailsChapter: {
      title: 'Life insurance benefit details',
      pages: {
        lifeInsuranceBenefitDetailsPage: {
          depends: {
            recordSelections: {
              [RECORD_TYPES.LIFE_INS]: true,
            },
          },
          path: 'life-insurance-benefit-details',
          title: 'Life insurance benefit details',
          uiSchema: lifeInsBenefitDetailsPg.uiSchema,
          schema: lifeInsBenefitDetailsPg.schema,
          pageClass: 'life-insurance-benefit-details',
        },
      },
    },
    otherCompensationAndPensionDetailsChapter: {
      title: 'Compensation and pension details',
      pages: {
        otherCompensationAndPensionDetailsPage: {
          depends: {
            recordSelections: {
              [RECORD_TYPES.OTHER_COMP_PEN]: true,
            },
          },
          path: 'other-compensation-and-pension-details',
          title: 'Other compensation and pension record details',
          uiSchema: otherCompPenDetailsPg.uiSchema,
          schema: otherCompPenDetailsPg.schema,
          pageClass: 'other-compensation-and-pension-details',
        },
      },
    },
    otherBenefitDetailsChapter: {
      title: 'Benefit record details',
      pages: {
        otherBenefitDetailsPage: {
          depends: {
            recordSelections: {
              [RECORD_TYPES.OTHER]: true,
            },
          },
          path: 'other-benefit-details',
          title: 'Other benefit record details',
          uiSchema: otherBenefitDetailsPg.uiSchema,
          schema: otherBenefitDetailsPg.schema,
          pageClass: 'other-benefit-details',
        },
      },
    },
  },
  customText: {
    appSavedSuccessfullyMessage: 'Your request has been saved.',
    startNewAppButtonText: 'Start a new request',
    continueAppButtonText: 'Continue your request',
    finishAppLaterMessage: 'Finish this request later',
    appType: 'request',
    appAction: 'requesting your personal records',
    submitButtonText: 'Submit request',
  },
  footerContent,
  getHelp,
};

export default formConfig;
