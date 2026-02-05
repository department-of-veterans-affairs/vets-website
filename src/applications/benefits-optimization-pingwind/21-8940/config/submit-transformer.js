import sharedTransformForSubmit from '../../shared/config/submit-transformer';
import {
  doctorCareQuestionFields,
  employmentAppliedFields,
} from '../definitions/constants';

const MAX_LENGTHS = {
  firstName: 12,
  middleInitial: 1,
  lastName: 18,
  disabilities: 81,
  doctorAddresses: 135,
  hospitalAddresses: 127,
  occupation: 27,
  previousEmployerNameAddress: 110,
  previousEmployerType: 39,
  appliedEmployerType: 62,
  trainingName: 12,
  remarks: 603,
};

const stringOrUndefined = value => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }
  return undefined;
};

const digitsOnly = value => {
  if (typeof value !== 'string') {
    return undefined;
  }

  return value.replace(/[^\d]/g, '');
};

const formatPhoneNumber = phone => {
  if (phone === undefined || phone === null) {
    return undefined;
  }

  if (typeof phone === 'string' || typeof phone === 'number') {
    return stringOrUndefined(String(phone));
  }

  if (typeof phone !== 'object') {
    return undefined;
  }

  const contactValue = stringOrUndefined(phone.contact);
  if (!contactValue) {
    return undefined;
  }

  const countryCode = stringOrUndefined(phone.countryCode);
  const callingCodeRaw =
    phone.callingCode === 0 || phone.callingCode
      ? String(phone.callingCode)
      : undefined;

  const contactDigits = digitsOnly(contactValue) || contactValue;
  const callingCodeDigits = callingCodeRaw
    ? digitsOnly(callingCodeRaw)
    : undefined;

  const includeCallingCode =
    callingCodeDigits &&
    (countryCode
      ? countryCode.toUpperCase() !== 'US' || callingCodeDigits !== '1'
      : true);

  const combined = includeCallingCode
    ? `${callingCodeDigits}${contactDigits}`
    : contactDigits;

  return stringOrUndefined(combined);
};

const truncateString = (value, limit) => {
  if (typeof value !== 'string') {
    return value;
  }

  if (!limit) {
    return value.trim();
  }

  const trimmed = value.trim();
  return trimmed.length > limit ? trimmed.slice(0, limit) : trimmed;
};

const normalizeCountry = country => {
  const normalized = stringOrUndefined(country);
  if (!normalized) {
    return undefined;
  }

  const upper = normalized.toUpperCase();
  if (
    upper === 'US' ||
    upper === 'USA' ||
    upper === 'UNITED STATES' ||
    upper === 'UNITED STATES OF AMERICA'
  ) {
    return 'US';
  }

  return upper.length === 2 ? upper : upper.slice(0, 2);
};

const pruneEmpty = value => {
  if (Array.isArray(value)) {
    const prunedArray = value.map(item => pruneEmpty(item)).filter(item => {
      if (item == null) {
        return false;
      }
      if (Array.isArray(item)) {
        return item.length > 0;
      }
      if (typeof item === 'object') {
        return Object.keys(item).length > 0;
      }
      return true;
    });

    return prunedArray.length ? prunedArray : undefined;
  }

  if (value && typeof value === 'object') {
    const prunedObject = Object.entries(value).reduce((acc, [key, val]) => {
      const pruned = pruneEmpty(val);
      if (pruned !== undefined) {
        acc[key] = pruned;
      }
      return acc;
    }, {});

    return Object.keys(prunedObject).length ? prunedObject : undefined;
  }

  if (value === undefined || value === null) {
    return undefined;
  }

  return value;
};

const buildAddress = address => {
  if (!address || typeof address !== 'object') {
    return undefined;
  }

  const result = {
    street: stringOrUndefined(address.street),
    street2: stringOrUndefined(address.street2),
    city: stringOrUndefined(address.city),
    state: stringOrUndefined(address.state),
    postalCode: stringOrUndefined(address.postalCode),
    country: normalizeCountry(address.country) || 'US',
  };

  return pruneEmpty(result);
};

