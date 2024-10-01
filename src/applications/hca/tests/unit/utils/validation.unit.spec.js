import { expect } from 'chai';
import sinon from 'sinon';
import { add, format } from 'date-fns';
import {
  validateServiceDates,
  validateDependentDate,
  validateGulfWarDates,
  validateExposureDates,
  validateCurrency,
  validatePolicyNumber,
} from '../../../utils/validation';

describe('hca `validateServiceDates` form validation', () => {
  const dischargeDateSpy = sinon.spy();
  const entryDateSpy = sinon.spy();
  const getData = ({
    dischargeDate = '2016-01-01',
    entryDate = '2011-01-01',
    birthdate = '1980-01-01',
  }) => ({
    errors: {
      lastDischargeDate: { addError: dischargeDateSpy },
      lastEntryDate: { addError: entryDateSpy },
    },
    fieldData: {
      lastDischargeDate: dischargeDate,
      lastEntryDate: entryDate,
    },
    formData: {
      veteranDateOfBirth: birthdate,
    },
  });

  afterEach(() => {
    dischargeDateSpy.reset();
    entryDateSpy.reset();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData, formData } = getData({});
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.false;
    expect(entryDateSpy.called).to.be.false;
  });

  it('should set error message when discharge date is before entry date', () => {
    const { errors, fieldData, formData } = getData({
      dischargeDate: '2010-01-01',
    });
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.true;
  });

  it('should set error message when discharge date is later than 1 year from today', () => {
    const dischargeDate = add(new Date(), { days: 367 });
    const { errors, fieldData, formData } = getData({
      dischargeDate: format(dischargeDate, 'yyyy-MM-dd'),
    });
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.true;
  });

  it('should not set message when discharge date is exactly 1 year from today', () => {
    const dischargeDate = add(new Date(), { years: 1 });
    const { errors, fieldData, formData } = getData({
      dischargeDate: format(dischargeDate, 'yyyy-MM-dd'),
    });
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.false;
  });

  it('should set error message when entry date is less than 15 years after birthdate', () => {
    const { errors, fieldData, formData } = getData({
      dischargeDate: '2010-03-01',
      entryDate: '2000-01-01',
      birthdate: '1990-01-01',
    });
    validateServiceDates(errors, fieldData, formData);
    expect(entryDateSpy.called).to.be.true;
  });
});

describe('hca `validateGulfWarDates` form validation', () => {
  const startDateSpy = sinon.spy();
  const endDateSpy = sinon.spy();
  const getData = ({ startDate = '1990-09-XX', endDate = '1991-01-XX' }) => ({
    errors: {
      gulfWarStartDate: { addError: startDateSpy },
      gulfWarEndDate: { addError: endDateSpy },
    },
    fieldData: {
      gulfWarStartDate: startDate,
      gulfWarEndDate: endDate,
    },
  });

  afterEach(() => {
    startDateSpy.reset();
    endDateSpy.reset();
  });

  it('should not set error message when date range is valid', () => {
    const { errors, fieldData } = getData({});
    validateGulfWarDates(errors, fieldData);
    expect(startDateSpy.called).to.be.false;
    expect(endDateSpy.called).to.be.false;
  });

  it('should not set error message when date range is equal', () => {
    const { errors, fieldData } = getData({
      startDate: '1990-09-XX',
      endDate: '1990-09-XX',
    });
    validateGulfWarDates(errors, fieldData);
    expect(startDateSpy.called).to.be.false;
    expect(endDateSpy.called).to.be.false;
  });

  it('should set error message when end date is before start date', () => {
    const { errors, fieldData } = getData({
      endDate: '1989-09-XX',
    });
    validateGulfWarDates(errors, fieldData);
    expect(endDateSpy.called).to.be.true;
  });

  it('should set error message when only a month is provided to the end date', () => {
    const { errors, fieldData } = getData({
      endDate: 'XXXX-09-XX',
    });
    validateGulfWarDates(errors, fieldData);
    expect(endDateSpy.called).to.be.true;
  });

  it('should set error message when only a month is provided to the start date', () => {
    const { errors, fieldData } = getData({
      startDate: 'XXXX-09-XX',
    });
    validateGulfWarDates(errors, fieldData);
    expect(startDateSpy.called).to.be.true;
  });
});

