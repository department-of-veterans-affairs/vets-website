import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const aboutPrivateMedicalRecords = () => {
  return (
    <div>
      <h4>About private medical records</h4>
      <p>
        You said you were treated for [condition] by a private doctor. If you
        have those records, you can upload them here, or we can get them for
        you. If you want us to get your records, you‘ll need to authorize their
        release.
      </p>
      <p>Do you want to upload your private medical records?</p>
    </div>
  );
};

export const recordReleaseSummary = ({ formData }) => {
  const providerFacility = formData.providerFacility;
  return (
    <div>
      <br/>
      <li>We'll get your private medical records from</li>
      {providerFacility.map((provider, idx) => {
        return (
          <ul key={idx}>
            <strong>{provider.providerFacilityName}</strong>
          </ul>
        );
      })}
    </div>
  );
};

export const recordReleaseDescription = () => {
  return (
    <div>
      <p>
        Please let us know where and when you received treatment. We'll request
        your private medical records for you. If you have records available, you
        can upload them later in the application.
      </p>
    </div>
  );
};

export const recordHelp = (
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
);

export const limitedConsentDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      Limited consent means that your doctor can only share records that are
      directly related to your condition. This could add on the time it takes to
      get your private medical records.
    </p>
  </AdditionalInfo>
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

function isValidZIP(value) {
  if (value) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}
export function validateZIP(errors, fieldData) {
  if (fieldData && !isValidZIP(fieldData)) {
    errors.addError('Please enter a valid 5 or 9 digit ZIP (dashes allowed)');
  }
}

export const disabilityNameTitle = () => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">[condition]</legend>
  );
};

/** Note: This function will be moved to the 526EZ helper file
 * Converts the treatment date range into an array of objects from just an object
 * @param {object} treatmentDateRange object containing from/to date range
 */
const transformDateRange = (treatmentDateRange) => {
  return [treatmentDateRange];
};

/** Note: This function will be moved to the 526EZ helper file
 * Cycles through the list of provider facilities and performs transformations on each property as needed
 * @param {array} providerFacility array of objects being transformed
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

// Note: This function will be merged into the existing 526EZ transform function.
export function transform(formConfig, form) {
  const {
    providerFacility,
    veteranAddress,
    veteranDateOfBirth,
    veteranFullName,
    veteranPhone,
    veteranSocialSecurityNumber,
    vaFileNumber,
    limitedConsent,
    privacyAgreementAccepted
  } = form.data;

  const transformedData = {
    providerFacility: transformProviderFacility(providerFacility), // This will be the only line that needs to go into the transform function for 526EZ
    privacyAgreementAccepted,
    veteranFullName,
    veteranSocialSecurityNumber,
    veteranDateOfBirth,
    veteranAddress,
    veteranPhone,
    vaFileNumber,
    limitedConsent
  };

  return JSON.stringify(transformedData);
}
