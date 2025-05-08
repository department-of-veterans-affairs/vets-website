import React from 'react';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const applicantRelationToVetRadio = {
  relationToVetRadio: radioUI({
    title: 'What’s your relationship to the Veteran?',
    labels: {
      familyMember: 'Family member',
      personalRep: 'Personal representative',
      repOfVSO: 'Representative of Veterans Service Organization (VSO)',
      repOfCemetery: 'Representative of a cemetery',
      repOfFuneralHome: 'Representative of a funeral home',
      other: 'Other',
    },
    required: () => true,
    errorMessages: {
      required: 'Please select an option',
    },
  }),
};

export const validateVetRadioOtherComment = (formData, errors) => {
  if (formData.relationToVetRadio === 'other') {
    if (!formData.otherRelation) {
      errors.otherRelation.addError('You must provide a response');
    } else if (formData.otherRelation.length > 50) {
      errors.otherRelation.addError(
        'Character limit exceeded. Maximum 50 characters allowed.',
      );
    }
  }
  return errors;
};

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
  return formData?.isLoggedIn;
}

export const ApplicantNameHeader = () => {
  return (
    <h3 className="vads-u-margin-bottom--3">
      Confirm the personal information we have on file for you
    </h3>
  );
};

export const ApplicantNameNote = () => {
  return (
    <div className="vads-u-margin-bottom--4" data-testid="default-note">
      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, Social Security number, or date of
        birth. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m. ET.
        We’ll give you instructions for how to change your information. Or you
        can learn how to change your legal name on file with VA.{' '}
      </p>
      <va-link
        external
        href="https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/"
        text="Learn how to change your legal name"
      />
    </div>
  );
};
