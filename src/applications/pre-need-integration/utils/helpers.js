import React from 'react';
import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import * as Sentry from '@sentry/browser';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullNameUI from 'platform/forms/definitions/fullName';
import {
  ssnUI,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { countries } from 'platform/forms/address';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

import {
  stringifyFormReplacer,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';

import environment from 'platform/utilities/environment';
import { useSelector } from 'react-redux';
import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import ApplicantDescription from 'platform/forms/components/ApplicantDescription';
import jsonData from './Military Ranks.json';
import { serviceLabels } from './labels';
import RaceEthnicityReviewField from '../components/RaceEthnicityReviewField';
import ServicePeriodView from '../components/ServicePeriodView';
import CurrentlyBuriedDescription from '../components/CurrentlyBuriedDescription';
import { rankLabels } from './rankLabels';

export const envUrl = environment.API_URL;

export const nonRequiredFullNameUI = omit('required', fullNameUI);

export const veteranApplicantDetailsSubHeader = (
  <div className="applicantDetailsSubHeader">
    <h3 className="vads-u-font-size--h3">Your details</h3>
  </div>
);

export function veteranApplicantDetailsSummary({ formContext }) {
  return (
    <>
      {formContext.isLoggedIn &&
        !formContext.onReviewPage && (
          <div className="veteranApplicantDetailsSummaryBox">
            <va-summary-box>
              <p className="veteranApplicantDetailsSummaryBoxText">
                We’ve prefilled some of your information from your account. If
                you need to correct anything, you can edit the form fields
                below.
              </p>
            </va-summary-box>
          </div>
        )}
    </>
  );
}

export const veteranApplicantDetailsPreparerSubHeader = (
  <div className="applicantDetailsSubHeader">
    <h3>Applicant details</h3>
  </div>
);

export const nonVeteranApplicantDetailsSubHeader = (
  <div className="applicantDetailsSubHeader">
    <h3>Your details</h3>
  </div>
);

export function ApplicantDescriptionWrapper({ formContext }) {
  return (
    <div className="ApplicantDescriptionWrapper">
      <ApplicantDescription formContext={formContext} />
    </div>
  );
}

export function CurrentlyBurriedPersonsDescriptionWrapper({ formContext }) {
  return (
    <div className="currentlyBuriedDescription">
      {!formContext?.onReviewPage && <CurrentlyBuriedDescription />}
    </div>
  );
}

export const currentlyBuriedPersonsTitle = <h3>Name of deceased person(s)</h3>;

export const sponsorDeceasedDescription = (
  <div className="sponsorDeceasedDescriptionNotProd">
    <p>
      We’ll ask you questions about your sponsor’s death. We understand that the
      questions may be difficult to answer, but your answers will help us
      determine eligibility for your application.
    </p>
  </div>
);

export function isApplicantTheSponsor(item) {
  return get('application.applicant.isSponsor', item) === 'yes';
}

export function sponsorDetailsSubHeader({ formContext, formData }) {
  return (
    <>
      {isApplicantTheSponsor(formData) &&
        !formContext.onReviewPage && (
          <div className="sponsorDetailsSummaryBox">
            <va-summary-box>
              <p className="sponsorDetailsSummaryBoxText">
                We’ve prefilled your details since you indicated you’re the
                applicant’s sponsor. If you need to correct anything, you can
                edit the fields below.
              </p>
            </va-summary-box>
          </div>
        )}
      <div className="sponsorDetailsSubHeader">
        <h3>Sponsor details</h3>
      </div>
    </>
  );
}

export const sponsorDetailsGuidingText = (
  <div className="sponsorDetailsGuidingText">
    <p>
      Provide the details for the Veteran or service member the applicant is
      connected to.
    </p>
  </div>
);

export const sponsorDemographicsSubHeader = (
  <div className="sponsorDemographicsSubHeader">
    <h3>Sponsor demographics</h3>
  </div>
);

export const sponsorDemographicsDescription = (
  <div className="sponsorDemographicsDescription">
    <p>
      We require demographic information as part of this application. We use
      this information for statistical purposes only.
    </p>
  </div>
);

export const sponsorDeceasedSubheader = (
  <div className="sponsorDeceasedSubheader">
    <p>Has the sponsor died?</p>
  </div>
);

export const sponsorDateOfDeathSubheader = (
  <div className="sponsorDateOfDeathSubheader">
    <p>When did the sponsor die?</p>
  </div>
);

export const sponsorMilitaryDetailsSubHeader = (
  <div className="sponsorMilitaryDetailsSubHeader">
    <h3>Sponsor’s military details</h3>
  </div>
);

export const applicantDemographicsSubHeader = (
  <div className="applicantDemographicsSubHeader">
    <h3>Your demographics</h3>
  </div>
);

export const applicantDemographicsPreparerSubHeader = (
  <div className="applicantDemographicsSubHeader">
    <h3>Applicant demographics</h3>
  </div>
);

export const applicantDemographicsDescription = (
  <div className="applicantDemographicsDescription">
    <p>
      We require demographic information as part of this application. We use
      this information for statistical purposes only.
    </p>
  </div>
);

export function militaryDetailsSubHeader(formData) {
  return (
    <div className="militaryDetailsSubHeader">
      {get('applicant.applicantRelationshipToClaimant', formData.formData) ===
      'Authorized Agent/Rep' ? (
        <h3>Applicant’s military details</h3>
      ) : (
        <h3>Your military details</h3>
      )}
    </div>
  );
}

export function militaryDetailsReviewHeader(formData) {
  return get(
    'application.applicant.applicantRelationshipToClaimant',
    formData,
  ) === 'Authorized Agent/Rep'
    ? `Applicant’s military details`
    : `Your military details`;
}

export function previousNameReviewHeader(formData) {
  return get(
    'application.applicant.applicantRelationshipToClaimant',
    formData,
  ) === 'Authorized Agent/Rep'
    ? `Applicant’s previous name`
    : `Your previous name`;
}

export const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) {
    payload.append('password', password);
  }
  return payload;
};

