import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import Raven from 'raven-js';
import { connect } from 'react-redux';
import { Validator } from 'jsonschema';
import fullSchemaIncrease from 'vets-json-schema/dist/21-526EZ-schema.json';

import {
  isValidUSZipCode,
  isValidCanPostalCode,
} from '../../../platform/forms/address';
import { stateRequiredCountries } from '../../../platform/forms/definitions/address';
import { filterViewFields } from 'us-forms-system/lib/js/helpers';
import cloneDeep from '../../../platform/utilities/data/cloneDeep';
import set from '../../../platform/utilities/data/set';
import get from '../../../platform/utilities/data/get';
import { pick } from 'lodash';
import { genderLabels } from '../../../platform/static-data/labels';

import { DateWidget } from 'us-forms-system/lib/js/review/widgets';
import { getDisabilityName, transformDisabilities } from '../all-claims/utils';

import { VA_FORM4142_URL } from '../all-claims/constants';

/**
 * Inspects an array of objects, and attempts to aggregate subarrays at a given property
 * of each object into one array
 * @param {array} dataArray array of objects to inspect
 * @param {string} property the property to inspect in each array item
 * @returns {array} a list of aggregated items pulled from different arrays
 */
const aggregate = (dataArray, property) => {
  const masterList = [];
  dataArray.forEach(item => {
    if (item[property]) {
      item[property].forEach(listItem => masterList.push(listItem));
    }
  });

  return masterList;
};

// Moves phone & email out of the phoneEmailCard up one level into `formData.veteran`
const setPhoneEmailPaths = veteran => {
  const newVeteran = cloneDeep(veteran);
  const { primaryPhone, emailAddress } = newVeteran.phoneEmailCard;
  newVeteran.primaryPhone = primaryPhone;
  newVeteran.emailAddress = emailAddress;
  delete newVeteran.phoneEmailCard;
  return newVeteran;
};

export const getReservesGuardData = formData => {
  const {
    unitName,
    obligationTermOfServiceDateRange,
    title10Activation,
    waiveVABenefitsToRetainTrainingPay,
  } = formData;

  // Ensure all required fields are present
  if (
    !unitName ||
    !obligationTermOfServiceDateRange ||
    !obligationTermOfServiceDateRange.from ||
    !obligationTermOfServiceDateRange.to ||
    typeof waiveVABenefitsToRetainTrainingPay === 'undefined'
  ) {
    return null;
  }

  const obligationDateRange = {
    from: obligationTermOfServiceDateRange.from,
    to: obligationTermOfServiceDateRange.to,
  };

  if (formData['view:isTitle10Activated']) {
    return {
      unitName,
      obligationTermOfServiceDateRange: obligationDateRange,
      title10Activation: {
        title10ActivationDate: title10Activation.title10ActivationDate,
        anticipatedSeparationDate: title10Activation.anticipatedSeparationDate,
      },
      waiveVABenefitsToRetainTrainingPay,
    };
  }

  return {
    unitName,
    obligationTermOfServiceDateRange: obligationDateRange,
    waiveVABenefitsToRetainTrainingPay,
  };
};

export function transform(formConfig, form) {
  const {
    disabilities,
    veteran,
    privacyAgreementAccepted,
    servicePeriods,
    standardClaim,
  } = form.data;
  const reservesNationalGuardService = getReservesGuardData(form.data);
  const disabilityProperties = Object.keys(
    fullSchemaIncrease.definitions.disabilities.items.properties,
  );

  const serviceInformation = reservesNationalGuardService
    ? { servicePeriods, reservesNationalGuardService }
    : { servicePeriods };

  const additionalDocuments = aggregate(disabilities, 'additionalDocuments');
  const privateRecords = aggregate(disabilities, 'privateRecords');
  const treatments = aggregate(disabilities, 'treatments');

  const transformedData = {
    disabilities: disabilities
      .filter(disability => disability['view:selected'] === true)
      .map(filtered => pick(filtered, disabilityProperties)),
    // Pull phone & email out of phoneEmailCard and into veteran property
    veteran: setPhoneEmailPaths(veteran),
    attachments: additionalDocuments.concat(privateRecords),
    privacyAgreementAccepted,
    serviceInformation,
    standardClaim,
    // treatments has a minItems: 1 requirement so only include the property
    // if there is at least one treatment to send
    ...(treatments.length && { treatments }),
  };

  const withoutViewFields = filterViewFields(transformedData);
  return JSON.stringify({ form526: withoutViewFields });
}