const formatAddressLine = address => {
  if (!address || typeof address !== 'object') {
    return undefined;
  }

  const parts = [];
  const street = stringOrUndefined(address.street);
  const street2 = stringOrUndefined(address.street2);
  const city = stringOrUndefined(address.city);
  const state = stringOrUndefined(address.state);
  const postalCode = stringOrUndefined(address.postalCode);
  const country = normalizeCountry(address.country);

  if (street) {
    parts.push(street);
  }
  if (street2) {
    parts.push(street2);
  }

  const cityStateZip = [city, state, postalCode].filter(Boolean).join(', ');
  if (cityStateZip) {
    parts.push(cityStateZip);
  }

  if (country) {
    parts.push(country);
  }

  return parts.length ? parts.join(', ') : undefined;
};

const formatNameAndAddress = (name, address) => {
  const formattedName = stringOrUndefined(name);
  const formattedAddress = formatAddressLine(address);
  return [formattedName, formattedAddress].filter(Boolean).join(' - ');
};

const isDeepEmpty = value => {
  if (value == null) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isDeepEmpty);
  }

  if (typeof value === 'object') {
    return Object.values(value).every(isDeepEmpty);
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  return false;
};

const extractArrayLike = value => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value.data)) {
      return value.data;
    }

    if (Array.isArray(value.records)) {
      return value.records;
    }

    if (Array.isArray(value.items)) {
      return value.items;
    }
  }

  return [];
};

const toArray = value =>
  extractArrayLike(value).filter(item => !isDeepEmpty(item));

const formatDisabilitiesList = value => {
  if (typeof value === 'string') {
    return truncateString(stringOrUndefined(value), MAX_LENGTHS.disabilities);
  }

  const entries = toArray(value)
    .map(item => {
      if (typeof item === 'string') {
        return stringOrUndefined(item);
      }

      if (item && typeof item === 'object') {
        return stringOrUndefined(item.disability);
      }

      return undefined;
    })
    .filter(Boolean);

  if (!entries.length) {
    return undefined;
  }

  return truncateString(entries.join(', '), MAX_LENGTHS.disabilities);
};

const formatRelatedDisabilities = value => {
  if (typeof value === 'string') {
    const trimmed = stringOrUndefined(value);
    return trimmed ? [trimmed] : undefined;
  }

  const entries = toArray(value)
    .map(item => {
      if (typeof item === 'string') {
        return stringOrUndefined(item);
      }

      if (item && typeof item === 'object') {
        return stringOrUndefined(
          item.relatedDisability || item.disability || item.value,
        );
      }

      return undefined;
    })
    .filter(Boolean);

  return entries.length ? entries : undefined;
};

const toInteger = value => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const normalizeYear = value => {
  const numeric = toInteger(value);
  if (numeric === undefined) {
    return undefined;
  }

  const truncated = Number.parseInt(String(numeric).slice(0, 4), 10);
  return Number.isNaN(truncated) ? undefined : truncated;
};

const toBoolean = value => (typeof value === 'boolean' ? value : undefined);

const toVaNetworkFlag = value => {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = stringOrUndefined(value);
  if (!normalized) {
    return undefined;
  }

  const lower = normalized.toLowerCase();
  if (lower === 'va') {
    return true;
  }

  if (
    lower === 'nonva' ||
    lower === 'non-va' ||
    lower === 'non va' ||
    lower === 'non_va'
  ) {
    return false;
  }

  return undefined;
};

const ensureDateRange = (value, startKey = 'from', endKey = 'to') => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const from =
    stringOrUndefined(value[startKey]) ||
    stringOrUndefined(value.from) ||
    stringOrUndefined(value.startDate);
  const to =
    stringOrUndefined(value[endKey]) ||
    stringOrUndefined(value.to) ||
    stringOrUndefined(value.endDate);

  if (!from && !to) {
    return undefined;
  }

  return {
    from: from || to,
    to: to || from,
  };
};