export function parseResponse({ data }) {
  const { name } = data.attributes;
  const focusFileCard = () => {
    const target = $$('.schemaform-file-list li').find(entry =>
      entry.textContent?.trim().includes(name),
    );

    if (target) {
      focusElement(target);
    }
  };

  setTimeout(() => {
    focusFileCard();
  }, 100);

  return {
    name,
    confirmationCode: data.attributes.confirmationCode,
  };
}

export const contactInfoDescription = (
  <va-additional-info trigger="Why do we need your contact information?">
    <p>
      We may contact you by phone if we need more information about your
      application.
    </p>
    <p>
      You can also provide your email address to receive updates about new
      openings in VA national cemeteries or other burial benefits.
    </p>
  </va-additional-info>
);

export const applicantInformationDescription = (
  <va-additional-info trigger="Who we consider an adult dependent child">
    <p>
      We consider someone an adult dependent child if either of these
      descriptions is true:
    </p>
    <ul>
      <>
        <li>
          They became permanently physically or mentally disabled and unable to
          support themselves before the age of 21, <strong>or</strong>
        </li>
        <li>
          They became permanently physically or mentally disabled and unable to
          support themselves before the age of 23, if they were enrolled full
          time in a school or training program at the time their disability
          started
          <br />
        </li>
      </>
    </ul>
    <p>
      <strong>Note:</strong> Adult dependent children must be unmarried to be
      eligible for burial in a VA national cemetery.
    </p>
  </va-additional-info>
);

export const veteranApplicantDetailsPreparerDescription =
  'Provide the details for the person you’re filling out the application for (called the applicant).';

export const nonVeteranApplicantDetailsDescription =
  "Since you're applying for eligibility determination, first we'll ask for your details. Then we'll ask for the details for the Veteran or service member you’re connected to.";

export const nonVeteranApplicantDetailsDescriptionPreparer =
  'Provide the details for the person you are filling out the application for (called the applicant). Then we’ll ask for the details for the Veteran or service member the applicant is connected to.';

export const applicantContactInfoAddressTitle = (
  <div>
    <h3>Your mailing address</h3>
  </div>
);

export const applicantEditAddressTitleLoggedIn = (
  <div>
    <va-alert status="info" slim class="vads-u-margin-bottom--2">
      <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
        Any changes you make will also be reflected on your VA.gov profile.
      </p>
    </va-alert>
    <h3>Edit your mailing address</h3>
  </div>
);

export const applicantEditAddressDescriptionLoggedIn = (
  <p className="vads-u-margin-top--0">
    We may mail information about your application to the address you provide
    here.
  </p>
);

export const applicantContactInfoPreparerAddressTitle = (
  <div>
    <h3>Applicant mailing address</h3>
  </div>
);

export const applicantContactDetailsTitle = (
  <div>
    <h3>Your contact details</h3>
  </div>
);

export const applicantContactDetailsPreparerTitle = (
  <div>
    <h3>Applicant’s contact details</h3>
  </div>
);

export const applicantContactInfoSubheader = (
  <div className="applicantContactInfoSubheader">
    <h3>Your contact details</h3>
  </div>
);

export const applicantContactInfoPreparerSubheader = (
  <div className="applicantContactInfoPreparerSubheader">
    <h3>Applicant’s contact details</h3>
  </div>
);

export const sponsorContactInfoSubheader = (
  <div className="sponsorContactInfoSubheader">
    <h3>Sponsor’s contact details</h3>
  </div>
);

export const bottomPadding = <div className="bottomPadding" />;

export const applicantContactInfoDescription = (
  <va-additional-info trigger="Why we ask for your contact details">
    <p>
      Once you’ve submitted this application, we’ll send you an email
      confirmation. We may contact you by phone or mail if we need more
      information about this application.
    </p>
  </va-additional-info>
);

export const applicantContactInfoPreparerDescription = <p />;

export const sponsorContactInfoDescription = (
  <va-additional-info trigger="Why we ask for contact details">
    <p>
      We may contact the sponsor by phone or mail if we need more information
      about this application.
    </p>
  </va-additional-info>
);

export const PreparerPhoneNumberDescription = (
  <va-additional-info trigger="Why we ask for your contact details">
    <p>
      Once you’ve submitted the application, we’ll send you an email
      confirmation. We may contact you by phone or mail if we need more
      information about this application.
    </p>
  </va-additional-info>
);

export const veteranRelationshipDescription = (
  <va-alert
    status="info"
    background-only
    role="status"
    id="veteran-relationship"
  >
    You’re applying as the <strong>service member or Veteran</strong>. We’ll ask
    you questions about your military status and history to determine if you
    qualify for burial in a VA national cemetery.
  </va-alert>
);

