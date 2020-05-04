import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
import { Validator } from 'jsonschema';
import fullSchemaIncrease from 'vets-json-schema/dist/21-526EZ-schema.json';
import moment from 'moment';

import { apiRequest } from 'platform/utilities/api';
import { isValidUSZipCode, isValidCanPostalCode } from 'platform/forms/address';
import { stateRequiredCountries } from 'platform/forms/definitions/address';
import { filterViewFields } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { pick } from 'lodash';
import { genderLabels } from 'platform/static-data/labels';

import { DateWidget } from 'platform/forms-system/src/js/review/widgets';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import { capitalizeEachWord } from '../all-claims/utils';

import {
  VA_FORM4142_URL,
  SERVICE_CONNECTION_TYPES,
  disabilityActionTypes,
  NULL_CONDITION_STRING,
} from '../all-claims/constants';

/**
 * Inspects an array of objects, and attempts to aggregate subarrays at a given property
 * of each object into one array
 * @param {array} dataArray array of objects to inspect
 * @param {string} property the property to inspect in each array item
 * @param {string} [refPropPath] Path to a property used to determine if the
 *                               `property` should be aggregated. E.g., pointing
 *                               to a boolean `view:thingIsSelected` property will
 *                               ensure that only subarrays with a value of `true`
 *                               for this reference property are pulled into the
 *                               aggregated list.
 * @returns {array} an array of aggregated items pulled from different nested arrays
 */
