import { expect } from 'chai';
import {
  convertMedication,
  convertAppointment,
  convertDemographics,
  convertAccountSummary,
  blueButtonReducer,
} from '../../reducers/blueButton';
import { Actions } from '../../util/actionTypes';

describe('convertMedication', () => {
  it('should return null when passed null or undefined', () => {
    expect(convertMedication(null)).to.be.null;
    expect(convertMedication(undefined)).to.be.null;
  });

  it('should correctly convert a medication resource', () => {
    const med = {
      id: '123',
      attributes: {
        prescriptionName: 'Aspirin',
        lastFilledDate: '2021-01-01',
        refillStatus: 'Active',
        refillRemaining: 2,
        prescriptionNumber: 'RX123456',
        orderedDate: '2020-12-01',
        providerFirstName: 'John',
        providerLastName: 'Doe',
        facilityName: 'VA Hospital',
        expirationDate: '2022-01-01',
        sig: 'Take one tablet daily',
        quantity: 30,
      },
    };

    const expected = {
      id: '123',
      prescriptionName: 'Aspirin',
      lastFilledOn: '2021-01-01',
      status: 'Active',
      refillsLeft: 2,
      prescriptionNumber: 'RX123456',
      prescribedOn: '2020-12-01',
      prescribedBy: 'John Doe',
      facility: 'VA Hospital',
      expirationDate: '2022-01-01',
      instructions: 'Take one tablet daily',
      quantity: 30,
    };

    expect(convertMedication(med)).to.deep.equal(expected);
  });

  it('should handle missing optional fields', () => {
    const med = {
      id: '123',
      attributes: {
        prescriptionName: 'Aspirin',
        // lastFilledDate is missing
        refillStatus: 'Active',
        // refillRemaining is missing
        prescriptionNumber: 'RX123456',
        orderedDate: '2020-12-01',
        // providerFirstName and providerLastName are missing
        facilityName: 'VA Hospital',
        // expirationDate is missing
        // sig is missing
        quantity: 30,
      },
    };

    const expected = {
      id: '123',
      prescriptionName: 'Aspirin',
      lastFilledOn: 'Not filled yet', // default value
      status: 'Active',
      refillsLeft: undefined, // missing field
      prescriptionNumber: 'RX123456',
      prescribedOn: '2020-12-01',
      prescribedBy: '', // both providerFirstName and providerLastName are missing
      facility: 'VA Hospital',
      expirationDate: undefined, // missing field
      instructions: 'No instructions available', // default value
      quantity: 30,
    };

    expect(convertMedication(med)).to.deep.equal(expected);
  });
});

describe('convertAppointment', () => {
  it('should return null when passed null or undefined', () => {
    expect(convertAppointment(null)).to.be.null;
    expect(convertAppointment(undefined)).to.be.null;
  });

  it('should correctly convert an appointment resource', () => {
    const appt = {
      id: '456',
      attributes: {
        localStartTime: '2021-05-01T10:00:00',
        kind: 'clinic',
        status: 'booked',
        serviceName: 'Cardiology',
        location: {
          attributes: {
            name: 'VA Clinic',
            physicalAddress: '123 Main St',
          },
        },
        extension: {
          clinic: {
            physicalLocation: 'Room 101',
            phoneNumber: '555-1234',
          },
        },
        clinic: 'Main Clinic',
        serviceCategory: [
          {
            text: 'Follow-up',
          },
        ],
        friendlyName: 'Check-up appointment',
      },
    };

    const expected = {
      id: '456',
      date: new Date('2021-05-01T10:00:00').toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
      }),
      appointmentType: 'In person',
      status: 'Confirmed',
      what: 'Cardiology',
      where: {
        facilityName: 'VA Clinic',
        address: '123 Main St',
        clinicName: 'Main Clinic',
        location: 'Room 101',
        clinicPhone: '555-1234',
      },
      detailsShared: {
        reason: 'Follow-up',
        otherDetails: 'Check-up appointment',
      },
    };

    expect(convertAppointment(appt)).to.deep.equal(expected);
  });

  it('should handle missing optional fields', () => {
    const appt = {
      id: '456',
      attributes: {
        localStartTime: '2021-05-01T10:00:00',
        // kind is missing
        status: 'pending',
        // serviceName is missing
        // location is missing
        // extension is missing
        // clinic is missing
        // serviceCategory is missing
        // friendlyName is missing
      },
    };

    const expected = {
      id: '456',
      date: new Date('2021-05-01T10:00:00').toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
      }),
      appointmentType: 'Virtual',
      status: 'Pending',
      what: 'General',
      where: {
        facilityName: 'Unknown Facility',
        address: 'No address available',
        clinicName: 'Unknown Clinic',
        location: 'Unknown Location',
        clinicPhone: 'N/A',
      },
      detailsShared: {
        reason: 'Not specified',
        otherDetails: 'No details provided',
      },
    };

    expect(convertAppointment(appt)).to.deep.equal(expected);
  });
});

