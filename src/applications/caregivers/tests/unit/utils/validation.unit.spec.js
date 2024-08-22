import { expect } from 'chai';
import sinon from 'sinon';
import {
  requireAddressFields,
  validateCaregivers,
  validatePlannedClinic,
  validateSsnIsUnique,
} from '../../../utils/validation';
import { REQUIRED_ADDRESS_FIELDS } from '../../../utils/constants';

describe('CG `requireAddressFields` form validation', () => {
  const requiredField = REQUIRED_ADDRESS_FIELDS[0];
  const getData = ({ spy = () => {}, fieldData = {} }) => ({
    errors: {
      street: { addError: spy },
      city: { addError: () => {} },
      state: { addError: () => {} },
      postalCode: { addError: () => {} },
      county: { addError: () => {} },
    },
    fieldData,
  });
  let addErrorSpy;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
  });

  it('should set an error when the data is invalid', () => {
    const { errors, fieldData } = getData({ spy: addErrorSpy });
    requireAddressFields(errors, fieldData);
    expect(errors[requiredField].addError.called).to.be.true;
  });

  it('should not set an error when the data is valid', () => {
    const { errors, fieldData } = getData({
      spy: addErrorSpy,
      fieldData: {
        street: '123 Apple Lane',
        city: 'Indianapolis',
        state: 'IN',
        postalCode: '46220',
        county: 'Marion',
      },
    });
    requireAddressFields(errors, fieldData);
    expect(errors[requiredField].addError.called).to.be.false;
  });
});

describe('CG `validateCaregivers` form validation', () => {
  const getData = ({ spy = () => {}, formData = {} }) => ({
    errors: { addError: spy },
    formData,
  });
  let addErrorSpy;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
  });

  it('should set an error if caregivers have not been declared', () => {
    const { errors, formData } = getData({ spy: addErrorSpy });
    validateCaregivers(errors, {}, formData);
    expect(errors.addError.called).to.be.true;
  });

  it('should not set an error if primary caregiver has been declared', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: { 'view:hasPrimaryCaregiver': true },
    });
    validateCaregivers(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });

  it('should not set an error if secondary caregiver has been declared', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: { 'view:hasSecondaryCaregiverOne': true },
    });
    validateCaregivers(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });
});

describe('CG `validatePlannedClinic` form validation', () => {
  const getData = ({ spy = () => {}, formData = {} }) => ({
    errors: { addError: spy },
    formData,
  });
  let addErrorSpy;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
  });

  it('should set an error if planned clinic has not been set', () => {
    const { errors, formData } = getData({ spy: addErrorSpy });
    validatePlannedClinic(errors, {}, formData);
    expect(errors.addError.called).to.be.true;
  });

  it('should set an error if planned clinic is an empty object', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: { 'view:plannedClinic': {} },
    });
    validatePlannedClinic(errors, {}, formData);
    expect(errors.addError.called).to.be.true;
  });

  it('should not set an error if planned clinic has been declared', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: { 'view:plannedClinic': { id: 'my-id' } },
    });
    validatePlannedClinic(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });
});

describe('CG `validateSsnIsUnique` form validation', () => {
  const getData = ({ spy = () => {}, formData = {} }) => ({
    errors: { addError: spy },
    formData,
  });
  let addErrorSpy;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
  });

  it('should set an error if any of the included SSNs are duplicated', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: {
        veteranSsnOrTin: '222332222',
        primarySsnOrTin: '111332356',
        secondaryOneSsnOrTin: '444332111',
        secondaryTwoSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': true,
      },
    });
    validateSsnIsUnique(errors, {}, formData);
    expect(errors.addError.called).to.be.true;
  });

  it('should not set an error for a party that is not present', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: {
        veteranSsnOrTin: '222332222',
        primarySsnOrTin: '111332356',
        secondaryOneSsnOrTin: '211332222',
        secondaryTwoSsnOrTin: undefined,
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': false,
      },
    });
    validateSsnIsUnique(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });

  it('should not set an error for any value that is `undefined`', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: {
        veteranSsnOrTin: '222332222',
        primarySsnOrTin: '111332356',
        secondaryOneSsnOrTin: undefined,
        secondaryTwoSsnOrTin: undefined,
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': true,
      },
    });
    validateSsnIsUnique(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });

  it('should not set an error if all SSNs are unique', () => {
    const { errors, formData } = getData({
      spy: addErrorSpy,
      formData: {
        veteranSsnOrTin: '222332222',
        primarySsnOrTin: '111332356',
        secondaryOneSsnOrTin: '444332111',
        secondaryTwoSsnOrTin: '222332245',
        'view:hasPrimaryCaregiver': true,
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': true,
      },
    });
    validateSsnIsUnique(errors, {}, formData);
    expect(errors.addError.called).to.be.false;
  });
});
