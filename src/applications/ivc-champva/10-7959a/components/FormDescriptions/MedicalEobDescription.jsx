import React from 'react';
import FileUploadDescription from './FileUploadDescription';
import ProcedureCodesAddtlInfo from './ProcedureCodesAddtlInfo';
import SubmittingClaimsAddtlInfo from './SubmittingClaimsAddtlInfo';

const MedicalEobDescription = () => (
  <>
    <p>
      You’ll need to submit an Explanation of Benefits (EOB) from the
      beneficiary’s insurance provider. This is different than the summary of
      benefits for the health insurance policy. The EOB lists what the
      beneficiary’s insurance provider already paid for this specific claim.
    </p>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/resources/how-to-file-a-champva-claim/?#supporting-documents-to-send-w"
      >
        Learn more about an Explanation of Benefits (opens in a new tab)
      </a>
    </p>

    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      What the EOB must include
    </h2>
    <p>The EOB must include all of this information:</p>
    <ul>
      <li>
        Date of service that matches the date of care, <strong>and</strong>
      </li>
      <li>
        Provider’s full name, <strong>and</strong>
      </li>
      <li>
        Provider’s 10-digit National Provider Identifier (NPI) code if not shown
        on the itemized billing statement, <strong>and</strong>
      </li>
      <li>
        Services the insurance provider paid for, <strong>and</strong>
      </li>
      <li>Amount paid by the insurance provider</li>
    </ul>
    <p>
      <strong>Note:</strong> An explanation of benefits is usually sent by mail
      or email. Contact the beneficiary’s insurance provider if you have more
      questions about where to find this document.
    </p>
    <p>
      You can also submit any other documents you think may be relevant to this
      claim.
    </p>

    <ProcedureCodesAddtlInfo />
    <FileUploadDescription />
    <SubmittingClaimsAddtlInfo />
  </>
);

export default MedicalEobDescription;
