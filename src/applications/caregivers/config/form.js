// Example of an imported schema:
import fullSchema from '../10-10CG-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import * as addressUI from 'platform/forms-system/src/js/definitions/address';
import definitions from '../definitions/caregiverUI';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  chapterOneFields,
  chapterTwoFields,
  chapterThreeFields,
} from '../definitions/constants';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

const {
  address,
  cellNumber,
  dateOfBirth,
  email,
  facilityType,
  gender,
  medicaidEnrolled,
  otherHealthInsurance,
  otherHealthInsuranceName,
  plannedClinic,
  previousTreatmentFacility,
  telephoneNumber,
  vaEnrolled,
  vetRelationship,
} = definitions.items;

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

/* TODO Chapters
* 1 - Vet/Service Member
* 2 - Primary Family Caregiver
* 3 - Secondary & Tertiary Family Caregiver (optional -- up to 2 conditionally)
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
            [chapterOneFields.dateOfBirth]: dateOfBirth,
            [chapterOneFields.address]: address,
            [chapterOneFields.telephoneNumber]: telephoneNumber,
            [chapterOneFields.cellNumber]: cellNumber,
            [chapterOneFields.email]: email,
            [chapterOneFields.gender]: gender,
            [chapterOneFields.vaEnrolled]: vaEnrolled,
            [chapterOneFields.plannedClinic]: plannedClinic,
            [chapterOneFields.previousTreatmentFacility]: previousTreatmentFacility,
            [chapterOneFields.facilityType]: facilityType,
          },
          schema: {
            type: 'object',
            required: [
              chapterOneFields.fullName,
              chapterOneFields.ssn,
              chapterOneFields.dateOfBirth,
              chapterOneFields.plannedClinic,
            ],
            properties: {
              [chapterOneFields.fullName]: fullName,
              [chapterOneFields.ssn]: ssn,
              [chapterOneFields.dateOfBirth]: date,
              [chapterOneFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterOneFields.address]: addressUI.schema(fullSchema, false),
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
                type: 'boolean',
              },
              [chapterOneFields.plannedClinic]: {
                type: 'string',
              },
              [chapterOneFields.facilityType]: {
                type: 'string',
                enum: ['hospital', 'clinic'],
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
            [chapterTwoFields.dateOfBirth]: dateOfBirth,
            [chapterTwoFields.address]: address,
            [chapterTwoFields.telephoneNumber]: telephoneNumber,
            [chapterTwoFields.cellNumber]: cellNumber,
            [chapterTwoFields.email]: email,
            [chapterTwoFields.gender]: gender,
            [chapterTwoFields.vetRelationship]: vetRelationship,
            [chapterTwoFields.medicaidEnrolled]: medicaidEnrolled,
            [chapterTwoFields.otherHealthInsurance]: otherHealthInsurance,
            [chapterTwoFields.otherHealthInsuranceName]: otherHealthInsuranceName,
          },
          schema: {
            type: 'object',
            required: [
              chapterTwoFields.fullName,
              chapterTwoFields.ssn,
              chapterTwoFields.dateOfBirth,
            ],
            properties: {
              [chapterTwoFields.fullName]: fullName,
              [chapterTwoFields.ssn]: ssn,
              [chapterTwoFields.dateOfBirth]: date,
              [chapterTwoFields.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterTwoFields.address]: addressUI.schema(fullSchema, false),
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
                type: 'boolean',
              },
              [chapterTwoFields.otherHealthInsurance]: {
                type: 'boolean',
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
            [chapterThreeFields.secondary.dateOfBirth]: dateOfBirth,
            [chapterThreeFields.secondary.ssn]: ssnUI,
            [chapterThreeFields.secondary.address]: address,
            [chapterThreeFields.secondary.telephoneNumber]: telephoneNumber,
            [chapterThreeFields.secondary.cellNumber]: cellNumber,
            [chapterThreeFields.secondary.email]: email,
            [chapterThreeFields.secondary.gender]: gender,
            [chapterThreeFields.secondary.vetRelationship]: vetRelationship,
          },
          schema: {
            type: 'object',
            properties: {
              [chapterThreeFields.secondary.fullName]: fullName,
              [chapterThreeFields.secondary.ssn]: ssn,
              [chapterThreeFields.secondary.dateOfBirth]: date,
              [chapterThreeFields.secondary.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterThreeFields.secondary.address]: addressUI.schema(
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
            [chapterThreeFields.tertiary.dateOfBirth]: dateOfBirth,
            [chapterThreeFields.tertiary.ssn]: ssnUI,
            [chapterThreeFields.tertiary.address]: address,
            [chapterThreeFields.tertiary.telephoneNumber]: telephoneNumber,
            [chapterThreeFields.tertiary.cellNumber]: cellNumber,
            [chapterThreeFields.tertiary.email]: email,
            [chapterThreeFields.tertiary.gender]: gender,
            [chapterThreeFields.tertiary.vetRelationship]: vetRelationship,
          },
          schema: {
            type: 'object',
            properties: {
              [chapterThreeFields.tertiary.fullName]: fullName,
              [chapterThreeFields.tertiary.ssn]: ssn,
              [chapterThreeFields.tertiary.dateOfBirth]: date,
              [chapterThreeFields.tertiary.gender]: {
                type: 'string',
                enum: ['Male', 'Female'],
              },
              [chapterThreeFields.tertiary.address]: addressUI.schema(
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