export function validateDisability(disability) {
  const invalidDisabilityError = error =>
    /^instance.disabilities\[/.test(error.property);
  const v = new Validator();
  const result = v.validate({ disabilities: [disability] }, fullSchemaIncrease);

  if (result.errors.find(invalidDisabilityError)) {
    Raven.captureMessage(
      `vets-disability-increase-invalid-disability-prefilled: ${disability}`,
    );
    return false;
  }
  return true;
}

export function addPhoneEmailToCard(formData) {
  const { veteran } = formData;
  if (typeof veteran === 'undefined') {
    return formData;
  }

  const phoneEmailCard = {
    primaryPhone: get('primaryPhone', veteran, ''),
    emailAddress: get('emailAddress', veteran, ''),
  };

  const newFormData = set('veteran.phoneEmailCard', phoneEmailCard, formData);
  delete newFormData.veteran.primaryPhone;
  delete newFormData.veteran.emailAddress;

  return newFormData;
}

export function transformObligationDates(formData) {
  const { reservesNationalGuardService } = formData;
  if (
    !reservesNationalGuardService ||
    !reservesNationalGuardService.obligationTermOfServiceDateRange
  ) {
    return formData;
  }

  const {
    obligationTermOfServiceDateRange: { from, to },
  } = reservesNationalGuardService;
  const newFormData = set(
    'obligationTermOfServiceDateRange',
    { from, to },
    formData,
  );
  delete newFormData.reservesNationalGuardService;

  return newFormData;
}

export function prefillTransformer(pages, formData, metadata) {
  const { disabilities } = formData;
  if (!disabilities || !Array.isArray(disabilities)) {
    Raven.captureMessage(
      'vets-disability-increase-no-rated-disabilities-found',
    );
    return { metadata, formData, pages };
  }
  const newFormData = set(
    'disabilities',
    transformDisabilities(disabilities),
    formData,
  );
  newFormData.disabilities.forEach(validateDisability);
  const withPhoneEmailCard = addPhoneEmailToCard(newFormData);
  const withObligationDates = transformObligationDates(withPhoneEmailCard);
  return {
    metadata,
    formData: withObligationDates,
    pages,
  };
}

export const supportingEvidenceOrientation = (
  <p>
    On the next few screens, we’ll ask you where we can find medical records or
    supporting evidence that show your rated condition has gotten worse. You
    don’t need to turn in any medical records that you already submitted with
    your original claim.{' '}
    <strong>
      We only need new medical records or evidence that show your rated
      condition has gotten worse.
    </strong>
  </p>
);

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {getDisabilityName(formData.name)}
  </legend>
);

export const facilityDescription = ({ formData }) => (
  <p>
    Please tell us where VA treated you for {getDisabilityName(formData.name)}{' '}
    <strong>after you got your disability rating</strong>.
  </p>
);

export const vaMedicalRecordsIntro = ({ formData }) => (
  <p>
    First we’ll ask you about your VA medical records that show your{' '}
    {getDisabilityName(formData.name)} has gotten worse.
  </p>
);

export const privateRecordsChoice = ({ formData }) => (
  <div>
    <h4>About private medical records</h4>
    <p>
      You said you were treated for {getDisabilityName(formData.name)} by a
      private doctor. If you have your private medical records, you can upload
      them to your application. If you want us to get them for you, you’ll need
      to authorize their release.
    </p>
  </div>
);

const firstOrNowString = evidenceTypes =>
  evidenceTypes['view:vaMedicalRecords'] ? 'Now' : 'First,';
export const privateMedicalRecordsIntro = ({ formData }) => (
  <p>
    {firstOrNowString(formData['view:selectableEvidenceTypes'])} we’ll ask you
    about your private medical records that show your{' '}
    {getDisabilityName(formData.name)} has gotten worse.
  </p>
);