export const authorizedAgentDescription = (
  // TODO va-additional-info component to be replaced with a more optimal solution
  <va-additional-info trigger="What to know if you’re filling out this application for someone else">
    <p>
      One of these descriptions must be true for the applicant (the person
      you’re filling out this application for):
    </p>
    <ul>
      <>
        <li>
          They have an illness, injury, or other health condition that prevents
          them from making decisions for themselves or providing the information
          needed to complete forms, <strong>or</strong>
        </li>
        <li>They physically can’t sign the application</li>
      </>
    </ul>
  </va-additional-info>
);

export const isSponsorDescription = (
  // TODO va-additional-info component to be replaced with a more optimal solution
  <va-additional-info trigger="What it means to be the “sponsor”">
    <p>
      You’re the sponsor if you’re the Veteran or service member who the
      applicant is connected to.
    </p>
    <br />
    <p>
      If you’re not the sponsor, you’ll still need to provide the details for
      the Veteran or service member who the applicant is connected to.
    </p>
  </va-additional-info>
);

export const spouseRelationshipDescription = (
  <va-alert
    status="info"
    background-only
    role="status"
    id="spouse-relationship"
  >
    You’re applying as the{' '}
    <strong>legally married spouse or surviving spouse</strong> of the service
    member or Veteran who’s your sponsor. We’ll ask you questions about your
    sponsor’s military status and history to determine if you qualify for burial
    in a VA national cemetery.
  </va-alert>
);

export const childRelationshipDescription = (
  <va-alert status="info" background-only role="status" id="child-relationship">
    You’re applying as the <strong>unmarried adult child</strong> of the service
    member or Veteran who’s your sponsor. We’ll ask you questions about your
    sponsor’s military status and history to determine if you qualify for burial
    in a VA national cemetery. You’ll also need to provide supporting documents
    with information about your disability.
  </va-alert>
);

export const otherRelationshipDescription = (
  <va-alert status="info" background-only role="status" id="other-relationship">
    You’re applying on <strong>behalf</strong> of the service member or Veteran
    who’s your sponsor. We’ll ask you questions about your sponsor’s military
    status and history to determine if they qualify for burial in a VA national
    cemetery.
  </va-alert>
);

export const sponsorMilitaryStatusDescription = (
  <va-alert status="info" background-only>
    If you’re not sure what your sponsor’s status is—or if it isn’t listed
    here—don’t worry. You can upload supporting documents showing your sponsor’s
    service history later in this application.
  </va-alert>
);

export const desiredCemeteryNoteDescriptionSelfVeteran = (
  <p>
    <strong>Note:</strong> This doesn’t guarantee you’ll be buried in your
    preferred cemetery, but we’ll try to fulfill your wishes. If space is
    unavailable, we’ll work with your family to assign a gravesite in a cemetery
    with available space at the time of need.
  </p>
);

export const desiredCemeteryNoteDescriptionPreparerVeteran = (
  <p>
    <strong>Note:</strong> This doesn’t guarantee the applicant will be buried
    in their preferred cemetery, but we’ll try to fulfill their wishes. If space
    is unavailable, we’ll work with their family to assign a gravesite in a
    cemetery with available space at the time of need.
  </p>
);

export const desiredCemeteryNoteDescriptionSelfNonVeteran = (
  <p>
    <strong>Note:</strong> This doesn’t guarantee you’ll be buried in your
    preferred cemetery, but we’ll try to fulfill your wishes. If space is
    unavailable, we’ll work with your family to assign a gravesite in a cemetery
    with available space at the time of need.
  </p>
);

export const desiredCemeteryNoteDescriptionPreparerNonVeteran = (
  <p>
    <strong>Note:</strong> This doesn’t guarantee the applicant will be buried
    in their preferred cemetery, but we’ll try to fulfill their wishes. If space
    is unavailable, we’ll work with their family to assign a gravesite in a
    cemetery with available space at the time of need.
  </p>
);

export const relationshipToVetTitle =
  'What’s your relationship to the Veteran or service member you’re connected to?';

export const relationshipToVetPreparerTitle =
  'What’s the applicant’s relationship to the Veteran or service member they’re connected to?';

export const relationshipToVetDescription = '';

export const relationshipToVetPreparerDescription =
  'You told us you’re filling out this application for someone else. Now we’ll ask you about their details (the applicant).';

export function getRelationshipToVetOptions(option1) {
  return {
    labels: {
      veteran: option1,
      husband: 'Husband',
      wife: 'Wife',
      daughter: 'Adult dependent daughter',
      son: 'Adult dependent son',
      stepdaughter: 'Adult dependent stepdaughter',
      stepson: 'Adult dependent stepson',
      other: 'Other',
    },
    widgetProps: {
      veteran: { 'aria-describedby': 'veteran-relationship' },
      husband: { 'aria-describedby': 'spouse-relationship' },
      wife: { 'aria-describedby': 'spouse-relationship' },
      daughter: { 'aria-describedby': 'child-relationship' },
      son: { 'aria-describedby': 'child-relationship' },
      stepdaughter: { 'aria-describedby': 'child-relationship' },
      stepson: { 'aria-describedby': 'child-relationship' },
      other: { 'aria-describedby': 'other-relationship' },
    },
  };
}

export const relationshipToVetOptions = getRelationshipToVetOptions(
  'I’m the Veteran or service member',
);

export const relationshipToVetPreparerOptions = getRelationshipToVetOptions(
  'Applicant is the Veteran or service member',
);

export const applicantDetailsCityTitle = 'Your birth city';

export const applicantDetailsStateTitle = 'Your birth state';

