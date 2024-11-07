import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import FormFooter from 'platform/forms/components/FormFooter';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
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
// import submitForm from './submitForm';
import { transform } from './submit-transformer';
import FormHelp from '../components/FormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import CustomPageReview from '../components/CustomPageReview';

const { fullName, email, usaPhone } = commonDefinitions;
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
  defaultDefinitions: {
    fullName,
    usaPhone,
    email,
  },
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
          CustomPageReview: props => (
            <CustomPageReview
              data={props.data}
              editPage={props.editPage}
              title="Your country of residence"
              question="Country"
              dataValue="country"
              className="vads-u-margin-top--neg4"
            />
          ),
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
          CustomPageReview: props => (
            <CustomPageReview
              data={props.data}
              editPage={props.editPage}
              title="Your education"
              question="What’s the highest level of education you have completed?"
              dataValue="highestLevelOfEducation.level"
            />
          ),
          uiSchema: highestLevelOfEducation.uiSchema,
          schema: highestLevelOfEducation.schema,
        },
        currentlyEmployed: {
          title: 'Your education and employment history',
          path: 'education-employment-history-2',
          CustomPageReview: props => (
            <CustomPageReview
              data={props.data}
              editPage={props.editPage}
              title="Your current employment"
              question="Are you currently employed?"
              dataValue="currentlyEmployed"
            />
          ),
          uiSchema: {
            currentlyEmployed: {
              'ui:title': (
                <h3
                  className="vads-u-margin--0"
                  data-testid="currently-employed"
                >
                  Are you currently employed?
                </h3>
              ),
              'ui:widget': 'radio',
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
          CustomPageReview: props => (
            <CustomPageReview
              data={props.data}
              editPage={props.editPage}
              title="Your current annual salary"
              question="What’s your current annual salary?"
              dataValue="currentAnnualSalary"
            />
          ),
          uiSchema: currentAnnualSalary.uiSchema,
          schema: currentAnnualSalary.schema,
        },
        isWorkingInTechIndustry: {
          title: 'Your technology industry involvement',
          path: 'education-employment-history-4',
          CustomPageReview: props => (
            <CustomPageReview
              data={props.data}
              editPage={props.editPage}
              title="Your technology industry involvement"
              question="Do you currently work in the technology industry?"
              dataValue="isWorkingInTechIndustry"
            />
          ),
          uiSchema: {
            isWorkingInTechIndustry: {
              'ui:title': (
                <h3
                  className="vads-u-margin--0"
                  data-testid="current-technology"
                >
                  Do you currently work in the technology industry?
                </h3>
              ),
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
          CustomPageReview: props => {
            const { data, editPage } = props;
            return (
              <CustomPageReview
                data={data}
                editPage={editPage}
                title="Your main area of focus"
                question="What’s your main area of focus in the technology industry?"
                dataValue="techIndustryFocusArea"
              />
            );
          },
          uiSchema: techIndustryFocusArea.uiSchema,
          schema: techIndustryFocusArea.schema,
        },
      },
    },
  },
};

export default formConfig;
