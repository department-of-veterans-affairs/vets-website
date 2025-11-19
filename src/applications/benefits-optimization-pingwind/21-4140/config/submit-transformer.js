import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  hasEmploymentInLast12Months,
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../utils/employment';

const digits = value => {
  if (typeof value !== 'string') {
    return typeof value === 'number' ? String(value) : undefined;
  }

  const onlyDigits = value.replace(/\D/g, '');
  return onlyDigits || undefined;
};

const trimString = value => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const isPresent = value => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
};

const clean = value => {
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map(item => clean(item))
      .filter(item => isPresent(item));
    return cleanedArray.length ? cleanedArray : undefined;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [key, val]) => {
      const cleanedValue = clean(val);
      if (isPresent(cleanedValue)) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {});
  }

  return trimString(value);
};

const formatDate = input => {
  if (!input) {
    return undefined;
  }

  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input;
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return trimString(input);
  }

  return date.toISOString().slice(0, 10);
};

const mapFullName = fullName => {
  if (!fullName) {
    return undefined;
  }

  const { first, middle, last, suffix } = fullName;

  return clean({
    first,
    middle,
    last,
    suffix,
  });
};

const mapAddress = address => {
  if (!address) {
    return undefined;
  }

  const {
    street,
    street2,
    city,
    state,
    postalCode,
    internationalPostalCode,
    country,
    countryCodeIso3,
  } = address;

  return clean({
    street,
    apartment: street2,
    city,
    state,
    postalCode: postalCode || internationalPostalCode,
    country: country || countryCodeIso3,
  });
};

const mapContact = veteran => {
  if (!veteran) {
    return undefined;
  }

  const { email, homePhone, alternatePhone } = veteran;

  return clean({
    email,
    primaryPhone: digits(homePhone),
    alternatePhone: digits(alternatePhone),
  });
};

const toStringValue = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value);
};

const formatEmployerAddress = employerAddress => {
  if (!employerAddress) {
    return undefined;
  }

  const parts = [
    employerAddress.street,
    employerAddress.city,
    employerAddress.state,
    employerAddress.postalCode,
  ].filter(Boolean);

  return parts.join(', ');
};

const mapEmploymentHistory = employers => {
  if (!Array.isArray(employers)) {
    return undefined;
  }

  const mappedEmployers = employers.map(employer => {
    if (!employer) {
      return undefined;
    }

    const nameAndAddressParts = [
      employer.employerName,
      formatEmployerAddress(employer.employerAddress),
    ].filter(Boolean);

    const dateRange = clean({
      from: formatDate(employer.datesOfEmployment?.from),
      to: formatDate(employer.datesOfEmployment?.to),
    });

    return clean({
      nameAndAddress: nameAndAddressParts.join(', '),
      typeOfWork: employer.typeOfWork,
      timeLost: toStringValue(employer.lostTime),
      hoursPerWeek: toStringValue(employer.hoursPerWeek),
      dateRange,
      grossEarningsPerMonth: toStringValue(employer.highestIncome),
    });
  });

  return clean(mappedEmployers);
};

const buildEmploymentStatus = (hasEmployment, mailedDate) => {
  if (typeof hasEmployment !== 'boolean') {
    return undefined;
  }

  return clean({
    radio: hasEmployment ? '0' : '1',
    mailedDate,
  });
};

const buildSignatureSectionTwo = (employedByVA, signatureDate) => {
  if (!employedByVA) {
    return undefined;
  }

  const { hasCertifiedSection2, hasUnderstoodSection2 } = employedByVA;

  return clean({
    hasCertifiedSection2,
    hasUnderstoodSection2,
    signatureDate,
  });
};

const buildSignatureSectionThree = (employedByVA, signatureDate) => {
  if (!employedByVA) {
    return undefined;
  }

  const { hasCertifiedSection3, hasUnderstoodSection3 } = employedByVA;

  return clean({
    hasCertifiedSection3,
    hasUnderstoodSection3,
    signatureDate,
  });
};

const mapStationAddress = stationAddress => {
  if (!stationAddress) {
    return undefined;
  }

  if (typeof stationAddress === 'string') {
    return clean({
      address: stationAddress,
    });
  }

  if (typeof stationAddress === 'object') {
    if ('address' in stationAddress) {
      return clean({
        address: stationAddress.address,
      });
    }

    return clean({
      address: formatEmployerAddress(stationAddress),
    });
  }

  return undefined;
};

const createSubmissionDate = options => {
  if (options?.submissionTimestamp) {
    return formatDate(options.submissionTimestamp);
  }

  return formatDate(new Date());
};

const transformForSubmit = (formConfig, form, options) => {
  const transformed = JSON.parse(
    sharedTransformForSubmit(formConfig, form, options),
  );

  const submissionDate = createSubmissionDate(options);
  const hasEmployment = hasEmploymentInLast12Months(transformed);
  const showEmploymentSection = shouldShowEmploymentSection(transformed);
  const showUnemploymentSection = shouldShowUnemploymentSection(transformed);
  const veteran = transformed.veteran || {};

  const veteranSsn = digits(veteran.ssn);

  const submissionForm = clean({
    veteranFullName: mapFullName(veteran.fullName),
    veteranSocialSecurityNumber: veteranSsn,
    vaFileNumber: trimString(veteran.vaFileNumber),
    dateOfBirth: formatDate(veteran.dateOfBirth),
    veteranAddress: mapAddress(veteran.address),
    veteranServiceNumber: trimString(veteran.veteranServiceNumber),
    veteranContact: mapContact(veteran),
    employmentStatus: buildEmploymentStatus(hasEmployment, submissionDate),
    signatureSection1: clean({
      signatureDate: submissionDate,
      veteranSocialSecurityNumber: veteranSsn,
    }),
    employmentHistory: showEmploymentSection
      ? mapEmploymentHistory(transformed.employers)
      : undefined,
    signatureSection2: showEmploymentSection
      ? buildSignatureSectionTwo(transformed.employedByVA, submissionDate)
      : undefined,
    signatureSection3: showUnemploymentSection
      ? buildSignatureSectionThree(transformed.employedByVA, submissionDate)
      : undefined,
    stationAddress: mapStationAddress(transformed.stationAddress),
    files: Array.isArray(transformed.files) ? transformed.files : undefined,
    formNumber: transformed.formNumber,
  });

  return JSON.stringify({
    // API contract requires this snake_case key
    // eslint-disable-next-line camelcase
    employment_questionnaires_claim: {
      form: JSON.stringify(submissionForm || {}),
    },
  });
};

export default transformForSubmit;