export const applicantDetailsPreparerCityTitle = 'Applicant’s birth city';

export const applicantDetailsPreparerStateTitle = 'Applicant’s birth state';

export const applicantDemographicsGenderTitle = 'What’s your sex?';

export const applicantDemographicsMaritalStatusTitle =
  'What’s your marital status?';

export const applicantDemographicsPreparerGenderTitle =
  'What’s the applicant’s sex?';

export const applicantDemographicsPreparerMaritalStatusTitle =
  'What’s the applicant’s marital status?';

export const applicantDemographicsEthnicityTitle = 'What’s your ethnicity? ';

export const applicantDemographicsRaceTitle = 'What’s your race?';

export const applicantDemographicsPreparerEthnicityTitle =
  'What’s the applicant’s ethnicity?';

export const applicantDemographicsPreparerRaceTitle =
  'What’s the applicant’s race?';

export function preparerAddressHasState(item) {
  const country = get(
    'application.applicant.view:applicantInfo.mailingAddress.country',
    item,
  );
  const countriesWithStates = ['USA', 'CAN'];
  return countriesWithStates.includes(country);
}

export function applicantsMailingAddressHasState(item) {
  const country = get('application.claimant.address.country', item);
  const countriesWithStates = ['USA', 'CAN'];
  return countriesWithStates.includes(country);
}

export function sponsorMailingAddressHasState(item) {
  const country = get('application.veteran.address.country', item);
  const countriesWithStates = ['USA', 'CAN'];
  return countriesWithStates.includes(country);
}

export function isVeteran(item) {
  const response =
    get('application.claimant.relationshipToVet', item) ||
    get('formData.application.claimant.relationshipToVet', item);
  return response === 'veteran';
}

export function isSponsorDeceased(item) {
  return get('application.veteran.isDeceased', item) === 'yes';
}

export function isSpouse(item) {
  const relationshipToVet = get('application.claimant.relationshipToVet', item);
  return relationshipToVet === 'husband' || relationshipToVet === 'wife';
}

export function isUnmarriedChild(item) {
  const relationshipToVet = get('application.claimant.relationshipToVet', item);
  return (
    relationshipToVet === 'daughter' ||
    relationshipToVet === 'son' ||
    relationshipToVet === 'stepdaughter' ||
    relationshipToVet === 'stepson'
  );
}

export function isVeteranAndHasServiceName(item) {
  return (
    isVeteran(item) &&
    get('application.veteran.view:hasServiceName', item) === true
  );
}

export function isNotVeteranAndHasServiceName(item) {
  return (
    !isVeteran(item) &&
    get('application.veteran.view:hasServiceName', item) === true
  );
}

export function buriedWSponsorsEligibility(item) {
  return get('application.hasCurrentlyBuried', item) === '1';
}

export function isAuthorizedAgent(item) {
  return (
    get('application.applicant.applicantRelationshipToClaimant', item) ===
    'Authorized Agent/Rep'
  );
}

export function requiresSponsorInfo(item) {
  const sponsor = item['view:sponsor'];
  return sponsor === undefined || sponsor === 'Other';
}

export function hasServiceRecord(item) {
  const serviceRecords =
    get('serviceRecords', item) || get('formData.serviceRecords', item);
  return !(serviceRecords === undefined || serviceRecords.length === 0);
}

export function hasDeceasedPersons(item) {
  const deceasedPersons =
    get('currentlyBuriedPersons', item) ||
    get('formData.currentlyBuriedPersons', item);
  return !(deceasedPersons === undefined || deceasedPersons.length === 0);
}

export function formatName(name) {
  const { first, middle, last, suffix } = name;
  return (
    (first || last) &&
    `${first} ${middle ? `${middle} ` : ''}${last}${
      suffix ? `, ${suffix}` : ''
    }`
  );
}

export function claimantHeader({ formData }) {
  const name = formatName(formData.claimant.name);
  return <h4 className="highlight">{name}</h4>;
}

