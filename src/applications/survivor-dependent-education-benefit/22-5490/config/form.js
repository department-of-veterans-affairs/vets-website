import React from 'react';
import { Link } from 'react-router';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import constants from 'vets-json-schema/dist/constants.json';

// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-5490-schema.json';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import * as address from 'platform/forms-system/src/js/definitions/address';
import get from 'platform/utilities/data/get';
import { createSelector } from 'reselect';

import fullSchema from '../22-5490-schema.json';

import manifest from '../manifest.json';
import PersonalInformation from '../components/PersonalInformation';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DuplicateContactInfoModal from '../components/DuplicateContactInfoModal';
import FormFooter from '../components/FormFooter';
import EmailReviewField from '../components/EmailReviewField';
import CustomPreSubmitInfo from '../components/PreSubmitInfo';
import ObfuscateReviewField from '../components/ObfuscateReviewField';

// pages
import directDeposit from '../pages/directDeposit';
// import serviceHistory from '../pages/serviceHistory';
// import { uiSchema } from '../../../edu-benefits/1990s/pages/directDeposit';

import { prefillTransformer } from '../helpers';
import { transform5490Form } from '../utils/form-submit-transform';
import { validateHomePhone, validateMobilePhone } from '../utils/validations';
import CustomEmailField from '../components/CustomEmailField';
import CustomPhoneNumberField from '../components/CustomPhoneNumberField';
import YesNoReviewField from '../components/YesNoReviewField';
import PhoneViewField from '../components/PhoneViewField';
import PhoneReviewField from '../components/PhoneReviewField';
import MailingAddressViewField from '../components/MailingAddressViewField';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';
import PersonalInformationReviewField from '../components/PersonalInformationReviewField';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

