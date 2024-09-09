import React from 'react';

const DocumentTypeDescription = (
  <>
    <p>You can submit one of these types of documents:</p>
    <ul>
      <li>
        A valid power of attorney, <strong>or</strong>
      </li>
      <li>
        A legal guardianship order, <strong>or</strong>
      </li>
      <li>
        Another type of legal document that your state considers proof of this
        authority, <strong>or</strong>
      </li>
      <li>
        Alternate Signer Certification (VA Form 21-0972), <strong>or</strong>
      </li>
      <li>
        Appointment of Veterans Service Organization as Claimant’s
        Representative (VA Form 21-22), <strong>or</strong>
      </li>
      <li>
        Appointment of Individual As Claimant’s Representative (VA Form 21-22a)
      </li>
    </ul>
    <p className="vads-u-margin-bottom--0">
      We can’t accept a marriage certificate, driver’s license, or release of
      information form. Uploading a document that we can’t accept may delay the
      application process.
    </p>
  </>
);

export default DocumentTypeDescription;
