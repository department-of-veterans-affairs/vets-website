import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { format, isAfter } from 'date-fns';
import { capitalize } from 'lodash';
import { Actions } from '../util/actionTypes';
import { medicationTypes, NA, NONE_RECORDED, UNKNOWN } from '../util/constants';
import { dateFormat } from '../util/helpers';

const initialState = {
  /** The list of medications returned from the api @type {Array} */
  medicationsList: undefined,

  /** The list of appointments returned from the api @type {Array} */
  appointmentsList: undefined,

  /** The demographic info returned from the api @type {Array} */
  demographics: undefined,

  /** The military service info returned from the api @type {Array} */
  militaryService: undefined,

  /** The account summary info returned from the api @type {Array} */
  accountSummary: undefined,

  /** A list of domains which failed during fetch @type {Array} */
  failedDomains: [],
};

/**
 * Convert a non-VA medication resource from the backend into the appropriate model.
 * @param {Object} medication an MHV medication resource
 * @returns a medication object that this application can use, or null if the param is null/undefined
 */
export const convertNonVaMedication = med => {
  return {
    id: med.id,
    type: medicationTypes.NON_VA,
    prescriptionName: med.prescriptionName,
    medication: med.prescriptionName || NA,
    instructions: med.sig || NA,
    reasonForUse: med.reason || NA,
    status: med.dispStatus || NA,
    startDate: formatDateLong(med.refillDate || med.orderedDate) || NA,
    documentedBy: `${med.providerLastName || NA}, ${med.providerFirstName ||
      NA}`,
    documentedAtFacility: med.facilityName || NA,
    providerNotes: med.remarks || NA,
  };
};

/**
 * Convert a medication resource from the backend into the appropriate model.
 * @param {Object} medication an MHV medication resource
 * @returns a medication object that this application can use, or null if the param is null/undefined
 */
export const convertMedication = med => {
  if (!med) return null;
  if (med.dispStatus?.toLowerCase()?.includes('non-va'))
    return convertNonVaMedication(med);

  const { attributes } = med;
  const phoneNum = pharmacyPhoneNumber(med.attributes);

  return {
    id: med.id,
    type: medicationTypes.VA,
    prescriptionName: attributes.prescriptionName,
    lastFilledOn: attributes.lastFilledDate
      ? formatDateLong(attributes.lastFilledDate)
      : 'Not filled yet',
    status: attributes.refillStatus,
    refillsLeft: attributes.refillRemaining ?? UNKNOWN,
    prescriptionNumber: attributes.prescriptionNumber,
    prescribedOn: attributes.orderedDate
      ? formatDateLong(attributes.orderedDate)
      : UNKNOWN,
    prescribedBy: `${attributes.providerFirstName ||
      ''} ${attributes.providerLastName || ''}`.trim(),
    facility: attributes.facilityName,
    expirationDate: attributes.expirationDate
      ? formatDateLong(attributes.expirationDate)
      : NONE_RECORDED,
    instructions: attributes.sig || 'No instructions available',
    quantity: attributes.quantity,
    pharmacyPhoneNumber: phoneNum || UNKNOWN,
    indicationForUse: med.indicationForUse || NONE_RECORDED,
  };
};

/**
 * Convert the appointment resource from the backend into the appropriate model.
 * @param {Object} appt an MHV appointment resource
 * @returns an appointment object that this application can use, or null if the param is null/undefined
 */
export const convertAppointment = appt => {
  if (!appt) return null;

  const now = new Date();
  const { attributes } = appt;
  const appointmentTime = new Date(attributes.localStartTime);
  const location = attributes.location?.attributes || { physicalAddress: {} };
  const { line, city, state, postalCode } = location.physicalAddress;
  const addressLines = line || [];
  const clinic = attributes.extension?.clinic || {};
  const practitioners = attributes.practitioners || [];
  const practitionerNames =
    practitioners.length > 0
      ? practitioners
          .map(
            practitioner =>
              `${practitioner.name.given.join(' ')} ${
                practitioner.name.family
              }`,
          )
          .join(', ')
      : 'Not available';

  return {
    id: appt.id,
    date: dateFormat(appointmentTime),
    isUpcoming: isAfter(appointmentTime, now),
    appointmentType: attributes.kind ? capitalize(attributes.kind) : UNKNOWN,
    status: attributes.status === 'booked' ? 'Confirmed' : 'Pending',
    what: attributes.serviceName || 'General',
    who: practitionerNames,
    address: addressLines.length
      ? [location.name, ...addressLines, `${city}, ${state} ${postalCode}`]
      : UNKNOWN,
    location: attributes.physicalLocation || 'Unknown location',
    clinicName: attributes.clinic || 'Unknown clinic',
    clinicPhone: clinic.phoneNumber || 'N/A',
    detailsShared: {
      reason: attributes.serviceCategory?.[0]?.text
        ? attributes.serviceCategory.map(item => item.text).join(', ')
        : 'Not specified',
      otherDetails: attributes.friendlyName || 'No details provided',
    },
  };
};

