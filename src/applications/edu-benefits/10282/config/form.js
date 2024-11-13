import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import constants from 'vets-json-schema/dist/constants.json';
import FormFooter from 'platform/forms/components/FormFooter';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaRadioField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';
import manifest from '../manifest.json';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  veteranDesc,
  applicantContactInfo,
  genderRaceQuestion,
  applicantRaceAndEthnicity,
  applicantGender,
  highestLevelOfEducation,
} from '../pages';
import StatementOfTruth from '../components/StatementOfTruth';
// import submitForm from './submitForm';
import { transform } from './submit-transformer';
import FormHelp from '../components/FormHelp';
import IntroductionPage from '../containers/IntroductionPage';

const { country, state } = fullSchema10282.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: async formData => {
    return new Promise(resolve => {
      resolve({ status: 201, data: formData });
    });
  },
  trackingPrefix: 'edu-10282-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_10282,
  defaultDefinitions: { country, state },
  saveInProgress: {
    messages: {
      inProgress:
        'Your 	education benefits application (22-10282) is in progress.',
      expired:
        'Your saved 	education benefits application (22-10282) has expired. If you want to apply for 	education benefits, please start a new application.',
      saved: 'Your 	education benefits application has been saved.',
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
          uiSchema: {
            ...titleUI('Country'),
            country: {
              'ui:title': 'What country do you live in?',
              'ui:webComponentField': VaSelectField,
              'ui:errorMessages': {
                required: 'You must select a country',
              },
            },
          },
          schema: {
            ...fullSchema10282.properties.country,
          },
        },
        applicantState: {
          title: 'Your state of residence',
          path: 'applicant-information-4',
          uiSchema: {
            ...titleUI('State'),
            state: {
              'ui:title': 'What state do you live in?',
              'ui:webComponentField': VaSelectField,
              'ui:errorMessages': {
                required: 'You must select a state',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['state'],
            properties: {
              state: {
                ...fullSchema10282.properties.state,
                enum: constants.states.USA.map(st => st.label),
              },
            },
          },
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
          title: 'Your personal information',
          path: 'applicant-information-6',
          reviewTitle: 'Your ethnicity and race',
          uiSchema: applicantRaceAndEthnicity.uiSchema,
          schema: applicantRaceAndEthnicity.schema,
          depends: formData => formData.raceAndGender === 'Yes',
        },
        applicantGender: {
          title: 'Your gender identity',
          path: 'applicant-information-7',
          uiSchema: applicantGender.uiSchema,
          schema: applicantGender.schema,
          depends: formData => formData.raceAndGender === 'Yes',
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
          title: 'Your education and employment history',
          path: 'education-employment-history-2',
          uiSchema: {
            ...titleUI('Employment'),
            currentlyEmployed: {
              'ui:title': 'Are you currently employed?',
              'ui:webComponentField': VaRadioField,
            },
          },
          schema: {
            type: 'object',
            properties: {
              currentlyEmployed: {
                ...fullSchema10282.properties.currentlyEmployed,
              },
            },
          },
        },
        currentAnnualSalary: {
          title: 'Your current annual salary',
          path: 'education-employment-history-3',
          uiSchema: {
            ...titleUI('Your current annual salary'),
            currentAnnualSalary: {
              'ui:title': 'What’s your current annual salary?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            properties: {
              currentAnnualSalary: {
                ...fullSchema10282.properties.currentAnnualSalary,
              },
            },
          },
        },
        isWorkingInTechIndustry: {
          title: 'Your technology industry involvement',
          path: 'education-employment-history-4',
          uiSchema: {
            ...titleUI('Your technology industry involvement'),
            isWorkingInTechIndustry: {
              'ui:title': 'Do you currently work in the technology industry?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            properties: {
              isWorkingInTechIndustry: {
                ...fullSchema10282.properties.isWorkingInTechIndustry,
              },
            },
          },
        },
        techIndustryFocusArea: {
          title: 'Your main area of focus',
          path: 'education-employment-history-5',
          uiSchema: {
            ...titleUI('Your main area of focus'),
            techIndustryFocusArea: {
              'ui:title':
                'What’s your main area of focus in the technology industry?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            properties: {
              techIndustryFocusArea: {
                ...fullSchema10282.properties.techIndustryFocusArea,
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
