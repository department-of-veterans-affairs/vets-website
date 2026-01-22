import { expect } from 'chai';

import { transform } from '@bio-aquia/21-0779-nursing-home-information/config/transform';
import formData from '../fixtures/data/maximal-test.json';

function parseResult(result) {
  return JSON.parse(JSON.parse(result).form);
}

describe('Transform Function', () => {
  const createMockFormData = (overrides = {}) => ({
    data: {
      ...formData.data,
      ...overrides,
    },
  });

  it('should transform complete form data correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult).to.have.property('veteranInformation');
    expect(parsedResult.veteranInformation.fullName).to.deep.equal({
      first: 'Anakin',
      middle: 'L',
      last: 'Skywalker',
    });
    expect(parsedResult.veteranInformation.dateOfBirth).to.equal('1960-03-01');
    expect(parsedResult.veteranInformation.veteranId).to.deep.equal({
      ssn: '987654321',
      vaFileNumber: '501987654',
    });
  });

  it('should handle veteran as patient (duplicates veteran information)', () => {
    const mockForm = createMockFormData({
      claimantQuestion: { patientType: 'veteran' },
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.claimantInformation).to.not.be.null;
    expect(parsedResult.claimantInformation).to.be.an('object');
    // When veteran is patient, claimant info should duplicate veteran info
    expect(parsedResult.claimantInformation.fullName).to.deep.equal(
      parsedResult.veteranInformation.fullName,
    );
  });

  it('should include claimant information when patient is spouse or parent', () => {
    const mockForm = createMockFormData({
      claimantQuestion: { patientType: 'spouseOrParent' },
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.claimantInformation).to.not.be.null;
    expect(parsedResult.claimantInformation.fullName).to.deep.equal({
      first: 'Shmi',
      middle: 'E',
      last: 'Skywalker',
    });
    expect(parsedResult.claimantInformation.dateOfBirth).to.equal('1939-09-15');
    expect(parsedResult.claimantInformation.veteranId).to.deep.equal({
      ssn: '111223333',
      vaFileNumber: '41982736',
    });
  });

  it('should transform nursing home information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.nursingHomeInformation).to.deep.equal({
      nursingHomeName: 'Coruscant Veterans Medical Center',
      nursingHomeAddress: {
        street: '500 Senate District Boulevard',
        street2: 'Lvl 5',
        city: 'Coruscant',
        state: 'DC',
        country: 'USA',
        postalCode: '20001',
      },
    });
  });

  it('should transform general information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.generalInformation).to.include({
      admissionDate: '2019-05-04',
      medicaidFacility: true,
      medicaidApplication: true,
      patientMedicaidCovered: true,
      medicaidStartDate: '2020-12-25',
      monthlyCosts: '3277.00',
      certificationLevelOfCare: 'skilled', // String enum, not boolean
      nursingOfficialName: 'Beru Lars',
      nursingOfficialTitle: 'Nursing Home Administrator',
      nursingOfficialPhoneNumber: '5055551977',
    });
  });

  it('should handle missing nursing home details', () => {
    const mockForm = createMockFormData({
      nursingHomeDetails: null,
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.nursingHomeInformation.nursingHomeName).to.be.undefined;
  });

  it('should handle missing nursing official information', () => {
    const mockForm = createMockFormData({
      nursingOfficialInformation: null,
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal('');
  });

  it('should handle partial nursing official name', () => {
    const mockForm = createMockFormData({
      nursingOfficialInformation: {
        fullName: {
          first: 'Beru',
          last: '',
        },
        jobTitle: 'Nursing Home Administrator',
      },
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal(
      'Beru',
    );
  });

  it('should strip dashes from phone numbers', () => {
    const mockForm = createMockFormData({
      nursingOfficialInformation: {
        fullName: {
          first: 'Beru',
          last: 'Lars',
        },
        jobTitle: 'Nursing Home Administrator',
        phoneNumber: '505-555-1977',
      },
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.generalInformation.nursingOfficialPhoneNumber).to.equal(
      '5055551977',
    );
  });

  it('should handle boolean conversions correctly', () => {
    const mockForm = createMockFormData({
      medicaidFacility: { isMedicaidApprovedFacility: false },
      medicaidApplication: { hasAppliedForMedicaid: true },
      medicaidStatus: { currentlyCoveredByMedicaid: false },
      certificationLevelOfCare: { levelOfCare: 'intermediate' },
    });
    const result = transform({}, mockForm);
    const parsedResult = parseResult(result);

    expect(parsedResult.generalInformation).to.include({
      medicaidFacility: false,
      medicaidApplication: true,
      patientMedicaidCovered: false,
      certificationLevelOfCare: 'intermediate', // String enum value
    });
  });
});
