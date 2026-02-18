import React from 'react';
// eslint-disable-next-line you-dont-need-momentjs/no-import-moment
import moment from 'moment';
import { isValidSSN } from 'platform/forms-system/src/js/utilities/validations';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { focusElement } from 'platform/utilities/ui';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { countries } from 'platform/forms/address';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const envUrl = environment.API_URL;
import get from 'platform/utilities/data/get';

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
          A police report if the medallion was stolen, <strong>or</strong>
        </li>
        <li>
          A photo of the medallion if it was damaged, <strong>or</strong>
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
    // Guard against document being undefined if component unmounts before timeout fires
    if (typeof document === 'undefined') return;
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
  return formData?.['view:loginState']?.isLoggedIn;
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
  // eslint-disable-next-line you-dont-need-momentjs/no-moment-constructor
  const dob = moment(veteranDateOfBirth);
  // eslint-disable-next-line you-dont-need-momentjs/no-moment-constructor
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

const validateServiceDatesAgainstBirth = (errors, serviceRecord, dob) => {
  const errorMessage =
    "Provide a valid date that is after the Veteran's date of birth";
  const dobDate = new Date(dob);

  if (serviceRecord.dateRange.from) {
    const serviceStartDate = new Date(serviceRecord.dateRange.from);
    if (serviceStartDate <= dobDate) {
      errors.dateRange.from.addError(errorMessage);
    }
  }

  if (serviceRecord.dateRange.to) {
    const serviceEndDate = new Date(serviceRecord.dateRange.to);
    if (serviceEndDate <= dobDate) {
      errors.dateRange.to.addError(errorMessage);
    }
  }
};

const getVeteranDateOfBirth = useAllFormData => {
  return (
    useAllFormData?.veteranDateOfBirth ||
    useAllFormData?.application?.claimant?.dateOfBirth ||
    useAllFormData?.application?.veteran?.dateOfBirth
  );
};

export const validateMilitaryHistory = (
  errors,
  serviceRecords,
  useAllFormData,
) => {
  if (!serviceRecords) return;

  const serviceRecord = serviceRecords;

  if (isVeteran(useAllFormData) || isAuthorizedAgent(useAllFormData)) {
    return;
  }

  // Validate service dates against date of birth
  const dob = getVeteranDateOfBirth(useAllFormData);
  if (dob && serviceRecord.dateRange) {
    validateServiceDatesAgainstBirth(errors, serviceRecord, dob);
  }
};

export const requestRecordsLink = () => {
  return (
    <a
      href="https://www.va.gov/records/get-military-service-records/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn how to request military service records (open in new tab)
    </a>
  );
};

export const learnMoreAboutCertsLink = () => {
  return (
    <a
      href="https://www.va.gov/burials-memorials/memorial-items/presidential-memorial-certificates/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more about PMCs (opens in a new tab)
    </a>
  );
};

// FileField helper functions
export const createOpenRemoveModal = (
  setRemoveIndex,
  setShowRemoveModal,
) => index => {
  setRemoveIndex(index);
  setShowRemoveModal(true);
};

export const createCloseRemoveModal = (
  removeIndex,
  setRemoveIndex,
  setShowRemoveModal,
  removeFile,
  getFileListId,
) => ({ remove = false } = {}) => {
  const idx = removeIndex;
  setRemoveIndex(null);
  setShowRemoveModal(false);
  if (remove) {
    removeFile(idx);
  } else {
    setTimeout(() => {
      focusElement(
        'button, .delete-upload',
        {},
        $(`#${getFileListId(idx)} .delete-upload`)?.shadowRoot,
      );
    });
  }
};

export const createCancelUpload = (uploadRequest, removeFile) => index => {
  if (uploadRequest) {
    uploadRequest.abort();
  }
  removeFile(index);
};

export const formatPhone = phone => {
  if (!phone) return 'Not provided';

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Format as xxx-xxx-xxxx if we have exactly 10 digits
  if (digitsOnly.length === 10) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
      3,
      6,
    )}-${digitsOnly.slice(6)}`;
  }

  // If not 10 digits, return as-is (fallback)
  return phone;
};

export const formatSuggestedAddress = address => {
  if (address) {
    let displayAddress = '';
    const street = address.street || address.addressLine1;
    const street2 = address.street2 || address.addressLine2;
    const { city } = address;
    const state = address.state || address.stateCode;
    const zip = address.postalCode || address.zipCode;
    const country = address.country || address.countryCodeIso3;

    if (street) displayAddress += street;
    if (street2) displayAddress += `, ${street2}`;
    if (city) displayAddress += `, ${city}`;
    if (state) displayAddress += `, ${state}`;
    if (zip) displayAddress += ` ${zip}`;
    if (country && country !== 'USA')
      displayAddress += `, ${countries.find(c => c.value === country).label ||
        country}`;

    return displayAddress.trim();
  }
  return '';
};

/* eslint-disable camelcase */
export const prepareAddressForAPI = address => ({
  address_line1: address.street,
  address_line2: address.street2,
  address_pou: 'RESIDENCE',
  address_type: 'DOMESTIC',
  city: address.city,
  country_code_iso3: address.country,
  state_code: address.state,
  zip_code: address.postalCode,
});

export const fetchSuggestedAddress = async userAddress => {
  const options = {
    body: JSON.stringify({
      address: { ...prepareAddressForAPI(userAddress) },
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await apiRequest(
      `${envUrl}/v0/profile/address_validation`,
      options,
    );

    if (res?.addresses && res?.addresses.length > 0) {
      const suggested = res.addresses[0]?.address;
      return {
        fetchedSuggestedAddress: {
          addressLine1: suggested.addressLine1,
          addressLine2: suggested.addressLine2,
          city: suggested.city,
          country: suggested.countryCodeIso3,
          state: suggested.stateCode,
          zipCode: suggested.zipCode,
        },
        fetchedShowSuggestions:
          res?.addresses[0]?.addressMetaData?.confidenceScore !== 100,
      };
    }
  } catch (error) {
    return { fetchedSuggestedAddress: null, fetchedShowSuggestions: false };
  }

  return { fetchedSuggestedAddress: null, fetchedShowSuggestions: false };
};

// Helper function to conditionally return a line with a break
export const addressConfirmationRenderLine = content => {
  return content ? (
    <>
      {content}
      <br />
    </>
  ) : null;
};
