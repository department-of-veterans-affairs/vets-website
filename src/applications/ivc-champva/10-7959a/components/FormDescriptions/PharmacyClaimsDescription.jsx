import React from 'react';
import FileUploadDescription from './FileUploadDescription';
import SubmittingClaimsAddtlInfo from './SubmittingClaimsAddtlInfo';

const PharmacyClaimsDescription = (
  <>
    <p>
      You’ll need to submit a copy of a document from the pharmacy that includes
      all of this information:
    </p>
    <p>
      <strong>Here’s what the document must include:</strong>
    </p>
    <ul>
      <li>
        Beneficiary’s name, <strong>and</strong>
      </li>
      <li>
        Name, address, and phone number of the pharmacy, <strong>and</strong>
      </li>
      <li>
        Name, dosage, strength, quantity, and cost of the
        medication&mdash;including the amount of your copay,{' '}
        <strong>and</strong>
      </li>
      <li>
        11-digit National Drug Code (NDC) for each medication,{' '}
        <strong>and</strong>
      </li>
      <li>
        Date the pharmacy filled the prescription, <strong>and</strong>
      </li>
      <li>Name of the provider who wrote the prescription</li>
    </ul>
    <p>
      <strong>Note:</strong> The papers attached to the medication usually
      include this information. Or you can ask the pharmacy to print a document
      with this information.
    </p>
    <p>
      You can also submit any other documents you think may be helpful for this
      claim.
    </p>

    <FileUploadDescription />
    <SubmittingClaimsAddtlInfo />
  </>
);

export default PharmacyClaimsDescription;
