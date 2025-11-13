import React from 'react';

const SupportingDocumentsInfoDescription = () => (
  <div className="vads-u-margin-bottom--2">
    <p>
      <a
        href="https://www.va.gov/records/discharge-documents/"
        rel="noreferrer"
        target="_blank"
      >
        Learn more about these supporting documents (opens in a new tab)
      </a>
    </p>
    <p>
      If you don’t have these supporting documents, apply anyway. We’ll try to
      get them for you.
    </p>
    <p>
      On the next screen, we’ll ask you to submit supporting documents. You’ll
      need the DD214 or other discharge documents of the Veteran or service
      member whose military service will be used to determine eligibility for
      burial in a VA national cemetery. We may also need other documents to
      verify a relationship to a Veteran or the status of a dependent.
    </p>
    <p>You’ll need to submit a copy of one or more of these documents:</p>
    <ul>
      <li>The Veteran’s separation papers (DD214), or</li>
      <li>
        The Veteran’s discharge documents (if you don’t have their DD214), or
      </li>
      <li>
        The Veteran’s pre-need determination of eligibility decision letter, or
      </li>
      <li>A death certificate, or</li>
      <li>Letters from a doctor, or</li>
      <li>A divorce decree, or</li>
      <li>A statement from the Social Security Administration, or</li>
      <li>Any other service documents that prove eligibility for burial</li>
    </ul>

    <va-accordion bordered>
      <va-accordion-item header="If you’re a personal representative of the Veteran">
        <p>You’ll also need to submit a copy of one of these documents:</p>
        <ul>
          <li>A valid power of attorney, or</li>
          <li>A legal guardianship order, or</li>
          <li>
            Another type of legal document that your state considers proof of
            this authority, or
          </li>
          <li>
            Alternative Signer Certification (VA Form 21-0972){' '}
            <a
              href="https://www.vba.va.gov/pubs/forms/VBA-21-0972-ARE.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Get VA Form 21-0972 to download (opens in a new tab)
            </a>
            , or
          </li>
          <li>
            Appointment of Veterans Service Organization as Claimant’s
            Representative (VA Form 21-22){' '}
            <a
              href="https://www.vba.va.gov/pubs/forms/VBA-21-22-ARE.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Get VA Form 21-22 to download (opens in a new tab)
            </a>
            , or
          </li>
          <li>
            Appointment of Individual as Claimant’s Representative (VA Form
            21-22a){' '}
            <a
              href="https://www.vba.va.gov/pubs/forms/VBA-21-22a-ARE.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Get VA Form 21-22a to download (opens in a new tab)
            </a>
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </div>
);

/** @type {PageSchema} */
const supportingDocumentsInfo = {
  path: 'supporting-documents-info',
  title: 'Supporting documents',
  uiSchema: {
    'ui:title': 'Supporting documents',
    'ui:description': <SupportingDocumentsInfoDescription />,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default supportingDocumentsInfo;
