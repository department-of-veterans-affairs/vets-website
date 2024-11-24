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
  if (typeof med === 'undefined' || med === null) {
    return null;
  }
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
  if (typeof appt === 'undefined' || appt === null) {
    return null;
  }

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
      reason: attributes.serviceCategory?.[0]?.text || 'Not specified',
      otherDetails: attributes.friendlyName || 'No details provided',
    },
  };
};

/**
 * Convert the demographic resource from the backend into the appropriate model.
 * @param {Object} item an MHV demographic resource
 * @returns a demographic object that this application can use, or null if the param is null/undefined
 */
export const convertDemographics = item => {
  if (typeof item === 'undefined' || item === null) {
    return null;
  }

  return {
    id: item.id,
    facility: item.facilityInfo.name,
    firstName: item.firstName,
    middleName: item.middleName || 'None recorded',
    lastName: item.lastName,
    dateOfBirth: new Date(item.dateOfBirth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    age: item.age,
    gender: item.gender,
    ethnicity: 'None recorded', // Assuming no data provided
    religion: item.religion || 'None recorded',
    placeOfBirth: item.placeOfBirth || 'None recorded',
    maritalStatus: item.maritalStatus || 'None recorded',
    permanentAddress: {
      street: `${item.permStreet1} ${item.permStreet2 || ''}`.trim(),
      city: item.permCity,
      state: item.permState,
      zipcode: item.permZipcode,
      country: item.permCountry,
    },
    contactInfo: {
      homePhone: 'None recorded',
      workPhone: 'None recorded',
      cellPhone: 'None recorded',
      emailAddress: item.permEmailAddress || 'None recorded',
    },
    eligibility: {
      serviceConnectedPercentage: item.serviceConnPercentage || 'None recorded',
      meansTestStatus: 'None recorded', // Assuming no data provided
      primaryEligibilityCode: 'None recorded', // Assuming no data provided
    },
    employment: {
      occupation: item.employmentStatus || 'None recorded',
      meansTestStatus: 'None recorded', // Assuming no data provided
      employerName: 'None recorded', // Assuming no data provided
    },
    primaryNextOfKin: {
      name: item.nextOfKinName || 'None recorded',
      address: {
        street: `${item.nextOfKinStreet1} ${item.nextOfKinStreet2 ||
          ''}`.trim(),
        city: item.nextOfKinCity,
        state: item.nextOfKinState,
        zipcode: item.nextOfKinZipcode,
      },
      phone: item.nextOfKinHomePhone || 'None recorded',
    },
    emergencyContact: {
      name: item.emergencyName || 'No information reported',
      address: {
        street: `${item.emergencyStreet1} ${item.emergencyStreet2 ||
          ''}`.trim(),
        city: item.emergencyCity,
        state: item.emergencyState,
        zipcode: item.emergencyZipcode,
      },
      phone: item.emergencyHomePhone || 'No information reported',
    },
    vaGuardian: 'No information reported',
    civilGuardian: 'No information reported',
    activeInsurance: 'No information reported',
  };
};

/**
 * Convert the patient resource from the backend into the appropriate model.
 * @param {Object} data an MHV patient resource
 * @returns an account summary object that this application can use, or null if the param is null/undefined
 */
export const convertAccountSummary = data => {
  if (typeof data === 'undefined' || data === null) {
    return null;
  }
  // Extract necessary fields
  const { facilities, ipas } = data;

  // Map facilities
  const mappedFacilities = facilities.map(facility => ({
    facilityName: facility.facilityInfo.name,
    stationNumber: facility.facilityInfo.stationNumber,
    type: facility.facilityInfo.treatment ? 'Treatment' : 'VAMC',
  }));

  // Extract user profile details
  const authenticationInfo =
    ipas && ipas[0]
      ? {
          source: 'VA',
          authenticationStatus: ipas[0].status || 'Unknown',
          authenticationDate: new Date(
            ipas[0].authenticationDate,
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          authenticationFacilityName:
            facilities[0]?.facilityInfo?.name || 'Unknown Facility',
          authenticationFacilityID:
            facilities[0]?.facilityInfo?.stationNumber || 'Unknown ID',
        }
      : {};

  return {
    authenticationSummary: authenticationInfo,
    vaTreatmentFacilities: mappedFacilities,
  };
};

export const blueButtonReducer = (state = initialState, action) => {
  if (action.type === Actions.BlueButtonReport.GET) {
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
  }
  return state;
};