const toDateRangeArray = (
  items,
  startKey = 'startDate',
  endKey = 'endDate',
) => {
  const ranges = toArray(items)
    .map(item => ensureDateRange(item, startKey, endKey))
    .filter(Boolean);

  return ranges.length ? ranges : undefined;
};

const buildDoctorsCare = doctors =>
  pruneEmpty(
    toArray(doctors).map(entry =>
      pruneEmpty({
        doctorsTreatmentDates: toDateRangeArray(entry?.treatmentDates),
        nameAndAddressOfDoctor: truncateString(
          formatNameAndAddress(entry?.doctorName, entry?.doctorAddress),
          MAX_LENGTHS.doctorAddresses,
        ),
        inVANetwork: toVaNetworkFlag(entry?.doctorType),
        relatedDisability: formatRelatedDisabilities(entry?.relatedDisability),
      }),
    ),
  );

const buildHospitalsCare = hospitals =>
  pruneEmpty(
    toArray(hospitals).map(entry =>
      pruneEmpty({
        hospitalTreatmentDates: toDateRangeArray(entry?.treatmentDates),
        nameAndAddressOfHospital: truncateString(
          formatNameAndAddress(entry?.hospitalName, entry?.hospitalAddress),
          MAX_LENGTHS.hospitalAddresses,
        ),
        inVANetwork: toVaNetworkFlag(entry?.hospitalType),
        relatedDisability: formatRelatedDisabilities(entry?.relatedDisability),
      }),
    ),
  );

const buildVeteranFullName = fullName => {
  if (!fullName || typeof fullName !== 'object') {
    return undefined;
  }

  const first = truncateString(
    stringOrUndefined(fullName.first),
    MAX_LENGTHS.firstName,
  );
  const middle = stringOrUndefined(fullName.middle);
  const middleInitial = middle
    ? truncateString(middle.charAt(0).toUpperCase(), MAX_LENGTHS.middleInitial)
    : undefined;
  const last = truncateString(
    stringOrUndefined(fullName.last),
    MAX_LENGTHS.lastName,
  );

  return pruneEmpty({
    first,
    middleinitial: middleInitial,
    last,
  });
};

const buildVeteranFullNameString = fullName => {
  const nameObj = buildVeteranFullName(fullName);
  if (!nameObj) {
    return undefined;
  }

  const parts = [];
  if (nameObj.first) {
    parts.push(nameObj.first);
  }
  if (nameObj.middleinitial) {
    parts.push(nameObj.middleinitial);
  }
  if (nameObj.last) {
    parts.push(nameObj.last);
  }

  return parts.length ? parts.join(' ') : undefined;
};

const mapPreviousEmployers = employers =>
  pruneEmpty(
    toArray(employers).map(item => {
      const nameAndAddress = truncateString(
        formatNameAndAddress(item?.employerName, item?.employerAddress),
        MAX_LENGTHS.previousEmployerNameAddress,
      );

      return pruneEmpty({
        nameAndAddress,
        typeOfWork: truncateString(
          stringOrUndefined(item?.typeOfWork),
          MAX_LENGTHS.previousEmployerType,
        ),
        hoursPerWeek: toInteger(item?.hoursPerWeek),
        datesOfEmployment: ensureDateRange(item, 'startDate', 'endDate'),
        timeLostFromIllness: toInteger(item?.timeLost),
        mostEarningsInAMonth: toInteger(item?.earnings),
      });
    }),
  );

