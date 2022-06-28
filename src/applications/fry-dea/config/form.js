import React from 'react';
import { createSelector } from 'reselect';

import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { vagovprod, VAGOVSTAGING } from 'site/constants/buckets';

import * as address from 'platform/forms/definitions/address';
import FormFooter from 'platform/forms/components/FormFooter';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
// import createNonRequiredFullName from 'platform/forms/definitions/nonRequiredFullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
// import dateRangeUi from 'platform/forms-system/src/js/definitions/dateRange';
// import dateUI from 'platform/forms-system/src/js/definitions/date';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
// import fullNameUi from 'platform/forms/definitions/fullName';
// import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
// import * as personId from 'platform/forms/definitions/personId';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { VA_FORM_IDS } from 'platform/forms/constants';
// import {
//   validateMonthYear,
//   validateFutureDateIfExpectedGrad,
// } from 'platform/forms-system/src/js/validation';

import manifest from '../manifest.json';

import {
  isOnlyWhitespace,
  applicantIsChildOfVeteran,
  addWhitespaceOnlyError,
  isAlphaNumeric,
  AdditionalConsiderationTemplate,
  applicantIsSpouseOfVeteran,
  bothFryAndDeaBenefitsAvailable,
} from '../helpers';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  formFields,
  RELATIONSHIP,
  VETERAN_NOT_LISTED_VALUE,
} from '../constants';
import GetFormHelp from '../components/GetFormHelp';
import GoToYourProfileLink from '../components/GoToYourProfileLink';
import RelatedVeterans from '../components/RelatedVeterans';
import { phoneSchema, phoneUISchema } from '../schema';
import EmailViewField from '../components/EmailViewField';
import { isValidPhone, validateEmail } from '../validation';
import EmailReviewField from '../components/EmailReviewField';
import YesNoReviewField from '../components/YesNoReviewField';
import MailingAddressViewField from '../components/MailingAddressViewField';
import VeteransRadioGroup from '../components/VeteransRadioGroup';
import SelectedVeteranReviewPage from '../components/SelectedVeteranReviewPage';
import FryDeaEligibilityCards from '../components/FryDeaEligibilityCards';