export function validatePostalCodes(errors, formData) {
  let isValidPostalCode = true;
  // Checks if postal code is valid
  if (formData.treatmentCenterCountry === 'USA') {
    isValidPostalCode =
      isValidPostalCode && isValidUSZipCode(formData.treatmentCenterPostalCode);
  }
  if (formData.treatmentCenterCountry === 'CAN') {
    isValidPostalCode =
      isValidPostalCode &&
      isValidCanPostalCode(formData.treatmentCenterPostalCode);
  }

  // Add error message for postal code if it exists and is invalid
  if (formData.treatmentCenterPostalCode && !isValidPostalCode) {
    errors.treatmentCenterPostalCode.addError(
      'Please provide a valid postal code',
    );
  }
}

export function validateAddress(errors, formData) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (
    stateRequiredCountries.has(formData.treatmentCenterCountry) &&
    formData.treatmentCenterState === undefined
  ) {
    // TODO: enable once validation determined
    // && currentSchema.required.length) {
    errors.treatmentCenterState.addError('Please select a state or province');
  }
  const hasAddressInfo =
    stateRequiredCountries.has(formData.treatmentCenterCountry) &&
    // TODO: enable once validation determined
    // && !currentSchema.required.length
    typeof formData.treatmentCenterCity !== 'undefined' &&
    typeof formData.treatmentCenterStreet !== 'undefined' &&
    typeof formData.treatmentCenterPostalCode !== 'undefined';

  if (hasAddressInfo && typeof formData.treatmentCenterState === 'undefined') {
    errors.treatmentCenterState.addError(
      'Please enter a state or province, or remove other address information.',
    );
  }

  validatePostalCodes(errors, formData);
}

const claimsIntakeAddress = (
  <p className="va-address-block">
    Department of Veterans Affairs
    <br />
    Claims Intake Center
    <br />
    PO Box 4444
    <br />
    Janesville, WI 53547-4444
  </p>
);

export const download4142Notice = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <p>
      Since your doctor has your private medical records, you’ll need to fill
      out an Authorization to Disclose Information to the VA (VA Form 21-4142)
      so we can request your records. You’ll need to fill out a form for each
      doctor.
    </p>
    <p>
      <a href={VA_FORM4142_URL} target="_blank">
        Download VA Form 21-4142
      </a>
      .<p>Please print the form, fill it out, and send it to:</p>
      {claimsIntakeAddress}
      <p>
        Or you can upload a completed VA Form 21-4142 to your online
        application.
      </p>
    </p>
  </div>
);

export const authorizationToDisclose = (
  <div>
    <p>
      Since your medical records are with your doctor, you’ll need to fill out
      an Authorization to Disclose Information to the VA (VA Form 21-4142) so we
      can request your records. You’ll need to fill out a form for each doctor.
    </p>
    <p>
      <a href={VA_FORM4142_URL} target="_blank">
        Download VA Form 21-4142
      </a>
      .
    </p>
    <p>Please print the form, fill it out, and send it to:</p>
    {claimsIntakeAddress}
  </div>
);

export const recordReleaseWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span>
      Limiting consent means that your doctor can only share records that are
      directly related to your condition. This could add to the time it takes to
      get your private medical records.
    </span>
  </div>
);

export const additionalDocumentDescription = () => (
  <div>
    <p>
      If you have other evidence, such as a lay or buddy statement to turn in,
      you can upload them here. You can upload your document in a pdf, .jpeg, or
      .png file format. You’ll first need to scan a copy of your document onto
      your computer or mobile phone. You can then upload the document from
      there. Please note that if you have a slow Internet connection, large
      files can take longer to upload.
    </p>
    <p>File upload guidelines:</p>
    <ul>
      <li>File types you can upload: .pdf, .jpeg, or .png</li>
      <li>Maximum file size: 50 MB</li>
    </ul>
    <p>
      <em>
        Large files can be more difficult to upload with a slow Internet
        connection
      </em>
    </p>
  </div>
);

const getVACenterName = center => center.treatmentCenterName;
const getPrivateCenterName = release =>
  release.privateRecordRelease.treatmentCenterName;
