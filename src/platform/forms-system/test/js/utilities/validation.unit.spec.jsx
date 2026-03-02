import { expect } from 'chai';

import { rectifyData } from 'platform/forms-system/src/js/validation';

describe('rectifyData', () => {
  const camelCaseData = {
    isValid: true,
    required: true,
    touched: false,
    error: null,
    contact: '123456789',
  };

  const capitalData = {
    IsValid: false,
    Required: false,
    Touched: false,
    Error: 'an error',
  };

  const underscoreData = {
    _isValid: true,
    _required: true,
    _touched: false,
    _error: 'underscore error',
  };
  it('should give normal camel-case keys precedence', () => {
    const data = { ...camelCaseData, ...capitalData, ...underscoreData };
    const output = rectifyData(data);
    expect(output).to.deep.equal({
      isValid: true,
      required: true,
      touched: false,
      error: null,
      contact: '123456789',
    });
  });

  it('should give capital case keys precedence over underscore keys', () => {
    const data = { ...capitalData, ...underscoreData };
    const output = rectifyData(data);
    expect(output).to.deep.equal({
      isValid: false,
      required: false,
      touched: false,
      error: 'an error',
      contact: undefined,
    });
  });

  it('should use underscore keys if provided alone', () => {
    const output = rectifyData(underscoreData);
    expect(output).to.deep.equal({
      isValid: true,
      required: true,
      touched: false,
      error: 'underscore error',
      contact: undefined,
    });
  });

  it('should return an object with undefined values by default', () => {
    const output = rectifyData({});
    expect(output).to.deep.equal({
      isValid: undefined,
      required: undefined,
      touched: undefined,
      error: undefined,
      contact: undefined,
    });
  });
});
