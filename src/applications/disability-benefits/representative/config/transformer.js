import removeDeeplyEmptyObjects from 'platform/utilities/data/removeDeeplyEmptyObjects';

/**
 * Form data transformer for Representative 526EZ submission
 *
 * This transformer converts the form data into the format expected by the
 * ARP submission endpoint for disability compensation claims.
 */

const ADDRESS_KEYS = [
  'country',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'state',
  'zipCode',
];

/**
 * Trim string and return undefined if empty
 */
const trimString = value => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

/**
 * Extract digits only from a string
 */
const digitsOnly = value => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const digits = value.replace(/\D/g, '');
  return digits.length ? digits : undefined;
};

/**
 * Sanitize full name object
 */
const sanitizeFullName = fullName => {
  if (!fullName || typeof fullName !== 'object') {
    return undefined;
  }

  const first = trimString(fullName.first);
  const middle = trimString(fullName.middle);
  const last = trimString(fullName.last);

  if (!first || !last) {
    return undefined;
  }

  const result = { first, last };
  if (middle) {
    result.middle = middle;
  }

  return result;
};

/**
 * Sanitize veteran record (name, SSN, DOB, postal code)
 */
const sanitizeVeteranRecord = ({ fullName, ssn, dateOfBirth, postalCode }) => {
  const record = {};

  const name = sanitizeFullName(fullName);
  if (name) {
    record.fullName = name;
  }

  const normalizedSsn = digitsOnly(ssn);
  if (normalizedSsn) {
    record.ssn = normalizedSsn;
  }

  const dob = trimString(dateOfBirth);
  if (dob) {
    record.dateOfBirth = dob;
  }

  const postal = trimString(postalCode);
  if (postal) {
    record.postalCode = postal;
  }

  return Object.keys(record).length ? record : undefined;
};

/**
 * Sanitize phone and email
 */
const sanitizePhoneAndEmail = source => {
  if (!source) {
    return undefined;
  }
  const payload = {};
  const phone = digitsOnly(source.primaryPhone);
  const email = trimString(source.emailAddress);

  if (phone) {
    payload.primaryPhone = phone;
  }
  if (email) {
    payload.emailAddress = email;
  }

  return Object.keys(payload).length ? payload : undefined;
};

/**
 * Sanitize mailing address
 */
const sanitizeMailingAddress = address => {
  if (!address) {
    return undefined;
  }

  const payload = ADDRESS_KEYS.reduce((acc, key) => {
    const value = address[key];
    if (typeof value === 'string') {
      const trimmed = trimString(value);
      if (trimmed) {
        acc[key] = trimmed;
      }
    } else if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return Object.keys(payload).length ? payload : undefined;
};

/**
 * Transform disabilities array to submission format
 */
const transformDisabilities = list => {
  if (!Array.isArray(list)) {
    return undefined;
  }

  const transformed = list
    .map(entry => {
      if (!entry) {
        return null;
      }
      const name = trimString(entry.condition);
      if (!name) {
        return null;
      }

      return {
        name,
        disabilityActionType: 'NEW', // For PoC, all conditions are new
      };
    })
    .filter(Boolean);

  return transformed.length ? transformed : undefined;
};

/**
 * Build the 526 submission payload
 *
 * @param {Object} formData - The form data from the representative form
 * @returns {Object} - The formatted submission payload
 */
export const buildForm526Payload = formData => {
  const {
    fullName,
    ssn,
    dateOfBirth,
    veteranIcn,
    phoneAndEmail,
    mailingAddress,
    newDisabilities,
  } = formData || {};

  const sanitizedMailingAddress = sanitizeMailingAddress(mailingAddress);
  const sanitizedPhoneAndEmail = sanitizePhoneAndEmail(phoneAndEmail);
  const disabilities = transformDisabilities(newDisabilities);

  const veteran = sanitizeVeteranRecord({
    fullName,
    ssn,
    dateOfBirth,
    postalCode: sanitizedMailingAddress?.zipCode,
  });

  // Include veteranIcn if available from MVI lookup
  if (veteranIcn) {
    veteran.icn = veteranIcn;
  }

  // Build nested structure matching the expected submission format
  const form526Inner = {
    isVaEmployee: false,
    standardClaim: false,
    phoneAndEmail: sanitizedPhoneAndEmail,
    mailingAddress: sanitizedMailingAddress,
    disabilities,
  };

  const basePayload = {
    veteran,
    form526: {
      form526: form526Inner,
    },
  };

  return removeDeeplyEmptyObjects(basePayload);
};

/**
 * Transform form data for submission
 *
 * @param {Object} formConfig - The form configuration
 * @param {Object} form - The form state
 * @returns {string} - JSON stringified payload
 */
export const transform = (formConfig, form) => {
  const payload = buildForm526Payload(form.data);
  return JSON.stringify(payload);
};

export default transform;
