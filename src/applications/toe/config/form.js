import React from 'react';
import { createSelector } from 'reselect';
import { Link } from 'react-router';

import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import * as address from 'platform/forms/definitions/address';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import get from 'platform/utilities/data/get';
import { isValidCurrentOrPastDate } from 'platform/forms-system/src/js/utilities/validations';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import { VA_FORM_IDS } from 'platform/forms/constants';
import FormFooter from 'platform/forms/components/FormFooter';

import constants from 'vets-json-schema/dist/constants.json';
import * as BUCKETS from 'site/constants/buckets';
import * as ENVIRONMENTS from 'site/constants/environments';

import manifest from '../manifest.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

import ApplicantIdentityView from '../components/ApplicantIdentityView';
import ApplicantInformationReviewPage from '../components/ApplicantInformationReviewPage.jsx';
import DirectDepositViewField from '../components/DirectDepositViewField';
import EmailReviewField from '../components/EmailReviewField';
import EmailViewField from '../components/EmailViewField';
import FirstSponsorRadioGroup from '../components/FirstSponsorRadioGroup';
import FirstSponsorReviewPage from '../components/FirstSponsorReviewPage';
import GetHelp from '../components/GetHelp';
import GoToYourProfileLink from '../components/GoToYourProfileLink';
import LearnMoreAboutMilitaryBaseTooltip from '../components/LearnMoreAboutMilitaryBaseTooltip';
import MailingAddressViewField from '../components/MailingAddressViewField';
import SelectedSponsorsReviewPage from '../components/SelectedSponsorsReviewPage';
import SponsorCheckboxGroup from '../components/SponsorsCheckboxGroup';
import Sponsors from '../components/Sponsors';
import SponsorsSelectionHeadings from '../components/SponsorsSelectionHeadings';
import YesNoReviewField from '../components/YesNoReviewField';
import preSubmitInfo from '../components/preSubmitInfo';

import {
  addWhitespaceOnlyError,
  applicantIsChildOfSponsor,
  hideUnder18Field,
  isOnlyWhitespace,
  prefillTransformer,
} from '../helpers';

import { transformTOEForm } from '../utils/form-submit-transform';

import { phoneSchema, phoneUISchema } from '../schema';
import {
  isValidGivenName,
  isValidLastName,
  isValidPhoneField,
  nameErrorMessage,
  validateAccountNumber,
  validateEmail,
  validateRoutingNumber,
} from '../utils/validation';
import {
  formFields,
  SPONSOR_RELATIONSHIP,
  YOUR_PROFILE_URL,
} from '../constants';
import ObfuscateReviewField from '../ObfuscateReviewField';

