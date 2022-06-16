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
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import * as ENVIRONMENTS from 'site/constants/environments';
import * as BUCKETS from 'site/constants/buckets';
import fullSchema from '../22-1990-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import GetFormHelp from '../components/GetFormHelp';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import toursOfDutyUI from '../definitions/toursOfDuty';
import CustomReviewDOBField from '../components/CustomReviewDOBField';
import ServicePeriodAccordionView from '../components/ServicePeriodAccordionView';
import EmailViewField from '../components/EmailViewField';
import PhoneViewField from '../components/PhoneViewField';
import AccordionField from '../components/AccordionField';
import BenefitGivenUpReviewField from '../components/BenefitGivenUpReviewField';
import YesNoReviewField from '../components/YesNoReviewField';
import PhoneReviewField from '../components/PhoneReviewField';
import DateReviewField from '../components/DateReviewField';
import EmailReviewField from '../components/EmailReviewField';

import {
  chapter30Label,
  chapter1606Label,
  unsureDescription,
  post911GiBillNote,
  prefillTransformer,
} from '../helpers';

import MailingAddressViewField from '../components/MailingAddressViewField';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';

import {
  isValidPhone,
  validateEmail,
  validateEffectiveDate,
  validateMobilePhone,
  validateHomePhone,
} from '../utils/validation';

import { createSubmissionForm } from '../utils/form-submit-transform';
import { directDepositDescription } from '../../edu-benefits/1990/helpers';

import { ELIGIBILITY } from '../actions';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  email,
  toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  userFullName: 'userFullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  serviceHistoryIncorrect: 'serviceHistoryIncorrect',
  viewNoDirectDeposit: 'view:noDirectDeposit',
  viewStopWarning: 'view:stopWarning',
  bankAccount: 'bankAccount',
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  address: 'address',
  email: 'email',
  viewPhoneNumbers: 'view:phoneNumbers',
  phoneNumber: 'phoneNumber',
  mobilePhoneNumber: 'mobilePhoneNumber',
  viewBenefitSelection: 'view:benefitSelection',
  benefitRelinquished: 'benefitRelinquished',
  benefitEffectiveDate: 'benefitEffectiveDate',
  incorrectServiceHistoryExplanation: 'incorrectServiceHistoryExplanation',
  contactMethod: 'contactMethod',
  receiveTextMessages: 'receiveTextMessages',
  hasDoDLoanPaymentPeriod: 'hasDoDLoanPaymentPeriod',
  activeDutyKicker: 'activeDutyKicker',
  selectedReserveKicker: 'selectedReserveKicker',
  federallySponsoredAcademy: 'federallySponsoredAcademy',
  seniorRotcCommission: 'seniorRotcCommission',
  loanPayment: 'loanPayment',
  additionalConsiderationsNote: 'additionalConsiderationsNote',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    mailingAddress: 'mailingAddress',
    preferredContactMethod: 'preferredContactMethod',
  },
  serviceHistory: 'serviceHistory',
  benefitSelection: 'benefitSelection',
  additionalConsiderations: {
    activeDutyKicker: {
      name: 'active-duty-kicker',
      order: 1,
      title:
        'Do you qualify for an active duty kicker, sometimes called a College Fund?',
      additionalInfo: {
        trigger: 'What is an active duty kicker?',
        info:
          'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
      },
    },
    reserveKicker: {
      name: 'reserve-kicker',
      order: 1,
      title:
        'Do you qualify for a reserve kicker, sometimes called a College Fund?',
      additionalInfo: {
        trigger: 'What is a reserve kicker?',
        info:
          'Kickers, sometimes referred to as College Funds, are additional amounts of money that increase an individual’s basic monthly benefit. Each Department of Defense service branch (and not VA) determines who receives the kicker payments and the amount received. Kickers are included in monthly GI Bill payments from VA.',
      },
    },
    militaryAcademy: {
      name: 'academy-commission',
      order: 2,
      title:
        'Did you graduate and receive a commission from the United States Military Academy, Naval Academy, Air Force Academy, or Coast Guard Academy?',
    },
    seniorRotc: {
      name: 'rotc-commission',
      order: 3,
      title: 'Were you commissioned as a result of Senior ROTC?',
      additionalInfo: {
        trigger: 'What is Senior ROTC?',
        info:
          'The Senior Reserve Officer Training Corps (SROTC)—more commonly referred to as the Reserve Officer Training Corps (ROTC)—is an officer training and scholarship program for postsecondary students authorized under Chapter 103 of Title 10 of the United States Code.',
      },
    },
    loanPayment: {
      name: 'loan-payment',
      order: 4,
      title:
        'Do you have a period of service that the Department of Defense counts towards an education loan payment?',
      additionalInfo: {
        trigger: 'What does this mean?',
        info:
          "This is a Loan Repayment Program, which is a special incentive that certain military branches offer to qualified applicants. Under a Loan Repayment Program, the branch of service will repay part of an applicant's qualifying student loans.",
      },
    },
  },
  directDeposit: 'directDeposit',
};

