import { add, format } from 'date-fns';
import { omit } from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  validateServiceDates,
  validateDependentDate,
  validateGulfWarDates,
  validateExposureDates,
  validateCurrency,
  validatePolicyNumber,
  validateInsurancePolicy,
  validateDateOfBirth,
  validateDependent,
} from '../../../utils/validation';
import * as householdHelpers from '../../../utils/helpers/household';

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
    dischargeDateSpy.resetHistory();
    entryDateSpy.resetHistory();
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
    startDateSpy.resetHistory();
    endDateSpy.resetHistory();
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
    startDateSpy.resetHistory();
    endDateSpy.resetHistory();
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
    fieldSpy.resetHistory();
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
    fieldSpy.resetHistory();
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
    policySpy.resetHistory();
    groupSpy.resetHistory();
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

describe('hca `validateInsurancePolicy` method', () => {
  const defaultItem = {
    insuranceName: 'Cigna',
    insurancePolicyHolderName: 'John Smith',
    'view:policyNumberOrGroupCode': {},
  };

  it('should gracefully return when props are omitted', () => {
    expect(validateInsurancePolicy()).to.be.true;
  });

  it('should return `true` when `insuranceName` is omitted', () => {
    const item = omit('insuranceName', defaultItem);
    expect(validateInsurancePolicy(item)).to.be.true;
  });

  it('should return `true` when `insurancePolicyHolderName` is omitted', () => {
    const item = omit('insurancePolicyHolderName', defaultItem);
    expect(validateInsurancePolicy(item)).to.be.true;
  });

  it('should return `true` when `view:policyNumberOrGroupCode` is omitted', () => {
    const item = omit('view:policyNumberOrGroupCode', defaultItem);
    expect(validateInsurancePolicy(item)).to.be.true;
  });

  it('should return `true` when `insurancePolicyNumber` & `insuranceGroupCode` are omitted', () => {
    expect(validateInsurancePolicy(defaultItem)).to.be.true;
  });

  it('should return `false` when all correct data is provided', () => {
    const item = {
      ...defaultItem,
      'view:policyNumberOrGroupCode': { insurancePolicyNumber: '12345' },
    };
    expect(validateInsurancePolicy(item)).to.be.false;
  });
});

describe('hca `validateDateOfBirth` method', () => {
  it('should return `null` when a value is omitted from the function', () => {
    expect(validateDateOfBirth()).to.eq(null);
  });

  it('should return `null` when an empty value is passed to the function', () => {
    expect(validateDateOfBirth('')).to.eq(null);
  });

  it('should return `null` when an invalid value is passed to the function', () => {
    expect(validateDateOfBirth('1990-01-00')).to.eq(null);
  });

  it('should return `null` when the value is passed to the function is pre-1900', () => {
    expect(validateDateOfBirth('1890-01-01')).to.eq(null);
  });

  it('should return the value when the value is after 1899-12-31', () => {
    const validDate = '1990-01-01';
    expect(validateDateOfBirth(validDate)).to.eq(validDate);
  });
});

describe('hca `validateDependent` method', () => {
  const baseValidData = {
    fullName: { firstName: 'John', lastName: 'Doe' },
    dependentRelation: 'child',
    socialSecurityNumber: '211111111',
    dateOfBirth: '2005-01-01',
    becameDependent: '2010-01-01',
    disabledBefore18: false,
    cohabitedLastYear: false,
    'view:dependentIncome': true,
    'view:grossIncome': { grossIncome: '1000' },
    'view:netIncome': { netIncome: '500' },
    'view:otherIncome': { otherIncome: '200' },
    dependentEducationExpenses: '300.00',
  };

  beforeEach(() => {
    sinon.stub(householdHelpers, 'canHaveEducationExpenses').returns(false);
  });

  afterEach(() => sinon.restore());

  it('should return `false` for valid data', () => {
    expect(validateDependent(baseValidData)).to.be.false;
  });

  it('should return `true` if `firstName` is missing', () => {
    const data = { ...baseValidData, fullName: { lastName: 'Doe' } };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `lastName` is missing', () => {
    const data = { ...baseValidData, fullName: { firstName: 'John' } };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dependentRelation` is missing', () => {
    const data = { ...baseValidData, dependentRelation: null };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `socialSecurityNumber` is invalid', () => {
    const data = { ...baseValidData, socialSecurityNumber: '21111' };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dateOfBirth` is invalid', () => {
    const data = { ...baseValidData, dateOfBirth: '1890-01-01' };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dateOfBirth` is after `becameDependent`', () => {
    const data = {
      ...baseValidData,
      dateOfBirth: '2010-01-01',
      becameDependent: '2009-01-01',
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `disabledBefore18` is undefined', () => {
    const data = { ...baseValidData, disabledBefore18: undefined };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if cohabitedLastYear is undefined', () => {
    const data = { ...baseValidData, cohabitedLastYear: undefined };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dependentIncome` is `true` but no income fields are valid currency', () => {
    const data = {
      ...baseValidData,
      'view:grossIncome': { grossIncome: 'not-a-number' },
      'view:netIncome': { netIncome: 'NaN' },
      'view:otherIncome': { otherIncome: '-10.00' },
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if any currency values are not valid strings', () => {
    const data = {
      ...baseValidData,
      'view:grossIncome': { grossIncome: '1000.999' },
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dependentIncome` is true but some income fields are undefined', () => {
    const data = {
      ...baseValidData,
      'view:netIncome': { netIncome: undefined },
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dependentIncome` is true but some income fields are empty strings', () => {
    const data = {
      ...baseValidData,
      'view:netIncome': { netIncome: '' },
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if `dependentIncome` is true and some income values are negative', () => {
    const data = {
      ...baseValidData,
      'view:otherIncome': { otherIncome: '-200' },
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `false` if `dependentIncome` is true and all income fields have valid values >= 0', () => {
    const data = {
      ...baseValidData,
      'view:netIncome': { netIncome: '0' },
    };
    expect(validateDependent(data)).to.be.false;
  });

  it('should NOT require education expenses if age < 18 or > 23', () => {
    householdHelpers.canHaveEducationExpenses.returns(false);
    const data = {
      ...baseValidData,
      dependentEducationExpenses: undefined,
    };
    expect(validateDependent(data)).to.be.false;
  });

  it('should require education expenses if age is between 18 & 23 and gross income is valid', () => {
    householdHelpers.canHaveEducationExpenses.returns(true);
    const data = {
      ...baseValidData,
      dependentEducationExpenses: undefined,
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `true` if education expenses are required but invalid', () => {
    householdHelpers.canHaveEducationExpenses.returns(true);
    const data = {
      ...baseValidData,
      dependentEducationExpenses: '100.999',
    };
    expect(validateDependent(data)).to.be.true;
  });

  it('should return `false` if education expenses are required and valid', () => {
    householdHelpers.canHaveEducationExpenses.returns(true);
    const data = {
      ...baseValidData,
      dependentEducationExpenses: '1,200.50',
    };
    expect(validateDependent(data)).to.be.false;
  });
});
