import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import PreSubmitInfo from '../containers/PreSubmitInfo';

import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import submitForm from './submitForm';
import { prefillTransformer } from '../prefill-transformer';
import { transform } from '../submit-transformer';
import migrations from '../migrations';
import captureEvents from '../analytics-functions';

import manifest from '../manifest.json';

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
  ariaDescribedBySubmit: '22-0994-submit-application',
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/0994`,
  submit: submitForm,
  trackingPrefix: 'edu-0994-',
  formId: VA_FORM_IDS.FORM_22_0994,
  saveInProgress: {
    messages: {
      inProgress: 'Your VET TEC application (22-0994) is in progress.',
      expired:
        'Your saved VET TEC application (22-0994) has expired. If you want to apply for VET TEC, please start a new application.',
      saved: 'Your VET TEC application has been saved.',
    },
  },
  version: migrations.length,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
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
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  chapters: {
    // Chapter - Benefits eligibility
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: {
          title: 'Applicant Information',
          path: 'applicant/information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          onContinue: captureEvents.applicantInformation,
        },
        benefitsEligibility: {
          title: 'Applicant Information',
          path: 'benefits-eligibility',
          uiSchema: benefitsEligibility.uiSchema,
          schema: benefitsEligibility.schema,
          onContinue: captureEvents.benefitsEligibility,
        },
      },
    },
    // Chapter - Service history
    militaryService: {
      title: 'Service history',
      pages: {
        militaryService: {
          title: 'Military Service',
          path: 'military-service',
          uiSchema: militaryService.uiSchema,
          schema: militaryService.schema,
          onContinue: captureEvents.militaryService,
        },
      },
    },
    // Chapter - Education History
    educationHistory: {
      title: 'Education history',
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
      title: 'Work experience',
      pages: {
        // page - yes/no working in high-tech industry
        highTechIndustry: {
          title: 'High tech work experience',
          path: 'work-experience',
          uiSchema: highTechIndustry.uiSchema,
          schema: highTechIndustry.schema,
          onContinue: captureEvents.highTechWorkExp,
        },
      },
    },
    // Chapter - Program Selection
    programSelection: {
      title: 'Program selection',
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
          depends: form => form.hasSelectedPrograms === true,
          uiSchema: trainingProgramsInformation.uiSchema,
          schema: trainingProgramsInformation.schema,
        },
      },
    },
    // Chapter - Personal Information
    personalInformation: {
      title: 'Personal information',
      pages: {
        // page - contact information
        contactInformation: {
          title: 'Contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
          onContinue: captureEvents.contactInformation,
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
