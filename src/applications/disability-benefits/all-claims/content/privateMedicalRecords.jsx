import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import { VA_FORM4142_URL } from '../constants';

export const privateRecordsChoiceHelp = (
  <AdditionalInfo triggerText="Which should I choose?">
    <h4>You upload your medical records</h4>
    <p>
      If you upload a digital copy of all your medical records, we can review
      your claim more quickly. Uploading a digital file works best if you have a
      computer with a fast Internet connection. The digital file can be uploaded
      as a .pdf or other photo file format, like a .jpeg or .png.
    </p>
    <h4>We get your medical records for you</h4>
    <p>
      If you tell us the name of the private hospital or doctor who treated you
      for your condition, we can get your medical records for you. Getting your
      records may take us some time, and this could mean that it’ll take us
      longer to make a decision on your claim. You’ll need to fill out an
      Authorization to Disclose Information to the VA (VA Form 21-4142) so we
      can request your records.
    </p>
    <p>
      <a href={VA_FORM4142_URL} target="_blank">
        Download VA Form 21-4142
      </a>
      .
    </p>
  </AdditionalInfo>
);

export const documentDescription = () => (
  <div>
    <p>
      You can upload your document in a pdf, .jpeg, or .png file format. You’ll
      first need to scan a copy of your document onto your computer or mobile
      phone. You can then upload the document from there. Please note that large
      files can take longer to upload with a slow Internet connection.
      <br />
      File upload guidelines:
    </p>
    <ul>
      <li>You can upload files in a .pdf, .jpeg, or .png format</li>
      <li>Files can be a maximum of 50MB each</li>
    </ul>
    <p>
      <em>
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
);