export function transform(formConfig, form) {
  // Copy over sponsor data if the claimant is the veteran.
  const populateSponsorData = application =>
    isVeteran({ application })
      ? merge({}, application, {
          veteran: {
            address: application.claimant.address,
            currentName: application.claimant.name,
            dateOfBirth: application.claimant.dateOfBirth,
            ssn: application.claimant.ssn,
            isDeceased: 'no',
            serviceName:
              // eslint-disable-next-line no-nested-ternary
              application.veteran.serviceName === undefined
                ? application.claimant.name
                : application.veteran.serviceName.first === undefined
                  ? application.claimant.name
                  : application.veteran.serviceName ||
                    application.claimant.name,
          },
        })
      : application;

  // Copy over preparer data if the claimant is the applicant.
  const populatePreparerData = application =>
    !isAuthorizedAgent({ application })
      ? merge({}, application, {
          applicant: {
            mailingAddress: application.claimant.address,
            name: application.claimant.name,
          },
        })
      : application;

  // Copy over veteran data if a sponsor is filling out the form
  const populateVeteranData = application =>
    merge({}, application, {
      veteran: {
        serviceName:
          // eslint-disable-next-line no-nested-ternary
          application.veteran.serviceName === undefined
            ? application.veteran.currentName
            : application.veteran.serviceName.first === undefined
              ? application.veteran.currentName
              : application.veteran.serviceName ||
                application.veteran.currentName,
      },
      applicant: {
        applicantEmail: application.claimant.email,
        applicantPhoneNumber: application.claimant.phoneNumber,
      },
    });

  const application = [
    populateSponsorData,
    populatePreparerData,
    populateVeteranData,
    filterViewFields,
  ].reduce((result, func) => func(result), form.data.application);

  // const formCopy = set('application', application, Object.assign({}, form));
  // const formData = transformForSubmit(formConfig, formCopy);

  return JSON.stringify({ application }, stringifyFormReplacer);

  /* Transformation for multiple applicants.
     *
     *  const matchClaimant = name => a => formatName(a.claimant.name) === name;
     *
     *  formCopy.applications = formCopy.applications.map(application => {
     *    // Fill in veteran info that veterans didn't need to enter separately.
     *    if (isVeteran(application)) {
     *      return merge({}, application, {
     *        veteran: {
     *          address: application.claimant.address,
     *          currentName: application.claimant.name,
     *          dateOfBirth: application.claimant.dateOfBirth,
     *          ssn: application.claimant.ssn,
     *          isDeceased: 'no'
     *        }
     *      });
     *    }
     *
     *    // Fill in veteran info in each application
     *    // where the sponsor is another claimant.
     *    const sponsorName = application['view:sponsor'];
     *    if (sponsorName !== 'Other') {
     *      const veteranApplication = form.applications.find(matchClaimant(sponsorName));
     *      const veteran = set('isDeceased', 'no', veteranApplication.veteran);
     *      return set('veteran', veteran, application);
     *    }
     *
     *    return application;
     *  });
     *
     *  // Fill in applicant info in each application
     *  // if the applicant is another claimant.
     *  const applicantName = form['view:preparer'];
     *  if (applicantName !== 'Other') {
     *    const applicantApplication = form.applications.find(matchClaimant(applicantName));
     *    const { address, email, name, phoneNumber } = applicantApplication.claimant;
     *    formCopy.applications = formCopy.applications.map(application => set('applicant',  {
     *      applicantEmail: email,
     *      applicantPhoneNumber: phoneNumber,
     *      applicantRelationshipToClaimant: application.claimant.ssn === applicantApplication.claimant.ssn ? 'Self' : 'Authorized Agent/Rep',
     *      completingReason: '',
     *      mailingAddress: address,
     *      name
     *    }, application));
     *  }
     *
     */
}

export const fullMaidenNameUI = merge({}, fullNameUI, {
  first: { 'ui:title': 'First name', 'ui:webComponentField': VaTextInputField },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
  },
  last: { 'ui:title': 'Last name', 'ui:webComponentField': VaTextInputField },
  suffix: {
    'ui:webComponentField': VaSelectField,
    'ui:options': { classNames: 'form-select-medium' },
  },
  maiden: {
    'ui:title': 'Maiden name',
    'ui:webComponentField': VaTextInputField,
  },
  'ui:order': ['first', 'middle', 'last', 'suffix', 'maiden'],
});

export const nonPreparerFullMaidenNameUI = merge({}, fullMaidenNameUI, {
  first: { 'ui:title': 'Your first name' },
  middle: { 'ui:title': 'Your middle name' },
  last: { 'ui:title': 'Your last name' },
  maiden: { 'ui:title': 'Maiden name' },
});

export const preparerFullMaidenNameUI = merge({}, fullMaidenNameUI, {
  first: { 'ui:title': 'Applicant’s first name' },
  middle: { 'ui:title': 'Applicant’s middle name' },
  last: { 'ui:title': 'Applicant’s last name' },
  maiden: { 'ui:title': 'Applicant’s maiden name' },
  suffix: { 'ui:title': 'Applicant’s suffix' },
});

export const nonPreparerDateOfBirthUI = currentOrPastDateUI(
  'Your date of birth',
);

export const preparerDateOfBirthUI = currentOrPastDateUI(
  'Applicant’s date of birth',
);

// Modify default uiSchema for SSN to insert any missing dashes.
export const ssnDashesUI = ssnUI();

export const preparerSsnDashesUI = ssnUI('Applicant’s Social Security number');

export const sponsorDetailsSsnDashesUI = ssnUI(
  'Sponsor’s Social Security number',
);

export const VAClaimNumberAdditionalInfo = (
  <va-additional-info trigger="What is a “VA claim number”?">
    <p>
      We used to give a VA claim number to every person who applied for VA
      benefits or services. We no longer give people these numbers. But if you
      have one, you can provide it here.
    </p>
  </va-additional-info>
);

