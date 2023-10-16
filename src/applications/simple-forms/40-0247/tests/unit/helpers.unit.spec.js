import { expect } from 'chai';

import { getInitialData, dateOfDeathValidation } from '../../helpers';

describe('getInitialData', () => {
  it('returns mockData if environment is localhost and Cypress is not running', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => true,
    };
    const result = getInitialData({ mockData, environment });
    expect(result).to.deep.equal(mockData);
  });

  it('returns undefined if environment is not localhost', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => false,
    };
    const result = getInitialData({ mockData, environment });
    expect(result).to.be.undefined;
  });

  it('returns undefined if Cypress is running', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => true,
    };
    window.Cypress = true;
    const result = getInitialData({ mockData, environment });
    expect(result).to.be.undefined;
    window.Cypress = undefined;
  });
});

describe('dateOfDeathValidation', () => {
  let errors;

  beforeEach(() => {
    errors = {
      veteranDateOfDeath: {
        addError: error => {
          errors.veteranDateOfDeath.errors.push(error);
        },
        errors: [],
      },
    };
  });

  it('should add an error if date of death is before date of birth', () => {
    const fields = {
      veteranDateOfBirth: '1950-01-01',
      veteranDateOfDeath: '1940-01-01',
    };

    dateOfDeathValidation(errors, fields);
    expect(errors.veteranDateOfDeath.errors).to.have.lengthOf(1);
  });

  it('should not add an error if date of death is after date of birth', () => {
    const fields = {
      veteranDateOfBirth: '1950-01-01',
      veteranDateOfDeath: '1960-01-01',
    };

    dateOfDeathValidation(errors, fields);
    expect(errors.veteranDateOfDeath.errors).to.have.lengthOf(0);
  });

  it('should not add an error if date of death is the same as date of birth', () => {
    const fields = {
      veteranDateOfBirth: '1950-01-01',
      veteranDateOfDeath: '1950-01-01',
    };

    dateOfDeathValidation(errors, fields);
    expect(errors.veteranDateOfDeath.errors).to.have.lengthOf(0);
  });
});
