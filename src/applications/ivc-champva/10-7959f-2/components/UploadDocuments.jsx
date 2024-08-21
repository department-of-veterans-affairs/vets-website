import React from 'react';

export const UploadDocuments = () => {
  return (
    <>
      <div>
        <h2>Upload your billing statement or receipts</h2>
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
        <p>
          You’ll need to upload additional documents for these types of claims:
        </p>
        <ul>
          <li>Inpatient hospital care</li>
          <li>Medical devices, equipment, and supplies</li>
          <li>Prescription medicines</li>
          <li>COVID-19 vaccines</li>
        </ul>
      </div>
    </>
  );
};

export const UploadDocumentSchema = {
  type: 'object',
};
