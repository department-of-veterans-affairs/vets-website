import { expect } from 'chai';
import {
  convertMedication,
  convertAppointment,
  convertDemographics,
  convertAccountSummary,
  blueButtonReducer,
  formatPractitionerName,
} from '../../reducers/blueButton';
import { Actions } from '../../util/actionTypes';
import { NONE_RECORDED, UNKNOWN } from '../../util/constants';

describe('formatPractitionerName', () => {
  it('should format valid practitioner names correctly', () => {
    expect(
      formatPractitionerName({
        name: { given: ['John', 'Michael'], family: 'Doe' },
      }),
    ).to.equal('John Michael Doe');
    expect(
      formatPractitionerName({ name: { given: ['Jane'], family: 'Smith' } }),
    ).to.equal('Jane Smith');
    expect(formatPractitionerName({ name: { given: ['Alice'] } })).to.equal(
      'Alice',
    );
    expect(formatPractitionerName({ name: { family: 'Doe' } })).to.equal('Doe');
  });

  it('should handle missing or invalid given name gracefully', () => {
    expect(
      formatPractitionerName({ name: { given: undefined, family: 'Johnson' } }),
    ).to.equal('Johnson');
    expect(
      formatPractitionerName({ name: { given: null, family: 'Williams' } }),
    ).to.equal('Williams');
    expect(
      formatPractitionerName({ name: { given: [], family: 'Brown' } }),
    ).to.equal('Brown');
    expect(
      formatPractitionerName({
        name: { given: 'Not an array', family: 'Test' },
      }),
    ).to.equal('Test');
  });

  it('should return "Not available" for invalid or empty practitioners', () => {
    expect(formatPractitionerName(null)).to.equal('Not available');
    expect(formatPractitionerName(undefined)).to.equal('Not available');
    expect(formatPractitionerName({})).to.equal('Not available');
    expect(
      formatPractitionerName({ name: { given: [], family: '' } }),
    ).to.equal('Not available');
  });
});

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
        sortedDispensedDate: '2021-01-01',
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

    const result = convertMedication(med);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('123');
    expect(result.type).to.equal('va');
    expect(result.prescriptionName).to.equal('Aspirin');
    expect(result.lastFilledOn).to.be.a('string');
    expect(result.status).to.equal('Active');
    expect(result.refillsLeft).to.equal(2);
    expect(result.prescriptionNumber).to.equal('RX123456');
    expect(result.prescribedOn).to.be.a('string');
    expect(result.prescribedBy).to.equal('John Doe');
    expect(result.facility).to.equal('VA Hospital');
    expect(result.expirationDate).to.be.a('string');
    expect(result.instructions).to.equal('Take one tablet daily');
    expect(result.quantity).to.equal(30);
    expect(result.pharmacyPhoneNumber).to.equal(UNKNOWN);
    expect(result.indicationForUse).to.equal('None recorded');
  });

  it('should handle missing optional fields', () => {
    const med = {
      id: '123',
      attributes: {
        prescriptionName: 'Aspirin',
        refillStatus: 'Active',
        prescriptionNumber: 'RX123456',
        orderedDate: '2020-12-01',
        facilityName: 'VA Hospital',
        quantity: 30,
      },
    };

    const result = convertMedication(med);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('123');
    expect(result.type).to.equal('va');
    expect(result.prescriptionName).to.equal('Aspirin');
    expect(result.lastFilledOn).to.equal('Not filled yet');
    expect(result.status).to.equal('Active');
    expect(result.refillsLeft).to.equal(UNKNOWN);
    expect(result.prescriptionNumber).to.equal('RX123456');
    expect(result.prescribedOn).to.be.a('string');
    expect(result.prescribedBy).to.equal('');
    expect(result.facility).to.equal('VA Hospital');
    expect(result.expirationDate).to.equal(NONE_RECORDED);
    expect(result.instructions).to.equal('No instructions available');
    expect(result.quantity).to.equal(30);
    expect(result.pharmacyPhoneNumber).to.equal(UNKNOWN);
    expect(result.indicationForUse).to.equal('None recorded');
  });

  it('should handle invalid date strings gracefully without throwing', () => {
    const med = {
      id: '123',
      attributes: {
        prescriptionName: 'Aspirin',
        sortedDispensedDate: 'invalid-date',
        refillStatus: 'Active',
        prescriptionNumber: 'RX123456',
        orderedDate: 'not-a-date',
        facilityName: 'VA Hospital',
        expirationDate: '',
        quantity: 30,
      },
    };

    const result = convertMedication(med);
    expect(result).to.be.an('object');
    expect(result.lastFilledOn).to.equal('Not filled yet');
    expect(result.prescribedOn).to.equal(UNKNOWN);
    expect(result.expirationDate).to.equal(NONE_RECORDED);
  });

  it('should handle missing attributes property without crashing', () => {
    // Test when attributes is undefined
    const medWithoutAttributes = { id: '789' };
    expect(() => convertMedication(medWithoutAttributes)).to.not.throw();
    const result = convertMedication(medWithoutAttributes);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('789');
    expect(result.type).to.equal('va');
    expect(result.lastFilledOn).to.equal('Not filled yet');
    expect(result.refillsLeft).to.equal(UNKNOWN);
    expect(result.expirationDate).to.equal(NONE_RECORDED);
    expect(result.instructions).to.equal('No instructions available');

    // Test when attributes is null
    const medWithNullAttributes = { id: '101', attributes: null };
    expect(() => convertMedication(medWithNullAttributes)).to.not.throw();
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
            physicalAddress: {
              line: ['123 Main St'],
              city: 'Anytown',
              state: 'NY',
              postalCode: '12345',
            },
          },
        },
        extension: {
          clinic: {
            physicalLocation: 'Room 101',
            phoneNumber: '555-1234',
          },
        },
        clinic: 'Main Clinic',
        serviceCategory: [{ text: 'Follow-up' }],
        friendlyName: 'Check-up appointment',
      },
    };

    const result = convertAppointment(appt);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('456');
    expect(result.date).to.be.a('string');
    expect(result.isUpcoming).to.be.a('boolean');
    expect(result.appointmentType).to.equal('Clinic');
    expect(result.status).to.equal('Confirmed');
    expect(result.what).to.equal('Cardiology');
    expect(result.who).to.equal('Not available');
    expect(result.address).to.be.an('array');
    expect(result.location).to.be.a('string');
    expect(result.clinicName).to.equal('Main Clinic');
    expect(result.clinicPhone).to.equal('555-1234');
    expect(result.detailsShared).to.deep.equal({
      reason: 'Follow-up',
      otherDetails: 'Check-up appointment',
    });
  });

  it('should handle missing optional fields', () => {
    const appt = {
      id: '456',
      attributes: {
        localStartTime: '2021-05-01T10:00:00',
        status: 'pending',
      },
    };

    const result = convertAppointment(appt);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('456');
    expect(result.date).to.be.a('string');
    expect(result.isUpcoming).to.be.a('boolean');
    expect(result.appointmentType).to.equal(UNKNOWN);
    expect(result.status).to.equal('Pending');
    expect(result.what).to.equal('General');
    expect(result.who).to.equal('Not available');
    expect(result.address).to.equal(UNKNOWN);
    expect(result.location).to.equal('Unknown location');
    expect(result.clinicName).to.equal('Unknown clinic');
    expect(result.clinicPhone).to.equal('N/A');
    expect(result.detailsShared).to.deep.equal({
      reason: 'Not specified',
      otherDetails: 'No details provided',
    });
  });

  it('should handle non-array serviceCategory without crashing', () => {
    const appt = {
      id: '789',
      attributes: {
        localStartTime: '2021-05-01T10:00:00',
        status: 'booked',
        serviceCategory: 'Not an array', // string instead of array
      },
    };
    expect(() => convertAppointment(appt)).to.not.throw();
    expect(convertAppointment(appt).detailsShared.reason).to.equal(
      'Not specified',
    );

    // Also test undefined and object
    appt.attributes.serviceCategory = undefined;
    expect(() => convertAppointment(appt)).to.not.throw();

    appt.attributes.serviceCategory = { text: 'Object' };
    expect(() => convertAppointment(appt)).to.not.throw();
  });

  it('should handle invalid date in localStartTime gracefully without throwing', () => {
    const appt = {
      id: '456',
      attributes: {
        localStartTime: 'invalid-date-string',
        status: 'booked',
      },
    };

    expect(() => convertAppointment(appt)).to.not.throw();
    const result = convertAppointment(appt);
    expect(result).to.be.an('object');
    expect(result.date).to.equal(NONE_RECORDED);
  });

  it('should handle missing attributes property without crashing', () => {
    // Test when attributes is undefined
    const apptWithoutAttributes = { id: '123' };
    expect(() => convertAppointment(apptWithoutAttributes)).to.not.throw();
    const result = convertAppointment(apptWithoutAttributes);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('123');
    expect(result.appointmentType).to.equal(UNKNOWN);
    expect(result.status).to.equal('Pending');

    // Test when attributes is null
    const apptWithNullAttributes = { id: '456', attributes: null };
    expect(() => convertAppointment(apptWithNullAttributes)).to.not.throw();
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

    const result = convertDemographics(info);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('789');
    expect(result.facility).to.equal('VA Medical Center');
    expect(result.firstName).to.equal('Jane');
    expect(result.middleName).to.equal('A.');
    expect(result.lastName).to.equal('Doe');
    expect(result.dateOfBirth).to.be.a('string');
    expect(result.age).to.equal(40);
    expect(result.gender).to.equal('Female');
    expect(result.ethnicity).to.equal('None recorded');
    expect(result.religion).to.equal('None');
    expect(result.placeOfBirth).to.equal('New York');
    expect(result.maritalStatus).to.equal('Single');
    expect(result.permanentAddress).to.be.an('object');
    expect(result.contactInfo).to.be.an('object');
    expect(result.employment).to.be.an('object');
    expect(result.primaryNextOfKin).to.be.an('object');
    expect(result.emergencyContact).to.be.an('object');
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

    const result = convertDemographics(info);
    expect(result).to.be.an('object');
    expect(result.id).to.equal('789');
    expect(result.facility).to.equal('VA Medical Center');
    expect(result.firstName).to.equal('Jane');
    expect(result.middleName).to.equal('None recorded');
    expect(result.lastName).to.equal('Doe');
    expect(result.dateOfBirth).to.be.a('string');
    expect(result.age).to.equal(40);
    expect(result.gender).to.equal('Female');
    expect(result.ethnicity).to.equal('None recorded');
  });

  it('should handle invalid dateOfBirth gracefully without throwing', () => {
    const info = {
      id: '789',
      dateOfBirth: 'invalid-date-string',
      gender: 'Male',
    };
    expect(() => convertDemographics(info)).to.not.throw();
    const result = convertDemographics(info);
    expect(result.dateOfBirth).to.equal(NONE_RECORDED);
  });
});

