import { expect } from 'chai';

import { addressExists } from '../../utilities/helpers';

describe('addressExists', () => {
  it('should return true when all address fields are present and non-empty', () => {
    const mockAddress = {
      addressLine1: '123 Main St',
      city: 'Somewhere',
      stateCode: 'CA',
      zipCode: '12345',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.true;
  });

  it('should return false when addressLine1 is missing', () => {
    const mockAddress = {
      addressLine1: '',
      city: 'Somewhere',
      stateCode: 'CA',
      zipCode: '12345',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.false;
  });

  it('should return false when city is missing', () => {
    const mockAddress = {
      addressLine1: '123 Main St',
      city: '',
      stateCode: 'CA',
      zipCode: '12345',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.false;
  });

  it('should return false when stateCode is missing', () => {
    const mockAddress = {
      addressLine1: '123 Main St',
      city: 'Somewhere',
      stateCode: '',
      zipCode: '12345',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.false;
  });

  it('should return false when zipCode is missing', () => {
    const mockAddress = {
      addressLine1: '123 Main St',
      city: 'Somewhere',
      stateCode: 'CA',
      zipCode: '',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.false;
  });

  it('should return false when address is completely null or undefined', () => {
    const result = addressExists(null);
    expect(result).to.be.false;

    const undefinedResult = addressExists(undefined);
    expect(undefinedResult).to.be.false;
  });

  it('should return false when address is an empty object', () => {
    const result = addressExists({});
    expect(result).to.be.false;
  });

  it('should return false when any of the fields are only whitespace', () => {
    const mockAddress = {
      addressLine1: '  ',
      city: 'Somewhere',
      stateCode: 'CA',
      zipCode: '12345',
    };

    const result = addressExists(mockAddress);
    expect(result).to.be.false;
  });
});