export const veteranUI = {
  militaryServiceNumber: {
    'ui:title': 'Military Service number',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      enableAnalytics: false,
      hint: 'If it’s different than your Social Security number',
    },
    'ui:errorMessages': {
      pattern: 'Your Military Service number must be between 4 to 9 characters',
    },
  },
  vaClaimNumber: {
    'ui:title': 'VA claim number',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      enableAnalytics: false,
      hint: "If you don't have a VA claim number, leave this blank.",
    },
    'ui:errorMessages': {
      pattern: 'Your VA claim number must be between 8 to 9 digits',
    },
  },
  cityOfBirth: {
    'ui:title': 'Your birth city or county',
  },
  stateOfBirth: {
    'ui:title': 'Your birth state or territory',
  },
  gender: {
    'ui:title': 'What’s your sex?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        female: 'Female',
        male: 'Male',
      },
    },
  },
  maritalStatus: {
    'ui:title': 'What’s your marital status?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        single: 'Single',
        separated: 'Separated',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed',
        na: 'Prefer not to answer',
      },
    },
  },
  ethnicity: {
    // 'ui:field': RaceEthnicityReviewField,
    'ui:title': applicantDemographicsEthnicityTitle,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        isSpanishHispanicLatino: 'Hispanic or Latino',
        notSpanishHispanicLatino: 'Not Hispanic or Latino',
        unknown: 'Unknown',
        na: 'Prefer not to answer',
      },
      showFieldLabel: true,
    },
  },
  race: {
    'ui:field': RaceEthnicityReviewField,
    'ui:title': applicantDemographicsRaceTitle,
    'ui:webComponentField': VaCheckboxGroupField,
    isAmericanIndianOrAlaskanNative: {
      'ui:title': 'American Indian or Alaskan Native',
    },
    isAsian: {
      'ui:title': 'Asian',
    },
    isBlackOrAfricanAmerican: {
      'ui:title': 'Black or African American',
    },
    isNativeHawaiianOrOtherPacificIslander: {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
    },
    isWhite: {
      'ui:title': 'White',
    },
    na: {
      'ui:title': 'Prefer not to answer',
    },
    isOther: {
      'ui:title': 'Other',
    },
    'ui:validations': [
      // require at least one value to be true/checked + custom validation to ensure that "Prefer not to answer" is not selected along with other options
      (errors, fields) => {
        const { na, ...otherFields } = fields;
        const otherSelected = Object.values(otherFields).some(
          val => val === true,
        );

        if (na && otherSelected) {
          errors.addError(
            'When selecting Prefer not to answer, you can’t have another option.',
          );
        } else if (!na && !otherSelected) {
          errors.addError('Please provide a response.');
        }
      },
    ],
    'ui:options': {
      hint:
        'You can select more than one option, unless you prefer not to answer.',
      showFieldLabel: true,
    },
  },
  raceComment: {
    'ui:title': 'Enter the race that best describes you',
    'ui:widget': 'textarea',
    'ui:required': form => !!form?.application?.veteran?.race?.isOther,
    'ui:options': {
      expandUnder: 'race',
      expandUnderCondition: form => {
        return !!form?.isOther;
      },
      expandedContentFocus: true,
    },
    'ui:errorMessages': {
      required: 'Please provide a response.',
    },
  },
  militaryStatus: {
    'ui:title': 'Current military status',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      hint:
        'You can add more service history information later in this application.',
      labels: {
        A: 'Active duty',
        I: 'Death related to inactive duty training',
        D: 'Died on active duty',
        S: 'Reserve/National Guard',
        R: 'Retired',
        E: 'Retired active duty',
        O: 'Retired Reserve/National Guard',
        V: 'Veteran',
        X: 'Other',
      },
    },
  },
};

export const preparerVeteranUI = {
  militaryServiceNumber: {
    'ui:title': 'Applicant’s Military Service number',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      enableAnalytics: false,
      hint: 'If it’s different than their Social Security number',
    },
    'ui:errorMessages': {
      pattern:
        'Their Military Service number must be between 4 to 9 characters',
    },
  },
  vaClaimNumber: {
    'ui:title': 'Applicant’s VA claim number',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      enableAnalytics: false,
      hint: "If they don't have a VA claim number, leave this blank.",
    },
    'ui:errorMessages': {
      pattern: 'Your VA claim number must be between 8 to 9 digits',
    },
  },
  placeOfBirth: {
    'ui:title': 'Place of birth (City, State, or Territory)',
  },
  gender: {
    'ui:title': 'What’s your sex?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        female: 'Female',
        male: 'Male',
      },
    },
  },
  maritalStatus: {
    'ui:title': 'What’s your marital status?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        single: 'Single',
        separated: 'Separated',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed',
        na: 'Prefer not to answer',
      },
    },
  },
  ethnicity: {
    // 'ui:field': RaceEthnicityReviewField,
    'ui:title': 'What’s your ethnicity?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        isSpanishHispanicLatino: 'Hispanic or Latino',
        notSpanishHispanicLatino: 'Not Hispanic or Latino',
        unknown: 'Unknown',
        na: 'Prefer not to answer',
      },
      showFieldLabel: true,
    },
  },
  race: {
    'ui:field': RaceEthnicityReviewField,
    'ui:title': 'What’s your race?',
    'ui:webComponentField': VaCheckboxGroupField,
    isAmericanIndianOrAlaskanNative: {
      'ui:title': 'American Indian or Alaskan Native',
    },
    isAsian: {
      'ui:title': 'Asian',
    },
    isBlackOrAfricanAmerican: {
      'ui:title': 'Black or African American',
    },
    isNativeHawaiianOrOtherPacificIslander: {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
    },
    isWhite: {
      'ui:title': 'White',
    },
    isOther: {
      'ui:title': 'Other',
    },
    na: {
      'ui:title': 'Prefer not to answer',
    },
    'ui:validations': [
      // require at least one value to be true/checked
      (errors, fields) => {
        if (!Object.values(fields).some(val => val === true)) {
          errors.addError('Please provide a response');
        }
      },
    ],
    'ui:options': {
      hint: 'You can select more than one option.',
      showFieldLabel: true,
    },
  },
  militaryStatus: {
    'ui:title': 'Applicant’s current military status',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      hint:
        'You can add more service history information later in this application.',
      labels: {
        A: 'Active duty',
        S: 'Reserve/National Guard',
        R: 'Retired',
        E: 'Retired active duty',
        O: 'Retired Reserve/National Guard',
        V: 'Veteran',
        X: 'Other',
      },
    },
  },
};

