import React from 'react';
import FileUploadDescription from './FileUploadDescription';
import ProcedureCodesAddtlInfo from './ProcedureCodesAddtlInfo';
import SubmittingClaimsAddtlInfo from './SubmittingClaimsAddtlInfo';

const MedicalClaimsDescription = () => (
  <>
    <va-alert status="warning">
      <div>
        <p className="vads-u-margin-top--0">
          You’ll need to submit a copy of an itemized billing statement, for
          this claim.
        </p>
        <p className="vads-u-margin-bottom--0">
          If you don’t submit an itemized billing statement, we may not be able
          to process your claim.
        </p>
      </div>
    </va-alert>

    <p>
      You’ll need to submit a copy of the itemized billing statement for the
      medical services the beneficiary received. This statement could be forms
      UB-04, HCFA, or CMS 1500. Some providers call this statement a superbill.
    </p>
    <p>
      Ask the beneficiary’s provider for an itemized bill. The patient copy is
      often missing critical information required by CHAMPVA to process claims.
    </p>

    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      What your itemized billing statement must include
    </h2>
    <p>
      Make sure the itemized billing statement includes all of this information:
    </p>
    <ul>
      <li>
        Beneficiary’s full name and date of birth, <strong>and</strong>
      </li>
      <li>
        Provider’s full name and medical title, <strong>and</strong>
      </li>
      <li>
        Provider’s tax identification number (TIN) or Tax ID (example:
        12-1234567), <strong>and</strong>
      </li>
      <li>
        Office and building address of service, <strong>and</strong>
      </li>
      <li>
        List of charges with the date you received care, <strong>and</strong>
      </li>
      <li>
        Quantity of services, <strong>and</strong>
      </li>
      <li>
        Diagnosis (DX/ICD-10) codes for specific diagnoses (example: A12.345)
      </li>
    </ul>

    <p>
      Your itemized billing statement should also include either of these
      additional procedure codes:
    </p>
    <ul>
      <li>
        Current Procedural Terminology (CPT) codes (example: Lab work, 12345),{' '}
        <strong>or</strong>
      </li>
      <li>
        Healthcare Common Procedure Coding System (PX/HCPCS) codes (example:
        A1234)
      </li>
    </ul>

    <ProcedureCodesAddtlInfo />

    <p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/resources/how-to-file-a-champva-claim/?#supporting-documents-to-send-w"
      >
        Learn more about itemized bills (opens in a new tab)
      </a>
    </p>

    <p>
      You can also submit any other documents you think may be relevant to this
      claim.
    </p>

    <FileUploadDescription />
    <SubmittingClaimsAddtlInfo />
  </>
);

export default MedicalClaimsDescription;
