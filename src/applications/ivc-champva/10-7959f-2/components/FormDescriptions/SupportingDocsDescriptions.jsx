import React from 'react';
import FileUploadDescription from './FileUploadDescription';

export const SupportingDocsDescription = () => (
  <>
    <p>
      <strong>Supporting documents for certain claims</strong>
    </p>
    <p>You’ll need to upload additional documents for these types of claims:</p>
    <ul>
      <li>Inpatient hospital care</li>
      <li>Medical devices, equipment, and supplies</li>
      <li>Prescription medicines</li>
      <li>COVID-19 vaccines</li>
    </ul>
    <p>
      <a
        href="/health-care/file-foreign-medical-program-claim/#supporting-documents-to-send-w"
        rel="noreferrer"
        target="_blank"
      >
        Find out which supporting documents you need (opens in a new tab)
      </a>
    </p>

    <FileUploadDescription />
  </>
);

export const VeteranDocsDescription = () => (
  <>
    <p>
      Upload proof that you paid the provider. This can be a receipt or a
      billing statement that’s marked as “paid.” Make sure it includes this
      information:
    </p>
    <ul>
      <li>Date you paid the provider</li>
      <li>Care, services, medications, or supplies you paid for</li>
      <li>Address of the provider or pharmacy</li>
      <li>Amount you paid</li>
    </ul>
  </>
);

export const ProviderDocsDescription = () => (
  <>
    <p>
      Upload an itemized billing statement from your provider. Make sure it
      includes this information:
    </p>
    <ul>
      <li>Provider’s full name and medical title</li>
      <li>Office address and billing address</li>
      <li>Phone number</li>
      <li>Health conditions you got care for</li>
      <li>Dates you got that care</li>
      <li>Amount due</li>
    </ul>
  </>
);
