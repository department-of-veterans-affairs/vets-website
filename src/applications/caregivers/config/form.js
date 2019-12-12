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
const formFields = {
  fullName: 'fullName',
  ssn: 'ssn',
  veteranDateOfBirth: 'veteranDateOfBirth',
  caregiverDateOfBirth: 'caregiverDateOfBirth',
  viewStopWarning: 'view:stopWarning',
  address: 'address',
  email: 'email',
  telephoneNumber: 'telephoneNumber',
  cellNumber: 'cellNumber',
  gender: 'gender',
  vaEnrolled: 'vaEnrolled',
  plannedClinic: 'plannedClinic',
  previousTreatmentFacility: 'previousTreatmentFacility',
  facilityType: 'facilityType',
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
            [formFields.fullName]: fullNameUI,
            [formFields.ssn]: ssnUI,
            [formFields.veteranDateOfBirth]: currentOrPastDateUI(
              'Date of Birth',
            ),
            [formFields.address]: address.uiSchema(
              'Current Street Address',
              false,
            ),
            [formFields.telephoneNumber]: phoneUI(
              'Telephone Number (Including Area Code)',
            ),
            [formFields.cellNumber]: phoneUI(
              'Cell Number (Including Area Code)',
            ),
            [formFields.email]: {
              'ui:title': 'Email Address',
            },
            [formFields.gender]: {
              'ui:title': 'Gender',
            },
            [formFields.vaEnrolled]: {
              'ui:title': 'Enrolled in VA Health Care?',
            },
            [formFields.plannedClinic]: {
              'ui:title':
                'Name of VA medical center or clinic where you receive or plan to receive health care services:',
            },
            [formFields.previousTreatmentFacility]: {
              'ui:title':
                'Name of facility where you last received medical treatment:',
            },
            [formFields.facilityType]: {
              'ui:title':
                'Type of facility where you last received medical treatment:',
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              [formFields.fullName]: fullName,
              [formFields.ssn]: ssn,
              [formFields.veteranDateOfBirth]: date,
              [formFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [formFields.address]: address.schema(fullSchema, false),
              [formFields.telephoneNumber]: usaPhone,
              [formFields.cellNumber]: usaPhone,
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [formFields.vaEnrolled]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
              [formFields.plannedClinic]: {
                type: 'string',
                format: 'email',
              },
              [formFields.facilityType]: {
                type: 'string',
                enum: ['Hospital', 'Clinic'],
              },
              [formFields.previousTreatmentFacility]: {
                type: 'string',
                format: 'email',
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
            [formFields.fullName]: fullNameUI,
            [formFields.veteranDateOfBirth]: currentOrPastDateUI(
              'Date of birth',
            ),
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.fullName]: fullName,
              [formFields.veteranDateOfBirth]: date,
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
            [formFields.fullName]: fullNameUI,
          },
          schema: {
            type: 'object',
            properties: {
              [formFields.address]: address.schema(fullSchema, false),
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.telephoneNumber]: usaPhone,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