const { date, fullName } = fullSchema5490.definitions;
const { /* fullName, date, dateRange, usaPhone, */ email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const checkImageSrc = environment.isStaging()
  ? `${VAGOVSTAGING}/img/check-sample.png`
  : `${vagovprod}/img/check-sample.png`;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'fry-dea-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_5490,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-5490) is in progress.',
    //   expired: 'Your saved education benefits application (22-5490) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Apply for education benefits as an eligible dependent',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    fullName,
    date,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        applicantInformation: {
          title: 'Your information',
          path: 'applicant/information',
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
                  <p className="vads-u-margin-bottom--3">
                    <GoToYourProfileLink />
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
              ...currentOrPastDateUI('Your date of birth'),
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
            },
          },
        },
      },
    },
    veteranServiceMember: {
      title: 'Veteran and service member information',
      pages: {
        selectVeteran: {
          title: 'Veteran and service member information',
          path: 'choose-veteran-or-service-member',
          CustomPageReview: SelectedVeteranReviewPage,
          depends: formData => formData.veterans?.length > 1,
          uiSchema: {
            'view:selectedVeteranSubHeadings': {
              'ui:description': (
                <>
                  <h3>Choose your Veteran or service member</h3>
                  <p>
                    Based on Department of Defense records, these are the
                    Veterans and service members we have on file related to you,
                    as well as the associated eduacational benefits you may be
                    eligible for.
                  </p>
                  <RelatedVeterans />
                </>
              ),
            },
            [formFields.selectedVeteran]: {
              'ui:title':
                'Which Veteran or service member’s benefits would you like to use?',
              'ui:widget': VeteransRadioGroup,
              'ui:errorMessages': {
                required: 'Please select a Veteran or service member',
              },
            },
          },
          schema: {
            type: 'object',
            required: [formFields.selectedVeteran],
            properties: {
              'view:selectedVeteranSubHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.selectedVeteran]: {
                type: 'string',
              },
            },
          },
        },
        veteranInformation: {
          title: 'Enter Veteran or service member information',
          path: 'veteran-service-member/information',
          depends: formData =>
            !formData.veterans?.length ||
            formData[formFields.selectedVeteran] === VETERAN_NOT_LISTED_VALUE,
          uiSchema: {
            'view:veteranInformationHeading': {
              'ui:description': (
                <h3>Enter Veteran or service member information</h3>
              ),
            },
            'view:noVeteranWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    We do not have any Veteran or service member information on
                    file
                  </h3>
                  <p>
                    If you think this is incorrect, you may still continue this
                    application and enter their information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => formData.veterans?.length,
              },
            },
            'view:veteranNotOnFileWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="info"
                  visible
                >
                  <h3 slot="headline">
                    Your selected Veteran or service member is not on file
                  </h3>
                  <p>
                    You may still continue this application and enter their
                    information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => !formData.veterans?.length,
              },
            },
            [formFields.relationshipToVeteran]: {
              'ui:title':
                'What’s your relationship to the Veteran or service member whose benefits you’d like to use?',
              'ui:widget': 'radio',
              'ui:errorMessages': {
                required: 'Please select a relationship',
              },
            },
            'view:veteranFullNameHeading': {
              'ui:description': <h4>Veteran or service member information</h4>,
            },
            [formFields.veteranFullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:validations': [
                  (errors, field) =>
                    addWhitespaceOnlyError(
                      field,
                      errors,
                      'Please enter a first name',
                    ),
                ],
              },
              last: {
                ...fullNameUI.last,
                'ui:validations': [
                  (errors, field) =>
                    addWhitespaceOnlyError(
                      field,
                      errors,
                      'Please enter a last name',
                    ),
                ],
              },
            },
            [formFields.veteranDateOfBirth]: {
              ...currentOrPastDateUI('Date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.relationshipToVeteran,
              formFields.veteranDateOfBirth,
            ],
            properties: {
              'view:veteranInformationHeading': {
                type: 'object',
                properties: {},
              },
              'view:noVeteranWarning': {
                type: 'object',
                properties: {},
              },
              'view:veteranNotOnFileWarning': {
                type: 'object',
                properties: {},
              },
              [formFields.relationshipToVeteran]: {
                type: 'string',
                enum: [RELATIONSHIP.SPOUSE, RELATIONSHIP.CHILD],
              },
              'view:veteranFullNameHeading': {
                type: 'object',
                properties: {},
              },
              [formFields.veteranFullName]: {
                ...fullName,
                required: ['first', 'last'],
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [formFields.veteranDateOfBirth]: date,
            },
          },
        },
      },
    },
    benefitSelection: {
      title: 'Benefit selection',
      pages: {
        benefitSelection: {
          title: 'Benefit Selection',
          path: 'benefit-selection',
          depends: formData => bothFryAndDeaBenefitsAvailable(formData),
          uiSchema: {
            'view:benefitSelectionHeaderInfo': {
              'ui:description': (
                <>
                  <h3>Choose the benefit you’d like to apply for</h3>
                  <p>
                    We estimated your benefit eligibility based on your chosen
                    Veteran or service member’s service history. This isn’t an
                    eligibility determination. An official determination won’t
                    be made until you complete and submit this application.
                  </p>
                  <p>
                    <strong>Note:</strong> If you are eligible for both the Fry
                    Scholarship and Survivors’ and Dependents’ Educational
                    Assistance benefits, you’ll need to choose which one to use.
                    Once you make this choice, you can’t switch to the other
                    program.
                  </p>
                  <FryDeaEligibilityCards />
                  <va-additional-info trigger="Which benefit should I choose?">
                    <p>
                      For each benefit, you should consider the amount you can
                      receive, how payments are made, and when they expire.
                    </p>
                  </va-additional-info>
                </>
              ),
            },
            [formFields.benefitSelection]: {
              'ui:title': (
                <>
                  <span className="fry-dea-labels_label--main vads-u-padding-left--1">
                    Which education benefit would you like to apply for?
                  </span>
                  <span className="fry-dea-labels_label--secondary fry-dea-input-message vads-u-background-color--primary-alt-lightest vads-u-padding--1 vads-u-margin-top--1">
                    <i
                      className="fas fa-info-circle vads-u-margin-right--1"
                      aria-hidden="true"
                    />{' '}
                    <span className="sr-only">information</span> If you’re the
                    child of a veteran or service member who died in the line of
                    duty before August 1, 2011 you can use both Fry Scholarship
                    and DEA and get up to 81 months of benefits. You’ll need to
                    apply separately and use one program at a time.
                  </span>
                </>
              ),
              'ui:errorMessages': {
                required: 'Please select an education benefit',
              },
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  fry: 'Fry Scholarship (Chapter 33)',
                  dea:
                    'Survivors’ and Dependents Educational Assistance (DEA, Chapter 35)',
                },
                widgetProps: {
                  fry: { 'data-info': 'fry' },
                  dea: { 'data-info': 'dea' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID’s *must* exist on the page; and we
                // conditionally add content based on the selection
                selectedProps: {
                  fry: { 'aria-describedby': 'fry' },
                  dea: { 'aria-describedby': 'dea' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: [formFields.benefitSelection],
            properties: {
              'view:benefitSelectionHeaderInfo': {
                type: 'object',
                properties: {},
              },
              [formFields.benefitSelection]: {
                type: 'string',
                enum: [
                  'Fry Scholarship (Chapter 33)',
                  'Survivors’ and Dependents Educational Assistance (DEA, Chapter 35)',
                ],
              },
            },
          },
        },
      },
    },
    additionalConsideration: {
      title: 'Additional considerations',
      pages: {
        verifyHighSchool: {
          title: 'High school education',
          path: 'child/high-school-education',
          depends: formData => applicantIsChildOfVeteran(formData),
          uiSchema: {
            // 'view:subHeadings': {
            //   'ui:description': (
            //     <>
            //       <h3>Verify your high school education</h3>
            //       <va-alert
            //         close-btn-aria-label="Close notification"
            //         status="info"
            //         visible
            //       >
            //         <h3 slot="headline">We need additional information</h3>
            //         <div>
            //           Since you indicated that you are the child of your
            //           sponsor, please include information about your high school
            //           education.
            //         </div>
            //       </va-alert>
            //     </>
            //   ),
            // },
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
              // 'view:subHeadings': {
              //   type: 'object',
              //   properties: {},
              // },
              [formFields.highSchoolDiploma]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
            },
          },
        },
        highSchool: {
          title: 'Date received',
          path: 'veteran-service-member/high-school-education',
          depends: formData =>
            applicantIsChildOfVeteran(formData) &&
            formData[formFields.highSchoolDiploma] === 'Yes',
          uiSchema: {
            // 'view:subHeadings': {
            //   'ui:description': (
            //     <>
            //       <h3>Verify your high school education</h3>
            //       <va-alert
            //         close-btn-aria-label="Close notification"
            //         status="info"
            //         visible
            //       >
            //         <h3 slot="headline">We need additional information</h3>
            //         <div>
            //           Since you indicated that you are the child of your
            //           sponsor, please include information about your high school
            //           education.
            //         </div>
            //       </va-alert>
            //     </>
            //   ),
            // },
            [formFields.highSchoolDiplomaDate]: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: [formFields.highSchoolDiplomaDate],
            properties: {
              // 'view:subHeadings': {
              //   type: 'object',
              //   properties: {},
              // },
              [formFields.highSchoolDiplomaDate]: date,
            },
          },
        },
        marriageDate: {
          ...AdditionalConsiderationTemplate(
            'Marriage date',
            'additional/consideration/marriage/date',
            formFields.additionalConsiderations.marriageDate,
            {
              ...currentOrPastDateUI(
                'When did you get married to your chosen Veteran or service member?',
              ),
            },
            { ...date },
          ),
          depends: formData => applicantIsSpouseOfVeteran(formData),
        },
        marriageInformation: {
          ...AdditionalConsiderationTemplate(
            'Marriage information',
            'additional/consideration/marriage/information',
            formFields.additionalConsiderations.marriageInformation,
            {
              'ui:title':
                'What’s the status of your marriage with your chosen Veteran or service member?',
              'ui:widget': 'radio',
            },
            {
              type: 'string',
              enum: [
                'Married',
                'Divorced (or a divorce is in progress)',
                'Marriage was annulled (or annulment is in progress)',
                'Widowed',
              ],
            },
          ),
          depends: formData => applicantIsSpouseOfVeteran(formData),
        },
        marriageInformationDivorced: {
          ...AdditionalConsiderationTemplate(
            'Remarriage',
            'additional/consideration/remarriage/information/divorced',
            formFields.additionalConsiderations.remarriage,
            {
              'ui:title': 'Have you been remarried?',
              'ui:widget': 'yesNo',
            },
            {
              type: 'boolean',
            },
          ),
          depends: formData =>
            applicantIsSpouseOfVeteran(formData) &&
            formData[
              formFields.additionalConsiderations.marriageInformation
            ] === 'Divorced (or a divorce is in progress)',
        },
        marriageInformationAnnulled: {
          ...AdditionalConsiderationTemplate(
            'Remarriage',
            'additional/consideration/remarriage/information/annulment',
            formFields.additionalConsiderations.remarriage,
            {
              'ui:title': 'Have you been remarried since your annulment?',
              'ui:widget': 'yesNo',
            },
            {
              type: 'boolean',
            },
          ),
          depends: formData =>
            applicantIsSpouseOfVeteran(formData) &&
            formData[
              formFields.additionalConsiderations.marriageInformation
            ] === 'Marriage was annulled (or annulment is in progress)',
        },
        marriageInformationWidowed: {
          ...AdditionalConsiderationTemplate(
            'Remarriage',
            'additional/consideration/remarriage/information/widowed',
            formFields.additionalConsiderations.remarriage,
            {
              'ui:title': 'Have you been remarried since being widowed?',
              'ui:widget': 'yesNo',
            },
            {
              type: 'boolean',
            },
          ),
          depends: formData =>
            applicantIsSpouseOfVeteran(formData) &&
            formData[
              formFields.additionalConsiderations.marriageInformation
            ] === 'Widowed',
        },
        remarriageDate: {
          ...AdditionalConsiderationTemplate(
            'Remarriage date',
            'additional/consideration/remarriage/date',
            formFields.additionalConsiderations.remarriageDate,
            {
              ...currentOrPastDateUI('When did you get remarried?'),
            },
            {
              ...date,
            },
          ),
          depends: formData =>
            applicantIsSpouseOfVeteran(formData) &&
            formData[formFields.additionalConsiderations.remarriage] &&
            formData[
              formFields.additionalConsiderations.marriageInformation
            ] === 'Married',
        },
        outstandingFelony: {
          ...AdditionalConsiderationTemplate(
            'Outstanding felony',
            'new/additional/consideration/felony/status',
            formFields.additionalConsiderations.outstandingFelony,
            {
              'ui:title':
                'Do you or your chosen Veteran or service member have an outstanding felony or warrant?',
              'ui:widget': 'yesNo',
            },
            {
              type: 'boolean',
            },
          ),
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        phoneEmail: {
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
                    <GoToYourProfileLink />
                  </p>
                </>
              ),
            },
            [formFields.viewPhoneNumbers]: {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 fry-dea-review-page-only">
                    Phone numbers and email addresss
                  </h4>
                  <p className="fry-dea-review-page-only">
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
              [formFields.email]: {
                ...emailUI('Email address'),
                'ui:validations': [validateEmail],
                'ui:reviewField': EmailReviewField,
              },
              [formFields.confirmEmail]: {
                ...emailUI('Confirm email address'),
                'ui:options': {
                  ...emailUI()['ui:options'],
                  hideOnReview: true,
                },
              },
              'ui:validations': [
                (errors, field) => {
                  if (
                    field[formFields.email] !== field[formFields.confirmEmail]
                  ) {
                    errors[formFields.confirmEmail].addError(
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
                required: [formFields.email, formFields.confirmEmail],
                properties: {
                  [formFields.email]: email,
                  [formFields.confirmEmail]: email,
                },
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
                  <p className="vads-u-margin-bottom--4">
                    <GoToYourProfileLink />
                  </p>
                </>
              ),
            },
            'view:mailingAddress': {
              'ui:description': (
                <>
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5 fry-dea-review-page-only">
                    Mailing address
                  </h4>
                  <p className="fry-dea-review-page-only">
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
                'ui:description': (
                  <va-additional-info
                    trigger="Learn more about military base addresses"
                    class="vads-u-margin-top--4"
                  >
                    <p>
                      U.S. military bases are considered a domestic address and
                      a part of the United States.
                    </p>
                  </va-additional-info>
                ),
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
                    ...address.schema(fullSchema5490, true),
                  },
                },
              },
            },
          },
        },
        contactPreferences: {
          title: 'Contact preferences',
          path: 'contact-information/contact-preferences',
          uiSchema: {
            'view:contactMethodIntro': {
              'ui:description': (
                <>
                  <h3 className="fry-dea-form-page-only">
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
                      form[formFields.viewPhoneNumbers][
                        formFields.mobilePhoneNumber
                      ]?.phone,
                    form =>
                      form[formFields.viewPhoneNumbers][formFields.phoneNumber]
                        ?.phone,
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
                  <div className="fry-dea-form-page-only">
                    <h3>Choose how you want to get notifications</h3>
                    <p>
                      We recommend that you opt in to text message notifications
                      about your benefits. These include notifications that
                      prompt you to verify your enrollment so you’ll receive
                      your education payments. This is an easy way to verify
                      your monthly enrollment.
                    </p>
                    <va-alert status="info">
                      <>
                        If you choose to get text message notifications from
                        VA’s GI Bill program, message and data rates may apply.
                        Two messages per month. At this time, we can only send
                        text messages to U.S. mobile phone numbers. Text STOP to
                        opt out or HELP for help.{' '}
                        <a
                          href="https://benefits.va.gov/gibill/isaksonroe/verification_of_enrollment.asp"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View Terms and Conditions and Privacy Policy.
                        </a>
                      </>
                    </va-alert>
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
                    const phoneExists = !!formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ].phone;
                    const isInternational =
                      formData[formFields.viewPhoneNumbers][
                        formFields.mobilePhoneNumberInternational
                      ];

                    if (isYes) {
                      if (!phoneExists) {
                        errors.addError(
                          'You can’t select that response because we don’t have a mobile phone number on file for you.',
                        );
                      } else if (isInternational) {
                        errors.addError(
                          'You can’t select that response because you have an international mobile phone number',
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
                    formFields.mobilePhoneNumberInternational
                  ],
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
                  !isValidPhone(
                    formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ].phone,
                  ) ||
                  !formData[formFields.viewPhoneNumbers][
                    formFields.mobilePhoneNumberInternational
                  ],
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
        directDeposit: {
          path: 'direct-deposit',
          uiSchema: {
            'ui:description': (
              <p className="vads-u-margin-bottom--4">
                <strong>Note</strong>: VA makes payments only through direct
                deposit, also called electronic funds transfer (EFT).
              </p>
            ),
            [formFields.bankAccount]: {
              ...bankAccountUI,
              'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
              accountType: {
                ...bankAccountUI.accountType,
                'ui:errorMessages': {
                  required: 'Please select an account type',
                },
              },
              accountNumber: {
                ...bankAccountUI.accountNumber,
                'ui:validations': [
                  (errors, field) => {
                    if (!isAlphaNumeric(field)) {
                      errors.addError('Please enter a valid account number');
                    }
                  },
                ],
              },
            },
            'view:directDepositLearnMore': {
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
              [formFields.bankAccount]: {
                type: 'object',
                required: ['accountType', 'routingNumber', 'accountNumber'],
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
              'view:directDepositLearnMore': {
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