const mapAppliedEmployers = (primary, fallback) => {
  const combined = [...toArray(primary), ...toArray(fallback)];
  return pruneEmpty(
    combined.map(item => {
      const nameAndAddress = formatNameAndAddress(
        item?.employerName,
        item?.employerAddress,
      );

      return pruneEmpty({
        nameAndAddress: truncateString(
          nameAndAddress,
          MAX_LENGTHS.previousEmployerNameAddress,
        ),
        typeOfWork: truncateString(
          stringOrUndefined(item?.typeOfWork),
          MAX_LENGTHS.appliedEmployerType,
        ),
        dateApplied: stringOrUndefined(item?.dateApplied),
      });
    }),
  );
};

const COLLEGE_LEVEL_MAP = {
  freshman: 'Fresh',
  sophomore: 'Soph',
  junior: 'Jr',
  senior: 'Sr',
};

const mapEducation = data => {
  const level = stringOrUndefined(data?.educationLevel);
  const gradeSchool =
    level === 'gradeSchool' ? toInteger(data?.gradeSchool) : undefined;
  const highSchool =
    level === 'highSchool' ? toInteger(data?.highSchool) : undefined;
  const collegeKey =
    level === 'college' ? stringOrUndefined(data?.college) : undefined;
  const college = collegeKey
    ? COLLEGE_LEVEL_MAP[collegeKey.toLowerCase()]
    : undefined;

  return pruneEmpty({
    gradeSchool,
    highSchool,
    college,
  });
};

const buildTrainingSection = (entries, rangePropName) => {
  let normalizedEntries = entries;

  if (Array.isArray(entries)) {
    normalizedEntries = entries;
  } else if (entries && typeof entries === 'object') {
    normalizedEntries = [entries];
  }

  const entryList = toArray(normalizedEntries);
  if (!entryList.length) {
    return { hasTraining: false, details: undefined };
  }

  const firstEntry = entryList[0];
  const details = pruneEmpty({
    name: truncateString(
      stringOrUndefined(firstEntry?.typeOfEducation),
      MAX_LENGTHS.trainingName,
    ),
    [rangePropName]: ensureDateRange(firstEntry?.datesOfTraining, 'from', 'to'),
  });

  if (!details) {
    return { hasTraining: false, details: undefined };
  }

  return { hasTraining: true, details };
};

