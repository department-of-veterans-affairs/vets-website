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
import { VA_FORM_IDS } from 'platform/forms/constants';
import FormFooter from 'platform/forms/components/FormFooter';
import * as BUCKETS from 'site/constants/buckets';
import * as ENVIRONMENTS from 'site/constants/environments';

import manifest from '../manifest.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantIdentityWithModal from '../components/ApplicantIdentityWithModal';
import ApplicantInformationReviewPage from '../components/ApplicantInformationReviewPage';
import CustomEmailField from '../components/CustomEmailField';
import DirectDepositViewField from '../components/DirectDepositViewField';
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
import CustomPreSubmitInfo from '../components/CustomPreSubmitInfo';
import DuplicateContactInfoModal from '../components/DuplicateContactInfoModal';

import {
  addWhitespaceOnlyError,
  isOnlyWhitespace,
  prefillTransformer,
  applicantIsaMinor,
} from '../helpers';

import { transformTOEForm } from '../utils/form-submit-transform';

import { phoneSchema, phoneUISchema } from '../schema';
import {
  isValidPhoneField,
  validateAccountNumber,
  validateEmail,
  validateRoutingNumber,
} from '../utils/validation';
import { formFields } from '../constants';
import ObfuscateReviewField from '../ObfuscateReviewField';
import DirectDepositField from '../components/DirectDepositField';
import { createAddressFieldsUI } from '../helpers/addressUI';

const { date, email } = commonDefinitions;
const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];
const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

const mailingAddressSchema = address.schema(fullSchema1990e, true);

