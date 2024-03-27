import React from 'react';
import { createSelector } from 'reselect';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import * as address from 'platform/forms-system/src/js/definitions/address';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import get from 'platform/utilities/data/get';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { VA_FORM_IDS } from 'platform/forms/constants';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import constants from 'vets-json-schema/dist/constants.json';
import * as ENVIRONMENTS from 'site/constants/environments';
import * as BUCKETS from 'site/constants/buckets';

import fullSchema from '../22-1990-schema.json';

import manifest from '../manifest.json';
import toursOfDutyUI from '../definitions/toursOfDuty';

import AccordionField from '../components/AccordionField';
import ApplicantIdentityView from '../components/ApplicantIdentityView';
import ApplicantInformationReviewPage from '../components/ApplicantInformationReviewPage';
import BenefitRelinquishedLabel from '../components/BenefitRelinquishedLabel';
import BenefitRelinquishWidget from '../components/BenefitRelinquishWidget';
import ConfirmationPage from '../containers/ConfirmationPage';
import ContactInformationReviewPanel from '../components/ContactInformationReviewPanel';
import CustomReviewDOBField from '../components/CustomReviewDOBField';
import CustomEmailField from '../components/CustomEmailField';
import CustomPhoneNumberField from '../components/CustomPhoneNumberField';
import DateReviewField from '../components/DateReviewField';
import DirectDepositViewField from '../components/DirectDepositViewField';
import EmailViewField from '../components/EmailViewField';
import ExclusionPeriodsWidget from '../components/ExclusionPeriodsWidget';

import GetFormHelp from '../components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';
import MailingAddressViewField from '../components/MailingAddressViewField';
import ObfuscateReviewField from '../components/ObfuscateReviewField';
import PhoneReviewField from '../components/PhoneReviewField';
import PhoneViewField from '../components/PhoneViewField';
import CustomPreSubmitInfo from '../components/PreSubmitInfo';
import ServicePeriodAccordionView from '../components/ServicePeriodAccordionView';
import TextNotificationsDisclaimer from '../components/TextNotificationsDisclaimer';
import YesNoReviewField from '../components/YesNoReviewField';
import DuplicateContactInfoModal from '../components/DuplicateContactInfoModal';

import { ELIGIBILITY } from '../actions';
import { formFields } from '../constants';

import {
  unsureDescription,
  post911GiBillNote,
  prefillTransformer,
  customDirectDepositDescription,
} from '../helpers';

import {
  isValidPhone,
  validateBankAccountNumber,
  validateEmail,
  validateEffectiveDate,
  validateMobilePhone,
  validateHomePhone,
  validateRoutingNumber,
} from '../utils/validation';

import { createSubmissionForm } from '../utils/form-submit-transform';

const {
  fullName,
  // ssn,
  date,
  dateRange,
  usaPhone,
  email,
  toursOfDuty,
} = commonDefinitions;

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  applicantInformation: 'applicantInformation',
  contactInformation: {
    contactInformation: 'contactInformation',
    mailingAddress: 'mailingAddress',
    mailingAddressMilitaryBaseUpdates: 'mailingAddressMilitaryBaseUpdates',
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
          'Were you commissioned as the result of a Senior ROTC (Reserve Officers Training Corps) scholarship? If "Yes," please check "Yes". If you received your commission through a non-scholarship program, please check "No."',
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
  'NotEligible',
];

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function isValidName(str) {
  return str && /^[A-Za-z][A-Za-z ']*$/.test(str);
}

function isValidLastName(str) {
  return str && /^[A-Za-z][A-Za-z '-]*$/.test(str);
}

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
  if (
    !isValidAccountNumber(accountNumber) &&
    !formData.showDgiDirectDeposit1990EZ
  ) {
    errors.addError(errorMessages.pattern);
  }
};
const shouldStartInEditMode = formData => {
  const bankAccount = formData?.bankAccount;
  const hasData = [
    bankAccount?.accountType,
    bankAccount?.routingNumber,
    bankAccount?.accountNumber,
  ].some(field => field?.length > 0);
  // Return false to not start in edit mode if any data is present
  return !hasData;
};

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category) {
  const schema = {
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
            if (
              !formData[(formFields?.viewPhoneNumbers)]?.mobilePhoneNumber
                ?.phone
            ) {
              return true;
            }
          } else if (
            !formData[(formFields?.viewPhoneNumbers)]?.phoneNumber?.phone
          ) {
            return true;
          }
          return false;
        },
      },
    },
  };

  // use custom component if mobile phone
  if (category === 'mobile') {
    schema.phone['ui:widget'] = CustomPhoneNumberField;
  }

  return schema;
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
  const isUnsure = !benefitSelection || benefitSelection === 'NotEligible';
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

