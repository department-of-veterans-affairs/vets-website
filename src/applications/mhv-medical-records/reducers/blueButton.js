import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of medications returned from the api
   * @type {Array}
   */
  medicationsList: undefined,
  /**
   * The list of appointments returned from the api
   * @type {Array}
   */
  appointmentsList: undefined,
  /**
   * The demographic info returned from the api
   * @type {Array}
   */
  demographics: undefined,
  /**
   * The military service info returned from the api
   * @type {Array}
   */
  militaryService: undefined,
  /**
   * The account summary info returned from the api
   * @type {Array}
   */
  accountSummary: undefined,
};

/**
 * Convert the medication resource from the backend into the appropriate model.
 * @param {Object} medication an MHV medication resource
 * @returns a medication object that this application can use, or null if the param is null/undefined
 */
export const convertMedication = med => {
  if (!med) return null;

  const { attributes } = med;
  return {
    id: med.id,
    prescriptionName: attributes.prescriptionName,
    lastFilledOn: attributes.lastFilledDate || 'Not filled yet',
    status: attributes.refillStatus,
    refillsLeft: attributes.refillRemaining,
    prescriptionNumber: attributes.prescriptionNumber,
    prescribedOn: attributes.orderedDate,
    prescribedBy: `${attributes.providerFirstName ||
      ''} ${attributes.providerLastName || ''}`.trim(),
    facility: attributes.facilityName,
    expirationDate: attributes.expirationDate,
    instructions: attributes.sig || 'No instructions available',
    quantity: attributes.quantity,
  };
};

/**
 * Convert the appointment resource from the backend into the appropriate model.
 * @param {Object} appt an MHV appointment resource
 * @returns an appointment object that this application can use, or null if the param is null/undefined
 */
export const convertAppointment = appt => {
  if (!appt) return null;

  const { attributes } = appt;
  const location = attributes.location?.attributes || {};
  const clinic = attributes.extension?.clinic || {};

  return {
    id: appt.id,
    date: new Date(attributes.localStartTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short',
    }),
    appointmentType: attributes.kind === 'clinic' ? 'In person' : 'Virtual',
    status: attributes.status === 'booked' ? 'Confirmed' : 'Pending',
    what: attributes.serviceName || 'General',
    where: {
      facilityName: location.name || 'Unknown Facility',
      address: location.physicalAddress
        ? `${location.physicalAddress.line.join(' ')}, ${
            location.physicalAddress.city
          }, ${location.physicalAddress.state} ${
            location.physicalAddress.postalCode
          }`
        : 'No address available',
      clinicName: attributes.clinic || 'Unknown Clinic',
      location: clinic.physicalLocation || 'Unknown Location',
      clinicPhone: clinic.phoneNumber || 'N/A',
    },
    detailsShared: {
      // check with mike
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
export const convertDemographics = info => {
  const noneRecorded = 'None recorded';
  const noInfoReported = 'No information reported';

  if (!info) return null;

  // check all no-matches with mike
  return {
    id: info.id,
    facility: info.facilityInfo.name,
    firstName: info.firstName,
    middleName: info.middleName || noneRecorded,
    lastName: info.lastName,
    dateOfBirth: new Date(info.dateOfBirth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    age: info.age,
    gender: info.gender,
    ethnicity: noneRecorded, // no matching attribute in test user data
    religion: info.religion || noneRecorded,
    placeOfBirth: info.placeOfBirth || noneRecorded,
    maritalStatus: info.maritalStatus || noneRecorded,
    permanentAddress: {
      street: `${info.permStreet1} ${info.permStreet2 || ''}`.trim(),
      city: info.permCity,
      state: info.permState,
      zipcode: info.permZipcode,
      country: info.permCountry,
    },
    contactInfo: {
      homePhone: noneRecorded, // no matching attribute in test user data
      workPhone: noneRecorded, // no matching attribute in test user data
      cellPhone: noneRecorded, // no matching attribute in test user data
      emailAddress: info.permEmailAddress || noneRecorded,
    },
    eligibility: {
      serviceConnectedPercentage: info.serviceConnPercentage || noneRecorded,
      meansTestStatus: noneRecorded, // no matching attribute in test user data
      primaryEligibilityCode: noneRecorded, // no matching attribute in test user data
    },
    employment: {
      occupation: info.employmentStatus || noneRecorded,
      meansTestStatus: noneRecorded, // no matching attribute in test user data
      employerName: noneRecorded, // no matching attribute in test user data
    },
    primaryNextOfKin: {
      name: info.nextOfKinName || noneRecorded,
      address: {
        street: `${info.nextOfKinStreet1} ${info.nextOfKinStreet2 ||
          ''}`.trim(),
        city: info.nextOfKinCity,
        state: info.nextOfKinState,
        zipcode: info.nextOfKinZipcode,
      },
      phone: info.nextOfKinHomePhone || noneRecorded,
    },
    emergencyContact: {
      name: info.emergencyName || noInfoReported,
      address: {
        street: `${info.emergencyStreet1} ${info.emergencyStreet2 ||
          ''}`.trim(),
        city: info.emergencyCity,
        state: info.emergencyState,
        zipcode: info.emergencyZipcode,
      },
      phone: info.emergencyHomePhone || noInfoReported,
    },
    vaGuardian: noInfoReported, // no matching attribute in test user data
    civilGuardian: noInfoReported, // no matching attribute in test user data
    activeInsurance: noInfoReported, // no matching attribute in test user data
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
  const { facilities, ipas } = data;

  // Map facilities
  const mappedFacilities = facilities.map(facility => ({
    facilityName: facility.facilityInfo.name,
    stationNumber: facility.facilityInfo.stationNumber,
    type: facility.facilityInfo.treatment ? 'Treatment' : 'VAMC',
  }));

  // Extract user profile details
  const ipa = ipas && ipas[0];
  const authenticatingFacility =
    ipa?.authenticatingFacilityId &&
    facilities.find(
      facility => facility.facilityInfoId === ipa.authenticatingFacilityId,
    );
  const authenticationInfo = ipa
    ? {
        source: 'VA',
        authenticationStatus: ipa.status || 'Unknown',
        authenticationDate: new Date(ipa.authenticationDate).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ),
        authenticationFacilityName:
          authenticatingFacility?.facilityInfo?.name || 'Unknown Facility',
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
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case Actions.BlueButtonReport.GET:
      return {
        ...state,
        medicationsList:
          action.medicationsResponse.data?.map(med => {
            return convertMedication(med);
          }) || [],
        appointmentsList:
          action.appointmentsResponse.data?.map(appt => {
            return convertAppointment(appt);
          }) || [],
        demographics:
          action.demographicsResponse.content?.map(item => {
            return convertDemographics(item);
          }) || [],
        militaryService: action.militaryServiceResponse || '',
        accountSummary: convertAccountSummary(action.patientResponse) || {},
      };
    default:
      return state;
  }
};
