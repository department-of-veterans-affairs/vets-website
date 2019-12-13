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
  address: 'address',
  cellNumber: 'cellNumber',
  email: 'email',
  fullName: 'fullName',
  gender: 'gender',
  medicaidEnrolled: 'medicaidEnrolled',
  plannedClinic: 'plannedClinic',
  previousTreatmentFacility: 'previousTreatmentFacility',
  ssn: 'ssn',
  telephoneNumber: 'telephoneNumber',
  vaEnrolled: 'vaEnrolled',
};

const chapterTwoFields = {
  address: 'address',
  caregiverDateOfBirth: 'caregiverDateOfBirth',
  cellNumber: 'cellNumber',
  email: 'email',
  fullName: 'fullName',
  gender: 'gender',
  otherHealthInsurance: 'otherHealthInsurance',
  otherHealthInsuranceName: 'otherHealthInsuranceName',
  ssn: 'ssn',
  telephoneNumber: 'telephoneNumber',
  vetRelationship: 'vetRelationship',
};

const chapterThreeFields = {
  address: 'address',
  caregiverDateOfBirth: 'caregiverDateOfBirth',
  cellNumber: 'cellNumber',
  email: 'email',
  fullName: 'fullName',
  gender: 'gender',
  ssn: 'ssn',
  telephoneNumber: 'telephoneNumber',
  vaEnrolled: 'vaEnrolled',
  vetRelationship: 'vetRelationship',
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
          title: 'Applicant Information',
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
          path: 'service-history',
          title: 'Service History',
          uiSchema: {
            [chapterTwoFields.fullName]: fullNameUI,
            [chapterTwoFields.veteranDateOfBirth]: currentOrPastDateUI(
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
              'ui:title': 'medicaid?',
            },
            [chapterTwoFields.otherHealthInsurance]: {
              'ui:title': 'Other health?',
            },
            [chapterTwoFields.otherHealthInsuranceName]: {
              'ui:title': 'Other health name?',
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
      title: 'PRIMARY FAMILY CAREGIVER (continued)',
      pages: {
        secondaryCaregiverInfo: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [chapterThreeFields.fullName]: fullNameUI,
            [chapterThreeFields.veteranDateOfBirth]: currentOrPastDateUI(
              'Date of birth',
            ),
            [chapterThreeFields.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [chapterThreeFields.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [chapterThreeFields.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [chapterThreeFields.email]: {
              'ui:title': 'Email Address',
            },
            [chapterThreeFields.gender]: {
              'ui:title': 'Gender',
            },
            [chapterThreeFields.vetRelationship]: {
              'ui:title':
                'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
            },
          },
          schema: {
            type: 'object',
            properties: {
              [chapterThreeFields.fullName]: fullName,
              [chapterThreeFields.ssn]: ssn,
              [chapterThreeFields.caregiverDateOfBirth]: date,
              [chapterThreeFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterThreeFields.address]: address.schema(fullSchema, false),
              [chapterThreeFields.telephoneNumber]: usaPhone,
              [chapterThreeFields.cellNumber]: usaPhone,
              [chapterThreeFields.email]: {
                type: 'string',
                format: 'email',
              },
              [chapterThreeFields.vetRelationship]: {
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
