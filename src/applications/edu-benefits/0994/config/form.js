import environment from '../../../../platform/utilities/environment';

import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

import FormFooter from '../../../../platform/forms/components/FormFooter';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { prefillTransformer } from '../prefill-transformer';
import { transform } from '../submit-transformer';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import { urlMigration } from '../../config/migrations';

import {
  applicantInformation,
  bankInformation,
  benefitsEligibility,
  contactInformation,
  militaryService,
  educationCompleted,
  highTechIndustry,
  trainingProgramsChoice,
  trainingProgramsInformation,
} from '../pages';

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/0994`,
  trackingPrefix: 'edu-0994-',
  formId: '22-0994',
  version: 1,
  migrations: [urlMigration('/0994')],
  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for VET TEC',
  subTitle: 'Form 22-0994',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  chapters: {
    // Chapter - Benefits eligibility
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          title: 'Applicant Information',
          path: 'applicant/information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
        },
        benefitsEligibility: {
          title: 'Applicant Information',
          path: 'benefits-eligibility',
          uiSchema: benefitsEligibility.uiSchema,
          schema: benefitsEligibility.schema,
        },
      },
    },
    // Chapter - Military Service
    militaryService: {
      title: 'Military Service',
      pages: {
        militaryService: {
          title: 'Military Service',
          path: 'military-service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
        },
      },
    },
    // Chapter - Education History
    educationHistory: {
      title: 'Education History',
      pages: {
        // page - Highest Level of education completed
        educationCompleted: {
          title: 'Education History',
          path: 'education-history',
          uiSchema: educationCompleted.uiSchema,
          schema: educationCompleted.schema,
        },
      },
    },
    // Chapter - High tech work experience
    highTechWorkExp: {
      title: 'Work Experience',
      pages: {
        // page - yes/no working in high-tech industry
        highTechIndustry: {
          title: 'High tech work experience',
          path: 'work-experience',
          uiSchema: highTechIndustry.uiSchema,
          schema: highTechIndustry.schema,
        },
      },
    },
    // Chapter - Program Selection
    programSelection: {
      title: 'Program Selection',
      pages: {
        // page - picked like to attend training programs
        trainingProgramsChoice: {
          title: 'Program Selection',
          path: 'training-programs-choice',
          uiSchema: trainingProgramsChoice.uiSchema,
          schema: trainingProgramsChoice.schema,
        },
        // page - interested in training programs
        trainingProgramsInformation: {
          title: 'Program Selection',
          path: 'training-programs-information',
          depends: form => form['view:trainingProgramsChoice'] === true,
          uiSchema: trainingProgramsInformation.uiSchema,
          schema: trainingProgramsInformation.schema,
        },
      },
    },
    // Chapter - Personal Information
    personalInformation: {
      title: 'Personal Information',
      pages: {
        // page - contact information
        contactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        // page - banking information
        bankInformation: {
          title: 'Direct deposit information',
          path: 'direct-deposit-information',
          uiSchema: bankInformation.uiSchema,
          schema: bankInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
