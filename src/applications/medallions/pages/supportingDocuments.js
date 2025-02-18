import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const description = formData => {
  return (
    <div>
      <p>On the next screen, we’ll ask you to submit supporting documents. </p>
      <p>You’ll need to submit a copy of one of these documents:</p>
      <ul>
        <li>
          The Veteran’s separation papers (DD214), <strong>or</strong>
        </li>
        <li>
          The Veteran’s discharge documents (if you don’t have their DD214),{' '}
          <strong>or</strong>
        </li>
        <li>
          The Veteran’s pre-need determination of eligibility decision letter,{' '}
          <strong>or</strong>
        </li>
        <li>
          Any other service documents that prove the Veteran’s eligibility for a
          medallion
        </li>
      </ul>
      <a
        href="https://www.va.gov/records/discharge-documents/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about these supporting documents (opens in a new tab)
      </a>
      {formData && ( // This needs to be changed to check if the user is a rep once that data gets built out
        <div
          style={{
            marginTop: '20px',
          }}
        >
          <va-accordion open-single>
            <va-accordion-item
              header="If you’re a personal representative of the applicant"
              id="first"
            >
              <p>
                You’ll also need to submit a copy of one of these documents:
              </p>
              <ul>
                <li>
                  A valid power of attorney, <strong>or</strong>
                </li>
                <li>
                  A legal guardianship order, <strong>or</strong>
                </li>
                <li>
                  Another type of legal document that your state considers proof
                  of this authority, <strong>or</strong>
                </li>
                <li>
                  <strong>Alternative Signer Certification</strong> (VA Form
                  21-0972), <strong>or</strong>
                  <br />
                  <a
                    href="https://www.va.gov/find-forms/about-form-21-0972/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get VA Form 21-0972 to download (opens in new tab)
                  </a>
                </li>
                <li>
                  <strong>
                    Appointment of Veterans Service Organization as Claimant’s
                    Representative
                  </strong>{' '}
                  (VA Form 21-22), <strong>or</strong>
                  <br />
                  <a
                    href="https://www.va.gov/find-forms/about-form-21-22/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get VA Form 21-22 to download (opens in new tab)
                  </a>
                </li>
                <li>
                  <strong>
                    Appointment of Individual as Claimant’s Representative
                  </strong>{' '}
                  (VA Form 21-22a)
                  <br />
                  <a
                    href="https://www.va.gov/find-forms/about-form-21-22a/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get VA Form 21-22a to download (opens in new tab)
                  </a>
                </li>
              </ul>
            </va-accordion-item>
          </va-accordion>
        </div>
      )}
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting Documents'),
    'ui:description': formData => description(formData),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
