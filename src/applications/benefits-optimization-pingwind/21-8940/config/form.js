import React from 'react';
import environment from 'platform/utilities/environment';

import footerContent from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import {
  checkValidPagePath,
  getNextPagePath,
} from 'platform/forms-system/src/js/routing';
import { inlineTitleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import getHelp from '../../shared/components/GetFormHelp';
import transformForSubmit from './submit-transformer';

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

import doctorCareQuestion from '../pages/doctorCareQuestion';
import hospitalQuestion from '../pages/hospitalQuestion';

import {
  doctorCareQuestionFields,
  hospitalizationQuestionFields,
} from '../definitions/constants';

import ImportantInformation from '../containers/ImportantInformation';
import WhatYouNeed from '../containers/WhatYouNeed';

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

/** @returns {PageSchema} */
const sectionOneBannerPage = {
  path: 'section-1-banner',
  title: 'Section 1 - Veteran ID and Information',
  uiSchema: {
    ...inlineTitleUI('Section I - Veteran ID and Information'),
    'ui:description': (
      <div className="vads-u-margin-top--8">
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>Your name and identification numbers</li>
            <li>Your contact information (address, email, phone number)</li>
            <li>Takes about 5–7 minutes</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const sectionTwoBannerPage = {
  path: 'section-2-banner',
  title: 'Disability And Medical Treatment',
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Disability And Medical Treatment
      </h3>
    ),
    'ui:description': (
      <div>
        <p>
          We need some information about your service-connected disabilities and
          recent medical care.
        </p>
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>Which disabilities prevent you from working</li>
            <li>Doctors and hospitals you’ve visited in the past 12 months</li>
            <li>Treatment dates and provider information</li>
            <li>Takes about 7-10 minutes</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const sectionThreeBannerPage = {
  path: 'section-3-banner',
  title: 'Section 3 - Employment Statement',
  uiSchema: {
    ...inlineTitleUI('Section III - Employment'),
    'ui:description': (
      <div className="vads-u-margin-top--8">
        <p>Your work history and how your disabilities affect employment.</p>
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>When your disability began affecting your work</li>
            <li>Employment details for the past 5 years</li>
            <li>Your highest earnings and current income</li>
            <li>Whether you’ve tried to find work since becoming disabled</li>
            <li>Takes about 20-25 minutes (longest section)</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const sectionFourBannerPage = {
  path: 'section-4-banner',
  title: 'Section 4 - Schooling and Other Training',
  uiSchema: {
    ...inlineTitleUI('Section IV - Schooling and Other Training'),
    'ui:description': (
      <div className="vads-u-margin-top--8">
        <p>We’ll start by confirming your identity and how to reach you.</p>
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>Highest level of education completed</li>
            <li>Training before and after becoming too disabled to work</li>
            <li>Takes about 3-5 minutes</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

const sectionFiveBannerPage = {
  path: 'section-5-banner',
  title: 'Section 5 - Remarks',
  uiSchema: {
    ...inlineTitleUI('Section V - Remarks'),
    'ui:description': (
      <div className="vads-u-margin-top--8">
        <p>Add any additional information we should know.</p>
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>Space for any additional details about your situation</li>
            <li>Upload any supporting documentation</li>
            <li>This section is optional</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

const sectionSixBannerPage = {
  path: 'section-6-banner',
  title: 'Section 6 - Authorization, Certification, and Signature',
  uiSchema: {
    ...inlineTitleUI(
      'Section VI - Authorization, Certification, and Signature',
    ),
    'ui:description': (
      <div className="vads-u-margin-top--8">
        <p>We’ll start by confirming your identity and how to reach you.</p>
        <div
          style={{
            backgroundColor: '#e7f4f7',
            border: '1px solid #b3d4fc',
            borderRadius: '5px',
            padding: '16px',
            margin: '16px 0',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1b4480' }}>What to expect:</h3>
          <ul style={{ marginBottom: 0, color: '#1b4480' }}>
            <li>Review all your information</li>
            <li>Electronically sign and submit</li>
            <li>Takes about 2-5 minutes</li>
          </ul>
        </div>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
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

  additionalRoutes: [
    {
      path: 'confirmation-question',
      pageKey: 'confirmationQuestion',
      component: ConfirmationQuestion,
      depends: () => true,
    },
    {
      path: 'important-information',
      pageKey: 'important-information',
      component: ImportantInformation,
      depends: () => true,
    },
    {
      path: 'what-you-need',
      pageKey: 'what-you-need',
      component: WhatYouNeed,
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
        sectionOneBannerPage,
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
        sectionTwoBannerPage,
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
        sectionThreeBannerPage,
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
        sectionFourBannerPage,
        sectionFour: {
          path: 'education-and-training',
          title: 'Education and Training Information',
          uiSchema: sectionFour.uiSchema,
          schema: sectionFour.schema,
        },
      },
    },

    beforeDisabilityChapter: {
      title: 'Education and Training Information',
      pages: {
        beforeDisabilityPage: {
          path: 'education-and-training-before-disability',
          title: 'Education and Training Information',
          uiSchema: BeforeDisability.uiSchema,
          schema: BeforeDisability.schema,
        },
      },
    },
    afterDisabilityChapter: {
      title: 'Education and Training Information',
      pages: {
        afterDisabilityPage: {
          path: 'education-and-training-after-disability',
          title: 'Education and Training Information',
          uiSchema: AfterDisability.uiSchema,
          schema: AfterDisability.schema,
        },
      },
    },

    sectionFiveChapter: {
      title: 'Remarks',
      pages: {
        sectionFiveBannerPage,
        additionalRemarks: {
          path: 'additional-remarks',
          title: 'Additional Remarks',
          uiSchema: additionalRemarks.uiSchema,
          schema: additionalRemarks.schema,
        },
      },
    },
    sectionSixChapter: {
      title: 'Authorization and Certification',
      pages: {
        sectionSixBannerPage,
        sectionSix: {
          path: 'authorization-and-certification',
          title: 'Authorization and Certification',
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