/**
 * Convert the demographic data from the backend into the appropriate model.
 * @param {Object} info an MHV demographic content item
 * @returns a demographic object that this application can use, or null if the param is null/undefined
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const convertDemographics = info => {
  if (!info) return null;

  return {
    id: info.id,
    facility: info.facilityInfo?.name || NONE_RECORDED,
    firstName: info.firstName,
    middleName: info.middleName || NONE_RECORDED,
    lastName: info.lastName || NONE_RECORDED,
    dateOfBirth: format(new Date(info.dateOfBirth), 'MMMM d, yyyy'),
    age: info.age || NONE_RECORDED,
    gender: info.gender || NONE_RECORDED,
    ethnicity: NONE_RECORDED, // no matching attribute in test user data
    religion: info.religion || NONE_RECORDED,
    placeOfBirth: info.placeOfBirth || NONE_RECORDED,
    maritalStatus: info.maritalStatus || NONE_RECORDED,
    permanentAddress: {
      street:
        [info.permStreet1, info.permStreet2].filter(Boolean).join(' ') ||
        NONE_RECORDED,
      city: info.permCity || NONE_RECORDED,
      state: info.permState || NONE_RECORDED,
      zipcode: info.permZipcode || NONE_RECORDED,
      county: info.perCounty || NONE_RECORDED,
      country: info.permCountry || NONE_RECORDED,
    },
    contactInfo: {
      homePhone: NONE_RECORDED, // no matching attribute in test user data
      workPhone: NONE_RECORDED, // no matching attribute in test user data
      cellPhone: NONE_RECORDED, // no matching attribute in test user data
      emailAddress: info.permEmailAddress || NONE_RECORDED,
    },
    eligibility: {
      serviceConnectedPercentage: info.serviceConnPercentage || NONE_RECORDED,
      meansTestStatus: NONE_RECORDED, // no matching attribute in test user data
      primaryEligibilityCode: NONE_RECORDED, // no matching attribute in test user data
    },
    employment: {
      occupation: info.employmentStatus || NONE_RECORDED,
      meansTestStatus: NONE_RECORDED, // no matching attribute in test user data
      employerName: NONE_RECORDED, // no matching attribute in test user data
    },
    primaryNextOfKin: {
      name: info.nextOfKinName || NONE_RECORDED,
      address: {
        street:
          [info.nextOfKinStreet1, info.nextOfKinStreet2]
            .filter(Boolean)
            .join(' ') || NONE_RECORDED,
        city: info.nextOfKinCity || NONE_RECORDED,
        state: info.nextOfKinState || NONE_RECORDED,
        zipcode: info.nextOfKinZipcode || NONE_RECORDED,
      },
      homePhone: info.nextOfKinHomePhone || NONE_RECORDED,
      workPhone: info.nextOfKinWorkPhone || NONE_RECORDED,
    },
    emergencyContact: {
      name: info.emergencyName || NONE_RECORDED,
      address: {
        street:
          [info.emergencyStreet1, info.emergencyStreet2]
            .filter(Boolean)
            .join(' ') || NONE_RECORDED,
        city: info.emergencyCity || NONE_RECORDED,
        state: info.emergencyState || NONE_RECORDED,
        zipcode: info.emergencyZipcode || NONE_RECORDED,
      },
      homePhone: info.emergencyHomePhone || NONE_RECORDED,
      workPhone: info.emergencyHomePhone || NONE_RECORDED,
    },
    // no matching attribute in test user data
    vaGuardian: {
      name: info.vaGuardianName || NONE_RECORDED,
      address: {
        street:
          [info.vaGuardianStreet1, info.vaGuardianStreet2]
            .filter(Boolean)
            .join(' ') || NONE_RECORDED,
        city: info.vaGuardianCity || NONE_RECORDED,
        state: info.vaGuardianState || NONE_RECORDED,
        zipcode: info.vaGuardianZipcode || NONE_RECORDED,
      },
      homePhone: info.vaGuardianHomePhone || NONE_RECORDED,
      workPhone: info.vaGuardianHomePhone || NONE_RECORDED,
    },
    // no matching attribute in test user data
    civilGuardian: {
      name: info.civilGuardianName || NONE_RECORDED,
      address: {
        street:
          [info.civilGuardianStreet1, info.civilGuardianStreet2]
            .filter(Boolean)
            .join(' ') || NONE_RECORDED,
        city: info.civilGuardianCity || NONE_RECORDED,
        state: info.civilGuardianState || NONE_RECORDED,
        zipcode: info.civilGuardianZipcode || NONE_RECORDED,
      },
      homePhone: info.civilGuardianHomePhone || NONE_RECORDED,
      workPhone: info.civilGuardianHomePhone || NONE_RECORDED,
    },
    // no matching attribute in test user data
    activeInsurance: {
      company: info.activeInsuranceCompany || NONE_RECORDED,
      effectiveDate: info.activeInsuranceEffectiveDate || NONE_RECORDED,
      expirationDate: info.activeInsuranceExpirationDate || NONE_RECORDED,
      groupName: info.activeInsuranceGroupName || NONE_RECORDED,
      groupNumber: info.activeInsuranceGroupNumber || NONE_RECORDED,
      subscriberId: info.activeInsuranceSubscriberId || NONE_RECORDED,
      subscriberName: info.activeInsuranceSubscriberName || NONE_RECORDED,
      relationship: info.activeInsuranceRelationship || NONE_RECORDED,
    },
  };
};

/**
 * Convert the patient resource from the backend into the appropriate model.
 * @param {Object} data an MHV patient resource
 * @returns an account summary object that this application can use, or null if the param is null/undefined
 */