const buildSubmissionPayload = data => {
  const veteran = data?.veteran || {};

  const doctorCare = data?.[doctorCareQuestionFields.parentObject] || {};

  const doctors = toArray(data?.doctors);
  const doctorDates = doctors.reduce((accumulator, doctorEntry) => {
    const entryDates = toArray(doctorEntry?.treatmentDates);
    return entryDates.length ? accumulator.concat(entryDates) : accumulator;
  }, []);
  const hospitals = toArray(data?.hospitals);
  const doctorsCare = buildDoctorsCare(doctors);
  const hospitalsCare = buildHospitalsCare(hospitals);

  const previousEmployers = mapPreviousEmployers(data?.employersHistory);
  const appliedEmployers = mapAppliedEmployers(
    data?.[employmentAppliedFields.parentObject],
    data?.employers,
  );

  const education = mapEducation(data);
  const preTraining = buildTrainingSection(
    data?.educationBeforeDisability,
    'datesOfTraining',
  );
  const postTraining = buildTrainingSection(
    data?.educationAfterDisability,
    'datesOfTraining',
  );

  const doctorCareAnswer = toBoolean(
    doctorCare?.[doctorCareQuestionFields.hasReceivedDoctorCare],
  );

  let doctorsCareInLastYTD;
  if (doctorCareAnswer !== undefined) {
    doctorsCareInLastYTD = doctorCareAnswer;
  } else if (doctors.length > 0 || doctorDates.length > 0) {
    doctorsCareInLastYTD = true;
  }

  const appliedEmployersCount = Array.isArray(appliedEmployers)
    ? appliedEmployers.length
    : 0;

  const attemptedEmployAnswer = (() => {
    if (appliedEmployersCount > 0) {
      return true;
    }

    const nestedArrayAnswer = toBoolean(
      data?.[employmentAppliedFields.parentObject]?.[
        employmentAppliedFields.hasTriedEmployment
      ],
    );
    if (nestedArrayAnswer !== undefined) {
      return nestedArrayAnswer;
    }

    const arrayBuilderAnswer = toBoolean(
      data?.[employmentAppliedFields.hasTriedEmployment],
    );
    if (arrayBuilderAnswer !== undefined) {
      return arrayBuilderAnswer;
    }

    const legacyAnswer = toBoolean(data?.triedEmployment);
    if (legacyAnswer !== undefined) {
      return legacyAnswer;
    }

    return undefined;
  })();

  const submission = {
    veteranFullName: buildVeteranFullName(veteran.fullName),
    veteranSocialSecurityNumber: stringOrUndefined(veteran.ssn),
    vaFileNumber: stringOrUndefined(veteran.vaFileNumber),
    dateOfBirth: stringOrUndefined(veteran.dateOfBirth),
    veteranAddress: buildAddress(veteran.address),
    electronicCorrespondance: Boolean(stringOrUndefined(veteran.email)),
    email: stringOrUndefined(veteran.email),
    veteranPhone: formatPhoneNumber(veteran.homePhone),
    internationalPhone: formatPhoneNumber(veteran.alternatePhone),
    listOfDisabilities: formatDisabilitiesList(data?.disabilityDescription),
    doctorsCareInLastYTD,
    doctorsCare,
    hospitalsCare,
    disabilityAffectEmployFTDate: stringOrUndefined(data?.disabilityDate),
    lastWorkedFullTimeDate: stringOrUndefined(data?.lastWorkedDate),
    becameTooDisabledToWorkDate: stringOrUndefined(data?.disabledWorkDate),
    mostEarningsInAYear: toInteger(data?.maxYearlyEarnings),
    yearOfMostEarnings: normalizeYear(data?.yearEarned),
    occupationDuringMostEarnings: truncateString(
      stringOrUndefined(data?.occupation),
      MAX_LENGTHS.occupation,
    ),
    previousEmployers,
    preventMilitaryDuties: toBoolean(data?.activeDutyOrders),
    past12MonthsEarnedIncome: toInteger(data?.totalIncome),
    currentMonthlyEarnedIncome: toInteger(data?.monthlyIncome),
    leftLastJobDueToDisability: toBoolean(data?.leftDueToDisability),
    expectDisabilityRetirement: toBoolean(data?.receivesDisabilityRetirement),
    receiveExpectWorkersCompensation: toBoolean(
      data?.receivesWorkersCompensation,
    ),
    attemptedEmploy: attemptedEmployAnswer,
    appliedEmployers,
    education,
    trainingPreDisabled: preTraining.hasTraining,
    educationTrainingPreUnemployability: preTraining.details,
    trainingPostUnemployment: postTraining.hasTraining,
    educationTrainingPostUnemployability: postTraining.details,
    remarks: truncateString(
      stringOrUndefined(data?.additionalRemarks),
      MAX_LENGTHS.remarks,
    ),
    signature: buildVeteranFullNameString(veteran.fullName),
    // signature: stringOrUndefined(data?.signatureOfClaimant),
    signatureDate: stringOrUndefined(data?.dateSigned),
    files: pruneEmpty(toArray(data?.files)),
  };

  return pruneEmpty(submission) || {};
};

export default function transformForSubmit(formConfig, form) {
  const transformed = JSON.parse(
    sharedTransformForSubmit(formConfig, form, {
      allowPartialAddress: true,
    }),
  );

  const { formNumber, ...formData } = transformed;
  const payload = buildSubmissionPayload(formData);
  const stringifiedPayload = JSON.stringify(payload);

  return JSON.stringify({
    formNumber,
    // API contract requires this snake_case key
    // eslint-disable-next-line camelcase
    increase_compensation_claim: {
      form: stringifiedPayload,
    },
  });
}