describe('convertDemographics', () => {
  it('should return null when passed null or undefined', () => {
    expect(convertDemographics(null)).to.be.null;
    expect(convertDemographics(undefined)).to.be.null;
  });

  it('should correctly convert a demographics resource', () => {
    const info = {
      id: '789',
      facilityInfo: { name: 'VA Medical Center' },
      firstName: 'Jane',
      middleName: 'A.',
      lastName: 'Doe',
      dateOfBirth: '1980-05-15',
      age: 40,
      gender: 'Female',
      religion: 'None',
      placeOfBirth: 'New York',
      maritalStatus: 'Single',
      permStreet1: '456 Elm St',
      permStreet2: 'Apt 2',
      permCity: 'Anytown',
      permState: 'NY',
      permZipcode: '12345',
      permCountry: 'USA',
      permEmailAddress: 'jane.doe@example.com',
      serviceConnPercentage: '50%',
      employmentStatus: 'Employed',
      nextOfKinName: 'John Doe',
      nextOfKinStreet1: '789 Oak St',
      nextOfKinStreet2: '',
      nextOfKinCity: 'Othertown',
      nextOfKinState: 'CA',
      nextOfKinZipcode: '67890',
      nextOfKinHomePhone: '555-6789',
      emergencyName: 'Mary Smith',
      emergencyStreet1: '321 Pine St',
      emergencyStreet2: '',
      emergencyCity: 'Sometown',
      emergencyState: 'TX',
      emergencyZipcode: '98765',
      emergencyHomePhone: '555-4321',
    };

    const expected = {
      id: '789',
      facility: 'VA Medical Center',
      firstName: 'Jane',
      middleName: 'A.',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-05-15').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      age: 40,
      gender: 'Female',
      ethnicity: 'None recorded',
      religion: 'None',
      placeOfBirth: 'New York',
      maritalStatus: 'Single',
      permanentAddress: {
        street: '456 Elm St Apt 2',
        city: 'Anytown',
        state: 'NY',
        zipcode: '12345',
        country: 'USA',
      },
      contactInfo: {
        homePhone: 'None recorded',
        workPhone: 'None recorded',
        cellPhone: 'None recorded',
        emailAddress: 'jane.doe@example.com',
      },
      eligibility: {
        serviceConnectedPercentage: '50%',
        meansTestStatus: 'None recorded',
        primaryEligibilityCode: 'None recorded',
      },
      employment: {
        occupation: 'Employed',
        meansTestStatus: 'None recorded',
        employerName: 'None recorded',
      },
      primaryNextOfKin: {
        name: 'John Doe',
        address: {
          street: '789 Oak St',
          city: 'Othertown',
          state: 'CA',
          zipcode: '67890',
        },
        phone: '555-6789',
      },
      emergencyContact: {
        name: 'Mary Smith',
        address: {
          street: '321 Pine St',
          city: 'Sometown',
          state: 'TX',
          zipcode: '98765',
        },
        phone: '555-4321',
      },
      vaGuardian: 'No information reported',
      civilGuardian: 'No information reported',
      activeInsurance: 'No information reported',
    };

    expect(convertDemographics(info)).to.deep.equal(expected);
  });

  it('should handle missing optional fields', () => {
    const info = {
      id: '789',
      facilityInfo: { name: 'VA Medical Center' },
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1980-05-15',
      age: 40,
      gender: 'Female',
      permStreet1: '456 Elm St',
      permCity: 'Anytown',
      permState: 'NY',
      permZipcode: '12345',
      permCountry: 'USA',
    };

    const expected = {
      id: '789',
      facility: 'VA Medical Center',
      firstName: 'Jane',
      middleName: 'None recorded',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-05-15').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      age: 40,
      gender: 'Female',
      ethnicity: 'None recorded',
      religion: 'None recorded',
      placeOfBirth: 'None recorded',
      maritalStatus: 'None recorded',
      permanentAddress: {
        street: '456 Elm St',
        city: 'Anytown',
        state: 'NY',
        zipcode: '12345',
        country: 'USA',
      },
      contactInfo: {
        homePhone: 'None recorded',
        workPhone: 'None recorded',
        cellPhone: 'None recorded',
        emailAddress: 'None recorded',
      },
      eligibility: {
        serviceConnectedPercentage: 'None recorded',
        meansTestStatus: 'None recorded',
        primaryEligibilityCode: 'None recorded',
      },
      employment: {
        occupation: 'None recorded',
        meansTestStatus: 'None recorded',
        employerName: 'None recorded',
      },
      primaryNextOfKin: {
        name: 'None recorded',
        address: {
          street: undefined,
          city: undefined,
          state: undefined,
          zipcode: undefined,
        },
        phone: 'None recorded',
      },
      emergencyContact: {
        name: 'No information reported',
        address: {
          street: undefined,
          city: undefined,
          state: undefined,
          zipcode: undefined,
        },
        phone: 'No information reported',
      },
      vaGuardian: 'No information reported',
      civilGuardian: 'No information reported',
      activeInsurance: 'No information reported',
    };

    expect(convertDemographics(info)).to.deep.equal(expected);
  });
});

