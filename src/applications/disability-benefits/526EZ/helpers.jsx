import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import Raven from 'raven-js';
import appendQuery from 'append-query';
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
import { apiRequest } from '../../../platform/utilities/api';
import { genderLabels } from '../../../platform/static-data/labels';

import { DateWidget } from 'us-forms-system/lib/js/review/widgets';
import { getDisabilityName } from '../all-claims/utils';

import { VA_FORM4142_URL } from './constants';

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

/**
* Converts the treatment date range into an array of objects from just an object
* @param {object} treatmentDateRange object containing from/to date range
* @returns {array} of treatmentDateRange's
*/
const transformDateRange = (treatmentDateRange) => {
  return [treatmentDateRange];
};

/** Note: This function will be moved to the 526EZ helper file
* Cycles through the list of provider facilities and performs transformations on each property as needed
* @param {array} providerFacility array of objects being transformed
* @returns {object} containing the new Provider Facility structure
*/
const transformProviderFacility = (providerFacility) => {
  const newProviderFacility = [];
  providerFacility.forEach((facility) => {
    newProviderFacility.push({
      providerFacilityName: facility.providerFacilityName,
      treatmentDateRange: transformDateRange(facility.treatmentDateRange),
      providerFacilityAddress: facility.providerFacilityAddress
    });
  });

  return newProviderFacility;
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
  const providerFacility = disabilities
    .filter(disability => disability['view:selected'] === true)
    .map(filtered => filtered.providerFacility)
    .reduce((accumulator, item) => {
      return accumulator.concat(item);
    }, []);

  const limitedConsent = disabilities
    .filter((disability) => {
      return disability.limitedConsent === true;
    });

  const transformedData = {
    disabilities: disabilities
      .filter(disability => disability['view:selected'] === true)
      .map(filtered => pick(filtered, disabilityProperties)),
    // Pull phone & email out of phoneEmailCard and into veteran property
    veteran: setPhoneEmailPaths(veteran),
    // Extract treatments into one top-level array
    treatments: aggregate(disabilities, 'treatments'),
    attachments: additionalDocuments.concat(privateRecords),
    privacyAgreementAccepted,
    serviceInformation,
    standardClaim,
    form4142: {
      limitedConsent: limitedConsent.length > 0,
      providerFacility: transformProviderFacility(providerFacility)
    }
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

export function transformDisabilities(disabilities = []) {
  return (
    disabilities
      // We want to remove disabilities without a rating, but 0 counts as a valid rating
      // TODO: Log the disabilities if they're not service connected
      // Unfortunately, we don't have decisionCode in the schema, so it's stripped out by the time
      //  it gets here and we can't tell whether it is service connected or not. This happens in
      //  the api
      .filter(disability => {
        if (disability.ratingPercentage || disability.ratingPercentage === 0) {
          return true;
        }

        // TODO: Only log it if the decision code indicates the condition is not non-service-connected
        const { decisionCode } = disability;
        if (decisionCode) {
          Raven.captureMessage('526_increase_disability_filter', {
            extra: { decisionCode },
          });
        }

        return false;
      })
      .map(disability => set('disabilityActionType', 'INCREASE', disability))
  );
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

export const evidenceTypeHelp = (
  <AdditionalInfo triggerText="Which evidence type should I choose?">
    <h3>Types of evidence</h3>
    <h4>VA medical records</h4>
    <p>
      If you were treated at a VA medical center or clinic, or by a doctor
      through the TRICARE health care program, you’ll have VA medical records.
    </p>
    <h4>Private medical records</h4>
    <p>
      If you were treated by a private doctor, including a Veteran’s Choice
      doctor, you’ll have private medical records. We’ll need to see those
      records to make a decision on your claim. A Disability Benefit
      Questionnaire is an example of a private medical record.
    </p>
    <h4>Lay statements or other evidence</h4>
    <p>
      A lay statement is a written statement from family, friends, or coworkers
      to help support your claim. Lay statements are also called “buddy
      statements.” In most cases, you’ll only need your medical records to
      support your disability claim. Some claims, for example, for Posttraumatic
      Stress Disorder or for military sexual trauma, could benefit from a lay or
      buddy statement.
    </p>
  </AdditionalInfo>
);

/**
 * Disability/contention display HTML. 
 * @param {string} disabilityName Name of the contention/disability that the user is giving consent to
 */
const limitedConsentTitle = (disabilityName) => {
  return (
    <p>I give consent, or permission, to my doctor to release only records related to {disabilityName}.</p>
  );
};

/**
 * Grabbing the disbility string and returning a display content. Similar to getEvidenceTypesDescription. Maybe refactor?
 * @param {object} form Form data
 * @param {*} index identifier for which disability/contention is being evaluated
 */
export const getlimitedConsentTitle = (form, index) => {
  const { name } = form.disabilities[index];
  return limitedConsentTitle(getDisabilityName(name));
};

export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">
      {getDisabilityName(formData.name)}
    </legend>
  );
};

export const facilityDescription = ({ formData }) => {
  return (
    <p>
      Please tell us where VA treated you for {getDisabilityName(formData.name)}{' '}
      <strong>after you got your disability rating</strong>.
    </p>
  );
};

export const treatmentView = ({ formData }) => {
  const { from, to } = formData.treatmentDateRange;

  const name = formData.treatmentCenterName || '';
  let treatmentPeriod = '';
  if (from && to) {
    treatmentPeriod = `${from} — ${to}`;
  } else if (from || to) {
    treatmentPeriod = `${from || to}`;
  }

  return (
    <div>
      <strong>{name}</strong>
      <br/>
      {treatmentPeriod}
    </div>
  );
};

export const vaMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>
      First we’ll ask you about your VA medical records that show your{' '}
      {getDisabilityName(formData.name)} has gotten worse.
    </p>
  );
};