export const validateMilitaryHistory = (
  errors,
  serviceRecords,
  useAllFormData,
) => {
  if (serviceRecords !== null && serviceRecords !== undefined) {
    const serviceRecord = serviceRecords;

    // Check if serviceBranch is undefined and highestRank is defined
    if (
      serviceRecord.serviceBranch === undefined &&
      serviceRecord.highestRank !== undefined
    ) {
      if (isVeteran(useAllFormData)) {
        if (!isAuthorizedAgent(useAllFormData)) {
          // Self
          errors.highestRank.addError(
            'Select a branch of service before selecting your highest rank attained.',
          );
        } else {
          // Applicant
          errors.highestRank.addError(
            "Select Applicant's branch of service before selecting the Applicant's highest rank attained.",
          );
        }
      } else {
        // Sponsor
        errors.highestRank.addError(
          "Select Sponsor's branch of service before selecting the Sponsor's highest rank attained.",
        );
      }
    }

    if (serviceRecord.serviceBranch) {
      const branchFilteredRanks = jsonData.filter(
        rank => rank['Branch Of Service Code'] === serviceRecord.serviceBranch,
      );
      if (
        serviceRecord.highestRank &&
        !branchFilteredRanks.some(
          rank => rank['Rank Code'] === serviceRecord.highestRank,
        )
      ) {
        errors.highestRank.addError(
          `This is not a valid rank for ${
            serviceLabels[serviceRecord.serviceBranch]
          }`,
        );
      }
    }

    // Date of birth validation
    let dob;
    let errorMessage;

    if (isVeteran(useAllFormData)) {
      if (!isAuthorizedAgent(useAllFormData)) {
        // Self
        dob = useAllFormData?.application?.claimant?.dateOfBirth;
        errorMessage = 'Provide a valid date that is after your date of birth';
      } else {
        // Applicant
        dob = useAllFormData?.application?.claimant?.dateOfBirth;
        errorMessage =
          "Provide a valid date that is after the applicant's date of birth";
      }
    } else {
      // Sponsor
      dob = useAllFormData?.application?.veteran?.dateOfBirth;
      errorMessage =
        "Provide a valid date that is after the sponsor's date of birth";
    }

    // Date of birth validation against service start date and service end date
    if (serviceRecord.dateRange.from <= dob) {
      errors.dateRange.from.addError(errorMessage);
    }

    if (serviceRecord.dateRange.to <= dob) {
      errors.dateRange.to.addError(errorMessage);
    }
  }
};

export const selfServiceRecordsUI = {
  'ui:title': 'Your service period(s)',
  'ui:options': {
    viewField: ServicePeriodView,
    itemName: 'Service period',
    keepInPageOnReview: true,
    useDlWrap: true,
  },
  'ui:validations': [validateMilitaryHistory],
  items: {
    'ui:order': [
      'serviceBranch',
      'dateRange',
      'highestRank',
      'dischargeType',
      'nationalGuardState',
    ],
    'ui:options': {
      itemName: 'Service Period',
    },
    serviceBranch: autosuggest.uiSchema('Branch of service', null, {
      'ui:options': {
        labels: serviceLabels,
      },
    }),
    dateRange: dateRangeUI(
      'Service Start Date',
      'Service End Date',
      'Service start date must be after end date',
    ),
    dischargeType: {
      'ui:title': 'Discharge character of service',
      'ui:options': {
        labels: {
          1: 'Honorable',
          2: 'General',
          3: 'Entry Level Separation',
          4: 'Uncharacterized',
          5: 'Other Than Honorable',
          6: 'Bad Conduct',
          7: 'Dishonorable',
          8: 'Other',
        },
      },
    },
    highestRank: autosuggest.uiSchema('Highest rank attained', null, {
      'ui:options': {
        labels: rankLabels,
        hint:
          'This field may clear if the branch of service or service start and end dates are updated.',
      },
    }),
    nationalGuardState: {
      'ui:title': 'State (for National Guard Service only)',
      'ui:options': {
        hideIf: (formData, index) =>
          !['AG', 'NG'].includes(
            formData.application.veteran.serviceRecords[index].serviceBranch,
          ),
      },
    },
  },
};

export const preparerServiceRecordsUI = {
  'ui:title': 'Applicant’s service period(s)',
  'ui:options': {
    viewField: ServicePeriodView,
    itemName: 'Service period',
    keepInPageOnReview: true,
    useDlWrap: true,
  },
  'ui:validations': [validateMilitaryHistory],
  items: {
    'ui:order': [
      'serviceBranch',
      'dateRange',
      'highestRank',
      'dischargeType',
      'nationalGuardState',
    ],
    'ui:options': {
      itemName: 'Service Period',
    },
    serviceBranch: autosuggest.uiSchema('Applicant’s branch of service', null, {
      'ui:options': {
        labels: serviceLabels,
      },
    }),
    dateRange: dateRangeUI(
      'Applicant’s Service Start Date',
      'Applicant’s Service End Date',
      'Service start date must be after end date',
    ),
    dischargeType: {
      'ui:title': 'Applicant’s discharge character of service',
      'ui:options': {
        labels: {
          1: 'Honorable',
          2: 'General',
          3: 'Entry Level Separation',
          4: 'Uncharacterized',
          5: 'Other Than Honorable',
          6: 'Bad Conduct',
          7: 'Dishonorable',
          8: 'Other',
        },
      },
    },
    highestRank: autosuggest.uiSchema(
      'Applicant’s highest rank attained',
      null,
      {
        'ui:options': {
          labels: rankLabels,
          hint:
            'This field may clear if the branch of service or service start and end dates are updated.',
        },
      },
    ),
    nationalGuardState: {
      'ui:title': 'State (for National Guard Service only)',
      'ui:options': {
        hideIf: (formData, index) =>
          !['AG', 'NG'].includes(
            formData.application.veteran.serviceRecords[index].serviceBranch,
          ),
      },
    },
  },
};

