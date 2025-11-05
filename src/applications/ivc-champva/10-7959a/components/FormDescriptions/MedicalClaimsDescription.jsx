import React from 'react';

const MedicalClaimsDescription = (
  <>
    <va-alert status="warning">
      <div>
        <p className="vads-u-margin-top--0">
          You’ll need to submit a copy of an{' '}
          <strong>itemized billing statement</strong>, often called a superbill,
          for this claim.
        </p>
        <p className="vads-u-margin-bottom--0">
          Ask the beneficiary’s provider for an itemized bill as the patient
          copy is often missing critical information required by CHAMPVA to
          process claims.
        </p>
      </div>
    </va-alert>

    <p>
      <strong>
        The statement must include all of this information to process your
        claim:
      </strong>
    </p>
    <ul>
      <li>
        <strong>The beneficiary’s:</strong>
        <ul style={{ listStyleType: 'disc' }}>
          <li>Full name</li>
          <li>Date of birth</li>
        </ul>
      </li>
      <li>
        <strong>The beneficiary’s provider’s:</strong>
        <ul style={{ listStyleType: 'disc' }}>
          <li>Full name</li>
          <li>Medical title</li>
          <li>Address where services were rendered</li>
          <li>10-digit National Provider Identifier (NPI)</li>
          <li>
            9-digit tax identification number (TIN or Tax ID; example
            12-1234567)
          </li>
        </ul>
      </li>
      <li>
        <strong>A list of charges</strong> for the beneficiary’s care
      </li>
      <li>
        <strong>The date of service</strong> when the beneficiary got the care
      </li>
      <li>
        <strong>Diagnosis (DX) codes</strong> for the care
      </li>
      <li>
        <strong>A list of procedure codes</strong> for the care:
        <ul style={{ listStyleType: 'disc' }}>
          <li>Current Procedural Terminology (CPT) codes or</li>
          <li>Healthcare Common Procedure Coding System (HCPCS) codes</li>
        </ul>
      </li>
    </ul>

    <va-additional-info
      trigger="More information about the codes that should be included"
      class="vads-u-margin-bottom--4"
    >
      <ul>
        <li>
          <strong>DX codes</strong>, or diagnosis codes, are used to identify a
          specific diagnosis. They are typically a letter followed by a series
          of 3-7 numbers, usually including a decimal point (example: A12.345).
        </li>
        <li>
          <strong>CPT codes</strong> are used to identify a medical service or
          procedure. They are usually a 5-digit code (example: 12345).
        </li>
        <li>
          <strong>HCPCS codes</strong> are used to identify products, supplies,
          and services. They are usually one alphabet letter followed by 4
          digits (example: A1234).
        </li>
      </ul>
    </va-additional-info>

    <p>
      <strong>Note:</strong> CHAMPVA will not be able to process your claim if
      your statement does not include all of the listed information. You may
      need to ask your provider for a statement that has all of the information
      listed here.
    </p>

    <p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/resources/how-to-file-a-champva-claim/"
      >
        Learn more about itemized bills (opens in a new tab)
      </a>
    </p>

    <p>
      You can also submit any other documents you think may be relevant to this
      claim.
    </p>
  </>
);

export default MedicalClaimsDescription;
