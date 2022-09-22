import React from 'react';
import { createSelector } from 'reselect';

import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import bankAccountUI from 'platform/forms/definitions/bankAccount';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { vagovprod, VAGOVSTAGING } from 'site/constants/buckets';

import manifest from '../manifest.json';

import * as address from '../definitions/address';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

import EmailReviewField from '../components/EmailReviewField';
import EmailViewField from '../components/EmailViewField';
import FirstSponsorRadioGroup from '../components/FirstSponsorRadioGroup';
import FirstSponsorReviewPage from '../components/FirstSponsorReviewPage';
import GoToYourProfileLink from '../components/GoToYourProfileLink';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';
import MailingAddressViewField from '../components/MailingAddressViewField';
import GetHelp from '../components/GetHelp';
import SelectedSponsorsReviewPage from '../components/SelectedSponsorsReviewPage';
import Sponsors from '../components/Sponsors';
import SponsorCheckboxGroup from '../components/SponsorsCheckboxGroup';
import SponsorsSelectionHeadings from '../components/SponsorsSelectionHeadings';
import YesNoReviewField from '../components/YesNoReviewField';

import {
  isOnlyWhitespace,
  hideUnder18Field,
  addWhitespaceOnlyError,
  isAlphaNumeric,
  applicantIsChildOfSponsor,
  transformTOEForm,
  // prefillTransformer,
} from '../helpers';

import { phoneSchema, phoneUISchema } from '../schema';
import { isValidPhoneField, validateEmail } from '../utils/validation';
import {
  formFields,
  SPONSOR_RELATIONSHIP,
  YOUR_PROFILE_URL,
} from '../constants';

