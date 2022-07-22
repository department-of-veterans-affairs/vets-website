import React from 'react';
import { createSelector } from 'reselect';
import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

import { vagovprod, VAGOVSTAGING } from 'site/constants/buckets';

import * as address from 'platform/forms/definitions/address';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import manifest from '../manifest.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

import EmailReviewField from '../components/EmailReviewField';
import EmailViewField from '../components/EmailViewField';
import FirstSponsorRadioGroup from '../components/FirstSponsorRadioGroup';
import FirstSponsorReviewPage from '../components/FirstSponsorReviewPage';
import GoToYourProfileLink from '../components/GoToYourProfileLink';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';
import MailingAddressViewField from '../components/MailingAddressViewField';
import NewGetHelp from '../components/NewGetHelp';
import PhoneReviewField from '../components/PhoneReviewField';
import PhoneViewField from '../components/PhoneViewField';
import SelectedSponsorsReviewPage from '../components/SelectedSponsorsReviewPage';
import SponsorCheckboxGroup from '../components/SponsorsCheckboxGroup';
import Sponsors from '../components/Sponsors';
import YesNoReviewField from '../components/YesNoReviewField';

import {
  isOnlyWhitespace,
  titleCase,
  hideUnder18Field,
  addWhitespaceOnlyError,
  isAlphaNumeric,
  applicantIsChildOfSponsor,
  // prefillTransformer,
} from '../helpers';

import {
  isValidPhone,
  validatePhone,
  validateEmail,
} from '../utils/validation';

import { SPONSOR_RELATIONSHIP, newFormFields } from '../constants';

const newFormPages = {
  newApplicantInformation: 'newApplicantInformation',
  newContactInformation: {
    newContactInformation: 'newContactInformation',
    newMailingAddress: 'newMailingAddress',
    newPreferredContactMethod: 'newPreferredContactMethod',
  },
  newServiceHistory: 'newServiceHistory',
  newBenefitSelection: 'newBenefitSelection',
  newDirectDeposit: 'newDirectDeposit',
  newFirstSponsorSelection: 'newFirstSponsorSelection',
  newSponsorInformation: 'newSponsorInformation',
  newSponsorHighSchool: 'newSponsorHighSchool',
  newSponsorSelection: 'newSponsorSelection',
  newSponsorSelectionReview: 'newSponsorSelectionReview',
  newVerifyHighSchool: 'newVerifyHighSchool',
};

