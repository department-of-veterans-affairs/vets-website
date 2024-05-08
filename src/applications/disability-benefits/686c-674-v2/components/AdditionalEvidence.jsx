import React from 'react';

export const AdditionalEvidence = Component => (
  <div>
    {Component}
    <p>When you upload evidence, note:</p>
    <ul>
      <li>
        We can only accept <strong>JPEG, JPG, PNG or PDF</strong> file types
      </li>
      <li>
        You can upload one or more files, but they have to add up to{' '}
        <strong>10 MB or less</strong>
      </li>
    </ul>
    <p>
      Choose the type of evidence you’ll upload, then click the "Upload
      supporting documents" button to find the files on your computer or phone.
    </p>
  </div>
);