// Shared address UI configs for mailing and guardian address sections
const mailingAddressFieldsUI = createAddressFieldsUI('view:mailingAddress');
const guardianAddressFieldsUI = createAddressFieldsUI(
  'guardianMailingAddress',
  {
    streetErrors: {
      minLength: 'Please enter your full street address',
    },
    streetValidationMsg: 'You must provide a response',
    street2ValidationMsg: 'Please enter a valid street address line 2',
    cityErrors: { minLength: 'Please enter a valid city' },
    cityValidationMsg: 'You must provide a response',
    cityConstraints: { minLength: 2, maxLength: 20 },
    postalCodeErrors: { pattern: 'Please provide a valid postal code' },
    foreignPostalSchema: {
      pattern: '^[A-Z0-9 -]{3,10}$',
      minLength: 3,
      maxLength: 10,
    },
  },
);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/forms_submit_claim`,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  transformForSubmit: transformTOEForm,
  trackingPrefix: 'toe-',
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,
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
  preSubmitInfo: {
    CustomComponent: CustomPreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
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
            'view:applicantInformation': {
              'ui:description': ApplicantIdentityWithModal,
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
                  // If formData is empty, hide the alert
                  if (!formData) {
                    return true;
                  }

                  // Use applicantIsaMinor to determine if the alert should be hidden
                  return !applicantIsaMinor(formData);
                },
              },
            },
            [formFields.parentGuardianSponsor]: {
              'ui:title': 'Parent / Guardian signature',
              'ui:options': {
                hideIf: formData => {
                  // If formData is empty, hide the field
                  if (!formData) {
                    return true;
                  }

                  return !applicantIsaMinor(formData);
                },
              },
              'ui:required': formData => {
                // If formData is empty, the field is not required
                if (!formData) {
                  return false;
                }

                return applicantIsaMinor(formData);
              },
              'ui:validations': [
                (errors, field) => {
                  addWhitespaceOnlyError(
                    field,
                    errors,
                    'Please enter a parent/guardian signature',
                  );
                  if (field && field.length > 46) {
                    errors.addError('Signature must be 46 characters or less');
                  }
                },
              ],
              'ui:errorMessages': {
                required: 'Please enter a parent/guardian signature',
              },
            },
            [formFields.highSchoolDiploma]: {
              'ui:options': {
                hideIf: formData => {
                  if (!formData) {
                    return true;
                  }

                  return !applicantIsaMinor(formData);
                },
              },
              'ui:required': formData => {
                return applicantIsaMinor(formData);
              },
              'ui:title':
                'Did you earn a high school diploma or equivalency certificate?',
              'ui:widget': 'radio',
            },
            [formFields.highSchoolDiplomaDate]: {
              'ui:options': {
                hideIf: formData => {
                  if (!formData) {
                    return true;
                  }

                  return !(
                    applicantIsaMinor(formData) &&
                    formData[formFields.highSchoolDiploma] === 'Yes'
                  );
                },
              },
              'ui:required': formData => {
                return (
                  applicantIsaMinor(formData) &&
                  formData[formFields.highSchoolDiploma] === 'Yes'
                );
              },
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency certificate?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.highSchoolDiploma,
              formFields.highSchoolDiplomaDate,
            ],
            properties: {
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
              [formFields.highSchoolDiploma]: {
                type: 'string',
                enum: ['Yes', 'No'],
              },
              [formFields.highSchoolDiplomaDate]: date,
            },
          },
        },
      },
    },
    sponsorInformationChapter: {
      title: 'Sponsor information',
      pages: {
        sponsorSelection: {
          title: 'Choose your sponsor',
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
              'view:confirmDuplicateData': {
                type: 'object',
                properties: {},
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
              [formFields.address]: mailingAddressFieldsUI,
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
                  [formFields.address]: mailingAddressSchema,
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
                      Learn more about Enrollment Verifications
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
                      Learn more about Enrollment Verifications
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
                  const noDuplicates = formData?.duplicatePhone?.some(
                    entry => entry?.dupe === false,
                  );
                  const mobilePhone =
                    formData[(formFields?.viewPhoneNumbers)]?.[
                      formFields?.mobilePhoneNumber
                    ]?.phone;

                  // Return true if isYes is false, noDuplicates is true, or mobilePhone is undefined
                  return !isYes || noDuplicates || !mobilePhone;
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
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          uiSchema: {
            'ui:title': 'Direct deposit information',
            'ui:field': DirectDepositField,
            'ui:options': {
              hideLabelText: true,
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
              'ui:order': [
                'accountType',
                'routingNumber',
                'routingNumberConfirmation',
                'accountNumber',
                'accountNumberConfirmation',
              ],
              routingNumber: {
                ...bankAccountUI.routingNumber,
                'ui:errorMessages': {
                  pattern: 'Please enter a valid 9-digit routing number',
                },
                'ui:reviewField': ObfuscateReviewField,
                'ui:validations': [
                  validateRoutingNumber,
                  (errors, fieldData, formData) => {
                    const accountNumber =
                      formData[formFields.bankAccount]?.accountNumber;
                    if (
                      fieldData &&
                      accountNumber &&
                      fieldData === accountNumber
                    ) {
                      errors.addError(
                        'Your bank routing number and bank account number cannot match',
                      );
                    }
                  },
                ],
              },
              routingNumberConfirmation: {
                'ui:title': 'Confirm bank routing number',
                'ui:reviewField': ObfuscateReviewField,
                'ui:required': formData =>
                  formData?.mebBankInfoConfirmationField === true,
                'ui:options': {
                  hideIf: formData =>
                    formData?.mebBankInfoConfirmationField !== true,
                },
                'ui:errorMessages': {
                  pattern: 'Please enter a valid 9-digit routing number',
                },
                'ui:validations': [
                  (errors, fieldData, formData) => {
                    if (formData?.mebBankInfoConfirmationField === true) {
                      const routingNumber =
                        formData[formFields.bankAccount]?.routingNumber;
                      if (
                        fieldData &&
                        routingNumber &&
                        fieldData !== routingNumber
                      ) {
                        errors.addError('Your bank routing number must match');
                      }
                    }
                  },
                ],
              },
              accountNumber: {
                ...bankAccountUI.accountNumber,
                'ui:errorMessages': {
                  pattern:
                    'Please enter a valid 5-17 digit bank account number',
                },
                'ui:reviewField': ObfuscateReviewField,
                'ui:title': 'Bank account number',
                'ui:validations': [
                  validateAccountNumber,
                  (errors, fieldData, formData) => {
                    const routingNumber =
                      formData[formFields.bankAccount]?.routingNumber;
                    if (
                      fieldData &&
                      routingNumber &&
                      fieldData === routingNumber
                    ) {
                      errors.addError(
                        'Your bank routing number and bank account number cannot match',
                      );
                    }
                  },
                ],
              },
              accountNumberConfirmation: {
                'ui:title': 'Confirm bank account number',
                'ui:reviewField': ObfuscateReviewField,
                'ui:required': formData =>
                  formData?.mebBankInfoConfirmationField === true,
                'ui:options': {
                  hideIf: formData =>
                    formData?.mebBankInfoConfirmationField !== true,
                },
                'ui:errorMessages': {
                  pattern:
                    'Please enter a valid 5-17 digit bank account number',
                },
                'ui:validations': [
                  (errors, fieldData, formData) => {
                    if (formData?.mebBankInfoConfirmationField === true) {
                      const accountNumber =
                        formData[formFields.bankAccount]?.accountNumber;
                      if (
                        fieldData &&
                        accountNumber &&
                        fieldData !== accountNumber
                      ) {
                        errors.addError('Your bank account number must match');
                      }
                    }
                  },
                ],
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
                    style={{ marginTop: '0.625rem' }}
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
                  accountType: {
                    type: 'string',
                    enum: ['Checking', 'Savings'],
                  },
                  routingNumber: {
                    type: 'string',
                    pattern: '^[\\d*]{5}\\d{4}$',
                  },
                  routingNumberConfirmation: {
                    type: 'string',
                    pattern: '^[\\d*]{5}\\d{4}$',
                  },
                  accountNumber: {
                    type: 'string',
                    pattern: '^[\\d*]{5,17}$',
                  },
                  accountNumberConfirmation: {
                    type: 'string',
                    pattern: '^[\\d*]{5,17}$',
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
    guardianInformationChapter: {
      title: 'Parent/guardian/custodian information',
      pages: {
        guardianName: {
          path: 'guardian-name',
          title: 'Your parent/guardian/custodian’s name',
          depends: formData =>
            applicantIsaMinor(formData) && formData?.mebParentGuardianStep,
          uiSchema: {
            'ui:description': (
              <>
                <h3>Your parent/guardian/custodian’s name</h3>
                <p>
                  You and your parent/guardian/custodian should fill out their
                  personal information below.
                </p>
              </>
            ),
            [formFields.guardianFirstName]: {
              'ui:title': 'First name',
              'ui:errorMessages': {
                pattern:
                  'Please enter a valid entry. Acceptable entries are letters, spaces, hyphens and apostrophes.',
                required:
                  'Please enter your parent/guardian/custodian first name.',
              },
              'ui:validations': [
                (errors, field) => {
                  if (field[0] === ' ' || isOnlyWhitespace(field)) {
                    errors.addError(
                      'First character must be a letter with no leading space.',
                    );
                  }
                },
              ],
            },
            [formFields.guardianMiddleName]: {
              'ui:title': 'Middle name',
              'ui:errorMessages': {
                pattern:
                  'Please enter a valid entry. Acceptable entries are letters, spaces, hyphens and apostrophes.',
              },
              'ui:validations': [
                (errors, field) => {
                  if (field[0] === ' ' || isOnlyWhitespace(field)) {
                    errors.addError(
                      'First character must be a letter with no leading space.',
                    );
                  }
                },
              ],
            },
            [formFields.guardianLastName]: {
              'ui:title': 'Last or family name',
              'ui:errorMessages': {
                pattern:
                  'Please enter a valid entry. Acceptable entries are letters, spaces, hyphens and apostrophes.',
                required:
                  'Please enter your parent/guardian/custodian last or family name.',
              },
              'ui:validations': [
                (errors, field) => {
                  if (field[0] === ' ' || isOnlyWhitespace(field)) {
                    errors.addError(
                      'First character must be a letter with no leading space.',
                    );
                  }
                },
              ],
            },
            [formFields.guardianNameSuffix]: {
              'ui:title': 'Suffix',
              'ui:placeholder': '- Select -',
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.guardianFirstName,
              formFields.guardianLastName,
            ],
            properties: {
              [formFields.guardianFirstName]: {
                type: 'string',
                pattern: "^[a-zA-Z '-]{1,20}$",
                maxLength: 20,
              },
              [formFields.guardianMiddleName]: {
                type: 'string',
                pattern: "^[a-zA-Z '-]{1,20}$",
                maxLength: 20,
              },
              [formFields.guardianLastName]: {
                type: 'string',
                pattern: "^[a-zA-Z '-]{2,26}$",
                maxLength: 26,
              },
              [formFields.guardianNameSuffix]: {
                type: 'string',
                enum: ['II', 'III', 'IV', 'Jr.', 'Sr.'],
              },
            },
          },
        },
        guardianMailingAddress: {
          path: 'guardian-mailing-address',
          title: 'Your parent/guardian/custodian’s mailing address',
          depends: formData =>
            applicantIsaMinor(formData) && formData?.mebParentGuardianStep,
          uiSchema: {
            'ui:description': (
              <>
                <h3>Your parent/guardian/custodian’s mailing address</h3>
                <p>
                  You and your parent/guardian/custodian should fill out their
                  contact information below.
                </p>
              </>
            ),
            guardianMailingAddress: {
              livesOnMilitaryBase: {
                'ui:title': (
                  <span id="LiveOnMilitaryBaseTooltip">
                    I live on a United States military base outside of the
                    country
                  </span>
                ),
                'ui:reviewField': YesNoReviewField,
              },
              'view:livesOnMilitaryBaseInfo': {
                'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
              },
              [formFields.address]: guardianAddressFieldsUI,
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              guardianMailingAddress: {
                type: 'object',
                properties: {
                  livesOnMilitaryBase: {
                    type: 'boolean',
                  },
                  'view:livesOnMilitaryBaseInfo': {
                    type: 'object',
                    properties: {},
                  },
                  [formFields.address]: {
                    ...mailingAddressSchema,
                    properties: {
                      ...mailingAddressSchema.properties,
                      street: {
                        ...mailingAddressSchema.properties.street,
                        minLength: 3,
                        maxLength: 40,
                      },
                      street2: {
                        ...mailingAddressSchema.properties.street2,
                        maxLength: 40,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