const { fullName, date, usaPhone, email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const checkImageSrc = environment.isStaging()
  ? `${VAGOVSTAGING}/img/check-sample.png`
  : `${vagovprod}/img/check-sample.png`;

function phoneUISchema(category, parent, international) {
  return {
    [parent]: {
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
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
        // expandUnder: parent,
        hideIf: formData =>
          !isValidPhone(
            formData[newFormFields.newViewPhoneNumbers][parent].phone,
          ),
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

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'toe-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-1990E',
  title: 'Apply to use transferred education benefits',
  subTitle:
    'Equal to VA Form 22-1990e (Application for Family Member to Use Transferred Benefits)',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your survivor dependent benefits application (22-1990E) is in progress.',
    //   expired: 'Your saved survivor dependent benefits application (22-1990E) has expired. If you want to apply for survivor dependent benefits, please start a new application.',
    //   saved: 'Your survivor dependent benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for survivor dependent benefits.',
    noAuth:
      'Please sign in again to continue your application for survivor dependent benefits.',
  },
  defaultDefinitions: {},
  getHelp: NewGetHelp,
  chapters: {
    newApplicantInformationChapter: {
      title: 'Your information',
      pages: {
        [newFormPages.newApplicantInformation]: {
          title: 'Your information',
          path: 'new/applicant-information/personal-information',
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
            'view:dateOfBirthUnder18Alert': {
              'ui:description': (
                <va-alert
                  background-only
                  close-btn-aria-label="Close notification"
                  show-icon
                  status="warning"
                  visible
                >
                  <>
                    Since you’re under 18 years old, a parent or guardian will
                    have to sign this application when you submit it.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => {
                  if (!formData || !formData[newFormFields.newDateOfBirth]) {
                    return true;
                  }

                  const dateParts =
                    formData &&
                    formData[newFormFields.newDateOfBirth].split('-');

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
            [newFormFields.newParentGuardianSponsor]: {
              'ui:title': 'Parent / Guardian signature',
              'ui:options': {
                hideIf: formData =>
                  hideUnder18Field(formData, newFormFields.newDateOfBirth),
              },
              'ui:required': formData =>
                !hideUnder18Field(formData, newFormFields.newDateOfBirth),
              'ui:validations': [
                (errors, field) =>
                  addWhitespaceOnlyError(
                    field,
                    errors,
                    'Please enter a parent/guardian signature',
                  ),
              ],
              'ui:errorMessages': {
                required: 'Please enter a parent/guardian signature',
              },
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
              [newFormFields.newParentGuardianSponsor]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    sponsorInformationChapter: {
      title: 'Sponsor information',
      pages: {
        [newFormPages.newSponsorSelection]: {
          title: 'Choose your sponsor',
          path: 'new/sponsor/select-sponsor',
          CustomPageReview: SelectedSponsorsReviewPage,
          depends: formData => formData.sponsors?.sponsors?.length,
          uiSchema: {
            'view:listOfSponsors': {
              'ui:description': <Sponsors />,
            },
            [newFormFields.selectedSponsors]: {
              'ui:field': SponsorCheckboxGroup,
              'ui:required': formData => !!formData.sponsors?.sponsors?.length,
              'ui:options': {
                hideIf: formData =>
                  formData.fetchedSponsorsComplete &&
                  !formData.sponsors?.sponsors?.length,
                keepInPageOnReview: true,
              },
              items: {
                'ui:title': 'sponsor items',
              },
            },
            'view:additionalInfo': {
              'ui:description': (
                <va-additional-info
                  trigger="Which sponsor should I choose?"
                  class="vads-u-margin-bottom--4"
                >
                  <p className="vads-u-margin-y--0">
                    You will only receive a decision for the sponsor(s) you
                    select. VA will review your eligibility for each selection.
                    For any sponsors you do not select, you may impact your
                    ability to use those benefits in the future. You can reapply
                    for those sponsors using this application.
                  </p>
                </va-additional-info>
              ),
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:listOfSponsors': {
                type: 'object',
                properties: {},
              },
              [newFormFields.selectedSponsors]: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'string',
                },
              },
              'view:additionalInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        [newFormPages.newSponsorInformation]: {
          title: 'Enter your sponsor’s info',
          path: 'new/sponsor/information',
          depends: formData => formData.sponsors?.someoneNotListed,
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
                enum: [SPONSOR_RELATIONSHIP.SPOUSE, SPONSOR_RELATIONSHIP.CHILD],
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
        [newFormPages.newFirstSponsorSelection]: {
          title: 'Choose your first sponsor',
          path: 'new/sponsor/select-first-sponsor',
          CustomPageReview: FirstSponsorReviewPage,
          depends: formData => formData.selectedSponsors?.length > 1,
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Choose your first sponsor</h3>
                  <p>
                    You can only use one sponsor’s benefits at a time. Because
                    you selected more than one sponsor, you must choose which
                    benefits to use first.
                  </p>
                </>
              ),
            },
            [newFormFields.firstSponsor]: {
              'ui:title':
                'Which sponsor’s benefits would you like to use first?',
              'ui:widget': FirstSponsorRadioGroup,
              'ui:errorMessages': {
                required: 'Please select a sponsor',
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
                newFormFields.newMobilePhoneNumber,
                newFormFields.newMobilePhoneNumberInternational,
              ),
              ...phoneUISchema(
                'home',
                newFormFields.newPhoneNumber,
                newFormFields.newPhoneNumberInternational,
              ),
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
                  [newFormFields.newMobilePhoneNumberInternational]: {
                    type: 'boolean',
                  },
                  [newFormFields.newPhoneNumber]: phoneSchema(),
                  [newFormFields.newPhoneNumberInternational]: {
                    type: 'boolean',
                  },
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
                    ...address.schema(fullSchema1990e, true),
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
                  <h3 className="toe-form-page-only">
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
                  <div className="toe-form-page-only">
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
