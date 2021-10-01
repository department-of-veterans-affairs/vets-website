import React from 'react';

// Example of an imported schema:
// import fullSchema from '../22-1990-schema.json';
// eslint-disable-next-line no-unused-vars
import fullSchema from '../22-1990-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import GetFormHelp from '../components/GetFormHelp';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import FormFooter from 'platform/forms/components/FormFooter';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';

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
  activeDutyLabel,
  selectedReserveLabel,
  unsureDescription,
  post911GiBillNote,
} from '../helpers';

import MailingAddressViewField from '../components/MailingAddressViewField';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';

import {
  isValidPhone,
  validatePhone,
  validateEmail,
} from '../utils/validation';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  email,
  // bankAccount,
  toursOfDuty,
} = commonDefinitions;

// Define all the fields in the form to aid reuse
const formFields = {
  fullName: 'fullName',
  dateOfBirth: 'dateOfBirth',
  ssn: 'ssn',
  toursOfDuty: 'toursOfDuty',
  toursOfDutyCorrect: 'toursOfDutyCorrect',
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
  benefitSelection: 'benefitSelection',
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
  // directDeposit: 'directDeposit',
  additionalConsiderations: {
    activeDutyKicker: {
      name: 'active-duty-kicker',
      order: 1,
      title:
        'Do you qualify for an active duty kicker, sometimes called a College Fund?',
      additionalInfo: {
        triggerText: 'What is an active duty kicker?',
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
        triggerText: 'What is a reserve kicker?',
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
        triggerText: 'What is Senior ROTC?',
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
        triggerText: 'What does this mean?',
        info:
          "This is a Loan Repayment Program, which is a special incentive that certain military branches offer to qualified applicants. Under a Loan Repayment Program, the branch of service will repay part of an applicant's qualifying student loans.",
      },
    },
  },
};

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function startPhoneEditValidation({ phone }) {
  if (!phone) {
    return true;
  }
  return validatePhone(phone);
}

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category) {
  return {
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
      startInEdit: formData => startPhoneEditValidation(formData),
      viewComponent: PhoneViewField,
    },
    'ui:objectViewField': PhoneReviewField,
    phone: {
      ...phoneUI(`${titleCase(category)} phone number`),
      'ui:validations': [validatePhone],
    },
    isInternational: {
      'ui:title': `This ${category} phone number is international`,
      'ui:reviewField': YesNoReviewField,
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
  const isUnsure = !benefitSelection || benefitSelection === 'UNSURE';
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
          <AdditionalInfo triggerText={additionalInfo.triggerText}>
            <p>{additionalInfo.info}</p>
          </AdditionalInfo>
        ),
      },
    };
  }

  return {
    path: page.name,
    title: data => {
      return additionalConsiderationsQuestionTitleText(
        data[formFields.viewBenefitSelection][formFields.benefitSelection],
        page.order,
      );
    },
    uiSchema: {
      'ui:description': data => {
        return additionalConsiderationsQuestionTitle(
          data.formData[formFields.viewBenefitSelection][
            formFields.benefitSelection
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
  return ['ACTIVE_DUTY', 'SELECTED_RESERVE'].includes(
    formData[formFields.viewBenefitSelection][formFields.benefitSelection],
  );
}

function notGivingUpBenefitSelected(formData) {
  return !givingUpBenefitSelected(formData);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'my-education-benefits-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1990EZ',
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
  preSubmitInfo,
  chapters: {
    applicantInformationChapter: {
      title: 'Applicant information',
      pages: {
        [formPages.applicantInformation]: {
          title: 'Applicant information',
          path: 'applicant-information/personal-information',
          subTitle: 'Review your personal information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    Any updates you make here to your personal information will
                    only apply to your education benefits. To update your
                    personal information for all of the benefits across VA,{' '}
                    <a href="/profile">please go to your profile page</a>.
                  </p>
                </>
              ),
            },
            'view:fullName': {
              'ui:description': (
                <p className="meb-review-page-only">
                  If you’d like to update your personal information, please edit
                  the form fields below.
                </p>
              ),
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
              },
            },
            [formFields.dateOfBirth]: {
              ...currentOrPastDateUI('Date of birth'),
              'ui:reviewField': CustomReviewDOBField,
            },
          },
          schema: {
            type: 'object',
            required: [formFields.dateOfBirth],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:fullName': {
                required: [formFields.fullName],
                type: 'object',
                properties: {
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
                },
              },
              [formFields.dateOfBirth]: date,
            },
          },
          initialData: {
            'view:fullName': {
              fullName: {
                first: 'Hector',
                middle: 'Oliver',
                last: 'Stanley',
                suffix: 'Jr.',
              },
            },
            dateOfBirth: '1992-07-23',
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
          initialData: {
            [formFields.viewPhoneNumbers]: {
              mobilePhoneNumber: {
                phone: '123-456-7890',
                isInternational: false,
              },
              phoneNumber: {
                phone: '098-765-4321',
                isInternational: false,
              },
            },
            [formFields.email]: {
              email: 'hector.stanley@gmail.com',
              confirmEmail: 'hector.stanley@gmail.com',
            },
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your phone numbers and email address</h3>
                  <div className="meb-list-label">
                    <b>We’ll use this information to:</b>
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
                    for other VA benefits, you can do that from your profile.
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
                    Phone numbers and email addresss
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
          initialData: {
            'view:mailingAddress': {
              livesOnMilitaryBase: false,
              [formFields.address]: {
                street: '2222 Avon Street',
                street2: 'Apt 6',
                city: 'Arlington',
                state: 'VA',
                postalCode: '22205',
              },
            },
          },
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
                    Any updates you make here to your mailing address will only
                    apply to your education benefits. To update your mailing
                    address for all of the benefits across VA,{' '}
                    <a href="/profile/personal-information">
                      please go to your profile page
                    </a>
                    .
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
            'view:contactMethod': {
              'ui:description': (
                <>
                  <h3 className="meb-form-page-only">
                    Choose your contact method for follow-up questions
                  </h3>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
                    Contact preferences
                  </h4>
                  <p className="meb-review-page-only">
                    If you’d like to update your mailing address, please edit
                    the form fields below.
                  </p>
                </>
              ),
              [formFields.contactMethod]: {
                'ui:title':
                  'How should we contact you if we have questions about your application?',
                'ui:widget': 'radio',
                'ui:options': {
                  widgetProps: {
                    Email: { 'data-info': 'email' },
                    'Mobile phone': { 'data-info': 'mobile phone' },
                    'Home phone': { 'data-info': 'home phone' },
                    Mail: { 'data-info': 'mail' },
                  },
                },
                'ui:errorMessages': {
                  required:
                    'Please select at least one way we can contact you.',
                },
              },
            },
            'view:receiveTextMessages': {
              'ui:description': (
                <>
                  <div className="meb-form-page-only">
                    <h3>Choose your notification method</h3>
                    <p>
                      We’ll send you important notifications about your
                      benefits, including alerts to verify your monthly
                      enrollment. You’ll need to verify your monthly enrollment
                      to receive payment.
                    </p>
                    <p>
                      We recommend opting-in for text message notifications to
                      make verifying your monthly enrollment simpler.
                    </p>
                  </div>
                </>
              ),
              [formFields.receiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications on your education benefits?',
                'ui:widget': 'radio',
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
                <va-alert onClose={function noRefCheck() {}} status="info">
                  <p style={{ margin: 0 }}>
                    For text messages, messaging and data rates may apply. At
                    this time, VA is only able to send text messages about
                    education benefits to US-based mobile phone numbers.
                  </p>
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
                <va-alert onClose={function noRefCheck() {}} status="warning">
                  <p style={{ margin: 0 }}>
                    You can’t choose to receive text messages because you don’t
                    have a mobile phone number on file.
                  </p>
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
                <va-alert onClose={function noRefCheck() {}} status="warning">
                  <p style={{ margin: 0 }}>
                    You can’t choose to receive text messages because your
                    mobile phone number is international. At this time, VA is
                    only able to send text messages about your education
                    benefits to US-based mobile phone numbers.
                  </p>
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
              'view:contactMethod': {
                type: 'object',
                required: [formFields.contactMethod],
                properties: {
                  [formFields.contactMethod]: {
                    type: 'string',
                    enum: ['Email', 'Mobile phone', 'Home phone', 'Mail'],
                  },
                },
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
            'view:toursOfDutyCorrect': {
              'ui:description': (
                <p className="meb-review-page-only">
                  If you’d like to update information related to your service
                  history, edit the form fields below.
                </p>
              ),
              [formFields.toursOfDutyCorrect]: {
                'ui:title': 'This information is incorrect and/or incomplete',
                'ui:reviewField': YesNoReviewField,
              },
            },
            [formFields.incorrectServiceHistoryExplanation]: {
              'ui:title':
                'Please explain what is incorrect and/or incomplete about your service history.',
              'ui:options': {
                expandUnder: 'view:toursOfDutyCorrect',
                hideIf: formData =>
                  !formData['view:toursOfDutyCorrect'][
                    formFields.toursOfDutyCorrect
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
              },
              'view:toursOfDutyCorrect': {
                type: 'object',
                properties: {
                  [formFields.toursOfDutyCorrect]: {
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
          initialData: {
            [formFields.toursOfDuty]: [
              {
                // applyPeriodToSelected: true,
                dateRange: {
                  from: '2011-08-01',
                  to: '2014-07-30',
                },
                exclusionPeriods: [
                  {
                    from: '2011-08-01',
                    to: '2011-09-14',
                  },
                  {
                    from: '2011-11-01',
                    to: '2011-12-14',
                  },
                ],
                separationReason: 'Expiration term of service',
                serviceBranch: 'Navy',
                serviceCharacter: 'Honorable',
                // serviceStatus: 'Active Duty',
                trainingPeriods: [
                  {
                    from: '2011-08-01',
                    to: '2011-09-14',
                  },
                  {
                    from: '2011-11-01',
                    to: '2011-12-14',
                  },
                ],
              },
              {
                // applyPeriodToSelected: true,
                dateRange: {
                  from: '2015-04-04',
                  to: '2017-10-12',
                },
                separationReason: 'Disability',
                serviceBranch: 'Navy',
                serviceCharacter: 'Honorable',
                // serviceStatus: 'Active Duty',
              },
            ],
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
          instructions:
            'Currently, you can only apply for Post-9/11 Gi Bill (Chapter 33) benefits through this application/ If you would like to apply for other benefits, please visit out How to Apply page.',
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
                    <strong>This decision is final</strong>, which means you
                    can’t change your mind after you submit this application.
                  </p>
                  <AdditionalInfo triggerText="Why do I have to give up a benefit?">
                    <p>
                      Per 38 USC 3327, If you are eligible for both the
                      Post-9/11 GI Bill and other education benefits, you must
                      give up one benefit you may be eligible for.
                    </p>
                  </AdditionalInfo>
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
              [formFields.benefitSelection]: {
                'ui:title': 'Which benefit will you give up?',
                'ui:reviewField': BenefitGivenUpReviewField,
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
                    SELECTED_RESERVE: {
                      'aria-describedby': 'SELECTED_RESERVE',
                    },
                    UNSURE: { 'aria-describedby': 'UNSURE' },
                  },
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
                    formFields.benefitSelection
                  ] !== 'ACTIVE_DUTY',
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
            },
            'view:effectiveDateNotes': {
              'ui:description': (
                <ul>
                  <li>
                    We’ve set the date to one year ago to begin paying you
                    immediately
                  </li>
                  <li>
                    Select a future date if you don’t need to use your benefits
                    until then
                  </li>
                  <li>
                    If your classes started less than 2 years ago, enter the
                    date they began
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
                    formFields.benefitSelection
                  ] !== 'UNSURE',
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
                required: [formFields.benefitSelection],
                properties: {
                  [formFields.benefitSelection]: {
                    type: 'string',
                    enum: ['ACTIVE_DUTY', 'SELECTED_RESERVE', 'UNSURE'],
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
          initialData: {
            benefitSelection: '',
          },
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional Considerations',
      pages: {
        [formPages.additionalConsiderations.activeDutyKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.activeDutyKicker,
            formFields.activeDutyKicker,
          ),
          depends: formData =>
            formData[formFields.viewBenefitSelection][
              formFields.benefitSelection
            ] === 'ACTIVE_DUTY',
        },
        [formPages.additionalConsiderations.reserveKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.reserveKicker,
            formFields.selectedReserveKicker,
          ),
          depends: formData =>
            formData[formFields.viewBenefitSelection][
              formFields.benefitSelection
            ] === 'SELECTED_RESERVE',
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
  },
};

export default formConfig;
