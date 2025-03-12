import { expect } from 'chai';
import sinon from 'sinon';
import * as form from '../../config/form';
import { getMockData } from '../../helpers';
import mockData from '../e2e/fixtures/data/test-data.json';

describe('helpers', () => {
  describe('getMockData', () => {
    let isLocalhostStub;

    afterEach(() => {
      if (isLocalhostStub) {
        isLocalhostStub.restore();
      }
    });

    it('should return mockData when mockData is truthy, environment is localhost and window.Cypress is not defined', () => {
      isLocalhostStub = sinon.stub(form, 'isLocalhost').returns(true);
      global.window = { Cypress: undefined };

      const result = getMockData(mockData, isLocalhostStub);
      expect(result).to.deep.equal(mockData);
    });

    it('should return undefined when mockData is falsy, environment is not localhost or window.Cypress is defined', () => {
      isLocalhostStub = sinon.stub(form, 'isLocalhost').returns(false);
      global.window = { Cypress: true };

      const result = getMockData(null, isLocalhostStub);
      expect(result).to.be.undefined;
    });
  });
});
