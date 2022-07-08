import merge from 'lodash/merge';

import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';

import applicantInformation from 'platform/forms/pages/applicantInformation';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import FormFooter from 'platform/forms/components/FormFooter';
import * as address from 'platform/forms/definitions/address';
import fullNameUISchema from 'platform/forms/definitions/fullName';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import * as personId from 'platform/forms/definitions/personId';
import additionalBenefits from '../../pages/additionalBenefits';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import preSubmitInfo from '../containers/PreSubmitInfo';

import createContactInformationPage from '../../pages/contactInformation';
import createSchoolSelectionPage, {
  schoolSelectionOptionsFor,
} from '../../pages/schoolSelection';
import createDirectDepositPage from '../content/directDeposit';
import employmentHistoryPage from '../../pages/employmentHistory';

import postHighSchoolTrainingsUi from '../../definitions/postHighSchoolTrainings';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform,
  eligibilityDescription,
  benefitsLabels,
  relationshipLabels,
} from '../helpers';

import { urlMigration } from '../../config/migrations';

import manifest from '../manifest.json';

const {
  benefit,
  faaFlightCertificatesInformation,
  serviceBranch,
} = fullSchema1990e.properties;

const {
  date,
  dateRange,
  educationType,
  fullName,
  postHighSchoolTrainings,
  usaPhone,
} = fullSchema1990e.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/1990e`,
  trackingPrefix: 'edu-1990e-',
  formId: VA_FORM_IDS.FORM_22_1990E,
  saveInProgress: {
    messages: {
      messages: {
        inProgress:
          'Your education benefits application (22-1990E) is in progress.',
        expired:
          'Your saved education benefits application (22-1990E) has expired. If you want to apply for education benefits, please start a new application.',
        saved: 'Your education benefits application has been saved.',
      },
    },
  },
  version: 1,
  migrations: [urlMigration('/1990e')],
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply to use transferred education benefits.',
    noAuth:
      'Please sign in again to resume your application for transferred education benefits.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    educationType,
    usaPhone,
  },
  title: 'Apply to use transferred education benefits',
  subTitle: 'Form 22-1990E',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: applicantInformation(fullSchema1990e, {
          labels: { relationship: relationshipLabels },
        }),
        additionalBenefits: additionalBenefits(fullSchema1990e),
      },
    },
    benefitEligibility: {
      title: 'Benefits eligibility',
      pages: {
        benefitEligibility: {
          path: 'benefits/eligibility',
          title: 'Benefits eligibility',
          uiSchema: {
            'ui:description': eligibilityDescription,
            benefit: {
              'ui:widget': 'radio',
              'ui:title':
                'Select the benefit that has been transferred to you.',
              'ui:options': {
                labels: benefitsLabels,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              benefit,
            },
          },
        },
      },
    },
    sponsorVeteran: {
      title: 'Sponsor information',
      pages: {
        sponsorVeteran: {
          title: 'Sponsor information',
          path: 'sponsor/information',
          uiSchema: {
            veteranFullName: merge({}, fullNameUISchema, {
              first: {
                'ui:title': "Sponsor's first name",
              },
              last: {
                'ui:title': "Sponsor's last name",
              },
              middle: {
                'ui:title': "Sponsor's middle name",
              },
              suffix: {
                'ui:title': "Sponsor's suffix",
              },
            }),
            'view:veteranId': merge({}, personId.uiSchema(), {
              veteranSocialSecurityNumber: {
                'ui:title': "Sponsor's Social Security number",
              },
              'view:noSSN': {
                'ui:title': 'I don’t know my sponsor’s Social Security number',
              },
              vaFileNumber: {
                'ui:title': "Sponsor's VA file number",
              },
            }),
            veteranAddress: address.uiSchema("Sponsor's address"),
            serviceBranch: {
              'ui:title': "Sponsor's branch of service",
            },
          },
          schema: {
            type: 'object',
            required: ['veteranFullName'],
            properties: {
              veteranFullName: fullName,
              'view:veteranId': personId.schema(fullSchema1990e),
              veteranAddress: address.schema(fullSchema1990e),
              serviceBranch,
            },
          },
        },
      },
    },
    educationHistory: {
      title: 'Education history',
      pages: {
        educationHistory: {
          path: 'education/history',
          title: 'Education history',
          initialData: {},
          uiSchema: {
            highSchoolOrGedCompletionDate: monthYearUI(
              'When did you earn your high school diploma or equivalency certificate?',
            ),
            postHighSchoolTrainings: postHighSchoolTrainingsUi,
            faaFlightCertificatesInformation: {
              'ui:title':
                'If you have any FAA flight certificates, please list them here.',
              'ui:widget': 'textarea',
            },
          },
          schema: {
            type: 'object',
            properties: {
              highSchoolOrGedCompletionDate: date,
              postHighSchoolTrainings,
              faaFlightCertificatesInformation,
            },
          },
        },
      },
    },
    employmentHistory: {
      title: 'Employment history',
      pages: {
        employmentHistory: employmentHistoryPage(fullSchema1990e, false),
      },
    },
    schoolSelection: {
      title: 'School selection',
      pages: {
        schoolSelection: createSchoolSelectionPage(
          fullSchema1990e,
          schoolSelectionOptionsFor['1990e'],
        ),
      },
    },
    personalInformation: {
      title: 'Personal information',
      pages: {
        contactInformation: createContactInformationPage(
          fullSchema1990e,
          'relativeAddress',
        ),
        directDeposit: createDirectDepositPage(),
      },
    },
  },
};

export default formConfig;
