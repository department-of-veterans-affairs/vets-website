import { expect } from 'chai';
import { transform } from '../../config/transform';

describe('Transform Function', () => {
  const createMockFormData = (overrides = {}) => ({
    data: {
      veteranPersonalInfo: {
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        },
        dateOfBirth: '1950-01-01',
      },
      veteranIdentificationInfo: {
        ssn: '123456789',
        vaFileNumber: 'V12345678',
      },
      claimantQuestion: {
        patientType: 'veteran',
      },
      claimantPersonalInfo: {
        claimantFullName: {
          first: 'Jane',
          last: 'Doe',
        },
        claimantDateOfBirth: '1952-01-01',
      },
      claimantIdentificationInfo: {
        claimantSsn: '987654321',
        claimantVaFileNumber: 'V87654321',
      },
      nursingHomeDetails: {
        nursingHomeName: 'Test Nursing Home',
        nursingHomeAddress: {
          street: '123 Main St',
          street2: 'Apt 1',
          city: 'Anytown',
          state: 'CA',
          country: 'USA',
          postalCode: '12345',
        },
      },
      certificationLevelOfCare: {
        levelOfCare: 'skilled',
      },
      admissionDateInfo: {
        admissionDate: '2023-01-01',
      },
      medicaidFacility: {
        isMedicaidApproved: 'yes',
      },
      medicaidApplication: {
        hasAppliedForMedicaid: 'no',
      },
      medicaidStatus: {
        currentlyCoveredByMedicaid: 'yes',
      },
      medicaidStartDateInfo: {
        medicaidStartDate: '2023-02-01',
      },
      monthlyCosts: {
        monthlyOutOfPocket: 500,
      },
      nursingOfficialInformation: {
        firstName: 'Official',
        lastName: 'Name',
        jobTitle: 'Administrator',
        phoneNumber: '555-1234',
      },
      ...overrides,
    },
  });

  it('should transform complete form data correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult).to.have.property('veteranInformation');
    expect(parsedResult.veteranInformation).to.deep.include({
      first: 'John',
      middle: 'M',
      last: 'Doe',
      dateOfBirth: '1950-01-01',
    });
    expect(parsedResult.veteranInformation.veteranId).to.deep.equal({
      ssn: '123456789',
      vaFileNumber: 'V12345678',
    });
  });

  it('should handle veteran as patient (no claimant information)', () => {
    const mockForm = createMockFormData({
      claimantQuestion: { patientType: 'veteran' },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.claimantInformation).to.be.null;
  });

  it('should include claimant information when patient is spouse or parent', () => {
    const mockForm = createMockFormData({
      claimantQuestion: { patientType: 'spouseOrParent' },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.claimantInformation).to.not.be.null;
    expect(parsedResult.claimantInformation).to.include({
      first: 'Jane',
      last: 'Doe',
      dateOfBirth: '1952-01-01',
    });
    expect(parsedResult.claimantInformation.veteranId).to.deep.equal({
      ssn: '987654321',
      vaFileNumber: 'V87654321',
    });
  });

  it('should transform nursing home information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.nursingHomeInformation).to.deep.equal({
      nursingHomeName: 'Test Nursing Home',
      nursingHomeAddress: {
        street: '123 Main St',
        street2: 'Apt 1',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
      },
    });
  });

  it('should transform general information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation).to.include({
      admissionDate: '2023-01-01',
      medicaidFacility: true,
      medicaidApplication: false,
      patientMedicaidCovered: true,
      medicaidStartDate: '2023-02-01',
      monthlyCosts: 500,
      certificationLevelOfCare: true,
      nursingOfficialName: 'Official Name',
      nursingOfficialTitle: 'Administrator',
      nursingOfficialPhoneNumber: '555-1234',
    });
  });

  it('should handle missing nursing home details', () => {
    const mockForm = createMockFormData({
      nursingHomeDetails: null,
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.nursingHomeInformation.nursingHomeName).to.be.undefined;
  });

  it('should handle missing nursing official information', () => {
    const mockForm = createMockFormData({
      nursingOfficialInformation: null,
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal('');
  });

  it('should handle partial nursing official name', () => {
    const mockForm = createMockFormData({
      nursingOfficialInformation: {
        firstName: 'Official',
        lastName: '',
        jobTitle: 'Administrator',
      },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal(
      'Official',
    );
  });

  it('should handle boolean conversions correctly', () => {
    const mockForm = createMockFormData({
      medicaidFacility: { isMedicaidApproved: 'no' },
      medicaidApplication: { hasAppliedForMedicaid: 'yes' },
      medicaidStatus: { currentlyCoveredByMedicaid: 'no' },
      certificationLevelOfCare: { levelOfCare: 'intermediate' },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation).to.include({
      medicaidFacility: false,
      medicaidApplication: true,
      patientMedicaidCovered: false,
      certificationLevelOfCare: false,
    });
  });
});