const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const benefits = [
  ELIGIBILITY.CHAPTER30,
  ELIGIBILITY.CHAPTER1606,
  'CannotRelinquish',
];

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category) {
  return {
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
      viewComponent: PhoneViewField,
    },
    'ui:objectViewField': PhoneReviewField,
    phone: {
      ...phoneUI(`${titleCase(category)} phone number`),
      'ui:validations': [
        category === 'mobile' ? validateMobilePhone : validateHomePhone,
      ],
    },
    isInternational: {
      'ui:title': `This ${category} phone number is international`,
      'ui:reviewField': YesNoReviewField,
      'ui:options': {
        hideIf: formData => {
          if (category === 'mobile') {
            if (!formData['view:phoneNumbers'].mobilePhoneNumber.phone) {
              return true;
            }
          } else if (!formData['view:phoneNumbers'].phoneNumber.phone) {
            return true;
          }
          return false;
        },
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
      isInternational: {
        type: 'boolean',
      },
    },
  };
}

function additionalConsiderationsQuestionTitleText(benefitSelection, order) {
  const isUnsure = !benefitSelection || benefitSelection === 'CannotRelinquish';
  const pageNumber = isUnsure ? order - 1 : order;
  const totalPages = isUnsure ? 3 : 4;

  return `Question ${pageNumber} of ${totalPages}`;
}

function additionalConsiderationsQuestionTitle(benefitSelection, order) {
  const titleText = additionalConsiderationsQuestionTitleText(
    benefitSelection,
    order,
  );

  return (
    <>
      <h3 className="meb-additional-considerations-title meb-form-page-only">
        {titleText}
      </h3>
      <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
        {titleText}
      </h4>
      <p className="meb-review-page-only">
        If you’d like to update your answer to {titleText}, edit your answer to
        to the question below.
      </p>
    </>
  );
}

function AdditionalConsiderationTemplate(page, formField) {
  const { title, additionalInfo } = page;
  const additionalInfoViewName = `view:${page.name}AdditionalInfo`;
  let additionalInfoView;

  if (additionalInfo) {
    additionalInfoView = {
      [additionalInfoViewName]: {
        'ui:description': (
          <va-additional-info trigger={additionalInfo.trigger}>
            <p>{additionalInfo.info}</p>
          </va-additional-info>
        ),
      },
    };
  }

  return {
    path: page.name,
    title: data => {
      return additionalConsiderationsQuestionTitleText(
        data[formFields.viewBenefitSelection][formFields.benefitRelinquished],
        page.order,
      );
    },
    uiSchema: {
      'ui:description': data => {
        return additionalConsiderationsQuestionTitle(
          data.formData[formFields.viewBenefitSelection][
            formFields.benefitRelinquished
          ],
          page.order,
        );
      },
      [formFields[formField]]: {
        'ui:title': title,
        'ui:widget': 'radio',
      },
      [formFields[formField]]: {
        'ui:title': title,
        'ui:widget': 'radio',
      },
      ...additionalInfoView,
    },
    schema: {
      type: 'object',
      required: [formField],
      properties: {
        [formFields[formField]]: {
          type: 'string',
          enum: ['Yes', 'No'],
        },
        [additionalInfoViewName]: {
          type: 'object',
          properties: {},
        },
      },
    },
  };
}

function givingUpBenefitSelected(formData) {
  return ['Chapter30', 'Chapter1606'].includes(
    formData[formFields.viewBenefitSelection][formFields.benefitRelinquished],
  );
}

