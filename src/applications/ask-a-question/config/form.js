import _ from 'lodash/fp';

// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import * as address from 'platform/forms-system/src/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

import { directDepositWarning } from '../helpers';
import toursOfDutyUI from '../definitions/toursOfDuty';
import { findAllByDisplayValue } from '@testing-library/dom';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  topic: 'topic',
  inquiryType: 'inquiryType',
  query: 'query',
  veteranStatus: 'veteranStatus',
  isDependent: 'isDependent',
  veteranRelationship: 'veteranRelationship',
  isVeteranDeceased: 'isDeceased',
  preferredResponseType: 'preferredResponseType',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  phoneNumber: 'phoneNumber',
  branchOfService: 'branchOfService',
  ssn: 'ssn',
  claimNumber: 'claimNumber',
  serviceNumber: 'serviceNumber',
  dob: 'dob',
  dateEnteredActiveDuty: 'dateEnteredActiveDuty',
  dateReleasedActiveDuty: 'dateReleasedActiveDuty',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  topic: 'topic',
  whoAmI: 'whoAmI',
  contactInformation: 'contactInformation',
  serviceInformation: 'serviceInformation',
};

const conditionalPhoneUI = () => {
  const response = phoneUI('Daytime phone');
  response['ui:required'] = (formData, index) =>
    formData.preferredResponseType === 'Telephone';
  response['ui:title'] = 'Daytime phone';
  return response;
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Ask a Question',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    topicChapter: {
      title: 'Topic',
      pages: {
        [formPages.topic]: {
          path: 'topic',
          title: 'What is your Question for the VA?',
          uiSchema: {
            [formFields.topic]: {
              'ui:title': 'Topic',
            },
            [formFields.inquiryType]: {
              'ui:title': 'Inquiry Type',
            },
            [formFields.query]: {
              'ui:title': 'Question',
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.topic,
              formFields.inquiryType,
              formFields.query,
            ],
            properties: {
              [formFields.topic]: {
                type: 'string',
                enum: [
                  'Policy Questions',
                  'Question about Women Veterans Programs',
                ],
              },
              [formFields.inquiryType]: {
                type: 'string',
                enum: [
                  'Question',
                  'Compliment',
                  'Service Complaint',
                  'Suggestion',
                  'Status of Claim',
                  'Status of Appeal at a Local VA Office',
                  'Status of Appeals at BVA, Wash DC',
                ],
              },
              [formFields.query]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    veteranRelationshipChapter: {
      title: 'Veteran Relationship',
      pages: {
        [formPages.whoAmI]: {
          path: 'veteran-relationship',
          title: 'How does a Veteran relate to your Question?',
          uiSchema: {
            [formFields.veteranStatus]: {
              'ui:title': 'I am asking about benefits/services:',
            },
            [formFields.isDependent]: {
              'ui:title': 'Are you the Dependant?',
              'ui:widget': 'yesNo',
              'ui:options': {
                expandUnder: formFields.veteranStatus,
                expandUnderCondition: 'for the Dependent of a Veteran',
              },
              'ui:required': (formData, index) =>
                formData.veteranStatus === 'for the Dependent of a Veteran',
            },
            [formFields.veteranRelationship]: {
              'ui:title': 'Your Relationship to Veteran',
              'ui:options': {
                expandUnder: formFields.veteranStatus,
                expandUnderCondition: status =>
                  status === 'for, about, or on behalf of a Veteran' ||
                  status === 'for the Dependent of a Veteran',
              },
              'ui:required': (formData, index) =>
                formData.veteranStatus ===
                  'for, about, or on behalf of a Veteran' ||
                formData.veteranStatus === 'for the Dependent of a Veteran',
            },
            [formFields.isVeteranDeceased]: {
              'ui:title': 'Is Veteran Deceased?',
              'ui:widget': 'yesNo',
              'ui:options': {
                expandUnder: formFields.veteranStatus,
                expandUnderCondition: status =>
                  status === 'for, about, or on behalf of a Veteran' ||
                  status === 'for the Dependent of a Veteran',
              },
              'ui:required': (formData, index) =>
                formData.veteranStatus ===
                  'for, about, or on behalf of a Veteran' ||
                formData.veteranStatus === 'for the Dependent of a Veteran',
            },
          },
          schema: {
            type: 'object',
            required: [formFields.veteranStatus],
            properties: {
              [formFields.veteranStatus]: {
                type: 'string',
                enum: [
                  'for Myself as a Veteran (I am the Vet)',
                  'for, about, or on behalf of a Veteran',
                  'for the Dependent of a Veteran',
                  'a General Question (Vet Info Not Needed)',
                ],
              },
              [formFields.isDependent]: {
                type: 'boolean',
              },
              [formFields.veteranRelationship]: {
                type: 'string',
                enum: [
                  'Spouse',
                  'Surviving Spouse',
                  'Ex-spouse',
                  'Authorized 3rd Party',
                  'Guardian/Fiduciary',
                  'Attorney',
                  'VSO',
                  'Father',
                  'Mother',
                  'Son',
                  'Daughter',
                  'Sibiling',
                  'Dependent Child',
                  'Helpless Child',
                  'Veteran',
                  'Funeral Director',
                  'Other',
                  'General Question; Not Applicable',
                ],
              },
              [formFields.isVeteranDeceased]: {
                type: 'boolean',
              },
            },
          },
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [formFields.preferredResponseType]: {
              'ui:title': 'Preferred Response Type',
            },
            [formFields.fullName]: fullNameUI,
            [formFields.email]: {
              'ui:title': 'Email Address',
              'ui:required': (formData, index) =>
                formData.preferredResponseType === 'Email',
            },
            [formFields.phoneNumber]: conditionalPhoneUI,
            [formFields.address]: address.uiSchema('Mailing address'),
          },
          schema: {
            type: 'object',
            required: [formFields.preferredResponseType, formFields.fullName],
            properties: {
              [formFields.preferredResponseType]: {
                type: 'string',
                enum: ['Email', 'Telephone', 'US Mail'],
              },
              [formFields.fullName]: fullName,
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.phoneNumber]: usaPhone,
              [formFields.address]: address.schema(fullSchema, true),
            },
          },
        },
      },
    },
  },
  // serviceInfoChapter: {
  //   title: 'Service History',
  //   pages: {
  //     [formPages.serviceInfo]: {
  //       path: 'service-history',
  //       title: 'Service History',
  //       uiSchema: {
  //         [formFields.toursOfDuty]: toursOfDutyUI,
  //       },
  //       schema: {
  //         type: 'object',
  //         properties: {
  //           [formFields.toursOfDuty]: toursOfDuty,
  //         },
  //       },
  //     },
  //   },
  // },
};

export default formConfig;
