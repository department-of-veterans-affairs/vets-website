import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const privateRecordsChoiceHelp = (
  <div className="private-records-choice-help">
    <AdditionalInfo triggerText="Which should I choose?">
      <h4>You upload your medical records</h4>
      <p>
        If you upload a digital copy of all your medical records, we can review
        your claim more quickly. Uploading a digital file works best if you have
        a computer with a fast Internet connection. The digital file can be
        uploaded as a .pdf or other photo file format, like a .jpeg or .png.
      </p>
      <h4>We get your medical records for you</h4>
      <p>
        If you tell us the name of the private doctor or hospital that treated
        you for your condition, we can get your medical records for you. Getting
        your records may take us some time, and this could mean that it’ll take
        us longer to make a decision on your claim.
      </p>
    </AdditionalInfo>
  </div>
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
