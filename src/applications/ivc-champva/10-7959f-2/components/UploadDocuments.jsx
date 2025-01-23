import React from 'react';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';

export const supportingDocsInfo = (
  <div>
    <p>
      <b>Supporting documents for certain claims</b>
    </p>
    <p className="vad-u-margin-top--0">
      You’ll need to upload additional documents for these types of claims:
    </p>
    <ul>
      <li>Inpatient hospital care</li>
      <li>Medical devices, equipment, and supplies</li>
      <li>Prescription medicines</li>
      <li>COVID-19 vaccines</li>
    </ul>
    <a href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/#supporting-documents-to-send-w">
      Find out which documents you need
    </a>
    <div className="vads-u-margin-top--2">
      {fileUploadBlurb['view:fileUploadBlurb']['ui:description']}
    </div>
  </div>
);

export const UploadDocumentsVeteran = () => {
  return (
    <>
      <div>
        <p>
          Upload proof that you paid the provider. This can be a receipt or a
          billing statement that’s marked as "paid." Make sure it includes this
          information:
        </p>
        <ul>
          <li>Date you paid the provider</li>
          <li>Care, services, medications, or supplies you paid for</li>
          <li>Address of the provider or pharmacy</li>
          <li>Amount you paid</li>
        </ul>
        {supportingDocsInfo}
      </div>
    </>
  );
};

export const UploadDocumentsProvider = () => {
  return (
    <>
      <div>
        <p>
          <b>
            Upload an itemized billing statement from your provider. Make sure
            it includes this information:
          </b>
        </p>
        <ul>
          <li>Provider’s full name and medical title</li>
          <li>Office address and billing address</li>
          <li>Phone number</li>
          <li>Health conditions you got care for</li>
          <li>Dates you got that care</li>
          <li>Amount due</li>
        </ul>
        {supportingDocsInfo}
      </div>
    </>
  );
};
