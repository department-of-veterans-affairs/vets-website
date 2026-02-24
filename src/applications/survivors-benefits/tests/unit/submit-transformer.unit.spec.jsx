import { expect } from 'chai';
import sinon from 'sinon';
import * as transformHelpers from 'platform/forms-system/src/js/helpers';
import { transform } from '../../config/submit-transformer';
import completedForm from '../fixtures/mocks/completed-form.json';

describe('Survivors Benefits submit transformer', () => {
  let transformForSubmitStub;
  beforeEach(() => {
    transformForSubmitStub = sinon
      .stub(transformHelpers, 'transformForSubmit')
      .callsFake((formConfig, form) => {
        return JSON.stringify({
          ...form,
        });
      });
  });

  afterEach(() => {
    transformForSubmitStub.restore();
  });
  it('should truncate middle names to initials in veteran and claimant full names', () => {
    const formConfig = {}; // Mock or import your formConfig as needed
    const transformed = JSON.parse(transform(formConfig, completedForm));
    const form = JSON.parse(transformed.survivorsBenefitsClaim.form);

    expect(form.veteranFullName.middle).to.equal('K');
    expect(form.claimantFullName.middle).to.equal('M');
  });
  it('should split SSN field correctly', () => {
    const formConfig = {}; // Mock or import your formConfig as needed
    const transformed = JSON.parse(transform(formConfig, completedForm));
    const form = JSON.parse(transformed.survivorsBenefitsClaim.form);

    expect(form.veteranSocialSecurityNumber).to.equal('321313311');
  });
  it('should auto-populate marriage end date if married to veteran at time of death is yes and marriage end date is not provided', () => {
    const formConfig = {};
    const formData = {
      marriedToVeteranAtTimeOfDeath: true,
      veteranDateOfDeath: '2020-01-01',
    };
    const transformed = JSON.parse(transform(formConfig, formData));
    const form = JSON.parse(transformed.survivorsBenefitsClaim.form);

    expect(form.marriageEndDate).to.exist;
    expect(form.marriageEndDate).to.equal('2020-01-01');
  });
});

describe('feature flag - unit name and address transformation', () => {
  it('should use buildUnitAddress format when use2025Version is true', () => {
    const formConfig = {};
    const formData = {
      data: {
        unitName: 'Alpha Company',
        unitAddress: {
          street: '123 Military Base',
          city: 'Fort Worth',
          state: 'TX',
          postalCode: '76102',
        },
        survivorsBenefitsForm2025VersionEnabled: true,
      },
    };

    const result = JSON.parse(transform(formConfig, formData));
    const formDataResult = JSON.parse(result.survivorsBenefitsClaim.form);

    // With buildUnitAddress, unitAddress becomes a string and unitName stays separate
    expect(formDataResult.unitAddress).to.be.a('string');
    expect(formDataResult.unitAddress).to.include('123 Military Base');
    expect(formDataResult.unitAddress).to.include('Fort Worth');
    expect(formDataResult.unitName).to.equal('Alpha Company');
    expect(formDataResult.unitNameAndAddress).to.be.undefined;
  });

  it('should use combineUnitNameAddress format when use2025Version is false', () => {
    const formConfig = {};
    const formData = {
      data: {
        unitName: 'Bravo Company',
        unitAddress: {
          street: '456 Base Road',
          city: 'San Diego',
          state: 'CA',
          postalCode: '92101',
        },
        survivorsBenefitsForm2025VersionEnabled: false,
      },
    };

    const result = JSON.parse(transform(formConfig, formData));
    const formDataResult = JSON.parse(result.survivorsBenefitsClaim.form);

    // With combineUnitNameAddress, unitName and unitAddress are combined into unitNameAndAddress
    expect(formDataResult.unitNameAndAddress).to.be.a('string');
    expect(formDataResult.unitNameAndAddress).to.include('Bravo Company');
    expect(formDataResult.unitNameAndAddress).to.include('456 Base Road');
    expect(formDataResult.unitNameAndAddress).to.include('San Diego');
    expect(formDataResult.unitName).to.be.undefined;
    expect(formDataResult.unitAddress).to.be.undefined;
  });

  it('should use combineUnitNameAddress format when use2025Version is undefined', () => {
    const formConfig = {};
    const formData = {
      data: {
        unitName: 'Charlie Company',
        unitAddress: {
          street: '789 Military Dr',
          city: 'Houston',
          state: 'TX',
          postalCode: '77002',
        },
      },
    };

    const result = JSON.parse(transform(formConfig, formData));
    const formDataResult = JSON.parse(result.survivorsBenefitsClaim.form);

    // With combineUnitNameAddress (default when flag is undefined)
    expect(formDataResult.unitNameAndAddress).to.be.a('string');
    expect(formDataResult.unitNameAndAddress).to.include('Charlie Company');
    expect(formDataResult.unitNameAndAddress).to.include('789 Military Dr');
    expect(formDataResult.unitNameAndAddress).to.include('Houston');
    expect(formDataResult.unitName).to.be.undefined;
    expect(formDataResult.unitAddress).to.be.undefined;
  });
});