export const militaryNameUI = {
  application: {
    veteran: {
      'view:hasServiceName': {
        'ui:title': 'Did you serve under another name?',
        'ui:widget': 'yesNo',
      },
      serviceName: merge({}, nonRequiredFullNameUI, {
        'ui:options': {
          expandUnder: 'view:hasServiceName',
        },
      }),
    },
  },
};

export function DesiredCemeteryNoteDescription() {
  const data = useSelector(state => state.form.data || {});
  if (isAuthorizedAgent(data)) {
    if (isVeteran(data)) {
      return desiredCemeteryNoteDescriptionPreparerVeteran;
    }
    return desiredCemeteryNoteDescriptionPreparerNonVeteran;
  }
  if (isVeteran(data)) {
    return desiredCemeteryNoteDescriptionSelfVeteran;
  }
  return desiredCemeteryNoteDescriptionSelfNonVeteran;
}

export function getCemeteries() {
  const apiUrl = `${environment.API_URL}/simple_forms_api/v1/cemeteries`;

  return fetch(apiUrl, {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .then(res => {
      return res.data.map(item => ({
        label: item.attributes.name,
        id: item.id,
      }));
    })
    .catch(error => {
      if (error instanceof Error) {
        Sentry.captureException(error);
        Sentry.captureMessage('vets_preneed_cemeteries_error');
      }
      return Promise.resolve([]);
    });
}

export function MailingAddressStateTitle(props) {
  const { elementPath, formData } = props;
  const reduxFormData = useSelector(state => state.form.data || {});
  const data = formData || reduxFormData;
  const country = get(elementPath, data);

  if (country === 'CAN') {
    return 'Province';
  }
  return 'State or territory';
}

export const formatSuggestedAddress = address => {
  if (address) {
    let displayAddress = '';
    const street = address.street || address.addressLine1;
    const street2 = address.street2 || address.addressLine2;
    const { city } = address;
    const state = address.state || address.stateCode;
    const zip = address.postalCode || address.zipCode;
    const country = address.country || address.countryCodeIso3;

    if (street) displayAddress += street;
    if (street2) displayAddress += `, ${street2}`;
    if (city) displayAddress += `, ${city}`;
    if (state) displayAddress += `, ${state}`;
    if (zip) displayAddress += ` ${zip}`;
    if (country && country !== 'USA')
      displayAddress += `, ${countries.find(c => c.value === country).label ||
        country}`;

    return displayAddress.trim();
  }
  return '';
};

/* eslint-disable camelcase */
export const prepareAddressForAPI = address => ({
  address_line1: address.street,
  address_line2: address.street2,
  address_pou: 'RESIDENCE',
  address_type: 'DOMESTIC',
  city: address.city,
  country_code_iso3: address.country,
  state_code: address.state,
  zip_code: address.postalCode,
});

export const fetchSuggestedAddress = async userAddress => {
  const options = {
    body: JSON.stringify({
      address: { ...prepareAddressForAPI(userAddress) },
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await apiRequest(
      `${envUrl}/v0/profile/address_validation`,
      options,
    );

    if (res?.addresses && res?.addresses.length > 0) {
      const suggested = res.addresses[0]?.address;
      return {
        fetchedSuggestedAddress: {
          addressLine1: suggested.addressLine1,
          addressLine2: suggested.addressLine2,
          city: suggested.city,
          country: suggested.countryCodeIso3,
          state: suggested.stateCode,
          zipCode: suggested.zipCode,
        },
        fetchedShowSuggestions:
          res?.addresses[0]?.addressMetaData?.confidenceScore !== 100,
      };
    }
  } catch (error) {
    return { fetchedSuggestedAddress: null, fetchedShowSuggestions: false };
  }

  return { fetchedSuggestedAddress: null, fetchedShowSuggestions: false };
};

// Helper function to conditionally return a line with a break
export const addressConfirmationRenderLine = content => {
  return content ? (
    <>
      {content}
      <br />
    </>
  ) : null;
};

// This function ensures the `depends` function of each page is called with the correct form data
// in the burialBenefits section of the form
export const addConditionalDependency = (pages, condition) => {
  return Object.fromEntries(
    Object.entries(pages).map(([key, page]) => [
      key,
      {
        ...page,
        depends: formData => page.depends?.(formData) && condition(formData),
      },
    ]),
  );
};

export const ApplicantDetailsHeader = () => {
  return (
    <h3 className="vads-u-margin-bottom--3">
      Confirm the personal information we have on file for you
    </h3>
  );
};

// Helper function to check if user is logged in and not an authorized agent
export const isLoggedInUser = formData => {
  const isLoggedIn = formData?.['view:loginState']?.isLoggedIn || false;
  const isAgent = isAuthorizedAgent(formData);
  return !isAgent && isLoggedIn;
};
