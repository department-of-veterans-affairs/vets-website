import sinon from 'sinon';
import { expect } from 'chai';

import {
  getInitialData,
  textInputNumericRange,
  createPayload,
  parseResponse,
} from '../../helpers';

describe('textInputNumericRange', () => {
  it('should add an error if the number of copies is less than the minimum range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '2' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(
      errors.copies.addError.calledWith(
        `Please raise your number to at least ${input.range.min}`,
      ),
    ).to.be.true;
  });

  it('should add an error if the number of copies is greater than the maximum range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '11' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(
      errors.copies.addError.calledWith(
        'Please lower your number to less than 10',
      ),
    ).to.be.true;
  });

  it('should not add an error if the number of copies is within the range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '5' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(errors.copies.addError.called).to.be.false;
  });

  it('should use custom error messages if provided', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '2' };
    const input = {
      schemaKey: 'copies',
      range: { min: 3, max: 10 },
      customErrorMessages: { min: 'Custom min error message' },
    };
    textInputNumericRange(errors, formData, input);
    expect(errors.copies.addError.calledWith('Custom min error message')).to.be
      .true;
  });
});

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

describe('createPayload', () => {
  it('should create a FormData object with the file and password (if provided)', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const formId = 'test-form';
    const password = 'test-password';
    const payload = createPayload(file, formId, password);

    expect(payload.get('files_attachment[file_data]')).to.equal(file);
    expect(payload.get('files_attachment[password]')).to.equal(password);
  });

  it('should create a FormData object with only the file if no password is provided', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const formId = 'test-form';
    const payload = createPayload(file, formId);

    expect(payload.get('files_attachment[file_data]')).to.equal(file);
    expect(payload.get('files_attachment[password]')).to.be.null;
  });
});

describe('parseResponse', () => {
  it('should return an object with the name and confirmation code from the response', () => {
    const response = {
      data: {
        attributes: {
          guid: 'test-guid',
        },
      },
    };
    const name = 'test-file.txt';
    const result = parseResponse(response, { name });

    expect(result).to.deep.equal({
      name,
      confirmationCode: 'test-guid',
    });
  });
});