describe('hca `validateExposureDates` form validation', () => {
  const startDateSpy = sinon.spy();
  const endDateSpy = sinon.spy();
  const getData = ({ startDate = '1990-09-XX', endDate = '1991-01-XX' }) => ({
    errors: {
      toxicExposureStartDate: { addError: startDateSpy },
      toxicExposureEndDate: { addError: endDateSpy },
    },
    fieldData: {
      toxicExposureStartDate: startDate,
      toxicExposureEndDate: endDate,
    },
  });

  afterEach(() => {
    startDateSpy.reset();
    endDateSpy.reset();
  });

  it('should not set error message when date range is valid', () => {
    const { errors, fieldData } = getData({});
    validateExposureDates(errors, fieldData);
    expect(startDateSpy.called).to.be.false;
    expect(endDateSpy.called).to.be.false;
  });

  it('should not set error message when date range is equal', () => {
    const { errors, fieldData } = getData({
      startDate: '1990-09-XX',
      endDate: '1990-09-XX',
    });
    validateExposureDates(errors, fieldData);
    expect(startDateSpy.called).to.be.false;
    expect(endDateSpy.called).to.be.false;
  });

  it('should set error message when end date is before start date', () => {
    const { errors, fieldData } = getData({
      endDate: '1989-09-XX',
    });
    validateExposureDates(errors, fieldData);
    expect(endDateSpy.called).to.be.true;
  });

  it('should set error message when only a month is provided to the end date', () => {
    const { errors, fieldData } = getData({
      endDate: 'XXXX-09-XX',
    });
    validateExposureDates(errors, fieldData);
    expect(endDateSpy.called).to.be.true;
  });

  it('should set error message when only a month is provided to the start date', () => {
    const { errors, fieldData } = getData({
      startDate: 'XXXX-09-XX',
    });
    validateExposureDates(errors, fieldData);
    expect(startDateSpy.called).to.be.true;
  });
});

describe('hca `validateDependentDate` form validation', () => {
  const fieldSpy = sinon.spy();
  const getData = ({ fieldData = '2010-01-01', birthdate = '2009-12-31' }) => ({
    errors: { addError: fieldSpy },
    fieldData,
    formData: { dateOfBirth: birthdate },
  });

  afterEach(() => {
    fieldSpy.reset();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData, formData } = getData({});
    validateDependentDate(errors, fieldData, formData);
    expect(fieldSpy.called).to.be.false;
  });

  it('should set error message when birthdate is after dependent date', () => {
    const { errors, fieldData, formData } = getData({
      birthdate: '2011-01-01',
    });
    validateDependentDate(errors, fieldData, formData);
    expect(fieldSpy.called).to.be.true;
  });
});

describe('hca `validateCurrency` form validation', () => {
  const fieldSpy = sinon.spy();
  const getData = () => ({
    errors: { addError: fieldSpy },
  });

  afterEach(() => {
    fieldSpy.reset();
  });

  it('should not set error message when form data is valid', () => {
    const { errors } = getData();
    validateCurrency(errors, '234.23');
    expect(fieldSpy.called).to.be.false;
  });

  it('should set error message when value has three decimals', () => {
    const { errors } = getData();
    validateCurrency(errors, '234.234');
    expect(fieldSpy.called).to.be.true;
  });

  it('should set error message when value has trailing whitespace', () => {
    const { errors } = getData();
    validateCurrency(errors, '234234 ');
    expect(fieldSpy.called).to.be.true;
  });

  it('should set error message when value has leading whitespace', () => {
    const { errors } = getData();
    validateCurrency(errors, ' 234234');
    expect(fieldSpy.called).to.be.true;
  });

  it('should not set error message when value includes dollar sign', () => {
    const { errors } = getData();
    validateCurrency(errors, '$234,234');
    expect(fieldSpy.called).to.be.false;
  });
});

describe('hca `validatePolicyNumber` form validation', () => {
  const policySpy = sinon.spy();
  const groupSpy = sinon.spy();
  const getData = ({ policyNumber = '', groupCode = '' }) => ({
    errors: {
      insurancePolicyNumber: {
        addError: policySpy,
      },
      insuranceGroupCode: {
        addError: groupSpy,
      },
    },
    fieldData: {
      insurancePolicyNumber: policyNumber,
      insuranceGroupCode: groupCode,
    },
  });

  afterEach(() => {
    policySpy.reset();
    groupSpy.reset();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData } = getData({
      policyNumber: '1234567890',
    });
    validatePolicyNumber(errors, fieldData);
    expect(policySpy.called).to.be.false;
    expect(groupSpy.called).to.be.false;
  });

  it('should set error message when form data is missing', () => {
    const { errors, fieldData } = getData({});
    validatePolicyNumber(errors, fieldData);
    expect(policySpy.called).to.be.true;
    expect(groupSpy.called).to.be.true;
  });
});