describe('convertAccountSummary', () => {
  it('should return null when passed null or undefined', () => {
    expect(convertAccountSummary(null)).to.be.null;
    expect(convertAccountSummary(undefined)).to.be.null;
  });

  it('should correctly handle null or undefined facilities edge case', () => {
    const data = {
      facilities: null,
      ipas: [
        {
          status: 'Active',
          authenticationDate: '2021-05-01',
          authenticatingFacilityId: '123',
        },
      ],
    };
    const result = convertAccountSummary(data);
    // Ensure result.vaTreatmentFacilities only contains facilities where treatment is true
    expect(result.vaTreatmentFacilities).to.have.lengthOf(0);
  });

  it('should correctly convert exclude facility with null facilityInfo', () => {
    const data = {
      facilities: [
        {
          facilityInfo: {
            id: '123',
            name: 'VA Medical Center',
            stationNumber: 'TEST',
            treatment: true,
          },
        },
        {
          facilityInfo: null,
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
    const result = convertAccountSummary(data);
    // Ensure result.vaTreatmentFacilities only contains facilities where treatment is true
    expect(result.vaTreatmentFacilities).to.have.lengthOf(1);
    expect(result.vaTreatmentFacilities[0]).to.deep.equal({
      facilityName: 'VA Medical Center',
      stationNumber: 'TEST',
      type: 'Treatment',
    });
  });

  it('should correctly convert patient data', () => {
    const data = {
      facilities: [
        {
          facilityInfo: {
            id: '123',
            name: 'VA Medical Center',
            stationNumber: 'TEST',
            treatment: true,
          },
        },
        {
          facilityInfo: {
            id: '124',
            name: 'VA Medical Center 2',
            stationNumber: 'TEST2',
            treatment: false,
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

    const result = convertAccountSummary(data);
    expect(result).to.be.an('object');
    expect(result.authenticationSummary).to.be.an('object');
    expect(result.authenticationSummary.source).to.equal('VA');
    expect(result.authenticationSummary.authenticationStatus).to.equal(
      'Active',
    );
    expect(result.authenticationSummary.authenticationDate).to.be.a('string');
    expect(result.authenticationSummary.authenticationFacilityName).to.equal(
      'VA Medical Center',
    );
    expect(result.authenticationSummary.authenticationFacilityID).to.equal(
      '123',
    );
    expect(result.vaTreatmentFacilities).to.be.an('array');

    // Ensure result.vaTreatmentFacilities only contains facilities where treatment is true
    expect(result.vaTreatmentFacilities).to.have.lengthOf(1);
    expect(result.vaTreatmentFacilities[0]).to.deep.equal({
      facilityName: 'VA Medical Center',
      stationNumber: 'TEST',
      type: 'Treatment',
    });
  });

  it('should handle invalid authenticationDate gracefully without throwing', () => {
    const data = {
      facilities: [
        {
          facilityInfo: {
            id: '123',
            name: 'VA Medical Center',
            stationNumber: 'TEST',
            treatment: true,
          },
        },
      ],
      ipas: [
        {
          status: 'Active',
          authenticationDate: 'invalid-date-string',
          authenticatingFacilityId: '123',
        },
      ],
    };
    expect(() => convertAccountSummary(data)).to.not.throw();
    const result = convertAccountSummary(data);
    expect(result.authenticationSummary.authenticationDate).to.equal(
      'Unknown date',
    );
  });
});

describe('blueButtonReducer', () => {
  const initialState = {
    medicationsList: undefined,
    appointmentsList: undefined,
    demographics: undefined,
    militaryService: undefined,
    accountSummary: undefined,
    failedDomains: [],
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
              sortedDispensedDate: '2021-01-01',
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

    const newState = blueButtonReducer(initialState, action);
    expect(newState).to.be.an('object');
    expect(newState).to.have.all.keys([
      'medicationsList',
      'appointmentsList',
      'demographics',
      'militaryService',
      'accountSummary',
      'failedDomains',
    ]);

    expect(newState.medicationsList).to.be.an('array');
    expect(newState.medicationsList[0])
      .to.have.property('lastFilledOn')
      .that.is.a('string');
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
      militaryService: undefined,
      accountSummary: {
        authenticationSummary: {},
        vaTreatmentFacilities: [],
      },
    };

    const newState = blueButtonReducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
  });

  it('should not overwrite data if keys are missing from the payload', () => {
    const state = {
      medicationsList: [],
      appointmentsList: [],
      demographics: [],
      militaryService: 'Testing',
      accountSummary: [],
    };

    const action = {
      type: Actions.BlueButtonReport.GET,
    };

    const newState = blueButtonReducer(state, action);
    expect(newState).to.deep.equal(state);
  });
});