function isValidName(str) {
  return str && /^[A-Za-z][A-Za-z ']*$/.test(str);
}

function isValidLastName(str) {
  return str && /^[A-Za-z][A-Za-z '-]*$/.test(str);
}

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
            if (!formData?.mobilePhone?.phone) {
              return true;
            }
          } else if (!formData?.homePhone?.phone) {
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

const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/forms_submit_claim`,
  transformForSubmit: transform5490Form,
  trackingPrefix: 'edu-22-5490-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-5490',
  title: 'Apply to use survivor dependent education benefits',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application (22-5490) is in progress.',
    //   expired: 'Your saved DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application (22-5490) has expired. If you want to apply for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS , please start a new application.',
    //   saved: 'Your DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound:
      'Please start over to apply for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS .',
    noAuth:
      'Please sign in again to continue your application for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS .',
  },
  subTitle: "Form 22-5490 (Dependent's Application for VA Education Benefits)",
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  preSubmitInfo: {
    CustomComponent: CustomPreSubmitInfo,
    required: false,
    field: 'privacyAgreementAccepted',
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Veteran or Service Member Information',
      pages: {
        applicantInformation: {
          path: 'veteran-or-service-member-information',
          title: 'Veteran or Service Member Information',
          uiSchema: {
            relationShipToMember: {
              'ui:title':
                "What's your relationship to the Veteran or service member whose benefits you'd like to use?",
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  spouse: 'Spouse',
                  child: 'Child',
                },
              },
            },
            fullName: {
              ...fullNameUI,
              'ui:title': 'Veteran or service member information',
              first: {
                ...fullNameUI.first,
                'ui:validations': [
                  (errors, field) => {
                    if (isValidName(field)) {
                      if (field.length === 0) {
                        errors.addError('Please enter your first name');
                      } else if (field.length > 20) {
                        errors.addError('Must be 20 characters or less');
                      }
                    } else if (!isValidName(field)) {
                      errors.addError(
                        'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                      );
                    }
                  },
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:validations': [
                  (errors, field) => {
                    if (isValidName(field)) {
                      if (field.length > 20) {
                        errors.addError('Must be 20 characters or less');
                      }
                    } else if (!isValidName(field)) {
                      errors.addError(
                        'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                      );
                    }
                  },
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:validations': [
                  (errors, field) => {
                    if (isValidLastName(field)) {
                      if (field.length === 0) {
                        errors.addError('Please enter your last name');
                      } else if (field.length < 2) {
                        errors.addError('Must be 2 characters or more');
                      } else if (field.length > 26) {
                        errors.addError('Must be 26 characters or less');
                      }
                    } else if (!isValidName(field)) {
                      errors.addError(
                        'Please enter a valid entry. Acceptable entries are letters, spaces, dashes and apostrophes.',
                      );
                    }
                  },
                ],
              },
            },
            dateOfBirth: {
              ...currentOrPastDateUI('Date of birth'),
            },
            ssn: {
              ...ssnUI,
              'ui:reviewField': ObfuscateReviewField,
            },
          },
          schema: {
            type: 'object',
            required: [
              'relationShipToMember',
              'fullName',
              'ssn',
              'dateOfBirth',
            ],
            properties: {
              relationShipToMember: {
                type: 'string',
                enum: ['spouse', 'child'],
              },
              fullName,
              dateOfBirth: date,
              ssn,
            },
          },
        },
      },
    },
    benefitSelectionChapter: {
      title: 'Benefit selection',
      pages: {
        benefitSelection: {
          path: 'benefit-selection',
          title: 'Benefit selection',
          uiSchema: {
            'view:subHeading': {
              'ui:description': (
                <>
                  <div>
                    <h3>Choose the benefit you’d like to apply for:</h3>
                    <p>
                      <strong>Note:</strong> If you are eligible for both the
                      Fry Scholarship and Survivors’ and Dependents’ Educational
                      Assistance benefits, you’ll need to choose which one to
                      use. Once you make this choice, you can’t switch to the
                      other program.
                    </p>
                  </div>
                </>
              ),
            },
            'view:fry': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
                      CHAPTER 33
                    </h5>
                    <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Fry Scholarship
                    </h4>

                    <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Receive up to 36 months of benefits, including:
                    </h4>
                    <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
                      <li>
                        <va-icon
                          size={4}
                          icon="school"
                          className="fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Tuition &amp; fees
                      </li>
                      <li>
                        <va-icon
                          size={4}
                          icon="home"
                          className="fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Money for housing
                      </li>
                      <li>
                        <va-icon
                          size={4}
                          icon="local_library"
                          className="fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Money for books &amp; supplies
                      </li>
                    </ul>

                    <a
                      href="https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn more about the Fry Scholarship education benefit
                    </a>
                  </div>
                </>
              ),
            },
            'view:dea': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
                      DEA, CHAPTER 35
                    </h5>
                    <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Survivors' and Dependents' Educational Assistance
                    </h4>

                    <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Receive up to 36 months of benefits, including:
                    </h4>
                    <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
                      <li>
                        <va-icon
                          size={4}
                          icon="attach_money"
                          className="fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Monthly stipend
                      </li>
                    </ul>

                    <a
                      href="https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn more about DEA education benefit
                    </a>
                  </div>
                </>
              ),
            },
            'view:benefitInfo': {
              'ui:description': (
                <>
                  <span className="fry-dea-labels_label--main vads-u-padding-left--1">
                    Which education benefit would you like to apply for?
                  </span>
                  <br />
                  <br />
                  <span className="fry-dea-labels_label--secondary fry-dea-input-message fry-dea-review-view-hidden vads-u-background-color--primary-alt-lightest vads-u-padding--1 vads-u-margin-top--1">
                    <va-icon
                      size={3}
                      icon="info"
                      className="vads-u-margin-right--1"
                      aria-hidden="true"
                    />{' '}
                    <span className="sr-only">Informational Note:</span> If
                    you’re the child of a veteran or service member who died in
                    the line of duty before August 1, 2011 you can use both Fry
                    Scholarship and DEA and get up to 81 months of benefits.
                    You’ll need to apply separately and use one program at a
                    time.
                  </span>
                  <br />
                </>
              ),
            },
            chosenBenefit: {
              'ui:title': 'Select one benefit',
              'ui:errorMessages': {
                required: 'Please select an education benefit',
              },
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  fry: 'Fry Scholarship (Chapter 33)',
                  dea:
                    'Survivors’ and Dependents’ Educational Assistance (DEA, Chapter 35)',
                },
                widgetProps: {
                  fry: { 'data-info': 'fry' },
                  dea: { 'data-info': 'dea' },
                },
                selectedProps: {
                  fry: { 'aria-describedby': 'fry' },
                  dea: { 'aria-describedby': 'dea' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['chosenBenefit'],
            properties: {
              'view:subHeading': {
                type: 'object',
                properties: {},
              },
              'view:fry': {
                type: 'object',
                properties: {},
              },
              'view:dea': {
                type: 'object',
                properties: {},
              },
              'view:benefitInfo': {
                type: 'object',
                properties: {},
              },
              chosenBenefit: {
                type: 'string',
                enum: ['fry', 'dea'],
              },
            },
          },
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        reviewPersonalInformation: {
          path: 'review-personal-information',
          title: 'Review your Personal Information',
          CustomPageReview: PersonalInformationReviewField,
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    We have this personal information on file for you. Any
                    updates you make will change the information for your
                    education benefits only. If you want to update your personal
                    information for other VA benefits, update your information
                    on your{' '}
                    <a target="_blank" href="/profile/personal-information">
                      profile
                    </a>
                    .
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to request that we change
                    your name or date of birth, you will need to send additional
                    information. Learn more on how to change your legal name{' '}
                    <a
                      target="_blank"
                      href="/resources/how-to-change-your-legal-name-on-file-with-va/?_ga=2.13947071.963379013.1690376239-159354255.1663160782"
                    >
                      on file with VA.
                    </a>
                  </p>
                </>
              ),
            },
            'view:personalInformation': {
              'ui:description': <PersonalInformation />,
            },
            highSchoolDiploma: {
              'ui:title':
                'Did you earn a high school diploma or equivalency certificate?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
            graduationDate: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
              'ui:required': formData => {
                return formData?.highSchoolDiploma === 'yes';
              },
              'ui:options': {
                hideIf: formData => {
                  return formData?.highSchoolDiploma !== 'yes';
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['highSchoolDiploma', 'graduationDate'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:personalInformation': {
                type: 'object',
                properties: {},
              },
              highSchoolDiploma: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              graduationDate: date,
            },
          },
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional considerations',
      pages: {
        marriageInformation: {
          title: 'Marriage information',
          path: 'marriage-information',
          depends: formData => {
            return formData.relationShipToMember === 'spouse';
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Marriage information</h3>
                </>
              ),
            },
            marriageStatus: {
              'ui:title':
                "What's the status of your marriage with your chosen Veteran or service member?",
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  married: 'Married',
                  divorced: 'Divorced (or divorce in progress)',
                  anulled:
                    'Marriage was annulled (or an annullment in progress)',
                  widowed: 'Widowed',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['marriageStatus'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              marriageStatus: {
                type: 'string',
                enum: ['married', 'divorced', 'anulled', 'widowed'],
              },
            },
          },
        },
        marriageDate: {
          path: 'marriage-date',
          title: 'Marriage Date',
          depends: formData => {
            return formData.relationShipToMember === 'spouse';
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Marriage Date</h3>
                </>
              ),
            },
            marriageDate: {
              ...currentOrPastDateUI(
                'When did you get married to your chosen Veteran or service member?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: ['marriageDate'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              marriageDate: date,
            },
          },
        },
        remarriageInformation: {
          path: 'remarriage-information',
          title: 'Remarriage Information',
          depends: formData => {
            return (
              formData.marriageStatus === 'divorced' &&
              formData.relationShipToMember === 'spouse'
            );
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Remarriage</h3>
                </>
              ),
            },
            remarriageStatus: {
              'ui:title': 'Have you been remarried since your divorce?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['remarriageStatus'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              remarriageStatus: {
                type: 'string',
                enum: ['yes', 'no'],
              },
            },
          },
        },
        remarriageDate: {
          path: 'remarriage-date',
          title: 'Remarriage Date',
          depends: formData => {
            return (
              formData.marriageStatus === 'divorced' &&
              formData.relationShipToMember === 'spouse' &&
              formData.remarriageStatus === 'yes'
            );
          },
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Remarriage Date</h3>
                </>
              ),
            },
            remarriageDate: {
              ...currentOrPastDateUI('When did you get remarried?'),
            },
          },
          schema: {
            type: 'object',
            required: ['remarriageDate'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              remarriageDate: date,
            },
          },
        },
        outstandingFelony: {
          path: 'outstanding-felony',
          title: 'Outstanding Felony',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Outstanding felony</h3>
                </>
              ),
            },
            felonyOrWarrant: {
              'ui:title':
                'Do you or your chosen Veteran or service member have an outstanding felony or warrant?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['felonyOrWarrant'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              felonyOrWarrant: {
                type: 'string',
                enum: ['yes', 'no'],
              },
            },
          },
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Review your phone numbers and email address',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your phone number and email address</h3>
                </>
              ),
            },
            'view:EmailAndphoneNumbers': {
              'ui:description': (
                <>
                  <h4>We’ll use this information to:</h4>
                  <ul>
                    <li>
                      Contact you if we have questions about your application
                    </li>
                    <li>Tell you important information about your benefits</li>
                  </ul>
                  <p>
                    This is the contact information we have on file for you. If
                    you notice any errors, please correct them now. Any updates
                    you make here will be used for your education benefits only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your contact
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p>
                    <a
                      target="_blank"
                      href="https://www.va.gov/resources/managing-your-vagov-profile/"
                      rel="noreferrer"
                    >
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            mobilePhone: phoneUISchema('mobile'),
            homePhone: phoneUISchema('home'),
            email: {
              ...emailUI('Email address'),
              'ui:widget': CustomEmailField,
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
                if (
                  field?.email?.toLowerCase() !==
                  field?.confirmEmail?.toLowerCase()
                ) {
                  errors.confirmEmail?.addError(
                    'Sorry, your emails must match',
                  );
                }
              },
            ],
            'view:confirmDuplicateData': {
              'ui:description': DuplicateContactInfoModal,
            },
          },
          schema: {
            type: 'object',
            required: ['email', 'confirmEmail'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:EmailAndphoneNumbers': {
                type: 'object',
                properties: {},
              },
              mobilePhone: phoneSchema(),
              homePhone: phoneSchema(),
              email: {
                type: 'string',
                format: 'email',
              },
              confirmEmail: {
                type: 'string',
                format: 'email',
              },
              'view:confirmDuplicateData': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        mailingAddress: {
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
                    <a target="_blank" href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            mailingAddressInput: {
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
              address: {
                ...address.uiSchema('', false, null, true),
                country: {
                  'ui:title': 'Country',
                  'ui:required': formData =>
                    !formData?.mailingAddressInput?.livesOnMilitaryBase,
                  'ui:disabled': formData =>
                    formData?.mailingAddressInput?.livesOnMilitaryBase,
                  'ui:options': {
                    updateSchema: (formData, schema, uiSchema) => {
                      const countryUI = uiSchema;
                      const addressFormData = get(
                        ['mailingAddressInput', 'address'],
                        formData,
                      );
                      const livesOnMilitaryBase = get(
                        ['mailingAddressInput', 'livesOnMilitaryBase'],
                        formData,
                      );
                      if (livesOnMilitaryBase) {
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
                      } else if (field?.length < 3) {
                        errors.addError('minimum of 3 characters');
                      } else if (field?.length > 40) {
                        errors.addError('maximum of 40 characters');
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
                      if (formData?.mailingAddressInput?.livesOnMilitaryBase) {
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
                  'ui:title': 'State/County/Province',
                  'ui:required': formData =>
                    formData?.mailingAddressInput?.livesOnMilitaryBase ||
                    formData?.mailingAddressInput?.address?.country === 'USA',
                },
                postalCode: {
                  'ui:errorMessages': {
                    required: 'Zip code must be 5 digits',
                  },
                  'ui:options': {
                    replaceSchema: formData => {
                      if (
                        formData?.mailingAddressInput?.address?.country !==
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
              mailingAddressInput: {
                type: 'object',
                properties: {
                  livesOnMilitaryBase: {
                    type: 'boolean',
                  },
                  livesOnMilitaryBaseInfo: {
                    type: 'object',
                    properties: {},
                  },
                  address: {
                    ...address.schema(fullSchema, true),
                  },
                },
              },
            },
          },
        },
        chooseContactMethod: {
          title: 'Choose your contact method for follow-up questions',
          path: 'contact-information/contact-method',
          uiSchema: {
            contactMethod: {
              'ui:title':
                'How should we contact you if we have questions on your application?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  email: 'Email',
                  mobilePhone: 'Mobile phone',
                  homePhone: 'Home phone',
                  mail: 'Mail',
                },
                updateSchema: (() => {
                  const filterContactMethods = createSelector(
                    form => form?.mobilePhone?.phone,
                    form => form?.homePhone?.phone,
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
            'view:subHeadings': {
              'ui:description': (
                <>
                  <div>
                    <h3>Choose how you want to get notifications</h3>
                    <p>
                      We recommend that you opt into text message notifications
                      about your benefits. These include notifications that
                      prompt you to verify your enrollment so you’ll receive
                      your education payments. This is an easy way to verify
                      your monthly enrollment.
                    </p>
                    <div className="meb-list-label">
                      <strong>What to know about text notifications:</strong>
                    </div>
                    <ul>
                      <li>We’ll send you 2 messages per month.</li>
                      <li>Message and data rates may apply.</li>
                      <li>If you want to opt out, text STOP.</li>
                      <li>If you need help, text HELP.</li>
                    </ul>
                    <p>
                      <a
                        href="https://www.va.gov/privacy-policy/digital-notifications-terms-and-conditions/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Read our text notifications terms and conditions
                      </a>
                    </p>
                    <p>
                      <a
                        href="https://www.va.gov/privacy-policy/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Read our privacy policy
                      </a>
                    </p>
                    <p>
                      <strong>Note</strong>: At this time, we can only send text
                      messages to U.S. mobile phone numbers.
                    </p>
                  </div>
                </>
              ),
            },
            notificationMethod: {
              'ui:title': 'Choose how you want to get notifications?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes, send me text message notifications',
                  no: 'No, just send me email notifications',
                },
              },
              'ui:validations': [
                (errors, field, formData) => {
                  const isYes = field === 'yes';
                  const phoneExist = !!formData?.mobilePhone.phone;
                  const isInternational =
                    formData?.mobilePhone?.isInternational;

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
            },
            'view:noMobilePhoneAlert': {
              'ui:description': (
                <va-alert
                  background-only
                  close-btn-aria-label="Close notification"
                  show-icon
                  status="warning"
                  visible
                >
                  <div>
                    <p className="vads-u-margin-y--0">
                      We can’t send you text message notifications because we
                      don’t have a mobile phone number on file for you
                    </p>

                    <Link
                      aria-label="Go back and add a mobile phone number"
                      to={{
                        pathname: '/contact-information',
                      }}
                    >
                      <va-button
                        uswds
                        onClick={() => {}}
                        secondary
                        text="Go back and add a mobile phone number"
                      />
                    </Link>
                  </div>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => {
                  return !!formData?.mobilePhone?.phone;
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
                  const isNo = formData?.notificationMethod === 'no';

                  const noDuplicates = formData?.duplicateEmail?.some(
                    entry => entry?.dupe === false,
                  );

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
                  const isYes = formData?.notificationMethod === 'yes';
                  const mobilePhone = formData?.mobilePhone.phone;
                  const noDuplicates = formData?.duplicatePhone?.some(
                    entry => entry?.dupe === false,
                  );

                  return !isYes || noDuplicates || !mobilePhone;
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['contactMethod'],
            properties: {
              contactMethod: {
                type: 'string',
                enum: ['email', 'mobilePhone', 'homePhone', 'mail'],
              },
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              notificationMethod: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              'view:noMobilePhoneAlert': {
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
            },
          },
        },
      },
    },
    directDepositChapter: {
      title: 'Direct deposit',
      pages: {
        directDeposit: {
          path: 'direct-deposit',
          title: 'Enter your direct deposit information',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
  },
};

export default formConfig;
