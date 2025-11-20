import React from 'react';

const PharmacyClaimsDescription = (
  <>
    <p>
      You’ll need to submit a copy of a document from the pharmacy with
      information about the prescription medication.
    </p>
    <p>
      <strong>Here’s what the document must include:</strong>
    </p>
    <ul>
      <li>
        <strong>The pharmacy’s:</strong>
        <ul style={{ listStyleType: 'disc' }}>
          <li>Name</li>
          <li>Address</li>
          <li>Phone number</li>
        </ul>
      </li>
      <li>
        <strong>The medication’s:</strong>
        <ul style={{ listStyleType: 'disc' }}>
          <li>Name</li>
          <li>Dosage</li>
          <li>Strength</li>
          <li>Quantity</li>
        </ul>
      </li>
      <li>
        <strong>Cost</strong> of the medication.
      </li>
      <li>
        <strong>Copay amount.</strong>
      </li>
      <li>
        <strong>National Drug Code (NDC)</strong> for each medication. This is
        an 11-digit number that’s different from the Rx number.
      </li>
      <li>
        <strong>Date</strong> the pharmacy filled the prescription.
      </li>
      <li>
        <strong>Name of the provider</strong> who wrote the prescription.
      </li>
    </ul>
    <p>
      <strong>Note:</strong> The papers attached to the medication usually
      include this information. Or you can ask the pharmacy to print a document
      with this information.
    </p>
    <p>
      You can also submit any other documents you think may be relevant to this
      claim.
    </p>
  </>
);

export default PharmacyClaimsDescription;
