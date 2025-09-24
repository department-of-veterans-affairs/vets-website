import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  validateAddressFields,
  validateCaregivers,
  validateCountyInput,
  validatePlannedClinic,
  validateSsnIsUnique,
} from '../../../utils/validation';

describe('CG `validateAddressFields` form validation', () => {
  let addError;
  const getData = ({ fieldData = {} } = {}) => ({
    errors: {
      street: { addError },
      city: { addError: f => f },
      state: { addError: f => f },
      postalCode: { addError: f => f },
      county: { addError: f => f },
    },
    fieldData,
  });
  const runTest = input => {
    const { errors, fieldData } = getData(input);
    validateAddressFields(errors, fieldData);
    return addError.called;
  };
  const testCases = [
    {
      title: 'should set error when required data is missing',
      input: {},
      expected: true,
    },
    {
      title: 'should set error when pattern data is invalid',
      input: { fieldData: { county: ' usa ' } },
      expected: true,
    },
    {
      title: 'should not set error when data is valid',
      input: {
        fieldData: {
          street: '123 Apple Lane',
          city: 'Indianapolis',
          state: 'IN',
          postalCode: '46220',
          county: 'Marion',
        },
      },
      expected: false,
    },
  ];

  beforeEach(() => {
    addError = sinon.spy();
  });

  afterEach(() => {
    addError.resetHistory();
  });

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(runTest(input)).to.eq(expected));
  });
});

describe('CG `validateCaregivers` form validation', () => {
  let addError;
  const getData = ({ formData = {} } = {}) => ({
    errors: { addError },
    formData,
  });
  const runTest = input => {
    const { errors, formData } = getData(input);
    validateCaregivers(errors, {}, formData);
    return addError.called;
  };
  const testCases = [
    {
      title: 'should set error if caregivers have not been declared',
      input: {},
      expected: true,
    },
    {
      title: 'should not set error if primary caregiver has been declared',
      input: {
        formData: { 'view:hasPrimaryCaregiver': true },
      },
      expected: false,
    },
    {
      title: 'should not set error if secondary caregiver has been declared',
      input: {
        formData: { 'view:hasSecondaryCaregiverOne': true },
      },
      expected: false,
    },
  ];

  beforeEach(() => {
    addError = sinon.spy();
  });

  afterEach(() => {
    addError.resetHistory();
  });

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(runTest(input)).to.eq(expected));
  });
});

describe('CG `validateCountyInput` form validation', () => {
  let addError;
  const runTest = input => {
    validateCountyInput({ addError }, input);
    return addError.called;
  };
  const testCases = [
    {
      title:
        'should set error if data contains a restricted string with trailing whitespace',
      input: 'USA ',
      expected: true,
    },
    {
      title: 'should set error if data contains a restricted string',
      input: 'United States',
      expected: true,
    },
    {
      title:
        'should not set error if data does not contain a restricted string',
      input: 'Marion',
      expected: false,
    },
    {
      title:
        'should not set error if data contains a restricted string within a string',
      input: 'Tuscolusa',
      expected: false,
    },
  ];

  beforeEach(() => {
    addError = sinon.spy();
  });

  afterEach(() => {
    addError.resetHistory();
  });

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(runTest(input)).to.eq(expected));
  });
});

describe('CG `validatePlannedClinic` form validation', () => {
  let addError;
  const getData = ({ formData = {} } = {}) => ({
    errors: { addError },
    formData,
  });
  const runTest = input => {
    const { errors, formData } = getData(input);
    validatePlannedClinic(errors, {}, formData);
    return addError.called;
  };
  const testCases = [
    {
      title: 'should set error if planned clinic has not been set',
      input: {},
      expected: true,
    },
    {
      title: 'should set error if planned clinic is an empty object',
      input: { formData: { 'view:plannedClinic': {} } },
      expected: true,
    },
    {
      title: 'should not set error if planned clinic has been declared',
      input: { formData: { 'view:plannedClinic': { id: 'my-id' } } },
      expected: false,
    },
  ];

  beforeEach(() => {
    addError = sinon.spy();
  });

  afterEach(() => {
    addError.resetHistory();
  });

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(runTest(input)).to.eq(expected));
  });
});

describe('CG `validateSsnIsUnique` form validation', () => {
  let addError;
  const getData = ({ formData = {} } = {}) => ({
    errors: { addError },
    formData,
  });
  const runTest = input => {
    const { errors, formData } = getData(input);
    validateSsnIsUnique(errors, {}, formData);
    return addError.called;
  };
  const testCases = [
    {
      title: 'should set error if any of the included SSNs are duplicated',
      input: {
        formData: {
          veteranSsnOrTin: '222332222',
          primarySsnOrTin: '111332356',
          secondaryOneSsnOrTin: '444332111',
          secondaryTwoSsnOrTin: '222332222',
          'view:hasPrimaryCaregiver': true,
          'view:hasSecondaryCaregiverOne': true,
          'view:hasSecondaryCaregiverTwo': true,
        },
      },
      expected: true,
    },
    {
      title: 'should not set error when the primary caregiver is not declared',
      input: {
        formData: {
          veteranSsnOrTin: '222332222',
          primarySsnOrTin: undefined,
          secondaryOneSsnOrTin: '211332222',
          secondaryTwoSsnOrTin: '111332356',
          'view:hasPrimaryCaregiver': false,
          'view:hasSecondaryCaregiverOne': true,
          'view:hasSecondaryCaregiverTwo': true,
        },
      },
      expected: false,
    },
    {
      title:
        'should not set error when the secondary caregivers are not declared',
      input: {
        formData: {
          veteranSsnOrTin: '222332222',
          primarySsnOrTin: '111332356',
          secondaryOneSsnOrTin: undefined,
          secondaryTwoSsnOrTin: undefined,
          'view:hasPrimaryCaregiver': true,
          'view:hasSecondaryCaregiverOne': false,
          'view:hasSecondaryCaregiverTwo': false,
        },
      },
      expected: false,
    },
    {
      title: 'should not set error for any value that is `undefined`',
      input: {
        formData: {
          veteranSsnOrTin: '222332222',
          primarySsnOrTin: '111332356',
          secondaryOneSsnOrTin: undefined,
          secondaryTwoSsnOrTin: undefined,
          'view:hasPrimaryCaregiver': true,
          'view:hasSecondaryCaregiverOne': true,
          'view:hasSecondaryCaregiverTwo': true,
        },
      },
      expected: false,
    },
    {
      title: 'should not set error if all SSNs are unique',
      input: {
        formData: {
          veteranSsnOrTin: '222332222',
          primarySsnOrTin: '111332356',
          secondaryOneSsnOrTin: '444332111',
          secondaryTwoSsnOrTin: '222332245',
          'view:hasPrimaryCaregiver': true,
          'view:hasSecondaryCaregiverOne': true,
          'view:hasSecondaryCaregiverTwo': true,
        },
      },
      expected: false,
    },
  ];

  beforeEach(() => {
    addError = sinon.spy();
  });

  afterEach(() => {
    addError.resetHistory();
  });

  testCases.forEach(({ title, input, expected }) => {
    it(title, () => expect(runTest(input)).to.eq(expected));
  });
});