export const convertAccountSummary = data => {
  if (!data) return null;

  // Extract necessary fields
  const { facilities = [], ipas } = data;

  // Map facilities
  const mappedFacilities = facilities.map(facility => ({
    facilityName: facility.facilityInfo?.name || 'Unknown facility',
    stationNumber: facility.facilityInfo?.stationNumber || 'Unknown ID',
    type: facility.facilityInfo?.treatment ? 'Treatment' : 'VAMC',
  }));

  // Extract user profile details
  const ipa = ipas && ipas[0];
  const authenticatingFacility =
    ipa?.authenticatingFacilityId &&
    facilities.find(
      facility =>
        facility.facilityInfo?.stationNumber === ipa.authenticatingFacilityId,
    );

  const authenticationInfo = ipa
    ? {
        source: 'VA',
        authenticationStatus: ipa.status || UNKNOWN,
        authenticationDate: ipa.authenticationDate
          ? format(new Date(ipa.authenticationDate), 'MMMM d, yyyy')
          : 'Unknown date',
        authenticationFacilityName:
          authenticatingFacility?.facilityInfo?.name || 'Unknown facility',
        authenticationFacilityID:
          authenticatingFacility?.facilityInfo?.stationNumber || 'Unknown ID',
      }
    : {};

  return {
    authenticationSummary: authenticationInfo,
    vaTreatmentFacilities: mappedFacilities,
  };
};

export const blueButtonReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.BlueButtonReport.GET: {
      const updates = {};

      if (action.medicationsResponse) {
        updates.medicationsList =
          action.medicationsResponse.data?.map(med => {
            return convertMedication(med);
          }) || [];
      }

      if (action.appointmentsResponse) {
        updates.appointmentsList =
          action.appointmentsResponse.data?.map(appt => {
            return convertAppointment(appt);
          }) || [];
      }

      if (action.demographicsResponse) {
        updates.demographics =
          action.demographicsResponse.content?.map(item => {
            return convertDemographics(item);
          }) || [];
      }

      if (action.militaryServiceResponse) {
        updates.militaryService = action.militaryServiceResponse || undefined;
      }

      if (action.patientResponse) {
        updates.accountSummary =
          convertAccountSummary(action.patientResponse) || {};
      }

      return {
        ...state,
        ...updates,
      };
    }
    case Actions.BlueButtonReport.ADD_FAILED: {
      const failedDomain = action.payload;

      return {
        ...state,
        failedDomains: state.failedDomains.includes(failedDomain)
          ? state.failedDomains
          : [...state.failedDomains, failedDomain],
      };
    }
    case Actions.BlueButtonReport.CLEAR_FAILED: {
      return {
        ...state,
        failedDomains: [],
      };
    }
    default:
      return state;
  }
};
