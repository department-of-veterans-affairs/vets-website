import environment from 'platform/utilities/environment';

import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import {
  checkValidPagePath,
  getNextPagePath,
} from 'platform/forms-system/src/js/routing';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';
import prefillTransformer from './prefill-transformer';

import ConfirmationQuestion from '../containers/ConfirmationQuestion';
import personalInformation1 from '../pages/personalInformation1';
import contactInformation1 from '../pages/contactInformation1';
import contactInformation2 from '../pages/contactInformation2';

import sectionTwoP1 from '../pages/sectionTwoP1';
import sectionThree from '../pages/sectionThree';
import peakEarnings from '../pages/peakEarnings';

import employmentHistory from '../pages/employmentHistory';
import currentMilitaryService from '../pages/currentMilitaryService';
import currentIncome from '../pages/currentIncome';
import leavingLastPosition from '../pages/leavingLastPosition';
import doctorInformation from '../pages/doctorInformation';
import hospitalInformation from '../pages/hospitalInformation';

import BeforeDisability from '../pages/BeforeDisability';
import AfterDisability from '../pages/AfterDisability';
import informationRequiredPage from '../pages/informationRequired';

import employmentStatementHistory from '../pages/employmentStatementHistory';
import sectionFour from '../pages/sectionFour';
import additionalRemarks from '../pages/additionalRemarks';
import sectionSix from '../pages/sectionSix';
import supportingDocuments from '../pages/supportingDocuments';

import doctorCareQuestion from '../pages/doctorCareQuestion';
import hospitalQuestion from '../pages/hospitalQuestion';

import {
  doctorCareQuestionFields,
  hospitalizationQuestionFields,
} from '../definitions/constants';