function notGivingUpBenefitSelected(formData) {
  return !givingUpBenefitSelected(formData);
}

function transform(metaData, form) {
  const submission = createSubmissionForm(form.data, form.formId);
  return JSON.stringify(submission);
}

const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

const isValidAccountNumber = accountNumber => {
  if (/^[0-9]*$/.test(accountNumber)) {
    return accountNumber;
  }
  return false;
};

const validateAccountNumber = (
  errors,
  accountNumber,
  formData,
  schema,
  errorMessages,
) => {
  if (!isValidAccountNumber(accountNumber)) {
    errors.addError(errorMessages.pattern);
  }
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/submit_claim`,
  transformForSubmit: transform,
  trackingPrefix: 'my-education-benefits-',
  introduction: IntroductionPage,
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
  prefillTransformer,
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
  getHelp: GetFormHelp,
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
            formId: {
              'ui:title': 'Form ID',
              'ui:disabled': true,
              'ui:options': {
                hideOnReview: true,
              },
            },
            claimantId: {
              'ui:title': 'Claimant ID',
              'ui:disabled': true,
              'ui:options': {
                hideOnReview: true,
              },
            },
            'view:userFullName': {
              'ui:description': (
                <p className="meb-review-page-only">
                  If you’d like to update your personal information, please edit
                  the form fields below.
                </p>
              ),
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
            },
            [formFields.dateOfBirth]: {
              ...currentOrPastDateUI('Your date of birth'),
              'ui:reviewField': CustomReviewDOBField,
            },
          },
          schema: {
            type: 'object',
            required: [formFields.dateOfBirth],
            properties: {
              formId: {
                type: 'string',
              },
              claimantId: {
                type: 'integer',
              },
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:userFullName': {
                required: [formFields.userFullName],
                type: 'object',
                properties: {
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
                },
              },
              [formFields.dateOfBirth]: date,
            },
          },
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
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
                    Phone numbers and email addresses
                  </h4>
                  <p className="meb-review-page-only">
                    If you’d like to update your phone numbers and email
                    address, please edit the form fields below.
                  </p>
                </>
              ),
              [formFields.mobilePhoneNumber]: phoneUISchema('mobile'),
              [formFields.phoneNumber]: phoneUISchema('home'),
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
                  [formFields.phoneNumber]: phoneSchema(),
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
                  <p>
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
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
                    Mailing address
                  </h4>
                  <p className="meb-review-page-only">
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
                  <h3 className="meb-form-page-only">
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
                  <div className="meb-form-page-only">
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
                    Bill program, message and data rates may apply. Students
                    will receive an average of two messages per month. At this
                    time, we can only send text messages to U.S. mobile phone
                    numbers. Text STOP to opt out or HELP for help.{' '}
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
    serviceHistoryChapter: {
      title: 'Service history',
      pages: {
        [formPages.serviceHistory]: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: {
            'view:subHeading': {
              'ui:description': <h3>Review your service history</h3>,
            },
            [formFields.toursOfDuty]: {
              ...toursOfDutyUI,
              'ui:field': AccordionField,
              'ui:title': 'Service history',
              'ui:options': {
                ...toursOfDutyUI['ui:options'],
                keepInPageOnReview: true,
                reviewTitle: <></>,
                setEditState: () => {
                  return true;
                },
                showSave: false,
                viewField: ServicePeriodAccordionView,
                viewComponent: ServicePeriodAccordionView,
                viewOnlyMode: true,
              },
              items: {
                ...toursOfDutyUI.items,
                'ui:objectViewField': ServicePeriodAccordionView,
              },
            },
            'view:serviceHistory': {
              'ui:description': (
                <div className="meb-review-page-only">
                  <p>
                    If you’d like to update information related to your service
                    history, edit the form fields below.
                  </p>
                </div>
              ),
              [formFields.serviceHistoryIncorrect]: {
                'ui:title': 'This information is incorrect and/or incomplete',
                'ui:reviewField': YesNoReviewField,
              },
            },
            [formFields.incorrectServiceHistoryExplanation]: {
              'ui:title':
                'Please explain what is incorrect and/or incomplete about your service history (250 character limit)',
              'ui:options': {
                expandUnder: 'view:serviceHistory',
                hideIf: formData =>
                  !formData['view:serviceHistory'][
                    formFields.serviceHistoryIncorrect
                  ],
              },
              'ui:widget': 'textarea',
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeading': {
                type: 'object',
                properties: {},
              },
              [formFields.toursOfDuty]: {
                ...toursOfDuty,
                title: '', // Hack to prevent console warning
                items: {
                  type: 'object',
                  properties: {},
                },
                required: [],
              },
              'view:serviceHistory': {
                type: 'object',
                properties: {
                  [formFields.serviceHistoryIncorrect]: {
                    type: 'boolean',
                  },
                },
              },
              [formFields.incorrectServiceHistoryExplanation]: {
                type: 'string',
                maxLength: 250,
              },
            },
          },
        },
      },
    },
    benefitSelection: {
      title: 'Benefit selection',
      pages: {
        [formPages.benefitSelection]: {
          path: 'benefit-selection',
          title: 'Benefit selection',
          subTitle: "You're applying for the Post-9/11 GI Bill®",
          depends: formData => formData.eligibility?.length,
          uiSchema: {
            'view:post911Notice': {
              'ui:description': (
                <>
                  {post911GiBillNote}
                  <h3>Give up one other benefit</h3>
                  <p>
                    Because you are applying for the Post-9/11 GI Bill, you have
                    to give up one other benefit you may be eligible for.
                  </p>
                  <p>
                    <strong>
                      You cannot change your decision after you submit this
                      application.
                    </strong>
                  </p>
                  <va-additional-info trigger="Why do I have to give up a benefit?">
                    <p>
                      The law says if you are eligible for both the Post-9/11 GI
                      Bill and another education benefit based on the same
                      period of active duty, you must give one up. One
                      qualifying period of active duty can only be used for one
                      VA education benefit.
                    </p>
                  </va-additional-info>
                </>
              ),
            },
            [formFields.viewBenefitSelection]: {
              'ui:description': (
                <div className="meb-review-page-only">
                  <p>
                    If you’d like to update which benefit you’ll give up, please
                    edit your answers to the questions below.
                  </p>
                  {post911GiBillNote}
                </div>
              ),
              [formFields.benefitRelinquished]: {
                'ui:title': 'Which benefit will you give up?',
                'ui:reviewField': BenefitGivenUpReviewField,
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    Chapter30: chapter30Label,
                    Chapter1606: chapter1606Label,
                    CannotRelinquish: "I'm not sure",
                  },
                  widgetProps: {
                    Chapter30: { 'data-info': 'Chapter30' },
                    Chapter1606: { 'data-info': 'Chapter1606' },
                    CannotRelinquish: { 'data-info': 'CannotRelinquish' },
                  },
                  selectedProps: {
                    Chapter30: { 'aria-describedby': 'Chapter30' },
                    Chapter1606: {
                      'aria-describedby': 'Chapter1606',
                    },
                    CannotRelinquish: {
                      'aria-describedby': 'CannotRelinquish',
                    },
                  },
                  updateSchema: (() => {
                    const filterEligibility = createSelector(
                      state => state.eligibility,
                      eligibility => {
                        if (!eligibility || !eligibility.length) {
                          return benefits;
                        }

                        return {
                          enum: benefits.filter(
                            benefit =>
                              eligibility.includes(benefit) ||
                              benefit === 'CannotRelinquish',
                          ),
                        };
                      },
                    );
                    return (form, state) => filterEligibility(form, state);
                  })(),
                },
                'ui:errorMessages': {
                  required: 'Please select an answer.',
                },
              },
            },
            'view:activeDutyNotice': {
              'ui:description': (
                <div className="meb-alert meb-alert--mini meb-alert--warning">
                  <i aria-hidden="true" role="img" />
                  <p className="meb-alert_body">
                    <span className="sr-only">Alert:</span> If you give up the
                    Montgomery GI Bill Active Duty, you’ll get Post-9/11 GI Bill
                    benefits only for the number of months you had left under
                    the Montgomery GI Bill Active Duty.
                  </p>
                </div>
              ),
              'ui:options': {
                expandUnder: [formFields.viewBenefitSelection],
                hideIf: formData =>
                  formData[formFields.viewBenefitSelection][
                    formFields.benefitRelinquished
                  ] !== 'Chapter30',
              },
            },
            [formFields.benefitEffectiveDate]: {
              ...dateUI('Effective date'),
              'ui:options': {
                hideIf: notGivingUpBenefitSelected,
                expandUnder: [formFields.viewBenefitSelection],
              },
              'ui:required': givingUpBenefitSelected,
              'ui:reviewField': DateReviewField,
              'ui:validations': [validateEffectiveDate],
            },
            'view:effectiveDateNotes': {
              'ui:description': (
                <ul>
                  <li>
                    You can select a date up to one year in the past. We may be
                    able to pay you benefits for education or training taken
                    during this time.
                  </li>
                  <li>
                    We can’t pay for education or training taken more than one
                    year before the date of your application for benefits.
                  </li>
                  <li>
                    If you are currently using another benefit, select the date
                    you would like to start using the Post-9/11 GI Bill.
                  </li>
                </ul>
              ),
              'ui:options': {
                hideIf: notGivingUpBenefitSelected,
                expandUnder: [formFields.viewBenefitSelection],
              },
            },
            'view:unsureNote': {
              'ui:description': unsureDescription,
              'ui:options': {
                hideIf: formData =>
                  formData[formFields.viewBenefitSelection][
                    formFields.benefitRelinquished
                  ] !== 'CannotRelinquish',
                expandUnder: [formFields.viewBenefitSelection],
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:post911Notice': {
                type: 'object',
                properties: {},
              },
              [formFields.viewBenefitSelection]: {
                type: 'object',
                required: [formFields.benefitRelinquished],
                properties: {
                  [formFields.benefitRelinquished]: {
                    type: 'string',
                    enum: benefits,
                  },
                },
              },
              'view:activeDutyNotice': {
                type: 'object',
                properties: {},
              },
              [formFields.benefitEffectiveDate]: date,
              'view:effectiveDateNotes': {
                type: 'object',
                properties: {},
              },
              'view:unsureNote': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional considerations',
      pages: {
        [formPages.additionalConsiderations.activeDutyKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.activeDutyKicker,
            formFields.activeDutyKicker,
          ),
          depends: formData =>
            formData[formFields.viewBenefitSelection][
              formFields.benefitRelinquished
            ] === 'Chapter30',
        },
        [formPages.additionalConsiderations.reserveKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.reserveKicker,
            formFields.selectedReserveKicker,
          ),
          depends: formData =>
            formData[formFields.viewBenefitSelection][
              formFields.benefitRelinquished
            ] === 'Chapter1606',
        },
        [formPages.additionalConsiderations.militaryAcademy.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.militaryAcademy,
            formFields.federallySponsoredAcademy,
          ),
        },
        [formPages.additionalConsiderations.seniorRotc.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.seniorRotc,
            formFields.seniorRotcCommission,
          ),
        },
        [formPages.additionalConsiderations.loanPayment.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.loanPayment,
            formFields.loanPayment,
          ),
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
              accountNumber: {
                'ui:title': 'Bank account number',
                'ui:validations': [validateAccountNumber],
                'ui:errorMessages': {
                  pattern: 'Please enter only numbers',
                },
              },
            },
            'view:learnMore': {
              'ui:description': (
                <>
                  <img
                    key="check-image-src"
                    style={{ marginTop: '1rem' }}
                    src={checkImageSrc}
                    alt="Example of a check showing where the account and routing numbers are"
                  />
                  <p key="learn-more-title">Where can I find these numbers?</p>
                  <p key="learn-more-description">
                    The bank routing number is the first 9 digits on the bottom
                    left corner of a printed check. Your account number is the
                    second set of numbers on the bottom of a printed check, just
                    to the right of the bank routing number.
                  </p>
                  <va-additional-info key="learn-more-btn" trigger="Learn More">
                    <p key="btn-copy">
                      If you don’t have a printed check, you can sign in to your
                      online banking institution for this information
                    </p>
                  </va-additional-info>
                </>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              bankAccount: {
                type: 'object',
                required: [
                  formFields.accountType,
                  formFields.accountNumber,
                  formFields.routingNumber,
                ],
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
                    required: [],
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
