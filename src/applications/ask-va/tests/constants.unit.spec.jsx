import * as environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Constants', () => {
  let sandbox;
  let envStub;
  let constants;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    envStub = sandbox.stub(environment, 'default');
    // Clear the module cache to get fresh values
    delete require.cache[require.resolve('../constants')];
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('mockTestingFlagforAPI', () => {
    it('should be true when API_URL is localhost:3000', () => {
      envStub.value({ API_URL: 'http://localhost:3000' });
      constants = require('../constants');
      expect(constants.mockTestingFlagforAPI).to.be.true;
    });

    it('should be false when API_URL is not localhost:3000', () => {
      envStub.value({ API_URL: 'https://dev-api.va.gov' });
      constants = require('../constants');
      expect(constants.mockTestingFlagforAPI).to.be.false;
    });
  });

  describe('URL constants', () => {
    it('should include mock data parameter when mockTestingFlagforAPI is true', () => {
      envStub.value({ API_URL: 'http://localhost:3000' });
      constants = require('../constants');
      expect(constants.URL.GET_CATEGORIES).to.include('user_mock_data=true');
      expect(constants.URL.GET_TOPICS).to.include('user_mock_data=true');
      expect(constants.URL.GET_SUBTOPICS).to.include('user_mock_data=true');
    });

    it('should not include mock data parameter when mockTestingFlagforAPI is false', () => {
      envStub.value({ API_URL: 'https://dev-api.va.gov' });
      constants = require('../constants');
      expect(constants.URL.GET_CATEGORIES).to.not.include(
        'user_mock_data=true',
      );
      expect(constants.URL.GET_TOPICS).to.not.include('user_mock_data=true');
      expect(constants.URL.GET_SUBTOPICS).to.not.include('user_mock_data=true');
    });
  });

  describe('getApiUrl', () => {
    const API_URL = 'https://dev-api.va.gov';

    beforeEach(() => {
      envStub.value({ API_URL });
      constants = require('../constants');
    });

    it('should handle undefined url', () => {
      expect(constants.getApiUrl(undefined)).to.equal(API_URL);
    });

    it('should handle url without parameters', () => {
      expect(constants.getApiUrl('/test')).to.equal(`${API_URL}/test`);
    });

    it('should handle url with single parameter', () => {
      const url = '/test/%ID%';
      const params = { ID: '123' };
      expect(constants.getApiUrl(url, params)).to.equal(`${API_URL}/test/123`);
    });

    it('should handle url with multiple parameters', () => {
      const url = '/test/%ID%/%TYPE%';
      const params = { ID: '123', TYPE: 'user' };
      expect(constants.getApiUrl(url, params)).to.equal(
        `${API_URL}/test/123/user`,
      );
    });

    it('should handle url with undefined parameters', () => {
      const url = '/test/%ID%';
      expect(constants.getApiUrl(url)).to.equal(`${API_URL}/test/%ID%`);
    });
  });

  describe('hasPrefillInformation', () => {
    beforeEach(() => {
      envStub.value({ API_URL: 'https://dev-api.va.gov' });
      constants = require('../constants');
    });

    it('should return true when all required fields are present', () => {
      const form = {
        aboutYourself: {
          first: 'John',
          last: 'Doe',
          dateOfBirth: '1990-01-01',
        },
      };
      expect(constants.hasPrefillInformation(form)).to.be.true;
    });

    it('should return false when first name is missing', () => {
      const form = {
        aboutYourself: {
          first: '',
          last: 'Doe',
          dateOfBirth: '1990-01-01',
        },
      };
      expect(constants.hasPrefillInformation(form)).to.be.false;
    });

    it('should return false when last name is missing', () => {
      const form = {
        aboutYourself: {
          first: 'John',
          last: '',
          dateOfBirth: '1990-01-01',
        },
      };
      expect(constants.hasPrefillInformation(form)).to.be.false;
    });

    it('should return false when date of birth is missing', () => {
      const form = {
        aboutYourself: {
          first: 'John',
          last: 'Doe',
          dateOfBirth: '',
        },
      };
      expect(constants.hasPrefillInformation(form)).to.be.false;
    });
  });
});
