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
      first: 'Doug',
      middle: 'P',
      last: 'Woodhouse',
      dateOfBirth: '1945-10-15',
    });
    expect(parsedResult.veteranInformation.veteranId).to.deep.equal({
      ssn: '222-22-2222',
      vaFileNumber: '987654321',
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
      first: 'Rosemary',
      middle: 'M',
      last: 'Woodhouse',
      dateOfBirth: '1945-02-09',
    });
    expect(parsedResult.claimantInformation.veteranId).to.deep.equal({
      ssn: '111-11-1111',
      vaFileNumber: '12345678',
    });
  });

  it('should transform nursing home information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.nursingHomeInformation).to.deep.equal({
      nursingHomeName: 'Best Nursing Home',
      nursingHomeAddress: {
        street: '1060 W Addison St',
        street2: 'Suite 12',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        postalCode: '60613',
      },
    });
  });

  it('should transform general information correctly', () => {
    const mockForm = createMockFormData();
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation).to.include({
      admissionDate: '2022-10-19',
      medicaidFacility: true,
      medicaidApplication: true,
      patientMedicaidCovered: true,
      medicaidStartDate: '2021-12-13',
      monthlyCosts: '2134',
      certificationLevelOfCare: true,
      nursingOfficialName: 'Andrew Green',
      nursingOfficialTitle: 'Head Nurse',
      nursingOfficialPhoneNumber: '3121114321',
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
        firstName: 'Andrew',
        lastName: '',
        jobTitle: 'Head Nurse',
      },
    });
    const result = transform({}, mockForm);
    const parsedResult = JSON.parse(result);

    expect(parsedResult.generalInformation.nursingOfficialName).to.equal(
      'Andrew',
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