const handleFormLoaded = props => {
  const {
    returnUrl,
    router,
    routes,
    formData,
    formConfig: loadedFormConfig,
  } = props;
  const pageList = routes?.[routes.length - 1]?.pageList || [];
  const introPath = `${loadedFormConfig?.urlPrefix || '/'}introduction`;
  const fallbackPath =
    getNextPagePath(pageList, formData, introPath) || introPath;
  const safeReturnUrl =
    returnUrl && checkValidPagePath(pageList, formData, returnUrl)
      ? returnUrl
      : fallbackPath;

  router.push(safeReturnUrl);
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/increase_compensation/v0/form8940`,
  trackingPrefix: 'ss-8940-',
  // Provide an empty definitions object so shared page test helpers expecting this prop won't fail
  defaultDefinitions: {},
  dev: {
    collapsibleNavLinks: true,
    showNavLinks: true,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteran.fullName',
    },
  },
  formId: '21-8940',
  saveInProgress: {
    messages: {
      inProgress:
        "Your veteran's application for increased compensation based on unemployability is in progress.",
      expired:
        "Your saved veteran's application for increased compensation based on unemployability has expired.",
      saved:
        "Your veteran's application for increased compensation based on unemployability has been saved.",
    },
  },
  onFormLoaded: handleFormLoaded,
  version: 0,
  // Note: this is enabled for Save In Progress functionality. We are not using prefill and thus do not have a prefill transformer
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit,
  savedFormMessages: {
    notFound:
      "Please start over to complete your veteran's application for increased compensation based on unemployability.",
    noAuth:
      "Please sign in again to continue your veteran's application for increased compensation based on unemployability.",
  },
  hideUnauthedStartLink: true,
  title:
    "Veteran's application for increased compensation based on unemployability (VA 21-8940) ",
  subTitle:
    'Please take your time to complete this form as accurately as you can.',
  customText: {
    appType: 'veteran application',
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      { href: '/disability', label: 'Disability' },
      {
        href: '/disability/eligibility',
        label: 'Eligibility',
      },
      {
        href: '/disability/eligibility/special-claims',
        label: 'Special claims',
      },
      {
        href: '/disability/eligibility/special-claims/unemployability',
        label: 'Unemployability',
      },
    ],
  }),

  additionalRoutes: [
    {
      path: 'confirmation-question',
      pageKey: 'confirmationQuestion',
      component: ConfirmationQuestion,
      depends: () => true,
    },
  ],

  chapters: {
    informationRequiredChapter: {
      title: 'Information we are required to share',
      pages: {
        informationRequiredPage,
      },
    },
    veteranIdInformationChapter: {
      title: 'Veteran ID and Information',
      pages: {
        personalInformation1: {
          path: 'personal-information-1',
          title: 'Personal Information',
          uiSchema: personalInformation1.uiSchema,
          schema: personalInformation1.schema,
        },
        contactInformation1: {
          path: 'contact-information-1',
          title: 'Contact Information',
          uiSchema: contactInformation1.uiSchema,
          schema: contactInformation1.schema,
        },
        contactInformation2: {
          path: 'contact-information-2',
          title: 'Additional contact information',
          uiSchema: contactInformation2.uiSchema,
          schema: contactInformation2.schema,
        },
      },
    },
    sectionTwoP1Chapter: {
      title: 'Disability and Medical Information',
      pages: {
        sectionTwoP1: {
          path: 'disability-and-medical-information',
          title: 'Disability and Medical Information',
          uiSchema: sectionTwoP1.uiSchema,
          schema: sectionTwoP1.schema,
        },
        doctorCareQuestionPage: {
          path: 'doctor-care-question',
          title: "Doctor's Care Question",
          uiSchema: doctorCareQuestion.uiSchema,
          schema: doctorCareQuestion.schema,
        },
        doctorInformationPage: {
          path: 'doctor-information',
          title: 'Doctor Information',
          uiSchema: doctorInformation.uiSchema,
          schema: doctorInformation.schema,
          depends: formData =>
            !!formData?.[doctorCareQuestionFields.parentObject]?.[
              doctorCareQuestionFields.hasReceivedDoctorCare
            ],
        },
        hospitalCareQuestionPage: {
          path: 'hospital-care-question',
          title: 'Hospital Care Question',
          uiSchema: hospitalQuestion.uiSchema,
          schema: hospitalQuestion.schema,
        },
        hospitalInformationPage: {
          path: 'hospital-information',
          title: 'Hospitalization Information',
          uiSchema: hospitalInformation.uiSchema,
          schema: hospitalInformation.schema,
          depends: formData =>
            !!formData?.[hospitalizationQuestionFields.parentObject]?.[
              hospitalizationQuestionFields.hasBeenHospitalized
            ],
        },
      },
    },
    sectionThreeChapter: {
      title: 'Employment Statement',
      pages: {
        sectionThree: {
          path: 'employment-statement',
          title: 'Employment Statement',
          uiSchema: sectionThree.uiSchema,
          schema: sectionThree.schema,
        },
        peakEarnings: {
          path: 'peak-earnings',
          title: 'Peak Earnings',
          uiSchema: peakEarnings.uiSchema,
          schema: peakEarnings.schema,
        },
      },
    },
    employmentHistoryChapter: {
      title: 'Employment History',
      pages: {
        employmentHistory: {
          title: 'Employment History',
          path: 'section-3-employment',
          uiSchema: employmentHistory.uiSchema,
          schema: employmentHistory.schema,
        },
        currentMilitaryService: {
          title: 'Current Military Service',
          path: 'current-military-service',
          uiSchema: currentMilitaryService.uiSchema,
          schema: currentMilitaryService.schema,
        },
        currentIncome: {
          title: 'Current Income',
          path: 'current-income',
          uiSchema: currentIncome.uiSchema,
          schema: currentIncome.schema,
        },
        leavingLastPosition: {
          title: 'Leaving Your Last Position',
          path: 'leaving-last-position',
          uiSchema: leavingLastPosition.uiSchema,
          schema: leavingLastPosition.schema,
        },
      },
    },

    employmentAppliedChapter: {
      title: 'Employment Application Records',
      pages: employmentStatementHistory,
    },
    sectionFourChapter: {
      title: 'Education and Training Information',
      pages: {
        sectionFour: {
          path: 'education-and-training',
          title: 'Education and Training Information',
          uiSchema: sectionFour.uiSchema,
          schema: sectionFour.schema,
        },
      },
    },

    beforeDisabilityChapter: {
      title: 'Education and Training Information Before Disability',
      pages: {
        beforeDisabilityPage: {
          path: 'education-and-training-before-disability',
          title: 'Education and Training Information Before Disability',
          uiSchema: BeforeDisability.uiSchema,
          schema: BeforeDisability.schema,
        },
      },
    },
    afterDisabilityChapter: {
      title: 'Education and Training Information After Disability',
      pages: {
        afterDisabilityPage: {
          path: 'education-and-training-after-disability',
          title: 'Education and Training Information After Disability',
          uiSchema: AfterDisability.uiSchema,
          schema: AfterDisability.schema,
        },
      },
    },

    sectionFiveChapter: {
      title: 'Remarks',
      pages: {
        additionalRemarks: {
          path: 'additional-remarks',
          title: 'Additional Remarks',
          uiSchema: additionalRemarks.uiSchema,
          schema: additionalRemarks.schema,
        },
        supportingDocuments: {
          path: 'supporting-documents',
          title: 'Upload Supporting Documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
      },
    },
    sectionSixChapter: {
      title: 'Authorization and Certification Statements, Legal information',
      pages: {
        sectionSix: {
          path: 'authorization-and-certification',
          title:
            'Authorization and Certification Statements, Legal information',
          uiSchema: sectionSix.uiSchema,
          schema: sectionSix.schema,
        },
      },
    },
  },
  downtime: {
    dependencies: [externalServices.lighthouseBenefitsIntake],
  },
  footerContent,
  getHelp,
};

export default formConfig;
