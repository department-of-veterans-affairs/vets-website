// Example of an imported schema:
import fullSchema from '../10-10CG-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

const {
  fullName,
  ssn,
  veteranDateOfBirth,
  date,
  dateRange,
  usaPhone,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const chapterOneFields = {
  address: 'veteranAddress',
  cellNumber: 'veteranCellNumber',
  email: 'veteranEmail',
  fullName: 'veteranFullName',
  gender: 'veteranGender',
  medicaidEnrolled: 'veteranMedicaidEnrolled',
  plannedClinic: 'veteranPlannedClinic',
  previousTreatmentFacility: 'veteranPreviousTreatmentFacility',
  ssn: 'ssn',
  telephoneNumber: 'veteranTelephoneNumber',
  vaEnrolled: 'veteranVaEnrolled',
};

const chapterTwoFields = {
  address: 'primaryCaregiverAddress',
  caregiverDateOfBirth: 'primaryCaregiverDateOfBirth',
  cellNumber: 'primaryCaregiverCellNumber',
  email: 'primaryCaregiverEmail',
  fullName: 'primaryCaregiverFullName',
  gender: 'primaryCaregiverGender',
  otherHealthInsurance: 'OtherHealthInsurance',
  otherHealthInsuranceName: 'otherHealthInsuranceName',
  ssn: 'primaryCaregiverSsn',
  telephoneNumber: 'primaryCaregiverTelephoneNumber',
  vetRelationship: 'primaryCaregiverVetRelationship',
};

const chapterThreeFields = {
  secondary: {
    address: 'secondaryCaregiverAddress',
    caregiverDateOfBirth: 'secondaryCaregiverDateOfBirth',
    cellNumber: 'secondaryCaregiverCellNumber',
    email: 'secondaryCaregiverEmail',
    fullName: 'secondaryCaregiverFullName',
    gender: 'secondaryCaregiverGender',
    ssn: 'secondaryCaregiverSsn',
    telephoneNumber: 'secondaryCaregiverTelephoneNumber',
    vaEnrolled: 'secondaryCaregiverVaEnrolled',
    vetRelationship: 'secondaryCaregiverVetRelationship',
  },
  tertiary: {
    address: 'tertiaryCaregiverAddress',
    caregiverDateOfBirth: 'tertiaryCaregiverDateOfBirth',
    cellNumber: 'tertiaryCaregiverCellNumber',
    email: 'tertiaryCaregiverEmail',
    fullName: 'tertiaryCaregiverFullName',
    gender: 'tertiaryCaregiverGender',
    ssn: 'tertiaryCaregiverSsn',
    telephoneNumber: 'tertiaryCaregiverTelephoneNumber',
    vaEnrolled: 'tertiaryCaregiverVaEnrolled',
    vetRelationship: 'tertiaryCaregiverVetRelationship',
  },
};

/* TODO Chapters
* 1 - Vet/Service Member
* 2 - Primary Family Caregiver
* 3 - Secondary Family Caregiver (optional -- many)
*/

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'caregiver-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '1234',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for caregiver benefits.',
    noAuth:
      'Please sign in again to continue your application for caregiver benefits.',
  },
  title: 'Application for Caregiver Benefits',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
    veteranDateOfBirth,
  },
  chapters: {
    veteranChapter: {
      title: 'VETERAN/SERVICE MEMBER',
      pages: {
        veteranInfo: {
          path: 'service-member',
          title: 'Veteran Information',
          uiSchema: {
            [chapterOneFields.fullName]: fullNameUI,
            [chapterOneFields.ssn]: ssnUI,
            [chapterOneFields.veteranDateOfBirth]: currentOrPastDateUI(
              'Date of Birth',
            ),
            [chapterOneFields.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [chapterOneFields.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [chapterOneFields.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [chapterOneFields.email]: {
              'ui:title': 'Email Address',
            },
            [chapterOneFields.gender]: {
              'ui:title': 'Gender',
            },
            [chapterOneFields.vaEnrolled]: {
              'ui:title': 'Enrolled in VA Health Care?',
            },
            [chapterOneFields.plannedClinic]: {
              'ui:title':
                'Name of VA medical center or clinic where you receive or plan to receive health care services:',
            },
            [chapterOneFields.previousTreatmentFacility]: {
              'ui:title':
                'Name of facility where you last received medical treatment:',
            },
            [chapterOneFields.facilityType]: {
              'ui:title':
                'Type of facility where you last received medical treatment:',
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              [chapterOneFields.fullName]: fullName,
              [chapterOneFields.ssn]: ssn,
              [chapterOneFields.veteranDateOfBirth]: date,
              [chapterOneFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterOneFields.address]: address.schema(fullSchema, false),
              [chapterOneFields.telephoneNumber]: usaPhone,
              [chapterOneFields.cellNumber]: usaPhone,
              [chapterOneFields.email]: {
                type: 'string',
                format: 'email',
              },
              [chapterOneFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterOneFields.vaEnrolled]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
              [chapterOneFields.plannedClinic]: {
                type: 'string',
              },
              [chapterOneFields.facilityType]: {
                type: 'string',
                enum: ['Hospital', 'Clinic'],
              },
              [chapterOneFields.previousTreatmentFacility]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    primaryCaregiverChapter: {
      title: 'PRIMARY FAMILY CAREGIVER',
      pages: {
        primaryCaregiverInfo: {
          path: 'primary-caregiver',
          title: 'Primary Caregiver Information',
          uiSchema: {
            [chapterTwoFields.fullName]: fullNameUI,
            [chapterTwoFields.ssn]: ssnUI,
            [chapterTwoFields.caregiverDateOfBirth]: currentOrPastDateUI(
              'Date of birth',
            ),
            [chapterTwoFields.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [chapterTwoFields.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [chapterTwoFields.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [chapterTwoFields.email]: {
              'ui:title': 'Email Address',
            },
            [chapterTwoFields.gender]: {
              'ui:title': 'Gender',
            },
            [chapterTwoFields.vetRelationship]: {
              'ui:title':
                'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
            },
            [chapterTwoFields.medicaidEnrolled]: {
              'ui:title': 'Enrolled in Medicaid or Medicare?',
            },
            [chapterTwoFields.otherHealthInsurance]: {
              'ui:title': 'Other Health Insurance?',
            },
            [chapterTwoFields.otherHealthInsuranceName]: {
              'ui:title': 'Other Health Insurance Name?',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [chapterTwoFields.fullName]: fullName,
              [chapterTwoFields.ssn]: ssn,
              [chapterTwoFields.caregiverDateOfBirth]: date,
              [chapterTwoFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterTwoFields.address]: address.schema(fullSchema, false),
              [chapterTwoFields.telephoneNumber]: usaPhone,
              [chapterTwoFields.cellNumber]: usaPhone,
              [chapterTwoFields.email]: {
                type: 'string',
                format: 'email',
              },
              [chapterTwoFields.vetRelationship]: {
                type: 'string',
              },
              [chapterTwoFields.medicaidEnrolled]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
              [chapterTwoFields.otherHealthInsurance]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
              [chapterTwoFields.otherHealthInsuranceName]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    secondaryCaregiversChapter: {
      title: 'SECONDARY & TERTIARY FAMILY CAREGIVER',
      pages: {
        secondaryCaregiverInfo: {
          path: 'secondary-caregiver',
          title: 'Secondary Caregiver Information',
          uiSchema: {
            [chapterThreeFields.secondary.fullName]: fullNameUI,
            [chapterThreeFields.secondary
              .caregiverDateOfBirth]: currentOrPastDateUI('Date of birth'),
            [chapterThreeFields.secondary.ssn]: ssnUI,
            [chapterThreeFields.secondary.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [chapterThreeFields.secondary.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [chapterThreeFields.secondary.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [chapterThreeFields.secondary.email]: {
              'ui:title': 'Email Address',
            },
            [chapterThreeFields.secondary.gender]: {
              'ui:title': 'Gender',
            },
            [chapterThreeFields.secondary.vetRelationship]: {
              'ui:title':
                'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [chapterThreeFields.secondary.fullName]: fullName,
              [chapterThreeFields.secondary.ssn]: ssn,
              [chapterThreeFields.secondary.caregiverDateOfBirth]: date,
              [chapterThreeFields.secondary.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterThreeFields.secondary.address]: address.schema(
                fullSchema,
                false,
              ),
              [chapterThreeFields.secondary.telephoneNumber]: usaPhone,
              [chapterThreeFields.secondary.cellNumber]: usaPhone,
              [chapterThreeFields.secondary.email]: {
                type: 'string',
                format: 'email',
              },
              [chapterThreeFields.secondary.vetRelationship]: {
                type: 'string',
              },
            },
          },
        },
        tertiaryCaregiverInfo: {
          path: 'tertiary-caregiver',
          title: 'Tertiary Caregiver Information',
          uiSchema: {
            [chapterThreeFields.tertiary.fullName]: fullNameUI,
            [chapterThreeFields.tertiary
              .caregiverDateOfBirth]: currentOrPastDateUI('Date of birth'),
            [chapterThreeFields.tertiary.ssn]: ssnUI,
            [chapterThreeFields.tertiary.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [chapterThreeFields.tertiary.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [chapterThreeFields.tertiary.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [chapterThreeFields.tertiary.email]: {
              'ui:title': 'Email Address',
            },
            [chapterThreeFields.tertiary.gender]: {
              'ui:title': 'Gender',
            },
            [chapterThreeFields.tertiary.vetRelationship]: {
              'ui:title':
                'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [chapterThreeFields.tertiary.fullName]: fullName,
              [chapterThreeFields.tertiary.ssn]: ssn,
              [chapterThreeFields.tertiary.caregiverDateOfBirth]: date,
              [chapterThreeFields.tertiary.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterThreeFields.tertiary.address]: address.schema(
                fullSchema,
                false,
              ),
              [chapterThreeFields.tertiary.telephoneNumber]: usaPhone,
              [chapterThreeFields.tertiary.cellNumber]: usaPhone,
              [chapterThreeFields.tertiary.email]: {
                type: 'string',
                format: 'email',
              },
              [chapterThreeFields.tertiary.vetRelationship]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
