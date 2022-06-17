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
// import { VA_FORM_IDS } from 'platform/forms/constants';
// import {
//   validateMonthYear,
//   validateFutureDateIfExpectedGrad,
// } from 'platform/forms-system/src/js/validation';

import manifest from '../manifest.json';

import {
  isOnlyWhitespace,
  applicantIsChildOfSponsor,
  addWhitespaceOnlyError,
  isAlphaNumeric,
} from '../helpers';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { newFormFields, newFormPages, RELATIONSHIP } from '../constants';
import GetFormHelp from '../components/GetFormHelp';
import GoToYourProfileLink from '../components/GoToYourProfileLink';
import RelatedVeterans from '../components/RelatedVeterans';
import { phoneSchema, phoneUISchema } from '../schema';
import EmailViewField from '../components/EmailViewField';
import { isValidPhone, validateEmail } from '../validation';
import EmailReviewField from '../components/EmailReviewField';
import YesNoReviewField from '../components/YesNoReviewField';
import MailingAddressViewField from '../components/MailingAddressViewField';
import NotificationRadioButtons from '../components/NotificationRadioButtons';

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
  // formId: VA_FORM_IDS.FORM_22_5490,
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
  title: 'Fry/DEA — VA Education Benefits For Survivors and Dependents;',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {
    fullName,
    date,
  },
  chapters: {
    newApplicantInformationChapter: {
      title: 'Your information',
      pages: {
        [newFormPages.newApplicantInformation]: {
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
            [newFormFields.newUserFullName]: {
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
            [newFormFields.newDateOfBirth]: {
              ...currentOrPastDateUI('Your date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newDateOfBirth],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newUserFullName]: {
                ...fullName,
                properties: {
                  ...fullName.properties,
                  middle: {
                    ...fullName.properties.middle,
                    maxLength: 30,
                  },
                },
              },
              [newFormFields.newDateOfBirth]: date,
              'view:dateOfBirthUnder18Alert': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
    newVeteranServiceMember: {
      title: 'Veteran and service member information',
      pages: {
        [newFormPages.chooseServiceMember]: {
          title: 'Veteran and service member information',
          path: 'new/choose-veteran-or-service-member',
          uiSchema: {
            'view:subHeadings': {
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
            [newFormFields.firstSponsor]: {
              'ui:title':
                'Which sponsor’s benefits would you like to use first?',
              // 'ui:widget': FirstSponsorRadioGroup,
              // 'ui:reviewWidget': FirstSponsorReviewField,
              'ui:errorMessages': {
                required: 'Please select at least one sponsor',
              },
            },
            'view:firstSponsorAdditionalInfo': {
              'ui:description': (
                <va-additional-info
                  trigger="Which sponsor should I use first?"
                  class="vads-u-margin-bottom--4"
                >
                  <p className="vads-u-margin-top--0">
                    Though unlikely, you may need to consider differences in the
                    amount of benefits each sponsor offers and when they expire.
                    Benefits from other sponsors can be used after your first
                    sponsor’s benefits expire.
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    If you choose “I’m not sure,” or if there are additional
                    things to consider regarding your sponsors, a VA
                    representative will reach out to help you decide.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.firstSponsor],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.firstSponsor]: {
                type: 'string',
              },
              'view:firstSponsorAdditionalInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        [newFormPages.newSponsorInformation]: {
          title: 'Enter your sponsor’s info',
          path: 'new/sponsor/information',
          // depends: formData =>
          //   // formData.showUpdatedFryDeaApp &&
          //   !formData.sponsors?.sponsors?.length ||
          //   formData.sponsors?.someoneNotListed,
          uiSchema: {
            'view:noSponsorWarning': {
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
                    they can{' '}
                    <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
                      update this information on the DoD milConnect website
                    </a>
                    .
                  </p>
                  <p>
                    You may still continue this application and enter your
                    sponsor information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => formData.sponsors?.sponsors?.length,
              },
            },
            'view:sponsorNotOnFileWarning': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    One of your selected sponsors is not on file
                  </h3>
                  <p>
                    If you think this is incorrect, reach out to your sponsor so
                    they can{' '}
                    <a href="https://myaccess.dmdc.osd.mil/identitymanagement/authenticate.do?execution=e3s1">
                      update this information on the DoD milConnect website
                    </a>
                    .
                  </p>
                  <p>
                    You may still continue this application and enter your
                    sponsor information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => !formData.sponsors?.sponsors?.length,
              },
            },
            [newFormFields.newRelationshipToServiceMember]: {
              'ui:title':
                'What’s your relationship to the service member whose benefit has been transferred to you?',
              'ui:widget': 'radio',
            },
            [newFormFields.newSponsorFullName]: {
              ...fullNameUI,
              first: {
                ...fullNameUI.first,
                'ui:title': 'Your sponsor’s first name',
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
                'ui:title': 'Your sponsor’s last name',
                'ui:validations': [
                  (errors, field) =>
                    addWhitespaceOnlyError(
                      field,
                      errors,
                      'Please enter a last name',
                    ),
                ],
              },
              middle: {
                ...fullNameUI.middle,
                'ui:title': 'Your sponsor’s middle name',
              },
            },
            [newFormFields.newSponsorDateOfBirth]: {
              ...currentOrPastDateUI('Your sponsor’s date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [
              newFormFields.newRelationshipToServiceMember,
              newFormFields.newSponsorDateOfBirth,
            ],
            properties: {
              'view:noSponsorWarning': {
                type: 'object',
                properties: {},
              },
              'view:sponsorNotOnFileWarning': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newRelationshipToServiceMember]: {
                type: 'string',
                enum: [RELATIONSHIP.SPOUSE, RELATIONSHIP.CHILD],
              },
              [newFormFields.newSponsorFullName]: {
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
              [newFormFields.newSponsorDateOfBirth]: date,
            },
          },
        },
      },
    },
    newBenefitSelection: {
      title: 'Benefit selection',
      pages: {
        [newFormPages.benefitSelection]: {
          title: 'Benefit Selection',
          path: 'new/benefit-selection',
          // depends: formData => formData.showUpdatedFryDeaApp,
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Choose the benefit you’d like to apply for</h3>
                  <p>
                    <strong>Note:</strong> If you are eligible for both the Fry
                    scholarship and Survivors' and Dependents Educational
                    Assistance Benefits, you’ll need to choose which one to use.
                    Once you make this choice, you can’t switch to the other
                    program.
                  </p>
                </>
              ),
            },
            'view:fryMessageAlert': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  disable-analytics="false"
                  full-width="false"
                  status="continue"
                  visible="true"
                  background-only
                >
                  <p className="vads-u-margin-y--1px">Chapter 33</p>
                  <h3 className="vads-u-margin-y--1px">Fry Scholarship</h3>
                  <p>
                    <i className="fas fa-check-circle" /> You may be eligible
                    for this benefit
                  </p>
                  <h4>Receive up to 36 months of benefits, including</h4>
                  <p>
                    <i className="fas fa-folder" /> Tuition & fees
                  </p>
                  <p>
                    <i className="fas fa-folder" /> Money for housing
                  </p>
                  <p>
                    <i className="fas fa-folder" /> Money for books & supplies
                  </p>
                  <a href="va.gov">
                    Learn more about the Fry Scholarship education benefit
                  </a>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => formData.sponsors?.sponsors?.length,
              },
            },
            'view:deaMessageAlert': {
              'ui:description': (
                <va-alert
                  close-btn-aria-label="Close notification"
                  disable-analytics="false"
                  full-width="false"
                  status="continue"
                  visible="true"
                  background-only
                >
                  <p className="vads-u-margin-y--1px">DEA, Chapter 35</p>
                  <h3 className="vads-u-margin-y--1px">
                    Survivors' and Dependents Educational Assistance
                  </h3>
                  <p>
                    <i className="fas fa-check-circle" /> You may be eligible
                    for this benefit
                  </p>
                  <h4>Receive up to 45 months of benefits, including</h4>
                  <p>
                    <i className="fas fa-folder" /> Monthly stipened
                  </p>
                  <a href="va.gov">
                    Learn more about the DEA education benefit
                  </a>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => formData.sponsors?.sponsors?.length,
              },
            },
            'view:benefitSelectionExplainer': {
              'ui:description': (
                <va-additional-info
                  status="info"
                  trigger="Which benefit should I choose?"
                >
                  <p>
                    For each benefit, you should consider the amount you can
                    receive, how payments are made, and when they expire.
                  </p>
                </va-additional-info>
              ),
            },
            'view:benefitSelectionAlert': {
              'ui:description': (
                <NotificationRadioButtons
                  label="Which education benefit would you like to apply for?"
                  name="benefit selection"
                  required
                  additionalFieldsetClass="information-border"
                  informationMessage="If you’re the child of a veteran or service member who died
                  in the line of duty before August 1, 2011 you can use both
                  Fry Scholarship and DEA and get up to 81 months of benefits.
                  You’ll need to apply separately and use one program at a
                  time."
                  value={{ value: 'Fry' }}
                  onValueChange={e => e}
                  options={[
                    {
                      label: `Fry Scholarship (Chapter 33)`,
                      value: 'Fry',
                      ariaLabel: 'Notify me of TEST by',
                      class: 'vads-u-padding-left--1',
                    },
                    {
                      label: `Survivors' and Dependents Educational Assistance (DEA, Chapter 35)`,
                      value: 'Dea',
                      ariaLabel: `Do not notify me of TEST by`,
                    },
                  ]}
                />
              ),
            },
            favoriteAnimal: {
              'ui:title': (
                <>
                  <span className="fry-dea-labels_label--main vads-u-padding-bottom--1">
                    Favorite animal
                  </span>
                  <span className="fry-dea-labels_label--secondary fry-dea-input-message vads-u-background-color--primary-alt-lightest vads-u-padding--1">
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
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  dog: 'Dog',
                  cat: 'Cat',
                  octopus: 'Octopus',
                  sloth: 'Sloth',
                },
                widgetProps: {
                  dog: { 'data-info': 'dog_1' },
                  cat: { 'data-info': 'cat_2' },
                  octopus: { 'data-info': 'octopus_3' },
                  sloth: { 'data-info': 'sloth_4' },
                },
                // Only added to the radio when it is selected
                // a11y requirement: aria-describedby ID's *must* exist on the page; and we
                // conditionally add content based on the selection
                selectedProps: {
                  dog: { 'aria-describedby': 'some_id_1' },
                  cat: { 'aria-describedby': 'some_id_2' },
                  octopus: { 'aria-describedby': 'some_id_3' },
                  sloth: { 'aria-describedby': 'some_id_4' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['favoriteAnimal', newFormFields.newBenefitSelection],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:fryMessageAlert': {
                type: 'object',
                properties: {},
              },
              'view:deaMessageAlert': {
                type: 'object',
                properties: {},
              },
              'view:benefitSelectionExplainer': {
                type: 'object',
                properties: {},
              },
              'view:benefitSelectionAlert': {
                type: 'object',
                properties: {},
              },
              favoriteAnimal: {
                type: 'string',
                enum: ['dog', 'cat', 'octopus', 'sloth'],
              },
            },
          },
        },
      },
    },
    newHighSchool: {
      title: 'Sponsor information',
      pages: {
        [newFormPages.newVerifyHighSchool]: {
          title: 'Verify your high school education',
          path: 'new/child/high-school-education',
          depends: formData => applicantIsChildOfSponsor(formData),
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
            [newFormFields.newHighSchoolDiploma]: {
              'ui:title':
                'Did you earn a high school diploma or equivalency certificate?',
              'ui:widget': 'radio',
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newHighSchoolDiploma],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newHighSchoolDiploma]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
            },
          },
        },
        [newFormPages.newSponsorHighSchool]: {
          title: 'Verify your high school graduation date',
          path: 'new/sponsor/high-school-education',
          depends: formData =>
            applicantIsChildOfSponsor(formData) &&
            formData[newFormFields.newHighSchoolDiploma] === 'Yes',
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
            [newFormFields.newHighSchoolDiplomaDate]: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: [newFormFields.newHighSchoolDiplomaDate],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [newFormFields.newHighSchoolDiplomaDate]: date,
            },
          },
        },
      },
    },
    // Mariage chapter
    // Outstanding felony chapter
    newContactInformationChapter: {
      title: 'Contact information',
      pages: {
        [newFormPages.newContactInformation.newContactInformation]: {
          title: 'Phone numbers and email address',
          path: 'new/contact-information/email-phone',
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
            [newFormFields.newViewPhoneNumbers]: {
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
              [newFormFields.newMobilePhoneNumber]: phoneUISchema('mobile'),
              [newFormFields.newPhoneNumber]: phoneUISchema('home'),
            },
            [newFormFields.newEmail]: {
              'ui:options': {
                hideLabelText: true,
                showFieldLabel: false,
                viewComponent: EmailViewField,
              },
              [newFormFields.newEmail]: {
                ...emailUI('Email address'),
                'ui:validations': [validateEmail],
                'ui:reviewField': EmailReviewField,
              },
              [newFormFields.newConfirmEmail]: {
                ...emailUI('Confirm email address'),
                'ui:options': {
                  ...emailUI()['ui:options'],
                  hideOnReview: true,
                },
              },
              'ui:validations': [
                (errors, field) => {
                  if (
                    field[newFormFields.newEmail] !==
                    field[newFormFields.newConfirmEmail]
                  ) {
                    errors[newFormFields.newConfirmEmail].addError(
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
              [newFormFields.newViewPhoneNumbers]: {
                type: 'object',
                properties: {
                  [newFormFields.newMobilePhoneNumber]: phoneSchema(),
                  [newFormFields.newPhoneNumber]: phoneSchema(),
                },
              },
              [newFormFields.newEmail]: {
                type: 'object',
                required: [
                  newFormFields.newEmail,
                  newFormFields.newConfirmEmail,
                ],
                properties: {
                  [newFormFields.newEmail]: email,
                  [newFormFields.newConfirmEmail]: email,
                },
              },
            },
          },
        },
        [newFormPages.newContactInformation.newMailingAddress]: {
          title: 'Mailing address',
          path: 'new/contact-information/mailing-address',
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
              [newFormFields.newAddress]: {
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
                  [newFormFields.newAddress]: {
                    ...address.schema(fullSchema5490, true),
                  },
                },
              },
            },
          },
        },
        [newFormPages.newContactInformation.newPreferredContactMethod]: {
          title: 'Contact preferences',
          path: 'new/contact-information/contact-preferences',
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
            [newFormFields.newContactMethod]: {
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
                      form[newFormFields.newViewPhoneNumbers][
                        newFormFields.newMobilePhoneNumber
                      ]?.phone,
                    form =>
                      form[newFormFields.newViewPhoneNumbers][
                        newFormFields.newPhoneNumber
                      ]?.phone,
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
              [newFormFields.newReceiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications on your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field.slice(0, 4).includes('Yes');
                    const phoneExists = !!formData[
                      newFormFields.newViewPhoneNumbers
                    ][newFormFields.newMobilePhoneNumber].phone;
                    const isInternational =
                      formData[newFormFields.newViewPhoneNumbers][
                        newFormFields.newMobilePhoneNumberInternational
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
                    formData[newFormFields.newViewPhoneNumbers][
                      newFormFields.newMobilePhoneNumber
                    ].phone,
                  ) ||
                  formData[newFormFields.newViewPhoneNumbers][
                    newFormFields.newMobilePhoneNumberInternational
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
                    formData[newFormFields.newViewPhoneNumbers][
                      newFormFields.newMobilePhoneNumber
                    ].phone,
                  ) ||
                  !formData[newFormFields.newViewPhoneNumbers][
                    newFormFields.newMobilePhoneNumberInternational
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
              [newFormFields.newContactMethod]: {
                type: 'string',
                enum: contactMethods,
              },
              'view:receiveTextMessages': {
                type: 'object',
                required: [newFormFields.newReceiveTextMessages],
                properties: {
                  [newFormFields.newReceiveTextMessages]: {
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
            required: [newFormFields.newContactMethod],
          },
        },
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        [newFormPages.newDirectDeposit]: {
          path: 'new/direct-deposit',
          uiSchema: {
            'ui:description': (
              <p className="vads-u-margin-bottom--4">
                <strong>Note</strong>: VA makes payments only through direct
                deposit, also called electronic funds transfer (EFT).
              </p>
            ),
            [newFormFields.newBankAccount]: {
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
              [newFormFields.newBankAccount]: {
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