export const privateRecordsChoice = ({ formData }) => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>
        You said you were treated for {getDisabilityName(formData.name)} by a
        private doctor. If you have your private medical records, you can upload
        them to your application. If you want us to get them for you, you’ll
        need to authorize their release.
      </p>
    </div>
  );
};

export const privateRecordsChoiceHelp = (
  <div className="private-records-choice-help">
    <AdditionalInfo triggerText="Which should I choose?">
      <h5>Upload your medical records</h5>
      <p>
        If you have an electronic copy of your medical records, uploading your
        records can speed up the review of your claim.
      </p>
      <p>
        This works best if you have a fast internet connection and time for a
        large file to upload. Records should be .pdf, .jpg, or .png files and can be
        up to 50MB each.
      </p>
      <h5>We get records for you</h5>
      <p>
        If you tell us which VA medical center treated you for your condition, we
        can get your medical records for you. Getting your records may take us
        some time. This could take us longer to make a decision on your claim.
      </p>
    </AdditionalInfo>
  </div>
);

const firstOrNowString = evidenceTypes =>
  (evidenceTypes['view:vaMedicalRecords'] ? 'Now' : 'First,');
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
    Department of Veterans Affairs<br/>
    Claims Intake Center<br/>
    PO Box 4444<br/>
    Janesville, WI 53547-4444
  </p>
);

