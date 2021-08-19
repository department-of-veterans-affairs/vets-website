import React from 'react';
// import _ from 'lodash/fp';

// Example of an imported schema:
// import fullSchema from '../22-1990-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-1990-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import GetFormHelp from '../components/GetFormHelp';
import FormFooter from 'platform/forms/components/FormFooter';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
// import * as address from 'platform/forms-system/src/js/definitions/address';

// import fullSchema from 'vets-json-schema/dist/22-1990-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// import { directDepositWarning } from '../helpers';
// import toursOfDutyUI from '../definitions/toursOfDuty';
import ReviewBoxField from '../components/ReviewBoxField';
import FullNameViewField from '../components/FullNameViewField';
import DateViewField from '../components/DateViewField';
import CustomReviewDOBField from '../components/CustomReviewDOBField';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import EmailViewField from '../components/EmailViewField';
import PhoneViewField from '../components/PhoneViewField';

import {
  activeDutyLabel,
  selectedReserveLabel,
  unsureDescription,
} from '../helpers';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  // bankAccount,
  // toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  bankAccount: 'bankAccount',
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  address: 'address',
  email: 'email',
  phoneNumber: 'phoneNumber',
  mobilePhoneNumber: 'mobilePhoneNumber',
  benefitSelection: 'benefitSelection',
};

