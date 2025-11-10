import { expect } from 'chai';

import { transform } from '@bio-aquia/21-0779-nursing-home-information/config/transform';
import formData from '../fixtures/data/maximal-test.json';

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
    const parsedResult = JSON.parse(result);

    expect(parsedResult).to.have.property('veteranInformation');
    expect(parsedResult.veteranInformation).to.deep.include({
      first: 'Anakin',
      middle: 'L',
      last: 'Skywalker',
      dateOfBirth: '1960-03-01',
    });
    expect(parsedResult.veteranInformation.veteranId).to.deep.equal({
      ssn: '987654321',
      vaFileNumber: '501987654',
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
      first: 'Shmi',
      middle: 'E',
      last: 'Skywalker',
      dateOfBirth: '1939-09-15',
    });
    expect(parsedResult.claimantInformation.veteranId).to.deep.equal({
      ssn: '111223333',
      vaFileNumber: '41982736',
    });
  });

  it('should transform nursing home information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.nursingHomeInformation).to.deep.equal({
      nursingHomeName: 'Coruscant Veterans Medical Center',
      nursingHomeAddress: {
        street: '500 Senate District Boulevard',
        street2: 'Level 5127',
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
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation).to.include({
      admissionDate: '2019-05-04',
      medicaidFacility: true,
      medicaidApplication: true,
      patientMedicaidCovered: true,
      medicaidStartDate: '2020-12-25',
      monthlyCosts: '3277',
      certificationLevelOfCare: true,
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
        fullName: {
          first: 'Beru',
          last: '',
        },
        jobTitle: 'Nursing Home Administrator',
      },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal(
      'Beru',
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
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation).to.include({
      medicaidFacility: false,
      medicaidApplication: true,
      patientMedicaidCovered: false,
      certificationLevelOfCare: false,
    });
  });
});
