import React from 'react';
import { createSelector } from 'reselect';

// Example of an imported schema:
// import fullSchema from '../22-1990-schema.json';
// eslint-disable-next-line no-unused-vars
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
// import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';

import { vagovprod, VAGOVSTAGING } from 'site/constants/buckets';

// TODO Update this when we get the correct schema.
import fullSchema from '../../my-education-benefits/22-1990-schema.json';

// // In a real app this would not be imported directly; instead the schema you
// // imported above would import and use these common definitions:
// import GetFormHelp from '../components/GetFormHelp';

import manifest from '../manifest.json';

// import IntroductionPage from '../containers/IntroductionPage';
import TOEIntroductionPage from '../containers/TOEIntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
// import toursOfDutyUI from '../definitions/toursOfDuty';
// import CustomReviewDOBField from '../components/CustomReviewDOBField';
// import ServicePeriodAccordionView from '../components/ServicePeriodAccordionView';
import EmailViewField from '../components/EmailViewField';
import PhoneViewField from '../components/PhoneViewField';
// import AccordionField from '../components/AccordionField';
// import BenefitGivenUpReviewField from '../components/BenefitGivenUpReviewField';
import MailingAddressViewField from '../components/MailingAddressViewField';
import YesNoReviewField from '../components/YesNoReviewField';
import PhoneReviewField from '../components/PhoneReviewField';
// import DateReviewField from '../components/DateReviewField';
import EmailReviewField from '../components/EmailReviewField';

// import {
//   chapter30Label,
//   chapter1606Label,
//   unsureDescription,
//   post911GiBillNote,
//   prefillTransformer,
// } from '../helpers';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';

import {
  isValidPhone,
  validatePhone,
  validateEmail,
  // validateEffectiveDate,
} from '../utils/validation';

// import { createSubmissionForm } from '../utils/form-submit-transform';
import { directDepositDescription } from '../../edu-benefits/1990/helpers';
import GetHelp from '../components/GetHelp';

// import { ELIGIBILITY } from '../actions';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  email,
  // toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  accountNumber: 'accountNumber',
  accountType: 'accountType',
  activeDutyKicker: 'activeDutyKicker',
  additionalConsiderationsNote: 'additionalConsiderationsNote',
  address: 'address',
  bankAccount: 'bankAccount',
  benefitEffectiveDate: 'benefitEffectiveDate',
  benefitRelinquished: 'benefitRelinquished',
  contactMethod: 'contactMethod',
  dateOfBirth: 'dateOfBirth',
  email: 'email',
  federallySponsoredAcademy: 'federallySponsoredAcademy',
  fullName: 'fullName',
  hasDoDLoanPaymentPeriod: 'hasDoDLoanPaymentPeriod',
  highSchoolDiploma: 'highSchoolDiploma',
  highSchoolDiplomaDate: 'highSchoolDiplomaDate',
  incorrectServiceHistoryExplanation: 'incorrectServiceHistoryExplanation',
  loanPayment: 'loanPayment',
  mobilePhoneNumber: 'mobilePhoneNumber',
  mobilePhoneNumberInternational: 'mobilePhoneNumberInternational',
  phoneNumber: 'phoneNumber',
  phoneNumberInternational: 'phoneNumberInternational',
  relationshipToServiceMember: 'relationshipToServiceMember',
  receiveTextMessages: 'receiveTextMessages',
  routingNumber: 'routingNumber',
  selectedReserveKicker: 'selectedReserveKicker',
  seniorRotcCommission: 'seniorRotcCommission',
  serviceHistoryIncorrect: 'serviceHistoryIncorrect',
  sponsorDateOfBirth: 'sponsorDateOfBirth',
  sponsorFullName: 'sponsorFullName',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  userFullName: 'userFullName',
  viewBenefitSelection: 'view:benefitSelection',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewPhoneNumbers: 'view:phoneNumbers',
  viewStopWarning: 'view:stopWarning',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    preferredContactMethod: 'preferredContactMethod',
  },
  serviceHistory: 'serviceHistory',
  benefitSelection: 'benefitSelection',
  directDeposit: 'directDeposit',
  sponsorInformation: 'sponsorInformation',
  sponsorHighSchool: 'sponsorHighSchool',
  verifyHighSchool: 'verifyHighSchool',
};