export const patientAcknowledgmentText = (
  <AdditionalInfo triggerText="Read the full text.">
    <h4>PATIENT AUTHORIZATION:</h4>
    <p>
      I voluntarily authorize and request disclosure (including paper,
      oral, and electronic interchange) of: All my medical records;
      including information related to my ability to perform tasks of
      daily living. This includes specific permission to release:
      <ol>
        <li>All records and other information regarding my treatment,
          hospitalization, and outpatient care for my impairment(s)
          including, but not limited to:
          <ul>
            <li>Psychological, psychiatric, or other mental impairment(s)
              excluding "psychotherapy notes" as defined in 45 C.F.R. §164.501,</li>
            <li>Drug abuse, alcoholism, or other substance abuse,</li>
            <li>Sickle cell anemia,</li>
            <li>Records which may indicate the presence of a communicable
              or non-communicable disease; and tests for or records of HIV/AIDS,</li>
            <li>Gene-related impairments (including genetic test results)</li>
          </ul>
        </li>
        <li>Information about how my impairment(s) affects my ability to
          complete tasks and activities of daily living, and affects my ability to work.</li>
        <li>Information created within 12 months after the date this authorization
          is signed in Item 11, as well as past information.</li>
      </ol>
    </p>
    <p>
      YOU SHOULD NOT COMPLETE THIS FORM UNLESS YOU WANT THE VA TO
      OBTAIN PRIVATE TREATMENT RECORDS ON YOUR BEHALF. IF YOU HAVE
      ALREADY PROVIDED THESE RECORDS OR INTEND TO OBTAIN THEM YOURSELF,
      THERE IS NO NEED TO FILL OUT THIS FORM. DOING SO WILL LENGTHEN
      YOUR CLAIM PROCESSING TIME.
    </p>
    <h4>IMPORTANT:</h4>
    <p>
      In accordance with 38 C.F.R. §3.159(c), "VA will not pay any fees
      charged by a custodian to provide records requested."
    </p>
    <h4>PATIENT ACKNOWLEDGMENT:</h4>
    <p>
      I HEREBY AUTHORIZE the sources listed in Section IV, to release
      any information that may have been obtained in connection with
      a physical, psychological or psychiatric examination or treatment,
      with the understanding that VA will use this information in determining
      my eligibility to veterans benefits I have claimed.
    </p>
    <p>
      I understand that the source being asked to provide the Veterans
      Benefits Administration with records under this authorization may
      not require me to execute this authorization before it provides me
      with treatment, payment for health care, enrollment in a health plan,
      or eligibility for benefits provided by it.
    </p>
    <p>
      I understand that once my source sends this information to VA under
      this authorization, the information will no longer be protected by
      the HIPAA Privacy Rule, but will be protected by the Federal Privacy Act,
      5 USC 552a, and VA may disclose this information as authorized by law.
    </p>
    <p>
      I also understand that I may revoke this authorization in writing,
      at any time except to the extent a source of information has already
      relied on it to take an action. To revoke, I must send a written
      statement to the VA Regional Office handling my claim or the Board
      of Veterans' Appeals (if my claim is related to an appeal) and also
      send a copy directly to any of my sources that I no longer wish to
      disclose information about me.
    </p>
    <p>
      I understand that VA may use information disclosed prior to revocation
      to decide my claim.
    </p>
    <p>
      NOTE: For additional information regarding VA Form 21-4142, refer to
      the following website: <a href="https://www.benefits.va.gov/privateproviders/" target="_blank">https://www.benefits.va.gov/privateproviders/</a>.
    </p>
  </AdditionalInfo>
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
      </a>.
      <p>Please print the form, fill it out, and send it to:</p>
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
      </a>.
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

export const documentDescription = () => {
  return (
    <div>
      <p>
        You can upload your document in a pdf, .jpeg, or .png file format.
        You’ll first need to scan a copy of your document onto your computer or
        mobile phone. You can then upload the document from there. Please note
        that large files can take longer to upload with a slow Internet
        connection. Guidelines for uploading a file:
      </p>
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
};

export const additionalDocumentDescription = () => {
  return (
    <div>
      <p>
        If you have other evidence, such as a lay or buddy statement to turn in,
        you can upload them here. You can upload your document in a pdf, .jpeg,
        or .png file format. You’ll first need to scan a copy of your document
        onto your computer or mobile phone. You can then upload the document
        from there. Please note that if you have a slow Internet connection,
        large files can take longer to upload.
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
};

const getVACenterName = center => center.treatmentCenterName;
const getPrivateCenterName = release =>
  release.privateRecordRelease.treatmentCenterName;
const listCenters = centers => {
  return (
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
            {!notLast &&
              !justOne && <span className="unstyled-word"> and </span>}
            {centerName}
            {atLeastThree && notLast && ', '}
          </span>
        );
      })}
    </span>
  );
};