const listCenters = centers => (
  <span className="treatment-centers">
    {centers.map((center, idx, list) => {
      const centerName = center.treatmentCenterName
        ? getVACenterName(center)
        : getPrivateCenterName(center);
      const notLast = idx < list.length - 1;
      const justOne = list.length === 1;
      const atLeastThree = list.length > 2;
      return (
        <span key={idx}>
          {!notLast && !justOne && <span className="unstyled-word"> and </span>}
          {centerName}
          {atLeastThree && notLast && ', '}
        </span>
      );
    })}
  </span>
);

const listDocuments = documents => (
  <ul>
    {documents.map((document, id) => (
      <li className="dashed-bullet" key={id}>
        <strong>{document.name}</strong>
      </li>
    ))}
  </ul>
);

export const evidenceSummaryView = ({ formContext, formData }) => {
  const {
    treatments,
    privateRecordReleases,
    privateRecords,
    additionalDocuments,
  } = formData;

  return (
    <div>
      {formContext.reviewMode && (
        <div className="form-review-panel-page-header-row">
          <h5 className="form-review-panel-page-header">
            {formContext.pageTitle(formData)}
          </h5>
        </div>
      )}
      <ul>
        {treatments && (
          <li>
            We’ll get your medical records from {listCenters(treatments)}.
          </li>
        )}
        {privateRecordReleases && (
          <li>
            We’ll get your private medical records from{' '}
            {listCenters(privateRecordReleases)}.
          </li>
        )}
        {privateRecords && (
          <li>
            We have received the private medical records you uploaded:
            {listDocuments(privateRecords)}
          </li>
        )}
        {additionalDocuments && (
          <li>
            We have received the additional evidence you uploaded:
            {listDocuments(additionalDocuments)}
          </li>
        )}
      </ul>
    </div>
  );
};

export const editNote = name => (
  <p>
    <strong>Note:</strong> If you need to update your {name}, please call
    Veterans Benefits Assistance at{' '}
    <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday through Friday, 8:00
    a.m. to 9:00 p.m. (ET).
  </p>
);