const aggregate = (dataArray, property, refPropPath) => {
  const masterList = [];
  dataArray.forEach(item => {
    const itemIsSelected = get(refPropPath, item, true);
    if (item[property] && itemIsSelected) {
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
 * If any limited consent text is populated, collect it.
 */
export function gatherLimitedConsentText(disabilities) {
  const fullLimitedConsent = disabilities
    .filter(disability => disability['view:limitedConsent'])
    .reduce((accumulator, disability) => {
      let string = accumulator;
      string = `${string} ${disability.limitedConsent}`;
      return string;
    }, '');
  return fullLimitedConsent.trim();
}

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

  const selectedDisabilities = disabilities.filter(
    disability => disability['view:selected'],
  );

  const additionalDocuments = aggregate(
    selectedDisabilities,
    'additionalDocuments',
    'view:selectableEvidenceTypes.view:otherEvidence',
  );
  const privateRecords = aggregate(
    selectedDisabilities,
    'privateRecords',
    'view:selectableEvidenceTypes.view:privateMedicalRecords',
  );
  const treatments = aggregate(
    selectedDisabilities,
    'treatments',
    'view:selectableEvidenceTypes.view:vaMedicalRecords',
  ).map(treatment => {
    // If the day is missing, set it to the last day of the month because EVSS requires a day
    const [year, month, day] = get(
      'treatmentDateRange.to',
      treatment,
      '',
    ).split('-');
    if (day && day === 'XX') {
      return set(
        'treatmentDateRange.to',
        moment(`${year}-${month}`)
          .endOf('month')
          .format('YYYY-MM-DD'),
        treatment,
      );
    }

    return treatment;
  });

  const attachments = additionalDocuments.concat(privateRecords);

  const transformedData = {
    disabilities: selectedDisabilities.map(filtered =>
      pick(filtered, disabilityProperties),
    ),
    // Pull phone & email out of phoneEmailCard and into veteran property
    veteran: setPhoneEmailPaths(veteran),
    privacyAgreementAccepted,
    serviceInformation,
    standardClaim,
    // treatments has a minItems: 1 requirement so only include the property
    // if there is at least one treatment to send
    ...(treatments.length && { treatments }),
    ...(attachments.length && { attachments }),
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
    Sentry.captureMessage(
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

export function transformDisabilities(disabilities = []) {
  return (
    disabilities
      // We want to remove disabilities that aren't service-connected
      .filter(
        disability =>
          disability.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
      )
      .map(disability =>
        set('disabilityActionType', disabilityActionTypes.INCREASE, disability),
      )
  );
}

export function prefillTransformer(pages, formData, metadata) {
  const { disabilities } = formData;
  if (!disabilities || !Array.isArray(disabilities)) {
    Sentry.captureMessage(
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
    On the next few screens, we’ll ask you where we can find evidence
    (supporting documents like doctor’s reports, X-rays, and medical test
    results) that shows your rated condition has gotten worse. You don’t need to
    turn in any evidence that you already submitted with your original claim.{' '}
    <strong>
      We only need new evidence that shows your rated condition has gotten
      worse.
    </strong>
  </p>
);

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {typeof formData.name === 'string'
      ? capitalizeEachWord(formData.name)
      : NULL_CONDITION_STRING}
  </legend>
);

export const facilityDescription = ({ formData }) => (
  <p>
    Please tell us where VA treated you for{' '}
    {typeof formData.name === 'string'
      ? capitalizeEachWord(formData.name)
      : NULL_CONDITION_STRING}{' '}
    <strong>after you got your disability rating</strong>.
  </p>
);

export const vaMedicalRecordsIntro = ({ formData }) => (
  <p>
    First we’ll ask you about your VA medical records that show your{' '}
    {typeof formData.name === 'string'
      ? capitalizeEachWord(formData.name)
      : NULL_CONDITION_STRING}{' '}
    has gotten worse.
  </p>
);

export const privateRecordsChoice = ({ formData }) => (
  <div>
    <h4>About private medical records</h4>
    <p>
      You said you were treated for{' '}
      {typeof formData.name === 'string'
        ? capitalizeEachWord(formData.name)
        : NULL_CONDITION_STRING}{' '}
      by a private doctor. If you have your private medical records, you can
      upload them to your application. If you want us to get them for you,
      you’ll need to authorize their release.
    </p>
  </div>
);

const firstOrNowString = evidenceTypes =>
  evidenceTypes['view:vaMedicalRecords'] ? 'Now' : 'First,';
export const privateMedicalRecordsIntro = ({ formData }) => (
  <p>
    {firstOrNowString(formData['view:selectableEvidenceTypes'])} we’ll ask you
    about your private medical records that show your{' '}
    {typeof formData.name === 'string'
      ? capitalizeEachWord(formData.name)
      : NULL_CONDITION_STRING}{' '}
    has gotten worse.
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
  <div className="usa-alert usa-alert-warning background-color-only">
    <p>
      Since your doctor has your private medical records, you’ll need to fill
      out an Authorization to Disclose Information to the VA (VA Form 21-4142)
      so we can request your records. You’ll need to fill out a form for each
      doctor.
    </p>
    <p>
      <a href={VA_FORM4142_URL} target="_blank" rel="noopener noreferrer">
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

export const recordReleaseWarning = (
  <div className="usa-alert usa-alert-warning background-color-only">
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
const getPrivateCenterName = release => release.providerFacilityName;
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
  const { treatments, privateRecords, additionalDocuments } = formData;

  const {
    'view:selectableEvidenceTypes': {
      'view:vaMedicalRecords': vaRecordsSelected,
      'view:privateMedicalRecords': privateRecordsSelected,
      'view:otherEvidence': otherEvidenceSelected,
    },
    'view:uploadPrivateRecords': uploadPrivateRecords,
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
        {treatments &&
          vaRecordsSelected && (
            <li>
              We’ll get your medical records from {listCenters(treatments)}.
            </li>
          )}
        {privateRecords &&
          privateRecordsSelected &&
          uploadPrivateRecords === 'yes' && (
            <li>
              We have received the private medical records you uploaded:
              {listDocuments(privateRecords)}
            </li>
          )}
        {privateRecordsSelected &&
          uploadPrivateRecords === 'no' && (
            <li>
              You asked us to get your private medical records from your doctor,
              so you’ll need to fill out an Authorization to Disclose
              Information to the VA (VA Form 21-4142). We’ll provide a link to
              the 21-4142 after you submit your form.
            </li>
          )}
        {additionalDocuments &&
          otherEvidenceSelected && (
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
    <a href="tel:1-800-827-1000">800-827-1000</a>, Monday through Friday, 8:00
    a.m. to 9:00 p.m. ET.
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
        your identity.
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
        your account details. You can also save your form in progress for up to
        1 year and come back later to finish filling it out.
      </div>
    </div>
    <br />
  </div>
);

export const ITFDescription = (
  <span>
    <strong>Note:</strong> By clicking the button to start the disability
    application, you’ll declare your intent to file. This will reserve a
    potential effective date for when you could start getting benefits.
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

const evidenceTypesDescription = disabilityName => (
  <p>
    What supporting evidence will you turn in that shows your {disabilityName}{' '}
    <strong>has gotten worse since you received a VA rating</strong>?
  </p>
);

export const getEvidenceTypesDescription = (form, index) => {
  const { name } = form.disabilities[index];
  return evidenceTypesDescription(
    typeof name === 'string' ? capitalizeEachWord(name) : NULL_CONDITION_STRING,
  );
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
      <a href="/profile">Go to my profile page</a>
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

export function fetchPaymentInformation() {
  return apiRequest('/ppiu/payment_information')
    .then(
      response =>
        // Return only the bit the UI cares about
        response.data.attributes.responses[0].paymentAccount,
    )
    .catch(() => {
      Sentry.captureMessage('vets_payment_information_fetch_failure');
      return Promise.reject();
    });
}

export const PaymentDescription = () => (
  <p>
    This is the bank account information we have on file for you. We’ll pay your
    disability benefit to this account.
  </p>
);

export const ForwardingAddressViewField = ({ formData }) => {
  const { effectiveDate } = formData;
  return (
    <div>
      <EffectiveDateViewField formData={effectiveDate} />
      <AddressViewField formData={formData} />
    </div>
  );
};

const EffectiveDateViewField = ({ formData }) => (
  <p>
    We will use this address starting on{' '}
    <DateWidget value={formData} options={{ monthYear: false }} />:
  </p>
);

export const patientAcknowledgmentText = (
  <AdditionalInfo triggerText="Read the full text.">
    <h4>PATIENT AUTHORIZATION:</h4>
    <p>
      I voluntarily authorize and request disclosure (including paper, oral, and
      electronic interchange) of: All my medical records; including information
      related to my ability to perform tasks of daily living. This includes
      specific permission to release:
    </p>
    <ol>
      <li>
        All records and other information regarding my treatment,
        hospitalization, and outpatient care for my impairment(s) including, but
        not limited to:
      </li>
      <ul>
        <li>
          Psychological, psychiatric, or other mental impairment(s) excluding
          "psychotherapy notes" as defined in 45 C.F.R. §164.501,
        </li>
        <li>Drug abuse, alcoholism, or other substance abuse,</li>
        <li>Sickle cell anemia,</li>
        <li>
          Records which may indicate the presence of a communicable or
          non-communicable disease; and tests for or records of HIV/AIDS,
        </li>
        <li>Gene-related impairments (including genetic test results)</li>
      </ul>
      <li>
        Information about how my impairment(s) affects my ability to complete
        tasks and activities of daily living, and affects my ability to work.
      </li>
      <li>
        Information created within 12 months after the date this authorization
        is signed in Item 11, as well as past information.
      </li>
    </ol>
    <p>
      YOU SHOULD NOT COMPLETE THIS FORM UNLESS YOU WANT THE VA TO OBTAIN PRIVATE
      TREATMENT RECORDS ON YOUR BEHALF. IF YOU HAVE ALREADY PROVIDED THESE
      RECORDS OR INTEND TO OBTAIN THEM YOURSELF, THERE IS NO NEED TO FILL OUT
      THIS FORM. DOING SO WILL LENGTHEN YOUR CLAIM PROCESSING TIME.
    </p>
    <h4>IMPORTANT:</h4>
    <p>
      In accordance with 38 C.F.R. §3.159(c), "VA will not pay any fees charged
      by a custodian to provide records requested."
    </p>
    <h4>PATIENT ACKNOWLEDGEMENT:</h4>
    <p>
      I HEREBY AUTHORIZE the sources listed in Section IV, to release any
      information that may have been obtained in connection with a physical,
      psychological or psychiatric examination or treatment, with the
      understanding that VA will use this information in determining my
      eligibility to veterans benefits I have claimed.
    </p>
    <p>
      I understand that the source being asked to provide the Veterans Benefits
      Administration with records under this authorization may not require me to
      execute this authorization before it provides me with treatment, payment
      for health care, enrollment in a health plan, or eligibility for benefits
      provided by it.
    </p>
    <p>
      I understand that once my source sends this information to VA under this
      authorization, the information will no longer be protected by the HIPAA
      Privacy Rule, but will be protected by the Federal Privacy Act, 5 USC
      552a, and VA may disclose this information as authorized by law.
    </p>
    <p>
      I also understand that I may revoke this authorization in writing, at any
      time except to the extent a source of information has already relied on it
      to take an action. To revoke, I must send a written statement to the VA
      Regional Office handling my claim or the Board of Veterans' Appeals (if my
      claim is related to an appeal) and also send a copy directly to any of my
      sources that I no longer wish to disclose information about me.
    </p>
    <p>
      I understand that VA may use information disclosed prior to revocation to
      decide my claim.
    </p>
    <p>
      NOTE: For additional information regarding VA Form 21-4142, refer to the
      following website:
      <a
        href="https://www.benefits.va.gov/privateproviders/"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.benefits.va.gov/privateproviders/
      </a>
      .
    </p>
  </AdditionalInfo>
);

export const limitedConsentTitle = (
  <p>
    I want to limit my consent for the VA to retrieve only specific information
    from my private medical provider(s).
  </p>
);

export const limitedConsentTextTitle = (
  <p>Describe the limitation below. (Treatment dates, Disability type, etc.)</p>
);

export const limitedConsentDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      If you choose to limit consent, your doctor will abide by the limitation
      you specify. Limiting consent could add to the time it takes to get your
      private medical records.
    </p>
  </AdditionalInfo>
);

export const recordReleaseDescription = () => (
  <div>
    <p>
      Please let us know where and when you received treatment. We’ll request
      your private medical records for you. If you have records available, you
      can upload them later in the application.
    </p>
  </div>
);