const listDocuments = documents => {
  return (
    <ul>
      {documents.map((document, id) => {
        return (
          <li className="dashed-bullet" key={id}>
            <strong>{document.name}</strong>
          </li>
        );
      })}
    </ul>
  );
};

export const evidenceSummaryView = ({ formData }) => {

  const {
    treatments,
    privateRecords,
    additionalDocuments,
    providerFacility
  } = formData;

  return (
    <div>
      <ul>
        {treatments && (
          <li>
            We’ll get your medical records from {listCenters(treatments)}.
          </li>
        )}
        {providerFacility && (
          <li>
            We’ll get your private medical records from{' '}
            {providerFacility.map((facility, idx) => {
              return (
                <div key={idx}><strong>{facility.providerFacilityName}</strong></div>
              );
            })}
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
export const srSubstitute = (srIgnored, substitutionText) => {
  return (
    <span>
      <span aria-hidden>{srIgnored}</span>
      <span className="sr-only">{substitutionText}</span>
    </span>
  );
};

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
          <DateWidget value={dob} options={{ monthYear: false }}/>
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
    <br/>
  </div>
);

export const UnverifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        To apply for a disability increase, you’ll need to verify your account.
      </div>
    </div>
    <br/>
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
    <br/>
  </div>
);

export const GetFormHelp = () => {
  return (
    <div>
      <p className="help-talk">For help filling out this form, please call:</p>
      <p className="help-phone-number">
        <a className="help-phone-number-link" href="tel:+1-877-222-8387">
          1-877-222-VETS
        </a>{' '}
        (<a className="help-phone-number-link" href="tel:+1-877-222-8387">
          1-877-222-8387
        </a>)<br/>
        Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
      </p>
    </div>
  );
};

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
      uploaded all the supporting documents or additional forms needed to
      support your claim.
    </p>
    <a href="/pension/apply/fully-developed-claim/" target="_blank">
      Learn more about the FDC program
    </a>.
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
        Since you’ll be sending in additional documents later, your application
        doesn’t qualify for the Fully Developed Claim program. We’ll review your
        claim through the standard claim process. Please turn in any information
        to support your claim as soon as you can.
      </div>
    </div>
  </div>
);

export function queryForFacilities(input = '') {
  // Only search if the input has a length >= 3, otherwise, return an empty array
  if (input.length < 3) {
    return Promise.resolve([]);
  }

  const url = appendQuery('/facilities/suggested', {
    type: ['health', 'dod_health'],
    name_part: input, // eslint-disable-line camelcase
  });

  return apiRequest(
    url,
    {},
    response => {
      return response.data.map(facility => ({
        id: facility.id,
        label: facility.attributes.name,
      }));
    },
    error => {
      Raven.captureMessage('Error querying for facilities', { input, error });
      return [];
    },
  );
}

const evidenceTypesDescription = disabilityName => {
  return (
    <p>
      What supporting evidence will you be turning in that shows your{' '}
      {disabilityName}{' '}
      <strong>has gotten worse since you received a VA rating</strong>?
    </p>
  );
};

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
export const get4142Selection = disabilities => {
  return disabilities.reduce((selected, disability) => {
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
};

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

export const validateBooleanIfEvidence = (errors, fieldData, formData, schema, messages, options, index) => {
  const { wrappedValidator } = options;
  if (get('view:hasEvidence', formData, true)) {
    wrappedValidator(errors, fieldData, formData, schema, messages, index);
  }
};

export const title10DatesRequired = (formData) => get('view:isTitle10Activated', formData, false);