const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category, parent, international) {
  return {
    [parent]: {
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        // startInEdit: formData => startPhoneEditValidation(formData),
        viewComponent: PhoneViewField,
      },
      'ui:objectViewField': PhoneReviewField,
      phone: {
        ...phoneUI(`${titleCase(category)} phone number`),
        'ui:validations': [validatePhone],
      },
    },
    [international]: {
      'ui:title': `This ${category} phone number is international`,
      'ui:reviewField': YesNoReviewField,
      'ui:options': {
        expandUnder: parent,
      },
    },
  };
}

function phoneSchema() {
  return {
    type: 'object',
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
    },
  };
}

// function transform(metaData, form) {
//   const submission = createSubmissionForm(form.data);
//   return JSON.stringify(submission);
// }

const checkImageSrc = environment.isStaging()
  ? `${VAGOVSTAGING}/img/check-sample.png`
  : `${vagovprod}/img/check-sample.png`;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/submit_claim`,
  // transformForSubmit: transform,
  trackingPrefix: 'my-education-benefits-',
  introduction: TOEIntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990EZ,
  saveInProgress: {
    messages: {
      inProgress:
        'Your my education benefits application (22-1990) is in progress.',
      expired:
        'Your saved my education benefits application (22-1990) has expired. If you want to apply for my education benefits, please start a new application.',
      saved: 'Your my education benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for my education benefits.',
    noAuth:
      'Please sign in again to continue your application for my education benefits.',
  },
  title: 'Apply for VA education benefits',
  subTitle: 'Equal to VA Form 22-1990 (Application for VA Education Benefits)',
  defaultDefinitions: {
    fullName,
    // ssn,
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  getHelp: GetHelp,
  preSubmitInfo,
  chapters: {
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        [formPages.applicantInformation]: {
          title: 'Your information',
          path: 'applicant-information/personal-information',
          subTitle: 'Your information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    This is the personal information we have on file for you. If
                    you notice any errors, please correct them now. Any updates
                    you make will change the information for your education
                    benefits only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p>
                    <a href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            [formFields.userFullName]: {
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
            },
            [formFields.dateOfBirth]: {
              ...currentOrPastDateUI('Date of birth'),
            },
            'view:dateOfBirthUnder18Alert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    Since you’re under 18 years old, a parent or guardian will
                    have to sign this application when you submit it.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => {
                  if (!formData || !formData[formFields.dateOfBirth]) {
                    return true;
                  }

                  const dateParts =
                    formData && formData[formFields.dateOfBirth].split('-');

                  if (!dateParts || dateParts.length !== 3) {
                    return true;
                  }
                  const birthday = new Date(
                    dateParts[0],
                    dateParts[1] - 1,
                    dateParts[2],
                  );
                  const today18YearsAgo = new Date(
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18),
                    ).setHours(0, 0, 0, 0),
                  );

                  return (
                    !isValidCurrentOrPastDate(
                      dateParts[2],
                      dateParts[1],
                      dateParts[0],
                    ) || birthday.getTime() <= today18YearsAgo.getTime()
                  );
                },
              },
            },
            [formFields.relationshipToServiceMember]: {
              'ui:title':
                'What’s your relationship to the service member whose benefit has been transferred to you?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.dateOfBirth,
              formFields.relationshipToServiceMember,
            ],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.userFullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [formFields.dateOfBirth]: date,
              'view:dateOfBirthUnder18Alert': {
                type: 'object',
                properties: {},
              },
              [formFields.relationshipToServiceMember]: {
                type: 'string',
                enum: ['Spouse', 'Child'],
              },
            },
          },
        },
      },
    },
    sponsorInformationChapter: {
      title: 'Sponsor information',
      pages: {
        [formPages.sponsorInformation]: {
          title: 'Phone numbers and email address',
          path: 'sponsor/information',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Choose your sponsor</h3>
                  <p>
                    Based on Department of Defense (DoD) records, this is the
                    sponsor information we have on file for you.
                  </p>
                  <p>
                    <strong>Note:</strong> If you notice something wrong with
                    your sponsor’s information or don’t see them listed, let
                    your sponsor know. Your sponsor can
                    <a href="/">
                      update this information on the DoD milConnect website.
                    </a>
                  </p>
                  <div className="toe-form-featured-content vads-u-margin-top--3 vads-u-margin-bottom--4">
                    <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
                      SPONSOR 1
                    </h5>
                    <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Jane Doe
                    </h4>
                    <dl className="toe-definition-list">
                      <dt className="toe-definition-list_term">
                        Date of birth:
                      </dt>
                      <dd className="toe-definition-list_definition">
                        July 18, 1996
                      </dd>
                      <dt className="toe-definition-list_term">
                        Your relationship to sponsor:
                      </dt>
                      <dd className="toe-definition-list_definition">Spouse</dd>
                    </dl>
                  </div>
                </>
              ),
              'ui:options': {
                hideIf: formData => !formData,
              },
            },
            'view:sponsorWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    We do not have any sponsor information on file
                  </h3>
                  <p>
                    If you think this is incorrect, reach out to your sponsor so
                    they can update this information on the DoD milConnect
                    website.
                  </p>
                  <p>
                    You may still continue this application and enter your
                    sponsor information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => !formData,
              },
            },
            [formFields.relationshipToServiceMember]: {
              'ui:title':
                'What’s your relationship to the service member whose benefit has been transferred to you?',
              'ui:widget': 'radio',
            },
            [formFields.sponsorFullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': "Sponsor's first name",
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
                'ui:title': "Sponsor's last name",
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
                'ui:title': "Sponsor's  middle name",
              },
            },
            [formFields.sponsorDateOfBirth]: {
              ...currentOrPastDateUI("Sponsor's date of birth"),
            },
            'view:additionalInfo': {
              'ui:description': (
                <va-additional-info trigger="Which sponsor should I choose?">
                  <p>
                    You can only choose one sponsor for this application. If you
                    have multiple sponsors, you can talk to them to determine
                    which benefits are right for you. You can also submit
                    another application for Transfer of Entitlement education
                    benefits if you would like to choose another sponsor.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            required: [formFields.sponsorDateOfBirth],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:sponsorWarning': {
                type: 'object',
                properties: {},
              },
              [formFields.relationshipToServiceMember]: {
                type: 'string',
                enum: ['Sponsor 1: Jane Doe', 'Someone not listed here'],
              },
              [formFields.sponsorFullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [formFields.sponsorDateOfBirth]: date,
              'view:additionalInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        [formPages.verifyHighSchool]: {
          title: 'Verify your high school education',
          path: 'child/high-school-education',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Verify your high school education</h3>
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <h3 slot="headline">We need additional information</h3>
                    <div>
                      Since you indicated that you are the child of your
                      sponsor, please include information about your high school
                      education.
                    </div>
                  </va-alert>
                </>
              ),
            },
            [formFields.highSchoolDiploma]: {
              'ui:title':
                'Did you earn a high school diploma or equivalency certificate?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            required: [formFields.highSchoolDiploma],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.highSchoolDiploma]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
            },
          },
        },
        [formPages.sponsorHighSchool]: {
          title: 'Verify your high school education',
          path: 'sponsor/high-school-education',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Verify your high school education</h3>
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <h3 slot="headline">We need additional information</h3>
                    <div>
                      Since you indicated that you are the child of your
                      sponsor, please include information about your high school
                      education.
                    </div>
                  </va-alert>
                </>
              ),
            },
            [formFields.highSchoolDiplomaDate]: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
              'ui:options': {
                monthYear: true,
              },
            },
          },
          schema: {
            type: 'object',
            required: [formFields.highSchoolDiplomaDate],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.highSchoolDiplomaDate]: date,
            },
          },
          depends: formData => formData[formFields.highSchoolDiploma] === 'Yes',
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        [formPages.contactInformation.contactInformation]: {
          title: 'Phone numbers and email address',
          path: 'contact-information/email-phone',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your phone numbers and email address</h3>
                  <div className="meb-list-label">
                    <strong>We’ll use this information to:</strong>
                  </div>
                  <ul>
                    <li>
                      Contact you if we have questions about your application
                    </li>
                    <li>Tell you important information about your benefits</li>
                  </ul>
                  <p>
                    This is the contact information we have on file for you. If
                    you notice any errors, please correct them now. Any updates
                    you make will change the information for your education
                    benefits only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your contact
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p>
                    <a href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            [formFields.viewPhoneNumbers]: {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 toe-review-page-only">
                    Phone numbers and email addresss
                  </h4>
                  <p className="toe-review-page-only">
                    If you’d like to update your phone numbers and email
                    address, please edit the form fields below.
                  </p>
                </>
              ),
              ...phoneUISchema(
                'mobile',
                formFields.mobilePhoneNumber,
                formFields.mobilePhoneNumberInternational,
              ),
              ...phoneUISchema(
                'home',
                formFields.phoneNumber,
                formFields.phoneNumberInternational,
              ),
            },
            [formFields.email]: {
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: EmailViewField,
              },
              email: {
                ...emailUI('Email address'),
                'ui:validations': [validateEmail],
                'ui:reviewField': EmailReviewField,
              },
              confirmEmail: {
                ...emailUI('Confirm email address'),
                'ui:options': {
                  ...emailUI()['ui:options'],
                  hideOnReview: true,
                },
              },
              'ui:validations': [
                (errors, field) => {
                  if (field.email !== field.confirmEmail) {
                    errors.confirmEmail.addError(
                      'Sorry, your emails must match',
                    );
                  }
                },
              ],
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.viewPhoneNumbers]: {
                type: 'object',
                properties: {
                  [formFields.mobilePhoneNumber]: phoneSchema(),
                  [formFields.mobilePhoneNumberInternational]: {
                    type: 'boolean',
                  },
                  [formFields.phoneNumber]: phoneSchema(),
                  [formFields.phoneNumberInternational]: {
                    type: 'boolean',
                  },
                },
              },
              [formFields.email]: {
                type: 'object',
                required: [formFields.email, 'confirmEmail'],
                properties: {
                  email,
                  confirmEmail: email,
                },
              },
            },
          },
        },
        [formPages.contactInformation.mailingAddress]: {
          title: 'Mailing address',
          path: 'contact-information/mailing-address',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your mailing address</h3>
                  <p>
                    We’ll send any important information about your application
                    to this address.
                  </p>
                  <p>
                    This is the mailing address we have on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p className="vads-u-margin-bottom--4">
                    <a href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            'view:mailingAddress': {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 toe-review-page-only">
                    Mailing address
                  </h4>
                  <p className="toe-review-page-only">
                    If you’d like to update your mailing address, please edit
                    the form fields below.
                  </p>
                </>
              ),
              livesOnMilitaryBase: {
                'ui:title': (
                  <span id="LiveOnMilitaryBaseTooltip">
                    I live on a United States military base outside of the
                    country
                  </span>
                ),
                'ui:reviewField': YesNoReviewField,
              },
              livesOnMilitaryBaseInfo: {
                'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
              },
              [formFields.address]: {
                ...address.uiSchema(''),
                street: {
                  'ui:title': 'Street address',
                  'ui:errorMessages': {
                    required: 'Please enter your full street address',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError(
                          'Please enter your full street address',
                        );
                      }
                    },
                  ],
                },
                city: {
                  'ui:title': 'City',
                  'ui:errorMessages': {
                    required: 'Please enter a valid city',
                  },
                  'ui:validations': [
                    (errors, field) => {
                      if (isOnlyWhitespace(field)) {
                        errors.addError('Please enter a valid city');
                      }
                    },
                  ],
                },
                state: {
                  'ui:title': 'State/Province/Region',
                  'ui:errorMessages': {
                    required: 'State is required',
                  },
                },
                postalCode: {
                  'ui:title': 'Postal Code (5-digit)',
                  'ui:errorMessages': {
                    required: 'Zip code must be 5 digits',
                  },
                },
              },
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: MailingAddressViewField,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:mailingAddress': {
                type: 'object',
                properties: {
                  livesOnMilitaryBase: {
                    type: 'boolean',
                  },
                  livesOnMilitaryBaseInfo: {
                    type: 'object',
                    properties: {},
                  },
                  [formFields.address]: {
                    ...address.schema(fullSchema, true),
                  },
                },
              },
            },
          },
        },
        [formPages.contactInformation.preferredContactMethod]: {
          title: 'Contact preferences',
          path: 'contact-information/contact-preferences',
          uiSchema: {
            'view:contactMethodIntro': {
              'ui:description': (
                <>
                  <h3 className="toe-form-page-only">
                    Choose your contact method for follow-up questions
                  </h3>
                </>
              ),
            },
            [formFields.contactMethod]: {
              'ui:title':
                'How should we contact you if we have questions about your application?',
              'ui:widget': 'radio',
              'ui:errorMessages': {
                required: 'Please select at least one way we can contact you.',
              },
              'ui:options': {
                updateSchema: (() => {
                  const filterContactMethods = createSelector(
                    form => form['view:phoneNumbers'].mobilePhoneNumber.phone,
                    form => form['view:phoneNumbers'].phoneNumber.phone,
                    (mobilePhoneNumber, homePhoneNumber) => {
                      const invalidContactMethods = [];
                      if (!mobilePhoneNumber) {
                        invalidContactMethods.push('Mobile Phone');
                      }
                      if (!homePhoneNumber) {
                        invalidContactMethods.push('Home Phone');
                      }

                      return {
                        enum: contactMethods.filter(
                          method => !invalidContactMethods.includes(method),
                        ),
                      };
                    },
                  );
                  return form => filterContactMethods(form);
                })(),
              },
            },
            'view:receiveTextMessages': {
              'ui:description': (
                <>
                  <div className="toe-form-page-only">
                    <h3>Choose how you want to get notifications</h3>
                    <p>
                      We recommend that you opt in to text message notifications
                      about your benefits. These include notifications that
                      prompt you to verify your enrollment so you’ll receive
                      your education payments. This is an easy way to verify
                      your monthly enrollment.
                    </p>
                  </div>
                </>
              ),
              [formFields.receiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications on your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field.slice(0, 4).includes('Yes');
                    const phoneExist = !!formData['view:phoneNumbers']
                      .mobilePhoneNumber.phone;
                    const { isInternational } = formData[
                      'view:phoneNumbers'
                    ].mobilePhoneNumber;

                    if (isYes) {
                      if (!phoneExist) {
                        errors.addError(
                          "You can't select that response because we don't have a mobile phone number on file for you.",
                        );
                      } else if (isInternational) {
                        errors.addError(
                          "You can't select that response because you have an international mobile phone number",
                        );
                      }
                    }
                  },
                ],
                'ui:options': {
                  widgetProps: {
                    Yes: { 'data-info': 'yes' },
                    No: { 'data-info': 'no' },
                  },
                  selectedProps: {
                    Yes: { 'aria-describedby': 'yes' },
                    No: { 'aria-describedby': 'no' },
                  },
                },
              },
            },
            'view:textMessagesAlert': {
              'ui:description': (
                <va-alert status="info">
                  <>
                    If you choose to get text message notifications from VA’s GI
                    Bill program, message and data rates may apply. Two messages
                    per month. At this time, we can only send text messages to
                    U.S. mobile phone numbers. Text STOP to opt out or HELP for
                    help.{' '}
                    <a
                      href="https://benefits.va.gov/gibill/isaksonroe/verification_of_enrollment.asp"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View Terms and Conditions and Privacy Policy.
                    </a>
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  !isValidPhone(
                    formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ].phone,
                  ) ||
                  formData[formFields.viewPhoneNumbers][
                    formFields.mobilePhoneNumber
                  ].isInternational,
              },
            },
            'view:noMobilePhoneAlert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text message notifications because
                    we don’t have a mobile phone number on file for you.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  isValidPhone(
                    formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ].phone,
                  ) ||
                  formData[formFields.viewPhoneNumbers][
                    formFields.mobilePhoneNumber
                  ].isInternational,
              },
            },
            'view:internationalTextMessageAlert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text notifications because you have
                    an international mobile phone number. At this time, we can
                    send text messages about your education benefits to U.S.
                    mobile phone numbers.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  !formData[formFields.viewPhoneNumbers][
                    formFields.mobilePhoneNumber
                  ].isInternational,
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:contactMethodIntro': {
                type: 'object',
                properties: {},
              },
              [formFields.contactMethod]: {
                type: 'string',
                enum: contactMethods,
              },
              'view:receiveTextMessages': {
                type: 'object',
                required: [formFields.receiveTextMessages],
                properties: {
                  [formFields.receiveTextMessages]: {
                    type: 'string',
                    enum: [
                      'Yes, send me text message notifications',
                      'No, just send me email notifications',
                    ],
                  },
                },
              },
              'view:textMessagesAlert': {
                type: 'object',
                properties: {},
              },
              'view:noMobilePhoneAlert': {
                type: 'object',
                properties: {},
              },
              'view:internationalTextMessageAlert': {
                type: 'object',
                properties: {},
              },
            },
            required: [formFields.contactMethod],
          },
        },
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        [formPages.directDeposit]: {
          path: 'direct-deposit',
          uiSchema: {
            'ui:description': directDepositDescription,
            bankAccount: {
              ...bankAccountUI,
              'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
            },
            'view:learnMore': {
              'ui:description': (
                <va-additional-info trigger="Where can I find these numbers?">
                  <img
                    key="check-image-src"
                    src={checkImageSrc}
                    alt="Example of a check showing where the account and routing numbers are"
                  />
                  <p>
                    The bank routing number is the first 9 digits on the bottom
                    left corner of a printed check. Your account number is the
                    second set of numbers on the bottom of a printed check, just
                    to the right of the bank routing number.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              bankAccount: {
                type: 'object',
                properties: {
                  accountType: {
                    type: 'string',
                    enum: ['checking', 'savings'],
                  },
                  routingNumber: {
                    type: 'string',
                    pattern: '^\\d{9}$',
                  },
                  accountNumber: {
                    type: 'string',
                  },
                },
              },
              'view:learnMore': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
