import React from 'react';
import moment from 'moment';
import { isValidSSN } from 'platform/forms-system/src/js/utilities/validations';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import get from 'platform/utilities/data/get';
import jsonData from './Military Ranks.json';
import { serviceLabels } from './labels';

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

export function dateOfDeathValidation(errors, fields) {
  const { veteranDateOfBirth, veteranDateOfDeath } = fields;
  // dob = date of birth | dod = date of death
  const dob = moment(veteranDateOfBirth);
  const dod = moment(veteranDateOfDeath);

  // Check if the dates entered are after the date of birth
  if (dod.isBefore(dob)) {
    errors.veteranDateOfDeath.addError(
      'The Veteran’s date of death must be after the Veteran’s date of birth.',
    );
  }

  // Check if dates have 16 or more years between them
  if (dod.diff(dob, 'years') < 16) {
    errors.veteranDateOfDeath.addError(
      'From date of birth to date of death must be at least 16 years.',
    );
  }
}

export function validateSSN(errors, ssn) {
  if (ssn && !isValidSSN(ssn)) {
    errors.addError(
      'Please enter a valid 9 digit Social Security number (dashes allowed)',
    );
  }
}

export function hasServiceRecord(item) {
  const serviceRecords =
    get('serviceRecords', item) || get('formData.serviceRecords', item);
  return !(serviceRecords === undefined || serviceRecords.length === 0);
}

export function isVeteran(item) {
  const response =
    get('application.claimant.relationshipToVet', item) ||
    get('formData.application.claimant.relationshipToVet', item);
  return response === 'veteran';
}

export function isAuthorizedAgent(item) {
  return (
    get('application.applicant.applicantRelationshipToClaimant', item) ===
    'Authorized Agent/Rep'
  );
}

export const validateMilitaryHistory = (
  errors,
  serviceRecords,
  useAllFormData,
) => {
  if (serviceRecords !== null && serviceRecords !== undefined) {
    const serviceRecord = serviceRecords;

    // Check if serviceBranch is undefined and highestRank is defined
    if (
      serviceRecord.serviceBranch === undefined &&
      serviceRecord.highestRank !== undefined
    ) {
      if (isVeteran(useAllFormData)) {
        if (!isAuthorizedAgent(useAllFormData)) {
          // Self
          errors.highestRank.addError(
            'Select a branch of service before selecting your highest rank attained.',
          );
        } else {
          // Applicant
          errors.highestRank.addError(
            "Select Applicant's branch of service before selecting the Applicant's highest rank attained.",
          );
        }
      } else {
        // Sponsor
        errors.highestRank.addError(
          "Select Sponsor's branch of service before selecting the Sponsor's highest rank attained.",
        );
      }
    }

    if (serviceRecord.serviceBranch) {
      const branchFilteredRanks = jsonData.filter(
        rank => rank['Branch Of Service Code'] === serviceRecord.serviceBranch,
      );
      if (
        serviceRecord.highestRank &&
        !branchFilteredRanks.some(
          rank => rank['Rank Code'] === serviceRecord.highestRank,
        )
      ) {
        errors.highestRank.addError(
          `This is not a valid rank for ${
            serviceLabels[serviceRecord.serviceBranch]
          }`,
        );
      }
    }

    // Date of birth validation
    let dob;
    let errorMessage;

    if (isVeteran(useAllFormData)) {
      if (!isAuthorizedAgent(useAllFormData)) {
        // Self
        dob = useAllFormData?.application?.claimant?.dateOfBirth;
        errorMessage = 'Provide a valid date that is after your date of birth';
      } else {
        // Applicant
        dob = useAllFormData?.application?.claimant?.dateOfBirth;
        errorMessage =
          "Provide a valid date that is after the applicant's date of birth";
      }
    } else {
      // Sponsor
      dob = useAllFormData?.application?.veteran?.dateOfBirth;
      errorMessage =
        "Provide a valid date that is after the sponsor's date of birth";
    }

    // Date of birth validation against service start date and service end date
    if (serviceRecord.dateRange.from <= dob) {
      errors.dateRange.from.addError(errorMessage);
    }

    if (serviceRecord.dateRange.to <= dob) {
      errors.dateRange.to.addError(errorMessage);
    }
  }
};
