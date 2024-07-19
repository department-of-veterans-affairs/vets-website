import merge from 'lodash/merge';
import fullSchema5495 from 'vets-json-schema/dist/22-5495-schema.json';

import applicantInformation from 'platform/forms/pages/applicantInformation';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import * as personId from 'platform/forms/definitions/personId';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

import applicantServicePage from '../../pages/applicantService';
import createOldSchoolPage from '../../pages/oldSchool';
import createSchoolSelectionPage from '../../pages/schoolSelection';
import contactInformationPage from '../../pages/contactInformation';
import createDirectDepositChangePage from '../../pages/directDepositChange';

import sponsorFullNameUI from '../../definitions/sponsorFullName';

import ConfirmationPage from '../containers/ConfirmationPage';

import { transform, introductionPage } from '../helpers';

import { urlMigration } from '../../config/migrations';

import { survivorBenefitsLabels } from '../../utils/labels';

import manifest from '../manifest.json';

const {
  benefit,
  outstandingFelony,
  veteranFullName,
} = fullSchema5495.properties;

const { school, educationType, date, fullName } = fullSchema5495.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/education_benefits_claims/5495`,
  trackingPrefix: 'edu-5495-',
  formId: VA_FORM_IDS.FORM_22_5495,
  saveInProgress: {
    messages: {
      inProgress:
        'Your education benefits application (22-5495) is in progress.',
      expired:
        'Your saved education benefits application (22-5495) has expired. If you want to apply for education benefits, please start a new application.',
      saved: 'Your education benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [urlMigration('/5495')],
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to resume your application for education benefits.',
  },
  transformForSubmit: transform,
  introduction: introductionPage(),
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    fullName,
    school,
    educationType,
    date,
  },
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5495',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: applicantInformation(fullSchema5495, {
          required: ['relativeFullName', 'relativeDateOfBirth'],
          fields: [
            'relativeFullName',
            'relativeDateOfBirth',
            'gender',
            'relativeSocialSecurityNumber',
            'view:noSSN',
            'relativeVaFileNumber',
          ],
        }),
        applicantService: applicantServicePage(fullSchema5495),
      },
    },
    benefitSelection: {
      title: 'Benefit selection',
      pages: {
        benefitSelection: {
          path: 'benefits/selection', // other forms this is benefits/eligibility
          title: 'Benefit selection',
          uiSchema: {
            benefit: {
              'ui:title':
                'Select the benefit under which you are applying for a change in program or place of training:',
              'ui:widget': 'radio',
              'ui:options': {
                labels: survivorBenefitsLabels,
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
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        sponsorInformation: {
          path: 'sponsor/information',
          title: 'Sponsor information',
          uiSchema: {
            veteranFullName: sponsorFullNameUI,
            'view:veteranId': merge({}, personId.uiSchema(), {
              'view:noSSN': {
                'ui:title': 'I don’t know my sponsor’s Social Security number',
              },
              vaFileNumber: {
                'ui:title': "Sponsor's VA file number",
              },
              veteranSocialSecurityNumber: {
                'ui:title': "Sponsor's Social Security number",
                'ui:validations': [
                  (errors, fieldData, formData) => {
                    if (fieldData === formData.relativeSocialSecurityNumber) {
                      errors.addError(
                        'Your sponsor’s SSN cannot be the same as yours.',
                      );
                    }
                  },
                ],
              },
            }),
            outstandingFelony: {
              'ui:title':
                'Do you or your sponsor have an outstanding felony and/or warrant?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              'view:veteranId': personId.schema(fullSchema5495),
              outstandingFelony,
            },
          },
        },
      },
    },
    schoolSelection: {
      title: 'School selection',
      pages: {
        newSchool: createSchoolSelectionPage(fullSchema5495, {
          required: ['educationType', 'name'],
          fields: ['educationProgram', 'educationObjective'],
          title:
            'School, university, program, or training facility you want to attend',
        }),
        oldSchool: createOldSchoolPage(fullSchema5495),
      },
    },
    personalInformation: {
      title: 'Personal information',
      pages: {
        contactInformation: contactInformationPage(
          fullSchema5495,
          'relativeAddress',
        ),
        directDeposit: createDirectDepositChangePage(fullSchema5495),
      },
    },
  },
};

export default formConfig;
