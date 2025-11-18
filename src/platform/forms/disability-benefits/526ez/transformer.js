import removeDeeplyEmptyObjects from 'platform/utilities/data/removeDeeplyEmptyObjects';

// Map disability causes from schema values to submission values
const DISABILITY_ACTION_TYPE_MAP = {
  NEW: 'NEW',
  SECONDARY: 'SECONDARY',
  WORSENED: 'WORSENED',
  VA: 'VA',
};

const NEW_DISABILITY_ALLOWED_CAUSES = new Set([
  'NEW',
  'SECONDARY',
  'WORSENED',
  'VA',
]);

const NEW_DISABILITY_OPTIONAL_FIELDS = [
  'classificationCode',
  'primaryDescription',
  'causedByDisability',
  'causedByDisabilityDescription',
  'specialIssues',
  'worsenedDescription',
  'worsenedEffects',
  'vaMistreatmentDescription',
  'vaMistreatmentLocation',
  'vaMistreatmentDate',
];

const ADDRESS_KEYS = [
  'country',
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'city',
  'state',
  'zipCode',
];

const trimString = value => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const digitsOnly = value => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const digits = value.replace(/\D/g, '');
  return digits.length ? digits : undefined;
};

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

  const result = {
    first,
    last,
  };

  if (middle) {
    result.middle = middle;
  }

  return result;
};

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

const sanitizeCause = cause => {
  if (typeof cause !== 'string') {
    return 'NEW';
  }
  const upper = cause.trim().toUpperCase();
  return NEW_DISABILITY_ALLOWED_CAUSES.has(upper) ? upper : 'NEW';
};

// Transform disabilities array to match veteran-facing submission structure
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

      const disabilityActionType =
        DISABILITY_ACTION_TYPE_MAP[sanitizeCause(entry.cause)] || 'NEW';

      const result = {
        name,
        disabilityActionType,
      };

      // Include optional fields if present
      NEW_DISABILITY_OPTIONAL_FIELDS.forEach(field => {
        const value = entry[field];
        if (Array.isArray(value)) {
          if (value.length) {
            result[field] = value;
          }
        } else if (typeof value === 'string') {
          const trimmed = trimString(value);
          if (trimmed) {
            result[field] = trimmed;
          }
        } else if (value !== undefined && value !== null) {
          result[field] = value;
        }
      });

      return result;
    })
    .filter(Boolean);

  return transformed.length ? transformed : undefined;
};

const sanitizeNewDisabilities = list => {
  if (!Array.isArray(list)) {
    return undefined;
  }

  const sanitized = list
    .map(entry => {
      if (!entry) {
        return null;
      }
      const condition = trimString(entry.condition);
      if (!condition) {
        return null;
      }

      const result = {
        condition,
        cause: sanitizeCause(entry.cause),
      };

      NEW_DISABILITY_OPTIONAL_FIELDS.forEach(field => {
        const value = entry[field];
        if (Array.isArray(value)) {
          if (value.length) {
            result[field] = value;
          }
        } else if (typeof value === 'string') {
          const trimmed = trimString(value);
          if (trimmed) {
            result[field] = trimmed;
          }
        } else if (value !== undefined && value !== null) {
          result[field] = value;
        }
      });

      return result;
    })
    .filter(Boolean);

  return sanitized.length ? sanitized : undefined;
};

const buildForm526 = formData => {
  const veteranInformationSection =
    formData?.veteranInformationSection || {};
  const contactInformationSection =
    formData?.contactInformationSection || {};
  const disabilitiesSection = formData?.disabilitiesSection || {};

  const mailingAddress = sanitizeMailingAddress(
    contactInformationSection.mailingAddress,
  );
  const phoneAndEmail = sanitizePhoneAndEmail(
    contactInformationSection.phoneAndEmail,
  );
  const disabilities = transformDisabilities(
    disabilitiesSection.newDisabilities,
  );

  const veteran = sanitizeVeteranRecord({
    fullName: veteranInformationSection.veteranFullName,
    ssn: veteranInformationSection.veteranSocialSecurityNumber,
    dateOfBirth: veteranInformationSection.veteranDateOfBirth,
    postalCode:
      mailingAddress?.zipCode ??
      contactInformationSection?.mailingAddress?.zipCode,
  });

  // Build nested structure matching veteran-facing app
  const form526Inner = {
    isVaEmployee: false,
    standardClaim: false,
    phoneAndEmail,
    mailingAddress,
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

export const buildRepresentativeForm526 = formData =>
  buildForm526(formData || {});

export const transformRepresentativeForm = formData =>
  JSON.stringify(buildRepresentativeForm526(formData || {}));

export default transformRepresentativeForm;