// function hasDirectDeposit(formData) {
//   return formData[formFields.viewNoDirectDeposit] !== true;
// }

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  // serviceHistory: 'serviceHistory',
  contactInformation: 'contactInformation',
  directDeposit: 'directDeposit',
  benefitSelect: 'benefitSelect',
};

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'my-education-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1990',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your my education benefits application (22-1990) is in progress.',
    //   expired: 'Your saved my education benefits application (22-1990) has expired. If you want to apply for my education benefits, please start a new application.',
    //   saved: 'Your my education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for my education benefits.',
    noAuth:
      'Please sign in again to continue your application for my education benefits.',
  },
  title: 'Apply for VA education benefits',
  subTitle: 'Form 22-1990',
  defaultDefinitions: {
    fullName,
    // ssn,
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant information',
      pages: {
        [formPages.applicantInformation]: {
          path: 'applicant/information',
          subTitle: 'Review your personal information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    This is the personal information we have on file for you.
                  </p>
                </>
              ),
            },
            [formFields.fullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': 'Your first name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a first name');
                    }
                  },
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:title': 'Your last name',
                'ui:validations': [
                  (errors, field) => {
                    if (isOnlyWhitespace(field)) {
                      errors.addError('Please enter a last name');
                    }
                  },
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:title': 'Your middle name',
              },
              'ui:title': 'Your full name',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: FullNameViewField,
              },
            },
            'view:dateOfBirth': {
              'ui:title': 'Your date of birth',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                startInEdit: formData => {
                  const { dateOfBirth } = formData;

                  if (!dateOfBirth) {
                    return true;
                  }

                  const dateParts = dateOfBirth.split('-');
                  return !isValidCurrentOrPastDate(
                    dateParts[2],
                    dateParts[1],
                    dateParts[0],
                  );
                },
                viewComponent: DateViewField,
              },
              [formFields.dateOfBirth]: {
                ...currentOrPastDateUI('Date of birth'),
                'ui:reviewField': CustomReviewDOBField,
              },
            },
            'view:note': {
              'ui:description': (
                <p>
                  <strong>Note</strong>: Any updates you make here will change
                  your personal information for VA education benefits only. To
                  change your personal information for all benefits across VA,{' '}
                  <a href="#">visit your VA profile</a>.
                </p>
              ),
            },
          },
          schema: {
            type: 'object',
            required: [formFields.fullName],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.fullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              'view:dateOfBirth': {
                type: 'object',
                required: [formFields.dateOfBirth],
                properties: {
                  [formFields.dateOfBirth]: date,
                },
              },
              'view:note': {
                type: 'object',
                properties: {},
              },
            },
          },
          initialData: {
            fullName: {
              first: 'Hector',
              middle: 'Oliver',
              last: 'Stanley',
              suffix: 'Jr.',
            },
            'view:dateOfBirth': {
              dateOfBirth: '1992-07-23',
            },
          },
        },
      },
    },
    // serviceHistoryChapter: {
    //   title: 'Service History',
    //   pages: {
    //     [formPages.serviceHistory]: {
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
    contactInformationChapter: {
      title: 'Contact Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact/information',
          title: 'Contact Information',
          subTitle: 'Review your email and phone numbers',
          instructions:
            'This is the contact information we have on file for you. We’ll use this to get in touch with you if we have questions about your application and to communicate important information about your education benefits.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your email and phone numbers</h3>
                  <p>
                    This is the contact information we have on file for you.
                    We’ll use this to get in touch with you if we have questions
                    about your application and to communicate important
                    information about your education benefits.
                  </p>
                </>
              ),
            },
            [formFields.email]: {
              ...emailUI,
              'ui:title': 'Your email address',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: EmailViewField,
              },
            },
            [formFields.mobilePhoneNumber]: {
              ...phoneUI('Mobile phone'),
              'ui:title': 'Your mobile phone number',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: PhoneViewField,
              },
            },
            [formFields.phoneNumber]: {
              ...phoneUI('Home phone'),
              'ui:title': 'Your home phone number',
              'ui:field': ReviewBoxField,
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: PhoneViewField,
              },
            },
            'view:note': {
              'ui:description': (
                <p>
                  <strong>Note</strong>: Any updates you make here will change
                  your personal information for VA education benefits only. To
                  change your email and phone numbers for all benefits across
                  VA, <a href="#">visit your VA profile</a>.
                </p>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.email]: {
                type: 'string',
                format: 'email',
              },
              [formFields.mobilePhoneNumber]: usaPhone,
              [formFields.phoneNumber]: usaPhone,
              'view:note': {
                type: 'object',
                properties: {},
              },
            },
          },
          initialData: {
            email: 'hector.stanley@gmail.com',
            mobilePhoneNumber: '123-456-7890',
            phoneNumber: '098-765-4321',
          },
        },
        // [formPages.directDeposit]: {
        //   path: 'direct-deposit',
        //   title: 'Direct Deposit',
        //   uiSchema: {
        //     'ui:title': 'Direct deposit',
        //     [formFields.viewNoDirectDeposit]: {
        //       'ui:title': 'I don’t want to use direct deposit',
        //     },
        //     [formFields.bankAccount]: _.merge(bankAccountUI, {
        //       'ui:order': [
        //         formFields.accountType,
        //         formFields.accountNumber,
        //         formFields.routingNumber,
        //       ],
        //       'ui:options': {
        //         hideIf: formData => !hasDirectDeposit(formData),
        //       },
        //       [formFields.accountType]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.accountNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //       [formFields.routingNumber]: {
        //         'ui:required': hasDirectDeposit,
        //       },
        //     }),
        //     [formFields.viewStopWarning]: {
        //       'ui:description': directDepositWarning,
        //       'ui:options': {
        //         hideIf: hasDirectDeposit,
        //       },
        //     },
        //   },
        //   schema: {
        //     type: 'object',
        //     properties: {
        //       [formFields.viewNoDirectDeposit]: {
        //         type: 'boolean',
        //       },
        //       [formFields.bankAccount]: bankAccount,
        //       [formFields.viewStopWarning]: {
        //         type: 'object',
        //         properties: {},
        //       },
        //     },
        //   },
        // },
      },
    },
    benefitSelection: {
      title: 'Benefit selection',
      pages: {
        [formPages.benefitSelect]: {
          path: 'select-benefit',
          title: 'Benefit selection',
          subTitle: "you're applying for the Post-9/11 GIBill",
          instructions:
            'Currrently, you can only apply for Post-9/11 Gi Bill (Chapter 33) benefits through this application/ If you would like to apply for other benefits, please visit out How to Apply page.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h3>You’re applying for the Post-9/11 GI BIll®</h3>
                    <p>
                      Currently, you can only apply for Post-9/11 GI Bill
                      (Chapter 33) benefits through this application. If you
                      would like to apply for other benefits, please visit our{' '}
                      <a href="#">How To Apply</a> page.
                    </p>
                  </div>
                  <div>
                    <h4>Give up one other benefit</h4>
                    <p>
                      Because you are applying for the Post-9/11 GI Bill, you
                      have to give up one other benefit you may be eligible for.
                      <strong> This decision is final</strong>, which means you
                      can’t change your mind after you submit this application.
                    </p>
                  </div>
                  <div>
                    <AdditionalInfo triggerText="Why do I have to give up a benefit?">
                      <p>
                        {' '}
                        Per 38 USC 3327, If you are eligible for both the
                        Post-9/11 GI Bill and other education benefits, you must
                        give up one benefit you may be eligible for.
                      </p>
                    </AdditionalInfo>
                  </div>
                  <br />
                </>
              ),
            },
            [formFields.benefitSelection]: {
              'ui:title': 'Which benefit will you give up?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  ACTIVE_DUTY: activeDutyLabel,
                  SELECTED_RESERVE: selectedReserveLabel,
                  UNSURE: "I'm not sure and I need assistance",
                },
                widgetProps: {
                  ACTIVE_DUTY: { 'data-info': 'ACTIVE_DUTY' },
                  SELECTED_RESERVE: { 'data-info': 'SELECTED_RESERVE' },
                  UNSURE: { 'data-info': 'UNSURE' },
                },
                selectedProps: {
                  ACTIVE_DUTY: { 'aria-describedby': 'ACTIVE_DUTY' },
                  SELECTED_RESERVE: { 'aria-describedby': 'SELECTED_RESERVE' },
                  UNSURE: { 'aria-describedby': 'UNSURE' },
                },
                nestedContent: {
                  UNSURE: unsureDescription,
                },
              },
              'ui:errorMessages': {
                required: 'Please select an answer.',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['benefitSelection'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.benefitSelection]: {
                type: 'string',
                enum: ['ACTIVE_DUTY', 'SELECTED_RESERVE', 'UNSURE'],
              },
            },
          },
          initialData: {
            benefitSelection: '',
          },
        },
      },
    },
  },
};

export default formConfig;