function AdditionalConsiderationTemplate(page, formField, options = {}) {
  const { title, additionalInfo } = page;
  const additionalInfoViewName = `view:${page.name}AdditionalInfo`;
  const displayTypeMapping = {
    [formFields.federallySponsoredAcademy]: 'Academy',
    [formFields.seniorRotcCommission]: 'ROTC',
    [formFields.loanPayment]: 'LRP',
  };
  // Use the mapping to determine the display type
  const displayType = displayTypeMapping[formField] || '';
  let additionalInfoView;

  const uiDescription = (
    <>
      {options.includeExclusionWidget && (
        <ExclusionPeriodsWidget displayType={displayType} />
      )}
      {additionalInfo && (
        <>
          <br />
          <va-additional-info trigger={additionalInfo.trigger}>
            <p>{additionalInfo.info}</p>
          </va-additional-info>
        </>
      )}
    </>
  );
  if (additionalInfo || options.includeExclusionWidget) {
    additionalInfoView = {
      [additionalInfoViewName]: {
        'ui:description': uiDescription,
      },
    };
  }
  return {
    path: page.name,
    title: data => {
      return additionalConsiderationsQuestionTitleText(
        (data[(formFields?.viewBenefitSelection)] &&
          data[(formFields?.viewBenefitSelection)][
            (formFields?.benefitRelinquished)
          ]) ||
          'NotEligible',
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
  const benefitRelinquished =
    formData?.[formFields.viewBenefitSelection]?.[
      formFields.benefitRelinquished
    ];
  return ['Chapter30', 'Chapter1606'].includes(benefitRelinquished);
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

const checkBoxValidation = {
  pattern: (errors, values, formData) => {
    if (
      !Object.keys(values).some(key => values[key]) &&
      formData?.showMebServiceHistoryCategorizeDisagreement &&
      formData['view:serviceHistory']?.serviceHistoryIncorrect
    ) {
      errors.addError('Please check at least one of the options below');
    }
  },
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
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  getHelp: () => <GetFormHelp />, // Wrapping in a function to skirt failing platform unit test
  preSubmitInfo: {
    CustomComponent: CustomPreSubmitInfo,
    required: false,
    field: 'privacyAgreementAccepted',
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        [formPages.applicantInformation]: {
          title: 'Your information',
          path: 'applicant-information/personal-information',
          subTitle: 'Your information',
          CustomPageReview: ApplicantInformationReviewPage,
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
              'ui:options': {
                hideIf: formData => formData.showMebEnhancements06,
              },
            },
            [formFields.formId]: {
              'ui:title': 'Form ID',
              'ui:disabled': true,
              'ui:options': {
                hideOnReview: true,
              },
            },
            [formFields.claimantId]: {
              'ui:title': 'Claimant ID',
              'ui:disabled': true,
              'ui:options': {
                hideOnReview: true,
              },
            },
            'view:applicantInformation': {
              'ui:options': {
                hideIf: formData => !formData.showMebEnhancements06,
              },
              'ui:description': (
                <>
                  <ApplicantIdentityView />
                </>
              ),
            },
            [formFields.viewUserFullName]: {
              'ui:options': {
                hideIf: formData => formData.showMebEnhancements06,
              },
              'ui:description': (
                <>
                  <p className="meb-review-page-only">
                    If you’d like to update your personal information, please
                    edit the form fields below.
                  </p>
                </>
              ),
              [formFields.userFullName]: {
                'ui:options': {
                  hideIf: formData => formData.showMebEnhancements06,
                },
                'ui:required': formData => !formData?.showMebEnhancements06,
                ...fullNameUI,
                first: {
                  ...fullNameUI.first,
                  'ui:options': {
                    hideIf: formData => formData.showMebEnhancements06,
                  },
                  'ui:title': 'Your first name',
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidName(field)) {
                        if (field.length === 0) {
                          errors.addError('Please enter your first name');
                        } else if (field[0] === ' ' || field[0] === "'") {
                          errors.addError(
                            'First character must be a letter with no leading space.',
                          );
                        } else {
                          errors.addError(
                            'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                          );
                        }
                      }
                    },
                  ],
                },
                last: {
                  ...fullNameUI.last,
                  'ui:title': 'Your last name',
                  'ui:options': {
                    hideIf: formData => formData.showMebEnhancements06,
                  },
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidLastName(field)) {
                        if (field.length === 0) {
                          errors.addError('Please enter your last name');
                        } else if (
                          field[0] === ' ' ||
                          field[0] === "'" ||
                          field[0] === '-'
                        ) {
                          errors.addError(
                            'First character must be a letter with no leading space.',
                          );
                        } else {
                          errors.addError(
                            'Please enter a valid entry. Acceptable entries are letters, spaces, dashes and apostrophes.',
                          );
                        }
                      }
                    },
                  ],
                },
                middle: {
                  ...fullNameUI.middle,
                  'ui:title': 'Your middle name',
                  'ui:options': {
                    hideIf: formData => formData.showMebEnhancements06,
                  },
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidName(field)) {
                        if (field.length === 0) {
                          errors.addError('Please enter your middle name');
                        } else if (field[0] === ' ' || field[0] === "'") {
                          errors.addError(
                            'First character must be a letter with no leading space.',
                          );
                        } else {
                          errors.addError(
                            'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                          );
                        }
                      }
                    },
                  ],
                },
              },
            },
            [formFields.dateOfBirth]: {
              'ui:options': {
                hideIf: formData => formData.showMebEnhancements06,
              },
              'ui:required': formData => !formData?.showMebEnhancements06,
              ...currentOrPastDateUI('Your date of birth'),
              'ui:reviewField': CustomReviewDOBField,
            },
          },
          schema: {
            type: 'object',
            required: [formFields.dateOfBirth],
            properties: {
              [formFields.formId]: {
                type: 'string',
              },
              [formFields.claimantId]: {
                type: 'integer',
              },
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.viewUserFullName]: {
                // required: [formFields.userFullName],
                type: 'object',
                properties: {
                  [formFields.userFullName]: {
                    ...fullName,
                    properties: {
                      ...fullName.properties,
                      first: {
                        ...fullName.properties.first,
                        maxLength: 20,
                      },
                      middle: {
                        ...fullName.properties.middle,
                        maxLength: 20,
                      },
                      last: {
                        ...fullName.properties.last,
                        maxLength: 26,
                      },
                    },
                  },
                },
              },
              [formFields.dateOfBirth]: date,
              'view:applicantInformation': {
                type: 'object',
                properties: {},
              },
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
          CustomPageReview: ContactInformationReviewPanel,
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
              [formFields?.mobilePhoneNumber]: phoneUISchema('mobile'),
              [formFields?.phoneNumber]: phoneUISchema('home'),
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
                'ui:widget': CustomEmailField,
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
            'view:confirmDuplicateData': {
              'ui:description': DuplicateContactInfoModal,
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
                  [formFields?.mobilePhoneNumber]: phoneSchema(),
                  [formFields?.phoneNumber]: phoneSchema(),
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
              'view:confirmDuplicateData': {
                type: 'object',
                properties: {},
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
            [formFields.viewMailingAddress]: {
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
              [formFields.livesOnMilitaryBase]: {
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
                ...address.uiSchema('', false, null, true),
                country: {
                  'ui:title': 'Country',
                  'ui:required': formData =>
                    !formData.showMebDgi40Features ||
                    (formData.showMebDgi40Features &&
                      !formData['view:mailingAddress'].livesOnMilitaryBase),
                  'ui:disabled': formData =>
                    formData.showMebDgi40Features &&
                    formData['view:mailingAddress'].livesOnMilitaryBase,
                  'ui:options': {
                    updateSchema: (formData, schema, uiSchema) => {
                      const countryUI = uiSchema;
                      const addressFormData = get(
                        ['view:mailingAddress', 'address'],
                        formData,
                      );
                      const livesOnMilitaryBase = get(
                        ['view:mailingAddress', 'livesOnMilitaryBase'],
                        formData,
                      );
                      if (
                        formData.showMebDgi40Features &&
                        livesOnMilitaryBase
                      ) {
                        countryUI['ui:disabled'] = true;
                        const USA = {
                          value: 'USA',
                          label: 'United States',
                        };
                        addressFormData.country = USA.value;
                        return {
                          enum: [USA.value],
                          enumNames: [USA.label],
                          default: USA.value,
                        };
                      }

                      countryUI['ui:disabled'] = false;

                      return {
                        type: 'string',
                        enum: constants.countries.map(country => country.value),
                        enumNames: constants.countries.map(
                          country => country.label,
                        ),
                      };
                    },
                  },
                },
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
                  'ui:options': {
                    replaceSchema: formData => {
                      if (
                        formData.showMebDgi40Features &&
                        formData['view:mailingAddress']?.livesOnMilitaryBase
                      ) {
                        return {
                          type: 'string',
                          title: 'APO/FPO',
                          enum: ['APO', 'FPO'],
                        };
                      }

                      return {
                        type: 'string',
                        title: 'City',
                      };
                    },
                  },
                },
                state: {
                  'ui:required': formData =>
                    !formData.showMebDgi40Features ||
                    (formData.showMebDgi40Features &&
                      (formData['view:mailingAddress']?.livesOnMilitaryBase ||
                        formData['view:mailingAddress']?.address?.country ===
                          'USA')),
                },
                postalCode: {
                  'ui:errorMessages': {
                    required: 'Zip code must be 5 digits',
                  },
                  'ui:options': {
                    replaceSchema: formData => {
                      if (
                        formData['view:mailingAddress']?.address?.country !==
                        'USA'
                      ) {
                        return {
                          title: 'Postal Code',
                          type: 'string',
                        };
                      }

                      return {
                        title: 'Zip code',
                        type: 'string',
                      };
                    },
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
              [formFields.viewMailingAddress]: {
                type: 'object',
                properties: {
                  [formFields.livesOnMilitaryBase]: {
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
                    form =>
                      form[formFields.viewPhoneNumbers]?.mobilePhoneNumber
                        ?.phone,
                    form =>
                      form[formFields.viewPhoneNumbers]?.phoneNumber?.phone,
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
            [formFields.viewReceiveTextMessages]: {
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

                    <TextNotificationsDisclaimer />
                  </div>
                </>
              ),
              [formFields.receiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications about your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field.slice(0, 4).includes('Yes');
                    const phoneExist = !!formData[
                      (formFields?.viewPhoneNumbers)
                    ].mobilePhoneNumber?.phone;
                    const { isInternational } = formData[
                      formFields.viewPhoneNumbers
                    ]?.mobilePhoneNumber;

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
                hideIf: formData => {
                  const viewPhoneNumbers =
                    formData?.[formFields?.viewPhoneNumbers];
                  const mobilePhone =
                    viewPhoneNumbers?.[formFields?.mobilePhoneNumber]?.phone;
                  const isInternational =
                    viewPhoneNumbers?.[formFields?.mobilePhoneNumber]
                      ?.isInternational;
                  return !isValidPhone(mobilePhone) || isInternational;
                },
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
                hideIf: formData => {
                  const mobilePhoneInfo =
                    formData?.[formFields?.viewPhoneNumbers]?.[
                      formFields?.mobilePhoneNumber
                    ];
                  const mobilePhone = mobilePhoneInfo?.phone;
                  const isInternational = mobilePhoneInfo?.isInternational;
                  return isValidPhone(mobilePhone) || isInternational;
                },
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
                hideIf: formData => {
                  const mobilePhoneNumberInfo =
                    formData?.[formFields?.viewPhoneNumbers]?.[
                      formFields?.mobilePhoneNumber
                    ];
                  const isInternational =
                    mobilePhoneNumberInfo?.isInternational;
                  return !isInternational;
                },
              },
            },
            'view:emailOnFileWithSomeoneElse': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get email notifications because your
                    email is on file for another person with education benefits.
                    You will not be able to take full advantage of VA’s
                    electronic notifications and enrollment verifications
                    available. If you cannot, certain electronic services will
                    be limited or unavailable.
                    <br />
                    <br />
                    <a
                      target="_blank"
                      href="https://www.va.gov/education/verify-school-enrollment"
                      rel="noreferrer"
                    >
                      Learn more about the Enrollment Verifications
                    </a>
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => {
                  const isNo = formData[
                    'view:receiveTextMessages'
                  ]?.receiveTextMessages
                    ?.slice(0, 3)
                    ?.includes('No,');
                  const noDuplicates = formData?.duplicateEmail?.some(
                    entry => entry?.dupe === false,
                  );
                  // Return true if isNo is false OR noDuplicates is not false
                  return !isNo || noDuplicates;
                },
              },
            },
            'view:mobilePhoneOnFileWithSomeoneElse': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text notifications because your
                    mobile phone number is on file for another person with
                    education benefits. You will not be able to take full
                    advantage of VA’s electronic notifications and enrollment
                    verifications available. If you cannot, certain electronic
                    services will be limited or unavailable.
                    <br />
                    <br />
                    <a
                      target="_blank"
                      href="https://www.va.gov/education/verify-school-enrollment"
                      rel="noreferrer"
                    >
                      Learn more about the Enrollment Verifications
                    </a>
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => {
                  const isYes = formData[
                    'view:receiveTextMessages'
                  ]?.receiveTextMessages
                    ?.slice(0, 4)
                    ?.includes('Yes');
                  const duplicatesDetected = formData?.duplicatePhone?.some(
                    entry => entry?.dupe === true,
                  );
                  const mobilePhone =
                    formData[(formFields?.viewPhoneNumbers)]?.[
                      formFields?.mobilePhoneNumber
                    ]?.phone;

                  return !isYes || !duplicatesDetected || !mobilePhone;
                },
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
              [formFields.viewReceiveTextMessages]: {
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
              'view:emailOnFileWithSomeoneElse': {
                type: 'object',
                properties: {},
              },
              'view:mobilePhoneOnFileWithSomeoneElse': {
                type: 'object',
                properties: {},
              },
              'view:duplicateEmailAndPhoneAndNoHomePhone': {
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
              'ui:options': {
                hideIf: formData => formData?.showMebDgi40Features,
              },
            },
            'view:newSubHeading': {
              'ui:description': (
                <>
                  <p>
                    The displayed service history is reported to VA by DOD and
                    may include service which is not creditable for the
                    Post-9/11 GI Bill.
                  </p>
                  <p>
                    VA will only consider active duty service (
                    <a
                      target="_blank"
                      href="https://uscode.house.gov/view.xhtml?req=(title:38%20section:3301%20edition:prelim)%20OR%20(granuleid:USC-prelim-title38-section3301)&f=treesort&edition=prelim&num=0&jumpTo=true"
                      rel="noreferrer"
                    >
                      Authority 38 U.S.C. 3301(1)
                    </a>
                    ) when determining your eligibility. Please review your
                    service history and indicate if anything is incorrect.
                  </p>
                </>
              ),
              'ui:options': {
                hideIf: formData => !formData?.showMebDgi40Features,
              },
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
                <>
                  <div className="meb-review-page-only">
                    <p>
                      If you’d like to update information related to your
                      service history, edit the form fields below.
                    </p>
                  </div>
                </>
              ),
              [formFields.serviceHistoryIncorrect]: {
                'ui:title': 'This information is incorrect and/or incomplete',
                'ui:reviewField': YesNoReviewField,
              },
            },
            [formFields.incorrectServiceHistoryExplanation]: {
              'ui:options': {
                expandUnder: 'view:serviceHistory',
                hideIf: formData =>
                  !formData?.['view:serviceHistory']?.[
                    formFields.serviceHistoryIncorrect
                  ],
              },
              incorrectServiceHistoryInputs: {
                'ui:required': formData =>
                  formData['view:serviceHistory']?.serviceHistoryIncorrect ===
                    true &&
                  formData?.showMebServiceHistoryCategorizeDisagreement,
                'ui:errorMessages': {
                  required: 'Please check at least one of the options below',
                },
                'ui:title': (
                  <>
                    <p className="check-box-label">
                      Choose all that apply{' '}
                      <span className="text-restriction">
                        (*You must choose at least one)
                      </span>
                    </p>
                  </>
                ),
                'ui:validations': [checkBoxValidation.pattern],
                'ui:options': {
                  showFieldLabel: true,
                  forceDivWrapper: true,
                  hideIf: formData =>
                    !formData?.showMebServiceHistoryCategorizeDisagreement,
                },
                servicePeriodMissingForActiveDuty: {
                  'ui:title':
                    'I am currently on Active Duty orders and that service period is missing.',
                },
                servicePeriodMissing: {
                  'ui:title':
                    'I am not currently on Active Duty orders and one or more of my service periods is missing.',
                },
                servicePeriodNotMine: {
                  'ui:title':
                    'One or more service periods displayed are not mine.',
                },
                servicePeriodIncorrect: {
                  'ui:title':
                    'The service dates of one or more of my service periods are incorrect.',
                },
              },
              incorrectServiceHistoryText: {
                'ui:title':
                  'Please explain what is missing and/or incorrect about your service history.',
                'ui:required': formData =>
                  formData['view:serviceHistory']?.serviceHistoryIncorrect ===
                  true,
                'ui:widget': 'textarea',
                'ui:errorMessages': {
                  required:
                    'Please include your description of the issue below',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:subHeading': {
                type: 'object',
                properties: {},
              },
              'view:newSubHeading': {
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
                type: 'object',
                properties: {
                  incorrectServiceHistoryInputs: {
                    type: 'object',
                    properties: {
                      servicePeriodMissingForActiveDuty: { type: 'boolean' },
                      servicePeriodMissing: { type: 'boolean' },
                      servicePeriodNotMine: { type: 'boolean' },
                      servicePeriodIncorrect: { type: 'boolean' },
                    },
                  },
                  incorrectServiceHistoryText: {
                    type: 'string',
                    maxLength: 250,
                  },
                },
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
          subTitle: 'You’re applying for the Post-9/11 GI Bill®',
          depends: formData => {
            // If the showMebEnhancements09 feature flag is turned on, show the page
            if (formData.showMebEnhancements09) {
              return true;
            }
            // If the feature flag is not turned on, check the eligibility length
            return Boolean(formData.eligibility?.length);
          },
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
                'ui:title': <BenefitRelinquishedLabel />,
                'ui:widget': BenefitRelinquishWidget,
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
                  formData?.[formFields.viewBenefitSelection]?.[
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
                  formData?.[formFields.viewBenefitSelection]?.[
                    formFields.benefitRelinquished
                  ] !== 'NotEligible',
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
            formData?.[formFields.viewBenefitSelection]?.[
              formFields.benefitRelinquished
            ] === 'Chapter30',
        },
        [formPages.additionalConsiderations.reserveKicker.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.reserveKicker,
            formFields.selectedReserveKicker,
          ),
          depends: formData =>
            formData?.[formFields.viewBenefitSelection]?.[
              formFields.benefitRelinquished
            ] === 'Chapter1606',
        },
        [formPages.additionalConsiderations.militaryAcademy.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.militaryAcademy,
            formFields.federallySponsoredAcademy,
            { includeExclusionWidget: true },
          ),
        },

        [formPages.additionalConsiderations.seniorRotc.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.seniorRotc,
            formFields.seniorRotcCommission,
            { includeExclusionWidget: true },
          ),
        },
        [formPages.additionalConsiderations.loanPayment.name]: {
          ...AdditionalConsiderationTemplate(
            formPages.additionalConsiderations.loanPayment,
            formFields.loanPayment,
            { includeExclusionWidget: true },
          ),
        },
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct Deposit',
      pages: {
        standardDirectDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          depends: formData => !formData.showDgiDirectDeposit1990EZ,
          uiSchema: {
            'ui:description': customDirectDepositDescription,
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
                required: ['accountType', 'accountNumber', 'routingNumber'],
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
        preFilledDirectDeposit: {
          path: 'direct-deposit/review',
          title: 'Direct deposit',
          depends: formData => formData.showDgiDirectDeposit1990EZ,
          uiSchema: {
            'view:directDeposit': {
              'ui:title': (
                <h4 className="vads-u-font-size--h5 vads-u-margin-top--0">
                  Direct deposit information
                </h4>
              ),
              'ui:field': ReviewCardField,
              'ui:options': {
                editTitle: 'Direct deposit information',
                hideLabelText: true,
                itemName: 'account information',
                itemNameAction: 'Update',
                reviewTitle: 'Direct deposit information',
                showFieldLabel: false,
                startInEdit: formData => shouldStartInEditMode(formData),
                // startInEdit: false,
                viewComponent: DirectDepositViewField,
                volatileData: true,
              },
              'ui:description': (
                <p>
                  <strong>Note:</strong> We make payments only through direct
                  deposit, also called electronic funds transfer (EFT).
                </p>
              ),
              bankAccount: {
                ...bankAccountUI,
                'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
                routingNumber: {
                  ...bankAccountUI.routingNumber,
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid 9-digit routing number',
                  },
                  'ui:reviewField': ObfuscateReviewField,
                  'ui:validations': [validateRoutingNumber],
                },
                accountNumber: {
                  ...bankAccountUI.accountNumber,
                  'ui:errorMessages': {
                    pattern:
                      'Please enter a valid 5-17 digit bank account number',
                  },
                  'ui:reviewField': ObfuscateReviewField,
                  'ui:validations': [validateBankAccountNumber],
                },
              },
            },
            'view:learnMore': {
              'ui:description': (
                <va-additional-info
                  key="learn-more-btn"
                  trigger="Where can I find these numbers?"
                >
                  <img
                    key="check-image-src"
                    style={{ marginTop: '1rem' }}
                    src={checkImageSrc}
                    alt="Example of a check showing where the account and routing numbers are"
                  />
                  <br />
                  <br />

                  <p key="learn-more-description">
                    The bank routing number is the first 9 digits on the bottom
                    left corner of a printed check. Your account number is the
                    second set of numbers on the bottom of a printed check, just
                    to the right of the bank routing number.
                  </p>
                  <br />
                  <p key="learn-more-additional">
                    If you don’t have a printed check, you can sign in to your
                    online banking institution for this information
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:directDeposit': {
                type: 'object',
                properties: {
                  bankAccount: {
                    type: 'object',
                    required: ['accountType', 'accountNumber', 'routingNumber'],
                    properties: {
                      accountNumber: {
                        type: 'string',
                        pattern: '^[*a-zA-Z0-9]{5,17}$',
                      },
                      accountType: {
                        type: 'string',
                        enum: ['checking', 'savings'],
                      },
                      routingNumber: {
                        type: 'string',
                        pattern: '^[\\d*]{5}\\d{4}$',
                      },
                    },
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
