import React from 'react';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';

export const supportingDocsInfo = formData => {
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
      <p>
        If you don’t have these supporting documents, apply anyway. We’ll try to
        get them for you.
      </p>
      {formData && ( // This needs to be changed to check if the user is a rep once that data gets built out
        <div
          style={{
            marginTop: '20px',
          }}
        >
          <va-accordion open-single>
            <va-accordion-item
              bordered="true"
              header="If you’re a personal representative of the Veteran"
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
                  Alternative Signer Certification (VA Form 21-0972),{' '}
                  <strong>or</strong>
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
                  Appointment of Veterans Service Organization as Claimant’s
                  Representative (VA Form 21-22), <strong>or</strong>
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
                  Appointment of Individual as Claimant’s Representative (VA
                  Form 21-22a), <strong>or</strong>
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

export const createPayload = (file, formId, password) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) {
    payload.append('password', password);
  }
  return payload;
};

export function parseResponse({ data }) {
  const { name } = data.attributes;
  const focusFileCard = () => {
    const target = $$('.schemaform-file-list li').find(entry =>
      entry.textContent?.trim().includes(name),
    );

    if (target) {
      focusElement(target);
    }
  };

  setTimeout(() => {
    focusFileCard();
  }, 100);

  return {
    name,
    confirmationCode: data.attributes.confirmationCode,
  };
}

export function isUserSignedIn(formData) {
  return formData?.isLoggedIn || false;
}
