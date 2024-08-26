import React from 'react';

export const UploadDocuments = () => {
  return (
    <>
      <div>
        <h3>
          Upload proof that you paid the provider. This can be a receipt or a
          billing statement that’s marked as "paid." Make sure it includes this
          information:
        </h3>
        <ul>
          <li>Date you paid the provider</li>
          <li>Care, services, medications, or supplies you paid for</li>
          <li>Address of the provider or pharmacy</li>
          <li>Amount you paid</li>
        </ul>
      </div>
      <div>
        <h3>Supporting documents for certain claims</h3>
        <p className="vad-u-margin-top--0ß">
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
        <h3 className="vad-u-margin-top--0">How to upload files:</h3>
        <ul>
          <li>Use a .jpg, .pdf, or .png file</li>
          <li>Make sure the file size is 10MB or less</li>
          <li>
            If you only have a paper copy, scan or take a photo and upload the
            file
          </li>
        </ul>
      </div>
    </>
  );
};

export const UploadDocumentSchema = {
  type: 'object',
};
