import { expect } from 'chai';
import sinon from 'sinon';

import * as recordEventModule from 'platform/monitoring/record-event';

import {
  trackNoAuthStartLinkClick,
  createPayload,
  getInitialData,
  dateOfDeathValidation,
  parseResponse,
} from '../../helpers';

describe('trackNoAuthStartLinkClick', () => {
  it('should call recordEvent with correct argument', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');

    trackNoAuthStartLinkClick();

    expect(recordEventStub.calledWith({ event: 'no-login-start-form' })).to.be
      .true;

    recordEventStub.restore();
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

    expect(payload.get('file')).to.equal(file);
    expect(payload.get('password')).to.equal(password);
  });

  it('should create a FormData object with only the file if no password is provided', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const formId = 'test-form';
    const payload = createPayload(file, formId);

    expect(payload.get('file')).to.equal(file);
    expect(payload.get('password')).to.be.null;
  });
});

describe('parseResponse', () => {
  it('should return an object with the name and confirmation code from the response', () => {
    const response = {
      data: {
        attributes: {
          confirmationCode: 'test-guid',
          name: 'test-file.txt',
        },
      },
    };
    const result = parseResponse(response);

    expect(result).to.deep.equal({
      name: 'test-file.txt',
      confirmationCode: 'test-guid',
    });
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