const { fullName, date, email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const checkImageSrc = environment.isStaging()
  ? `${VAGOVSTAGING}/img/check-sample.png`
  : `${vagovprod}/img/check-sample.png`;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/forms_submit_claim`,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  transformForSubmit: transformTOEForm,
  trackingPrefix: 'toe-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990EMEB,
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
  getHelp: GetHelp,
  chapters: {
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        applicantInformation: {
          title: 'Your information',
          path: 'applicant-information',
          subTitle: 'Your information',
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    We have this personal information on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits,{' '}
                    <a href={YOUR_PROFILE_URL}>
                      update your information on your profile
                    </a>
                    .
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
            [formFields.parentGuardianSponsor]: {
              'ui:title': 'Parent / Guardian signature',
              'ui:options': {
                hideIf: formData =>
                  hideUnder18Field(formData, formFields.dateOfBirth),
              },
              'ui:required': formData =>
                !hideUnder18Field(formData, formFields.dateOfBirth),
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
              [formFields.parentGuardianSponsor]: {
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
        sponsorSelection: {
          title: 'Choose your sponsors',
          path: 'sponsor-selection',
          CustomPageReview: SelectedSponsorsReviewPage,
          depends: formData => formData.sponsors?.sponsors?.length,
          uiSchema: {
            'view:listOfSponsors': {
              'ui:description': (
                <>
                  <SponsorsSelectionHeadings />
                  <Sponsors />
                </>
              ),
            },
            [formFields.selectedSponsors]: {
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
              [formFields.selectedSponsors]: {
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
        sponsorInformation: {
          title: 'Enter your sponsor’s information',
          path: 'sponsor-information',
          depends: formData =>
            !formData.sponsors?.sponsors?.length ||
            formData.sponsors?.someoneNotListed,
          uiSchema: {
            'view:enterYourSponsorsInformationHeading': {
              'ui:description': (
                <h3 className="vads-u-margin-bottom--3">
                  Enter your sponsor’s information
                </h3>
              ),
            },
            'view:noSponsorWarning': {
              'ui:description': (
                <va-alert
                  class="vads-u-margin-bottom--5"
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">
                    We don’t have any sponsor information on file
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
                    sponsor’s information manually.
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
                  class="vads-u-margin-bottom--5"
                  close-btn-aria-label="Close notification"
                  status="warning"
                  visible
                >
                  <h3 slot="headline">Your selected sponsor isn’t on file</h3>
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
                    sponsor’s information manually.
                  </p>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData => !formData.sponsors?.sponsors?.length,
              },
            },
            [formFields.relationshipToServiceMember]: {
              'ui:title':
                'What’s your relationship to the Veteran or service member whose benefit has been transferred to you?',
              'ui:widget': 'radio',
            },
            'view:yourSponsorsInformationHeading': {
              'ui:description': <h4>Your sponsor’s information</h4>,
            },
            [formFields.sponsorFullName]: {
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
            [formFields.sponsorDateOfBirth]: {
              ...currentOrPastDateUI('Date of birth'),
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.relationshipToServiceMember,
              formFields.sponsorDateOfBirth,
            ],
            properties: {
              'view:enterYourSponsorsInformationHeading': {
                type: 'object',
                properties: {},
              },
              'view:noSponsorWarning': {
                type: 'object',
                properties: {},
              },
              'view:sponsorNotOnFileWarning': {
                type: 'object',
                properties: {},
              },
              [formFields.relationshipToServiceMember]: {
                type: 'string',
                enum: [SPONSOR_RELATIONSHIP.SPOUSE, SPONSOR_RELATIONSHIP.CHILD],
              },
              'view:yourSponsorsInformationHeading': {
                type: 'object',
                properties: {},
              },
              [formFields.sponsorFullName]: {
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
              [formFields.sponsorDateOfBirth]: date,
            },
          },
        },
        firstSponsorSelection: {
          title: 'Choose your first sponsor',
          path: 'first-sponsor',
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
            [formFields.firstSponsor]: {
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
            required: [formFields.firstSponsor],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              [formFields.firstSponsor]: {
                type: 'string',
              },
              'view:firstSponsorAdditionalInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        highSchool: {
          title: 'Verify your high school education',
          path: 'high-school',
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
        highSchoolGraduationDate: {
          title: 'Verify your high school graduation date',
          path: 'high-school-completion',
          depends: formData =>
            applicantIsChildOfSponsor(formData) &&
            formData[formFields.highSchoolDiploma] === 'Yes',
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
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        contactInformation: {
          title: 'Phone numbers and email address',
          path: 'phone-email',
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
                    We have this contact information on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to make changes to your
                    contact information for other VA benefits,{' '}
                    <GoToYourProfileLink text="update your information on your profile" />
                    .
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
          path: 'mailing-address',
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
                    We have this mailing address on file for you. If you notice
                    any errors, please correct them now. Any updates you make
                    will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to make changes to your
                    contact information for other VA benefits,{' '}
                    <GoToYourProfileLink text="update your information on your profile" />
                    .
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
                ...address.uiSchema('', false, null, true),
                country: {
                  'ui:title': 'Country',
                  'ui:required': formData =>
                    !formData['view:mailingAddress'].livesOnMilitaryBase,
                },
                street: {
                  'ui:title': 'Street address',
                  'ui:errorMessages': {
                    required: 'Please enter your full street address',
                  },
                  'ui:required': formData =>
                    !formData['view:mailingAddress'].livesOnMilitaryBase,
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
                  'ui:options': {
                    replaceSchema: formData => {
                      if (formData['view:mailingAddress'].livesOnMilitaryBase) {
                        return {
                          type: 'string',
                          title: 'APO/FPO',
                          enum: ['APO', 'FPO'],
                        };
                      }
                      return {
                        title: 'City',
                        type: 'string',
                        maxLength: 30,
                        pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
                      };
                    },
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
                    ...address.schema(fullSchema1990e, true),
                  },
                },
              },
            },
          },
        },
        preferredContactMethod: {
          title: 'Contact preferences',
          path: 'preferred-contact-method',
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
            [formFields.viewReceiveTextMessages]: {
              'ui:description': (
                <>
                  <div className="toe-form-page-only">
                    <h3>Choose how you want to get notifications</h3>
                    <p>
                      We recommend that you opt in to text message notifications
                      about your benefits. These notifications can prompt you to
                      verify your enrollment so you’ll receive your education
                      payments. You can verify your monthly enrollment easily
                      this way.
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
                          View Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a
                          href="/privacy-policy"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>
                        .
                      </>
                    </va-alert>
                  </div>
                </>
              ),
              [formFields.receiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications about your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field?.slice(0, 4).includes('Yes');
                    if (!isYes) {
                      return;
                    }

                    const { phone, isInternational } = formData[
                      formFields.viewPhoneNumbers
                    ][formFields.mobilePhoneNumber];

                    if (!phone) {
                      errors.addError(
                        'You can’t select that response because we don’t have a mobile phone number on file for you.',
                      );
                    } else if (isInternational) {
                      errors.addError(
                        'You can’t select that response because you have an international mobile phone number',
                      );
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
                  (formData[formFields.viewReceiveTextMessages][
                    formFields.receiveTextMessages
                  ] &&
                    !formData[formFields.viewReceiveTextMessages][
                      formFields.receiveTextMessages
                    ]
                      .slice(0, 4)
                      .includes('Yes')) ||
                  isValidPhoneField(
                    formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ],
                  ),
              },
            },
            'view:internationalTextMessageAlert': {
              'ui:description': (
                <va-alert status="warning">
                  <>
                    You can’t choose to get text notifications because you have
                    an international mobile phone number. At this time, we can
                    send text messages about your education benefits only to
                    U.S. mobile phone numbers.
                  </>
                </va-alert>
              ),
              'ui:options': {
                hideIf: formData =>
                  (formData[formFields.viewReceiveTextMessages][
                    formFields.receiveTextMessages
                  ] &&
                    !formData[formFields.viewReceiveTextMessages][
                      formFields.receiveTextMessages
                    ]
                      .slice(0, 4)
                      .includes('Yes')) ||
                  !isValidPhoneField(
                    formData[formFields.viewPhoneNumbers][
                      formFields.mobilePhoneNumber
                    ],
                  ) ||
                  !formData[formFields.viewPhoneNumbers][
                    formFields.mobilePhoneNumber
                  ]?.isInternational,
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
                <strong>Note</strong>: We make payments only through direct
                deposit, also called electronic funds transfer (EFT).
              </p>
            ),
            [formFields.bankAccount]: {
              ...bankAccountUI,
              'ui:order': [
                formFields.accountType,
                formFields.accountNumber,
                formFields.routingNumber,
              ],
              [formFields.accountType]: {
                ...bankAccountUI.accountType,
                'ui:errorMessages': {
                  required: 'Please select an account type',
                },
              },
              [formFields.accountNumber]: {
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
                required: [
                  formFields.accountType,
                  formFields.accountNumber,
                  formFields.routingNumber,
                ],
                properties: {
                  [formFields.accountType]: {
                    type: 'string',
                    enum: ['checking', 'savings'],
                  },
                  [formFields.routingNumber]: {
                    type: 'string',
                    pattern: '^\\d{9}$',
                  },
                  [formFields.accountNumber]: {
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