/**
 * Show one thing, have a screen reader say another.
 * NOTE: This will cause React to get angry if used in a <p> because the DOM is "invalid."
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

const unconnectedVetInfoView = profile => {
  // NOTE: ssn and vaFileNumber will be undefined for the foreseeable future; they're kept in here as a reminder.
  const { ssn, vaFileNumber, dob, gender } = profile;
  const { first, middle, last, suffix } = profile.userFullName;
  const mask = srSubstitute('●●●–●●–', 'ending with');
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <div className="blue-bar-block">
        <strong>
          {first} {middle} {last} {suffix}
        </strong>
        {ssn && (
          <p>
            Social Security number: {mask}
            {ssn.slice(5)}
          </p>
        )}
        {vaFileNumber && (
          <p>
            VA file number: {mask}
            {vaFileNumber.slice(5)}
          </p>
        )}
        <p>
          Date of birth:{' '}
          <DateWidget value={dob} options={{ monthYear: false }} />
        </p>
        <p>Gender: {genderLabels[gender]}</p>
      </div>
      {editNote('personal information')}
    </div>
  );
};

export const veteranInfoDescription = connect(state => state.user.profile)(
  unconnectedVetInfoView,
);

export const ITFErrorAlert = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h3>
        We’re sorry. Your intent to file request didn’t go through. Please try
        again.
      </h3>
    </div>
  </div>
);

export const UnauthenticatedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        To apply for a disability increase, you’ll need to sign in and verify
        your account.
      </div>
    </div>
    <br />
  </div>
);

export const UnverifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">We couldn’t verify your identity</h3>
        Please try again. If you have a premium DS Logon or My HealtheVet
        account, you can try signing in that way, or you can create an ID.me
        account to complete the verification process.
      </div>
    </div>
    <br />
  </div>
);

export const VerifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress, and come
        back later to finish filling it out. You have 1 year from the date you
        start or update your application to submit the form.
      </div>
    </div>
    <br />
  </div>
);

export const GetFormHelp = () => (
  <div>
    <p className="help-talk">For help filling out this form, please call:</p>
    <p className="help-phone-number">
      <a className="help-phone-number-link" href="tel:+1-877-222-8387">
        1-877-222-VETS
      </a>{' '}
      (
      <a className="help-phone-number-link" href="tel:+1-877-222-8387">
        1-877-222-8387
      </a>
      )<br />
      Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
    </p>
  </div>
);

export const ITFDescription = (
  <span>
    <strong>Note:</strong> By clicking the button to start the disability
    application, you’ll declare your intent to file, and this will set the date
    you can start getting benefits. This intent to file will expire 1 year from
    the day you start your application.
  </span>
);

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>
        The VA file number is the number used to track your disability claim and
        evidence through the VA system. For most Veterans, your VA file number
        is the same as your Social Security number. However, if you filed your
        first disability claim a long time ago, your VA file number may be a
        different number.
      </p>
    </AdditionalInfo>
  </div>
);

export const FDCDescription = (
  <div>
    <h5>Fully developed claim program</h5>
    <p>
      You can apply using the Fully Developed Claim (FDC) program if you’ve
      uploaded all the supporting documents or supplemental forms needed to
      support your claim.
    </p>
    <a href="/pension/apply/fully-developed-claim/" target="_blank">
      Learn more about the FDC program
    </a>
    .
  </div>
);

export const FDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since you’ve uploaded all your supporting documents, your claim will be
        submitted as a fully developed claim.
      </div>
    </div>
  </div>
);

export const noFDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        <p>
          Since you’ll be sending in additional documents later, your
          application doesn’t qualify for the Fully Developed Claim program.
          We’ll review your claim through the standard claim process. With the
          standard claim process, you have up to 1 year from the date we receive
          your claim to turn in any information and evidence.
        </p>
        <p>You can turn in your evidence 1 of 3 ways:</p>
        <ul>
          <li>
            Visit the Claim Status tool and upload your documents under the File
            tab. <a href="/track-claims">Track the status of your claims.</a>
          </li>
          <li>
            Call Veterans Benefits Assistance at{' '}
            <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday – Friday,
            8:30 a.m. – 4:30 p.m. (ET).
          </li>
          <li>
            Save your application and return to it later when you have your
            evidence ready to upload.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const evidenceTypesDescription = disabilityName => (
  <p>
    What supporting evidence will you be turning in that shows your{' '}
    {disabilityName}{' '}
    <strong>has gotten worse since you received a VA rating</strong>?
  </p>
);

export const getEvidenceTypesDescription = (form, index) => {
  const { name } = form.disabilities[index];
  return evidenceTypesDescription(getDisabilityName(name));
};

/**
 * If user chooses private medical record supporting evidence, he/she has a choice
 * to either upload PMRs directly or fill out a 4142. Here, we determine if the user
 * chose the 4142 option for any of his/her disabilities
 * @param {array} disabilities
 * @returns {boolean} true if user selected option to fill out 4142 on their own
 */
export const get4142Selection = disabilities =>
  disabilities.reduce((selected, disability) => {
    if (selected === true) {
      return true;
    }

    const {
      'view:selected': viewSelected,
      'view:uploadPrivateRecords': viewUploadPMR,
    } = disability;
    if (viewSelected === true && viewUploadPMR === 'no') {
      return true;
    }
    return false;
  }, false);

export const contactInfoDescription = () => (
  <p>
    This is the contact information we have on file for you. We’ll send any
    important information about your disability claim to the address listed
    here. Any updates you make here to your contact information will only apply
    to this application.
  </p>
);

export const contactInfoUpdateHelp = () => (
  <div>
    <p>
      If you want to update your contact information for all your VA accounts,
      please go to your profile page.
    </p>
    <p>
      <a href="/profile">Go to my profile page</a>.
    </p>
  </div>
);

export const validateIfHasEvidence = (
  errors,
  fieldData,
  formData,
  schema,
  messages,
  options,
  index,
) => {
  const { wrappedValidator } = options;
  if (get('view:hasEvidence', formData, true)) {
    wrappedValidator(errors, fieldData, formData, schema, messages, index);
  }
};

export const title10DatesRequired = formData =>
  get('view:isTitle10Activated', formData, false);