describe('convertAccountSummary', () => {
  it('should return null when passed null or undefined', () => {
    expect(convertAccountSummary(null)).to.be.null;
    expect(convertAccountSummary(undefined)).to.be.null;
  });

  it('should correctly convert patient data', () => {
    const data = {
      facilities: [
        {
          facilityInfo: {
            name: 'VA Medical Center',
            stationNumber: '123',
            treatment: true,
          },
        },
      ],
      ipas: [
        {
          status: 'Active',
          authenticationDate: '2021-05-01',
          authenticatingFacilityId: '123',
        },
      ],
    };

    const expected = {
      authenticationSummary: {
        source: 'VA',
        authenticationStatus: 'Active',
        authenticationDate: new Date('2021-05-01').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        authenticationFacilityName: 'VA Medical Center',
        authenticationFacilityID: '123',
      },
      vaTreatmentFacilities: [
        {
          facilityName: 'VA Medical Center',
          stationNumber: '123',
          type: 'Treatment',
        },
      ],
    };

    expect(convertAccountSummary(data)).to.deep.equal(expected);
  });

  it('should handle missing optional fields', () => {
    const data = {
      facilities: [],
      ipas: [],
    };

    const expected = {
      authenticationSummary: {},
      vaTreatmentFacilities: [],
    };

    expect(convertAccountSummary(data)).to.deep.equal(expected);
  });
});

describe('blueButtonReducer', () => {
  const initialState = {
    medicationsList: undefined,
    appointmentsList: undefined,
    demographics: undefined,
    militaryService: undefined,
    accountSummary: undefined,
  };

  it('should return the initial state when passed an undefined state', () => {
    expect(blueButtonReducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should handle BlueButtonReport.GET action', () => {
    const action = {
      type: Actions.BlueButtonReport.GET,
      medicationsResponse: {
        data: [
          {
            id: 'med1',
            attributes: {
              prescriptionName: 'Medication1',
              lastFilledDate: '2021-01-01',
            },
          },
        ],
      },
      appointmentsResponse: {
        data: [
          {
            id: 'appt1',
            attributes: {
              localStartTime: '2021-05-01T10:00:00',
              kind: 'clinic',
              status: 'booked',
            },
          },
        ],
      },
      demographicsResponse: {
        content: [
          {
            id: 'demo1',
            firstName: 'John',
            lastName: 'Smith',
            dateOfBirth: '1990-01-01',
            age: 31,
            gender: 'Male',
            facilityInfo: { name: 'VA Medical Center' },
            permStreet1: '123 Main St',
            permCity: 'Anytown',
            permState: 'NY',
            permZipcode: '12345',
            permCountry: 'USA',
          },
        ],
      },
      militaryServiceResponse: 'Some military service info',
      patientResponse: {
        facilities: [
          {
            facilityInfo: {
              name: 'VA Medical Center',
              stationNumber: '123',
              treatment: true,
            },
          },
        ],
        ipas: [
          {
            status: 'Active',
            authenticationDate: '2021-05-01',
            authenticatingFacilityId: '123',
          },
        ],
      },
    };

    const expectedState = {
      ...initialState,
      medicationsList: [convertMedication(action.medicationsResponse.data[0])],
      appointmentsList: [
        convertAppointment(action.appointmentsResponse.data[0]),
      ],
      demographics: [
        convertDemographics(action.demographicsResponse.content[0]),
      ],
      militaryService: 'Some military service info',
      accountSummary: convertAccountSummary(action.patientResponse),
    };

    const newState = blueButtonReducer(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });

  it('should handle missing data in action payloads', () => {
    const action = {
      type: Actions.BlueButtonReport.GET,
      medicationsResponse: {},
      appointmentsResponse: {},
      demographicsResponse: {},
      militaryServiceResponse: '',
      patientResponse: {},
    };

    const expectedState = {
      ...initialState,
      medicationsList: [],
      appointmentsList: [],
      demographics: [],
      militaryService: '',
      accountSummary: {
        authenticationSummary: {},
        vaTreatmentFacilities: [],
      },
    };

    const newState = blueButtonReducer(initialState, action);

    expect(newState).to.deep.equal(expectedState);
  });
});