const { fullName, date, email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

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
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for survivor dependent benefits.',
    noAuth:
      'Please sign in again to continue your application for survivor dependent benefits.',
  },
  defaultDefinitions: {},
  footerContent: FormFooter,
  getHelp: GetHelp,
  preSubmitInfo,
  chapters: {
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        applicantInformation: {
          title: 'Your information',
          path: 'applicant-information',
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
              'ui:options': {
                hideIf: formData =>
                  formData.showMebEnhancements06 && formData.isLOA3,
              },
            },
            'view:applicantInformation': {
              'ui:options': {
                hideIf: formData =>
                  !formData.showMebEnhancements06 || !formData.isLOA3,
              },
              'ui:description': (
                <>
                  <ApplicantIdentityView />
                </>
              ),
            },
            [formFields.viewUserFullName]: {
              'ui:options': {
                hideIf: formData =>
                  formData.showMebEnhancements06 && formData.isLOA3,
              },
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
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:title': 'Your first name',
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidGivenName(field)) {
                        errors.addError(nameErrorMessage(20));
                      }
                    },
                  ],
                },
                middle: {
                  ...fullNameUI.middle,
                  'ui:options': {
                    hideIf: formData => formData.showMebEnhancements06,
                  },
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:title': 'Your middle name',
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidGivenName(field)) {
                        errors.addError(nameErrorMessage(20));
                      }
                    },
                  ],
                },
                last: {
                  ...fullNameUI.last,
                  'ui:options': {
                    hideIf: formData => formData.showMebEnhancements06,
                  },
                  'ui:required': formData => !formData?.showMebEnhancements06,
                  'ui:title': 'Your last name',
                  'ui:validations': [
                    (errors, field) => {
                      if (!isValidLastName(field)) {
                        errors.addError(nameErrorMessage(26));
                      }
                    },
                  ],
                },
              },
            },
            [formFields.dateOfBirth]: {
              'ui:options': {
                hideIf: formData =>
                  formData.showMebEnhancements06 && formData.isLOA3,
              },
              'ui:required': formData => !formData?.showMebEnhancements06,
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
              [formFields.viewUserFullName]: {
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
              'view:dateOfBirthUnder18Alert': {
                type: 'object',
                properties: {},
              },
              'view:applicantInformation': {
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
            formData.showMebEnhancements08
              ? false
              : !formData.sponsors?.sponsors?.length ||
                formData.sponsors?.someoneNotListed,
          uiSchema: {
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
                    <a href="https://milconnect.dmdc.osd.mil/milconnect/">
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
                    <a href="https://milconnect.dmdc.osd.mil/milconnect/">
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
            'view:enterYourSponsorsInformationHeading': {
              'ui:description': (
                <h3 className="vads-u-margin-bottom--3">
                  Enter your sponsor’s information
                </h3>
              ),
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
              'view:noSponsorWarning': {
                type: 'object',
                properties: {},
              },
              'view:sponsorNotOnFileWarning': {
                type: 'object',
                properties: {},
              },
              'view:enterYourSponsorsInformationHeading': {
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
                  <h3>Verify your high school education</h3>
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
                  <h3>Verify your high school education</h3>
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
                required: [formFields.email, 'confirmEmail'],
                properties: {
                  email,
                  confirmEmail: email,
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
            [formFields.viewMailingAddress]: {
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
                  'ui:disabled': formData =>
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
                    formData['view:mailingAddress']?.livesOnMilitaryBase ||
                    formData['view:mailingAddress']?.address?.country === 'USA',
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
                          pathname: 'phone-email',
                          search: '?redirect',
                        }}
                      >
                        <va-button
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
                    return !!formData['view:phoneNumbers']?.mobilePhoneNumber
                      ?.phone;
                  },
                },
              },
              [formFields.receiveTextMessages]: {
                'ui:title':
                  'Would you like to receive text message notifications about your education benefits?',
                'ui:widget': 'radio',
                'ui:validations': [
                  (errors, field, formData) => {
                    const isYes = field.slice(0, 4).includes('Yes');
                    const phoneExist = !!formData[formFields.viewPhoneNumbers]
                      .mobilePhoneNumber.phone;
                    const { isInternational } = formData[
                      formFields.viewPhoneNumbers
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
                  'view:noMobilePhoneAlert': {
                    type: 'object',
                    properties: {},
                  },
                  [formFields.receiveTextMessages]: {
                    type: 'string',
                    enum: [
                      'Yes, send me text message notifications',
                      'No, just send me email notifications',
                    ],
                  },
                },
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
          title: 'Direct deposit',
          uiSchema: {
            title: 'direct deposit',
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
              viewComponent: DirectDepositViewField,
              volatileData: true,
            },
            'ui:description': (
              <p>
                We make payments only through direct deposit, also called
                electronic funds transfer (EFT).
              </p>
            ),
            [formFields.bankAccount]: {
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
                'ui:title': 'Bank account number',
                'ui:validations': [validateAccountNumber],
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
              bankAccount: {
                type: 'object',
                required: [
                  formFields.accountType,
                  formFields.accountNumber,
                  formFields.routingNumber,
                ],
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
