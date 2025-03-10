import React from 'react';
import { VA_FORM_IDS } from 'platform/forms/constants';
import FormFooter from 'platform/forms/components/FormFooter';
import environment from 'platform/utilities/environment';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  applicantInformationCountry,
  veteranDesc,
  applicantContactInfo,
  applicantState,
  genderRaceQuestion,
  applicantRaceAndEthnicity,
  applicantGender,
  highestLevelOfEducation,
  currentAnnualSalary,
  techIndustryFocusArea,
} from '../pages';
import StatementOfTruth from '../components/StatementOfTruth';
import submitForm from './submitForm';
import { transform } from './submit-transformer';
import FormHelp from '../components/FormHelp';
import IntroductionPage from '../containers/IntroductionPage';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/10282`,
  submit: submitForm,
  trackingPrefix: 'edu-10282-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10282,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-10282) is in progress.',
      expired:
        'Your saved education benefits application (22-10282) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    required: true,
    CustomComponent: StatementOfTruth,
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Apply for the IBM SkillsBuild program',
  subTitle:
    'IBM SkillsBuild Training Program Intake Application (VA Form 22-10282)',
  footerContent: FormFooter,
  getHelp: () => <FormHelp tag={React.Fragment} />,
  defaultDefinitions: {},
  transformForSubmit: transform,
  chapters: {
    personalInformation: {
      title: 'Your personal information',
      pages: {
        applicantName: {
          title: 'Your name',
          path: 'applicant/information',
          uiSchema: {
            veteranFullName: fullNameNoSuffixUI(false),
            ...titleUI('Your name'),
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName: fullNameNoSuffixSchema,
            },
          },
        },
        veteranDesc: {
          title: 'Your relationship to Veteran',
          path: 'applicant-information-1',
          uiSchema: veteranDesc.uiSchema,
          schema: veteranDesc.schema,
        },
        contactInfo: {
          title: 'Your contact information',
          path: 'applicant-information-2',
          uiSchema: applicantContactInfo.uiSchema,
          schema: applicantContactInfo.schema,
        },
        applicantCountry: {
          title: 'Your country of residence',
          path: 'applicant-information-3',
          uiSchema: applicantInformationCountry.uiSchema,
          schema: applicantInformationCountry.schema,
        },
        applicantState: {
          title: 'Your state of residence',
          path: 'applicant-information-4',
          uiSchema: applicantState.uiSchema,
          schema: applicantState.schema,
          depends: formData => {
            return formData.country === 'United States';
          },
        },
        genderRaceQuestion: {
          title: 'Optional demographic information',
          path: 'applicant-information-5',
          uiSchema: genderRaceQuestion.uiSchema,
          schema: genderRaceQuestion.schema,
        },
        applicantRaceAndEthnicity: {
          title: 'Your ethnicity and race',
          path: 'applicant-information-6',
          uiSchema: applicantRaceAndEthnicity.uiSchema,
          schema: applicantRaceAndEthnicity.schema,
          depends: formData => formData.raceAndGender === true,
        },
        applicantGender: {
          title: 'Your gender identity',
          path: 'applicant-information-7',
          uiSchema: applicantGender.uiSchema,
          schema: applicantGender.schema,
          depends: formData => formData.raceAndGender === true,
        },
      },
    },
    educationAndEmploymentHistory: {
      title: 'Your education and employment history',
      pages: {
        highestLevelOfEducation: {
          title: 'Your education',
          path: 'education-employment-history-1',
          uiSchema: highestLevelOfEducation.uiSchema,
          schema: highestLevelOfEducation.schema,
        },
        currentlyEmployed: {
          title: 'Your employment',
          path: 'education-employment-history-2',
          uiSchema: {
            ...titleUI('Your employment'),
            currentlyEmployed: yesNoUI('Are you currently employed?'),
          },
          schema: {
            type: 'object',
            properties: {
              currentlyEmployed: yesNoSchema,
            },
          },
        },
        currentAnnualSalary: {
          title: 'Your current annual salary',
          path: 'education-employment-history-3',
          uiSchema: currentAnnualSalary.uiSchema,
          schema: currentAnnualSalary.schema,
        },
        isWorkingInTechIndustry: {
          title: 'Your technology industry involvement',
          path: 'education-employment-history-4',
          uiSchema: {
            ...titleUI('Your technology industry involvement'),
            isWorkingInTechIndustry: yesNoUI(
              'Do you currently work in the technology industry?',
            ),
          },
          schema: {
            type: 'object',
            properties: {
              isWorkingInTechIndustry: yesNoSchema,
            },
          },
        },
        techIndustryFocusArea: {
          title: 'Your main area of focus',
          path: 'education-employment-history-5',
          uiSchema: techIndustryFocusArea.uiSchema,
          schema: techIndustryFocusArea.schema,
        },
      },
    },
  },
};

export default formConfig;
